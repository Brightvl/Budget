package com.rest.controller;

import com.rest.dto.GoalDTO;
import com.rest.model.Goal;
import com.rest.model.auth.User;
import com.rest.service.GoalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<GoalDTO>> getGoalsByUser(@PathVariable Long userId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Goal> goals = goalService.getGoalsByUserId(userId);
        List<GoalDTO> goalDTOs = goals.stream()
                .map(this::convertToGoalDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(goalDTOs);
    }

    @GetMapping("/{userId}/{goalId}")
    public ResponseEntity<GoalDTO> getGoalById(@PathVariable Long userId, @PathVariable Long goalId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Goal> goalOptional = goalService.getGoalByIdAndUserId(goalId, userId);
        if (goalOptional.isPresent()) {
            GoalDTO goalDTO = convertToGoalDTO(goalOptional.get());
            return ResponseEntity.ok(goalDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/{userId}")
    public ResponseEntity<GoalDTO> createGoal(@PathVariable Long userId, @RequestBody GoalDTO goalDTO) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Goal goal = convertToGoalEntity(goalDTO);
        Goal createdGoal = goalService.createGoal(userId, goal);

        return ResponseEntity.status(HttpStatus.CREATED).body(convertToGoalDTO(createdGoal));
    }

    @PutMapping("/{userId}/{goalId}")
    public ResponseEntity<GoalDTO> updateGoal(@PathVariable Long userId, @PathVariable Long goalId, @RequestBody GoalDTO goalDTO) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Создаем объект Goal без учета шагов
        Goal goal = Goal.builder()
                .title(goalDTO.getTitle())
                .description(goalDTO.getDescription())
                .isCompleted(goalDTO.getIsCompleted())
                .startTime(goalDTO.getStartTime())
                .build();

        Goal updatedGoal = goalService.updateGoal(userId, goalId, goal);

        if (updatedGoal == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(convertToGoalDTO(updatedGoal));
    }

    @DeleteMapping("/{userId}/{goalId}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long userId, @PathVariable Long goalId) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        boolean isDeleted = goalService.deleteGoal(userId, goalId);
        if (!isDeleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.noContent().build();
    }

    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User) {
            return ((User) principal).getId();
        }
        return null;
    }

    private GoalDTO convertToGoalDTO(Goal goal) {
        return GoalDTO.builder()
                .id(goal.getId())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .isCompleted(goal.getIsCompleted())
                .startTime(goal.getStartTime())
                .stepIds(goal.getSteps() != null ? goal.getSteps().stream()
                        .map(step -> step.getId())
                        .collect(Collectors.toList()) : null)
                .build();
    }

    private Goal convertToGoalEntity(GoalDTO goalDTO) {
        return Goal.builder()
                .title(goalDTO.getTitle())
                .description(goalDTO.getDescription())
                .isCompleted(goalDTO.getIsCompleted())
                .startTime(goalDTO.getStartTime())
                .build();
    }
}
