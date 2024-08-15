package com.rest.controller;

import com.rest.dto.GoalDTO;
import com.rest.model.Goal;
import com.rest.model.Step;
import com.rest.model.auth.User;
import com.rest.service.GoalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401, если пользователь не аутентифицирован
        }
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403, если доступ запрещен
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401, если пользователь не аутентифицирован
        }
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403, если доступ запрещен
        }

        return goalService.getGoalByIdAndUserId(goalId, userId)
                .map(this::convertToGoalDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/{userId}")
    public ResponseEntity<GoalDTO> createGoal(@PathVariable Long userId, @RequestBody GoalDTO goalDTO) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401, если пользователь не аутентифицирован
        }
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403, если доступ запрещен
        }

        Goal goal = convertToGoalEntity(goalDTO);
        Goal createdGoal = goalService.createGoal(userId, goal);

        return ResponseEntity.status(HttpStatus.CREATED).body(convertToGoalDTO(createdGoal));
    }

    @PutMapping("/{userId}/{goalId}")
    public ResponseEntity<GoalDTO> updateGoal(@PathVariable Long userId, @PathVariable Long goalId, @RequestBody GoalDTO goalDTO) {
        Long currentUserId = getCurrentUserId();
        if (currentUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401, если пользователь не аутентифицирован
        }
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403, если доступ запрещен
        }

        Goal goal = convertToGoalEntity(goalDTO);
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401, если пользователь не аутентифицирован
        }
        if (!userId.equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403, если доступ запрещен
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
                        .map(Step::getId)
                        .collect(Collectors.toList()) : new ArrayList<>())
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
