package com.example.minicrm.service;

import com.example.minicrm.dto.TaskRequest;
import com.example.minicrm.dto.TaskResponse;
import com.example.minicrm.entity.Customer;
import com.example.minicrm.entity.Task;
import com.example.minicrm.entity.TaskStatus;
import com.example.minicrm.entity.User;
import com.example.minicrm.event.TaskCompletedEvent;
import com.example.minicrm.exception.ResourceNotFoundException;
import com.example.minicrm.repository.TaskRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final CustomerService customerService;
    private final UserService userService;
    private final ApplicationEventPublisher eventPublisher;
    private final CurrentUserService currentUserService;

    public TaskService(TaskRepository taskRepository, CustomerService customerService, UserService userService, ApplicationEventPublisher eventPublisher, CurrentUserService currentUserService) {
        this.taskRepository = taskRepository;
        this.customerService = customerService;
        this.userService = userService;
        this.eventPublisher = eventPublisher;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> findAll() {
        var currentUser = currentUserService.getCurrentUser();
        if (currentUserService.isAdmin(currentUser)) {
            return taskRepository.findAll().stream().map(this::toResponse).toList();
        }
        if (currentUserService.isManager(currentUser)) {
            Long teamId = currentUser.getTeam() == null ? null : currentUser.getTeam().getId();
            return teamId == null ? List.of() : taskRepository.findByCustomerTeamId(teamId).stream().map(this::toResponse).toList();
        }
        return taskRepository.findByUserId(currentUser.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(Long id) {
        Task task = getTask(id);
        verifyReadable(task);
        return toResponse(task);
    }

    public TaskResponse create(TaskRequest request) {
        Task task = new Task();
        applyRequest(task, request);
        Task savedTask = taskRepository.save(task);
        if (savedTask.getStatus() == TaskStatus.DONE) {
            eventPublisher.publishEvent(new TaskCompletedEvent(savedTask.getId(), savedTask.getCustomer().getId()));
        }
        return toResponse(savedTask);
    }

    public TaskResponse update(Long id, TaskRequest request) {
        Task task = getTask(id);
        verifyWritable(task);
        TaskStatus previousStatus = task.getStatus();
        applyRequest(task, request);
        if (previousStatus != TaskStatus.DONE && task.getStatus() == TaskStatus.DONE) {
            eventPublisher.publishEvent(new TaskCompletedEvent(task.getId(), task.getCustomer().getId()));
        }
        return toResponse(task);
    }

    public void delete(Long id) {
        Task task = getTask(id);
        verifyDeletable(task);
        taskRepository.delete(task);
    }

    private Task getTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private void applyRequest(Task task, TaskRequest request) {
        User user = request.userId() == null ? null : userService.getUser(request.userId());
        Customer customer = customerService.getCustomer(request.customerId());
        verifyCanAssign(customer, user);
        task.setTitle(request.title());
        task.setDueDate(request.dueDate());
        task.setStatus(request.status());
        task.setUser(user);
        task.setCustomer(customer);
    }

    private void verifyReadable(Task task) {
        var currentUser = currentUserService.getCurrentUser();
        if (currentUserService.isAdmin(currentUser)) {
            return;
        }
        Long currentTeamId = currentUser.getTeam() == null ? null : currentUser.getTeam().getId();
        Long customerTeamId = task.getCustomer().getTeam() == null ? null : task.getCustomer().getTeam().getId();
        if (currentUserService.isManager(currentUser) && currentTeamId != null && currentTeamId.equals(customerTeamId)) {
            return;
        }
        if (currentUserService.isSales(currentUser) && task.getUser() != null && task.getUser().getId().equals(currentUser.getId())) {
            return;
        }
        throw new ResourceNotFoundException("Task not found with id: " + task.getId());
    }

    private void verifyWritable(Task task) {
        verifyReadable(task);
    }

    private void verifyDeletable(Task task) {
        User currentUser = currentUserService.getCurrentUser();
        if (currentUserService.isAdmin(currentUser)) {
            return;
        }
        Long currentTeamId = currentUser.getTeam() == null ? null : currentUser.getTeam().getId();
        Long customerTeamId = task.getCustomer().getTeam() == null ? null : task.getCustomer().getTeam().getId();
        if (currentUserService.isManager(currentUser) && currentTeamId != null && currentTeamId.equals(customerTeamId)) {
            return;
        }
        throw new ResourceNotFoundException("Task not found with id: " + task.getId());
    }

    private void verifyCanAssign(Customer customer, User user) {
        var currentUser = currentUserService.getCurrentUser();
        Long customerTeamId = customer.getTeam() == null ? null : customer.getTeam().getId();
        Long assigneeTeamId = user == null || user.getTeam() == null ? null : user.getTeam().getId();
        if (assigneeTeamId != null && customerTeamId != null && !assigneeTeamId.equals(customerTeamId)) {
            throw new IllegalArgumentException("Task assignee must belong to the same team as the customer.");
        }
        if (currentUserService.isAdmin(currentUser)) {
            return;
        }
        Long currentTeamId = currentUser.getTeam() == null ? null : currentUser.getTeam().getId();
        if (currentUserService.isManager(currentUser) && currentTeamId != null && currentTeamId.equals(customerTeamId)) {
            return;
        }
        if (currentUserService.isSales(currentUser) && user != null && user.getId().equals(currentUser.getId())) {
            return;
        }
        throw new ResourceNotFoundException("Customer not found with id: " + customer.getId());
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDueDate(),
                task.getStatus(),
                task.getStatus() == TaskStatus.TODO && task.getDueDate().isBefore(LocalDate.now()),
                task.getUser() == null ? null : task.getUser().getId(),
                task.getUser() == null ? null : task.getUser().getName(),
                task.getCustomer().getId(),
                task.getCustomer().getName(),
                task.getCustomer().getTeam() == null ? null : task.getCustomer().getTeam().getId(),
                task.getCustomer().getTeam() == null ? null : task.getCustomer().getTeam().getName()
        );
    }
}
