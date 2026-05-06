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

    public TaskService(TaskRepository taskRepository, CustomerService customerService, UserService userService, ApplicationEventPublisher eventPublisher) {
        this.taskRepository = taskRepository;
        this.customerService = customerService;
        this.userService = userService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> findAll() {
        return taskRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(Long id) {
        return toResponse(getTask(id));
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
        TaskStatus previousStatus = task.getStatus();
        applyRequest(task, request);
        if (previousStatus != TaskStatus.DONE && task.getStatus() == TaskStatus.DONE) {
            eventPublisher.publishEvent(new TaskCompletedEvent(task.getId(), task.getCustomer().getId()));
        }
        return toResponse(task);
    }

    public void delete(Long id) {
        Task task = getTask(id);
        taskRepository.delete(task);
    }

    private Task getTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private void applyRequest(Task task, TaskRequest request) {
        User user = request.userId() == null ? null : userService.getUser(request.userId());
        Customer customer = customerService.getCustomer(request.customerId());
        task.setTitle(request.title());
        task.setDueDate(request.dueDate());
        task.setStatus(request.status());
        task.setUser(user);
        task.setCustomer(customer);
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
                task.getCustomer().getName()
        );
    }
}
