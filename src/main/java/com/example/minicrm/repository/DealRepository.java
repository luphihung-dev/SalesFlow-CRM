package com.example.minicrm.repository;

import com.example.minicrm.entity.Deal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DealRepository extends JpaRepository<Deal, Long> {
    List<Deal> findByOwnerTeamId(Long teamId);
    List<Deal> findByOwnerId(Long ownerId);
    Optional<Deal> findByNameAndCustomerId(String name, Long customerId);
}
