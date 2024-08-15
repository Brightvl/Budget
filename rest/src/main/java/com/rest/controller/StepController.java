package com.rest.controller;

import com.rest.dto.StepDTO;
import com.rest.model.Goal;
import com.rest.model.Step;
import com.rest.model.auth.User;
import com.rest.service.GoalService;
import com.rest.service.StepService;
import com.rest.service.auth.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/goals/{goalId}/steps")
public class StepController {

    private final StepService stepService;
    private final GoalService goalService;
    private final AuthService authService;

    public StepController(StepService stepService, GoalService goalService, AuthService authService) {
        this.stepService = stepService;
        this.goalService = goalService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<StepDTO>> getStepsByGoal(@PathVariable Long goalId) {
        User currentUser = authService.getCurrentUser();
        Goal goal = goalService.getGoalById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Step> steps = stepService.getStepsByGoalId(goalId);
        List<StepDTO> stepDTOs = steps.stream()
                .map(this::convertToStepDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(stepDTOs);
    }

    @GetMapping("/{stepId}")
    public ResponseEntity<StepDTO> getStepById(@PathVariable Long goalId, @PathVariable Long stepId) {
        User currentUser = authService.getCurrentUser();
        Step step = stepService.getStepByIdAndGoalId(stepId, goalId)
                .orElseThrow(() -> new RuntimeException("Step not found"));

        if (!step.getGoal().getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(convertToStepDTO(step));
    }

    @PostMapping
    public ResponseEntity<StepDTO> createStep(@PathVariable Long goalId, @RequestBody StepDTO stepDTO) {
        User currentUser = authService.getCurrentUser();
        Goal goal = goalService.getGoalById(goalId)
                .orElseThrow(() -> new RuntimeException("Goal not found"));

        if (!goal.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Step step = convertToStepEntity(stepDTO);
        step.setGoal(goal);

        Step createdStep = stepService.createStep(step);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(convertToStepDTO(createdStep));
    }

    @PutMapping("/{stepId}")
    public ResponseEntity<StepDTO> updateStep(@PathVariable Long goalId, @PathVariable Long stepId, @RequestBody StepDTO stepDTO) {
        User currentUser = authService.getCurrentUser();
        Step step = stepService.getStepByIdAndGoalId(stepId, goalId)
                .orElseThrow(() -> new RuntimeException("Step not found"));

        if (!step.getGoal().getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        step.setTitle(stepDTO.getTitle());
        step.setIsCompleted(stepDTO.isCompleted());

        Step updatedStep = stepService.updateStep(step);
        return ResponseEntity.ok(convertToStepDTO(updatedStep));
    }

    @DeleteMapping("/{stepId}")
    public ResponseEntity<Void> deleteStep(@PathVariable Long goalId, @PathVariable Long stepId) {
        User currentUser = authService.getCurrentUser();
        Step step = stepService.getStepByIdAndGoalId(stepId, goalId)
                .orElseThrow(() -> new RuntimeException("Step not found"));

        if (!step.getGoal().getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        stepService.deleteStepByIdAndGoalId(stepId, goalId);
        return ResponseEntity.noContent().build();
    }

    private StepDTO convertToStepDTO(Step step) {
        return StepDTO.builder()
                .id(step.getId())
                .title(step.getTitle())
                .isCompleted(step.getIsCompleted())
                .startTime(step.getStartTime())
                .build();
    }

    private Step convertToStepEntity(StepDTO stepDTO) {
        return Step.builder()
                .title(stepDTO.getTitle())
                .isCompleted(stepDTO.isCompleted())
                .startTime(stepDTO.getStartTime())
                .build();
    }
}
