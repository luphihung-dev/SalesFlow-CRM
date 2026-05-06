package com.example.minicrm.service;

import com.example.minicrm.dto.DealRequest;
import com.example.minicrm.dto.DealResponse;
import com.example.minicrm.entity.Customer;
import com.example.minicrm.entity.Deal;
import com.example.minicrm.entity.DealStage;
import com.example.minicrm.entity.User;
import com.example.minicrm.event.DealClosedEvent;
import com.example.minicrm.event.DealCreatedEvent;
import com.example.minicrm.exception.ResourceNotFoundException;
import com.example.minicrm.repository.DealRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DealService {

    private static final BigDecimal MANAGER_APPROVAL_THRESHOLD = new BigDecimal("50000.00");

    private final DealRepository dealRepository;
    private final CustomerService customerService;
    private final UserService userService;
    private final ApplicationEventPublisher eventPublisher;

    public DealService(DealRepository dealRepository, CustomerService customerService, UserService userService, ApplicationEventPublisher eventPublisher) {
        this.dealRepository = dealRepository;
        this.customerService = customerService;
        this.userService = userService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<DealResponse> findAll() {
        return dealRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DealResponse findById(Long id) {
        return toResponse(getDeal(id));
    }

    public DealResponse create(DealRequest request) {
        Deal deal = new Deal();
        applyRequest(deal, request);
        Deal savedDeal = dealRepository.save(deal);
        eventPublisher.publishEvent(new DealCreatedEvent(savedDeal.getId()));
        return toResponse(savedDeal);
    }

    public DealResponse update(Long id, DealRequest request) {
        Deal deal = getDeal(id);
        DealStage previousStage = deal.getStage();
        applyRequest(deal, request);
        if (previousStage != DealStage.CLOSED && deal.getStage() == DealStage.CLOSED) {
            eventPublisher.publishEvent(new DealClosedEvent(deal.getId()));
        }
        return toResponse(deal);
    }

    public void delete(Long id) {
        Deal deal = getDeal(id);
        dealRepository.delete(deal);
    }

    private Deal getDeal(Long id) {
        return dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with id: " + id));
    }

    private void applyRequest(Deal deal, DealRequest request) {
        Customer customer = customerService.getCustomer(request.customerId());
        User owner = userService.getUser(request.ownerId());
        deal.setName(request.name());
        deal.setAmount(request.amount());
        deal.setStage(request.stage());
        deal.setRequiresManagerApproval(request.amount().compareTo(MANAGER_APPROVAL_THRESHOLD) > 0);
        deal.setCustomer(customer);
        deal.setOwner(owner);
    }

    private DealResponse toResponse(Deal deal) {
        return new DealResponse(
                deal.getId(),
                deal.getName(),
                deal.getAmount(),
                deal.getStage(),
                deal.isRequiresManagerApproval(),
                deal.getCustomer().getId(),
                deal.getCustomer().getName(),
                deal.getOwner().getId(),
                deal.getOwner().getName()
        );
    }
}
