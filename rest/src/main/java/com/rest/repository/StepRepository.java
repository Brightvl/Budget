package com.rest.repository;

import com.rest.model.Step;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StepRepository extends JpaRepository<Step, Long> {

    // Найти все шаги по ID цели
    List<Step> findByGoalId(Long goalId);

    // Найти шаг по ID шага и ID цели
    Optional<Step> findByIdAndGoalId(Long stepId, Long goalId);
}
