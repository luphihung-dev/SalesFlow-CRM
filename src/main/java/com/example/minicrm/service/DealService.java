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
    private final CurrentUserService currentUserService;

    public DealService(DealRepository dealRepository, CustomerService customerService, UserService userService, ApplicationEventPublisher eventPublisher, CurrentUserService currentUserService) {
        this.dealRepository = dealRepository;
        this.customerService = customerService;
        this.userService = userService;
        this.eventPublisher = eventPublisher;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<DealResponse> findAll() {
        var currentUser = currentUserService.getCurrentUser();
        if (currentUserService.isAdmin(currentUser)) {
            return dealRepository.findAll().stream().map(this::toResponse).toList();
        }
        if (currentUserService.isManager(currentUser)) {
            Long teamId = currentUser.getTeam() == null ? null : currentUser.getTeam().getId();
            return teamId == null ? List.of() : dealRepository.findByOwnerTeamId(teamId).stream().map(this::toResponse).toList();
        }
        return dealRepository.findByOwnerId(currentUser.getId()).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DealResponse findById(Long id) {
        Deal deal = getDeal(id);
        verifyReadable(deal);
        return toResponse(deal);
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
        verifyWritable(deal);
        DealStage previousStage = deal.getStage();
        applyRequest(deal, request);
        if (previousStage != DealStage.CLOSED && deal.getStage() == DealStage.CLOSED) {
            eventPublisher.publishEvent(new DealClosedEvent(deal.getId()));
        }
        return toResponse(deal);
    }

    public void delete(Long id) {
        Deal deal = getDeal(id);
        verifyDeletable(deal);
        dealRepository.delete(deal);
    }

    private Deal getDeal(Long id) {
        return dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal not found with id: " + id));
    }

    private void applyRequest(Deal deal, DealRequest request) {
        Customer customer = customerService.getCustomer(request.customerId());
        User owner = userService.getUser(request.ownerId());
        verifyCanAssign(customer, owner);
        deal.setName(request.name());
        deal.setAmount(request.amount());
        deal.setStage(request.stage());
        deal.setRequiresManagerApproval(request.amount().compareTo(MANAGER_APPROVAL_THRESHOLD) > 0);
        deal.setCustomer(customer);
        deal.setOwner(owner);
    }

    private void verifyReadable(Deal deal) {
        var currentUser = currentUserService.getCurrentUser();
        if (currentUserService.isAdmin(currentUser)) {
            return;
        }
        Long currentTeamId = currentUser.getTeam() == null ? null : currentUser.getTeam().getId();
        Long ownerTeamId = deal.getOwner().getTeam() == null ? null : deal.getOwner().getTeam().getId();
        if (currentUserService.isManager(currentUser) && currentTeamId != null && currentTeamId.equals(ownerTeamId)) {
            return;
        }
        if (currentUserService.isSales(currentUser) && deal.getOwner().getId().equals(currentUser.getId())) {
            return;
        }
        throw new ResourceNotFoundException("Deal not found with id: " + deal.getId());
    }

    private void verifyWritable(Deal deal) {
        verifyReadable(deal);
    }

    private void verifyDeletable(Deal deal) {
        User currentUser = currentUserService.getCurrentUser();
        if (currentUserService.isAdmin(currentUser)) {
            return;
        }
        Long currentTeamId = currentUser.getTeam() == null ? null : currentUser.getTeam().getId();
        Long ownerTeamId = deal.getOwner().getTeam() == null ? null : deal.getOwner().getTeam().getId();
        if (currentUserService.isManager(currentUser) && currentTeamId != null && currentTeamId.equals(ownerTeamId)) {
            return;
        }
        throw new ResourceNotFoundException("Deal not found with id: " + deal.getId());
    }

    private void verifyCanAssign(Customer customer, User owner) {
        var currentUser = currentUserService.getCurrentUser();
        Long customerTeamId = customer.getTeam() == null ? null : customer.getTeam().getId();
        Long ownerTeamId = owner.getTeam() == null ? null : owner.getTeam().getId();
        if (customerTeamId != null && ownerTeamId != null && !customerTeamId.equals(ownerTeamId)) {
            throw new IllegalArgumentException("Deal owner must belong to the same team as the customer.");
        }
        if (currentUserService.isAdmin(currentUser)) {
            return;
        }
        Long currentTeamId = currentUser.getTeam() == null ? null : currentUser.getTeam().getId();
        if (currentUserService.isManager(currentUser) && currentTeamId != null && currentTeamId.equals(ownerTeamId)) {
            return;
        }
        if (currentUserService.isSales(currentUser) && owner.getId().equals(currentUser.getId())) {
            return;
        }
        throw new ResourceNotFoundException("User not found with id: " + owner.getId());
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
                deal.getOwner().getName(),
                deal.getOwner().getTeam() == null ? null : deal.getOwner().getTeam().getId(),
                deal.getOwner().getTeam() == null ? null : deal.getOwner().getTeam().getName()
        );
    }
}
