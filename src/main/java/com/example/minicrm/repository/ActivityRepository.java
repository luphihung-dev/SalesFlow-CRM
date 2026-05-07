package com.example.minicrm.repository;

import com.example.minicrm.entity.Activity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByCustomerTeamId(Long teamId);
    Optional<Activity> findByDescriptionAndCustomerId(String description, Long customerId);

    @Query("""
            select distinct a from Activity a
            left join a.customer c
            left join c.deals d
            left join c.tasks t
            where d.owner.id = :userId or t.user.id = :userId
            """)
    List<Activity> findVisibleToSales(@Param("userId") Long userId);
}
