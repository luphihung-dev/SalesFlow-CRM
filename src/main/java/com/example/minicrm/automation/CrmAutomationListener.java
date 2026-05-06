package com.example.minicrm.automation;

import com.example.minicrm.entity.Activity;
import com.example.minicrm.entity.ActivityType;
import com.example.minicrm.entity.Customer;
import com.example.minicrm.entity.Deal;
import com.example.minicrm.entity.Task;
import com.example.minicrm.entity.TaskStatus;
import com.example.minicrm.event.CustomerCreatedEvent;
import com.example.minicrm.event.DealClosedEvent;
import com.example.minicrm.event.DealCreatedEvent;
import com.example.minicrm.event.TaskCompletedEvent;
import com.example.minicrm.exception.ResourceNotFoundException;
import com.example.minicrm.repository.ActivityRepository;
import com.example.minicrm.repository.CustomerRepository;
import com.example.minicrm.repository.DealRepository;
import com.example.minicrm.repository.TaskRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
public class CrmAutomationListener {

    private static final BigDecimal HIGH_VALUE_DEAL_THRESHOLD = new BigDecimal("10000.00");
    private static final BigDecimal MANAGER_APPROVAL_THRESHOLD = new BigDecimal("50000.00");

    private final CustomerRepository customerRepository;
    private final DealRepository dealRepository;
    private final TaskRepository taskRepository;
    private final ActivityRepository activityRepository;

    public CrmAutomationListener(
            CustomerRepository customerRepository,
            DealRepository dealRepository,
            TaskRepository taskRepository,
            ActivityRepository activityRepository
    ) {
        this.customerRepository = customerRepository;
        this.dealRepository = dealRepository;
        this.taskRepository = taskRepository;
        this.activityRepository = activityRepository;
    }

    @EventListener
    public void createFollowUpTask(CustomerCreatedEvent event) {
        Customer customer = customerRepository.findById(event.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + event.customerId()));

        Task task = new Task();
        task.setTitle("Follow up with new customer");
        task.setDueDate(LocalDate.now().plusDays(2));
        task.setStatus(TaskStatus.TODO);
        task.setCustomer(customer);
        taskRepository.save(task);
    }

    @EventListener
    public void logHighValueDeal(DealCreatedEvent event) {
        Deal deal = dealRepository.findById(event.dealId())
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with id: " + event.dealId()));

        if (deal.getAmount().compareTo(HIGH_VALUE_DEAL_THRESHOLD) <= 0) {
            return;
        }

        createActivity(deal.getCustomer(), ActivityType.NOTE, "High value deal created");

        if (deal.getAmount().compareTo(MANAGER_APPROVAL_THRESHOLD) > 0) {
            createActivity(deal.getCustomer(), ActivityType.NOTE, "Manager approval required for enterprise deal");
        }
    }

    @EventListener
    public void logClosedDeal(DealClosedEvent event) {
        Deal deal = dealRepository.findById(event.dealId())
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with id: " + event.dealId()));

        createActivity(deal.getCustomer(), ActivityType.NOTE, "Deal closed");
    }

    @EventListener
    public void logTaskCompletion(TaskCompletedEvent event) {
        Customer customer = customerRepository.findById(event.customerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + event.customerId()));

        createActivity(customer, ActivityType.NOTE, "Task completed");
    }

    private void createActivity(Customer customer, ActivityType type, String description) {
        Activity activity = new Activity();
        activity.setType(type);
        activity.setDescription(description);
        activity.setCustomer(customer);
        activityRepository.save(activity);
    }
}
