package com.example.minicrm.repository;

import com.example.minicrm.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DealRepository extends JpaRepository<Deal, Long> {
}
