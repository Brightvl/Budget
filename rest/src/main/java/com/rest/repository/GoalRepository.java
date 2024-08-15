package com.rest.repository;

import com.rest.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {

    // Найти все цели по ID пользователя
    List<Goal> findByUserId(Long userId);

    // Найти цель по ID цели и ID пользователя
    Optional<Goal> findByIdAndUserId(Long goalId, Long userId);
}
