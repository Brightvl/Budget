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

    public List<Step> getStepsByGoalId(Long goalId) {
        return stepRepository.findByGoalId(goalId);
    }

    public Optional<Step> getStepByIdAndGoalId(Long stepId, Long goalId) {
        return stepRepository.findByIdAndGoalId(stepId, goalId);
    }

    public Step createStep(Step step) {
        return stepRepository.save(step);
    }

    public Step updateStep(Step step) {
        return stepRepository.save(step);
    }

    public boolean deleteStepByIdAndGoalId(Long stepId, Long goalId) {
        Optional<Step> step = stepRepository.findByIdAndGoalId(stepId, goalId);
        if (step.isPresent()) {
            stepRepository.delete(step.get());
            return true;
        }
        return false;
    }
}
