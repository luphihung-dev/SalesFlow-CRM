package com.example.minicrm.repository;

import com.example.minicrm.entity.Customer;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
    List<Customer> findByTeamId(Long teamId);

    @Query("""
            select distinct c from Customer c
            left join c.deals d
            left join c.tasks t
            where d.owner.id = :userId or t.user.id = :userId
            """)
    List<Customer> findVisibleToSales(@Param("userId") Long userId);
}
