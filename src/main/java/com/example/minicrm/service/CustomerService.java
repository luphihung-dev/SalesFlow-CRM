package com.example.minicrm.service;

import com.example.minicrm.dto.CustomerRequest;
import com.example.minicrm.dto.CustomerResponse;
import com.example.minicrm.entity.Customer;
import com.example.minicrm.entity.CustomerCountry;
import com.example.minicrm.event.CustomerCreatedEvent;
import com.example.minicrm.exception.DuplicateResourceException;
import com.example.minicrm.exception.ResourceNotFoundException;
import com.example.minicrm.repository.CustomerRepository;
import java.util.List;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final ApplicationEventPublisher eventPublisher;

    public CustomerService(CustomerRepository customerRepository, ApplicationEventPublisher eventPublisher) {
        this.customerRepository = customerRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> findAll() {
        return customerRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public CustomerResponse findById(Long id) {
        return toResponse(getCustomer(id));
    }

    public CustomerResponse create(CustomerRequest request) {
        if (customerRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Customer email already exists: " + request.email());
        }
        Customer customer = new Customer();
        applyRequest(customer, request);
        Customer savedCustomer = customerRepository.save(customer);
        eventPublisher.publishEvent(new CustomerCreatedEvent(savedCustomer.getId()));
        return toResponse(savedCustomer);
    }

    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer customer = getCustomer(id);
        if (customerRepository.existsByEmailAndIdNot(request.email(), id)) {
            throw new DuplicateResourceException("Customer email already exists: " + request.email());
        }
        applyRequest(customer, request);
        return toResponse(customer);
    }

    public void delete(Long id) {
        Customer customer = getCustomer(id);
        customerRepository.delete(customer);
    }

    public Customer getCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    private void applyRequest(Customer customer, CustomerRequest request) {
        validatePhoneForCountry(request.phone(), request.country());
        customer.setName(request.name());
        customer.setEmail(request.email());
        customer.setPhone(request.phone());
        customer.setCountry(request.country());
        customer.setCompany(request.company());
        customer.setStatus(request.status());
    }

    private void validatePhoneForCountry(String phone, CustomerCountry country) {
        if (phone == null || phone.isBlank()) {
            return;
        }

        String digits = phone.replaceAll("\\D", "");
        int length = digits.length();
        boolean valid = switch (country) {
            case VN -> length == 9 || length == 10;
            case US -> length == 10 || length == 11;
            case JP -> length == 10 || length == 11;
        };

        if (!valid) {
            throw new IllegalArgumentException("Phone number length is not valid for " + country + ". VN requires 9-10 digits, US requires 10-11 digits, JP requires 10-11 digits.");
        }
    }

    private CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getCountry(),
                customer.getCompany(),
                customer.getStatus(),
                customer.getCreatedAt()
        );
    }
}
