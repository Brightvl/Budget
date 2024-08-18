package com.rest.service;

import com.rest.model.Step;
import com.rest.repository.StepRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StepService {

    private final StepRepository stepRepository;

    public StepService(StepRepository stepRepository) {
        this.stepRepository = stepRepository;
    }

    public List<Step> getStepsByGoalIdAndUserId(Long goalId, Long userId) {
        return stepRepository.findByGoalIdAndGoalUserId(goalId, userId);
    }

    public Optional<Step> getStepByIdAndGoalIdAndUserId(Long stepId, Long goalId, Long userId) {
        return stepRepository.findByIdAndGoalIdAndGoalUserId(stepId, goalId, userId);
    }

    public Step createStep(Step step) {
        return stepRepository.save(step);
    }

    public Step updateStep(Step step) {
        return stepRepository.save(step);
    }

    public boolean deleteStepByIdAndGoalIdAndUserId(Long stepId, Long goalId, Long userId) {
        Optional<Step> stepOptional = stepRepository.findByIdAndGoalIdAndGoalUserId(stepId, goalId, userId);
        if (stepOptional.isPresent()) {
            stepRepository.delete(stepOptional.get());
            return true;
        }
        return false;
    }
}
