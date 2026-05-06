package com.example.minicrm.service;

import com.example.minicrm.dto.ActivityRequest;
import com.example.minicrm.dto.ActivityResponse;
import com.example.minicrm.entity.Activity;
import com.example.minicrm.entity.Customer;
import com.example.minicrm.exception.ResourceNotFoundException;
import com.example.minicrm.repository.ActivityRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CustomerService customerService;

    public ActivityService(ActivityRepository activityRepository, CustomerService customerService) {
        this.activityRepository = activityRepository;
        this.customerService = customerService;
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> findAll() {
        return activityRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ActivityResponse findById(Long id) {
        return toResponse(getActivity(id));
    }

    public ActivityResponse create(ActivityRequest request) {
        Activity activity = new Activity();
        applyRequest(activity, request);
        return toResponse(activityRepository.save(activity));
    }

    public ActivityResponse update(Long id, ActivityRequest request) {
        Activity activity = getActivity(id);
        applyRequest(activity, request);
        return toResponse(activity);
    }

    public void delete(Long id) {
        Activity activity = getActivity(id);
        activityRepository.delete(activity);
    }

    private Activity getActivity(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));
    }

    private void applyRequest(Activity activity, ActivityRequest request) {
        Customer customer = customerService.getCustomer(request.customerId());
        activity.setType(request.type());
        activity.setDescription(request.description());
        activity.setCustomer(customer);
    }

    private ActivityResponse toResponse(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getType(),
                activity.getDescription(),
                activity.getCreatedAt(),
                activity.getCustomer().getId(),
                activity.getCustomer().getName()
        );
    }
}
