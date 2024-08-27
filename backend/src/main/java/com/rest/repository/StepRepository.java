package com.rest.repository;

import com.rest.model.Step;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StepRepository extends JpaRepository<Step, Long> {

    List<Step> findByGoalId(Long goalId);
    Optional<Step> findByIdAndGoalId(Long stepId, Long goalId);
    Optional<Step> findByIdAndGoalIdAndGoalUserId(Long stepId, Long goalId, Long userId);
    List<Step> findByGoalIdAndGoalUserId(Long goalId, Long userId);
}
