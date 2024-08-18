package com.rest.service;

import com.rest.model.Goal;
import com.rest.model.auth.User;
import com.rest.repository.GoalRepository;
import com.rest.repository.UserRepository;
import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    private final GoalRepository goalRepository;
    private final UserRepository userRepository;

    public GoalService(UserRepository userRepository, GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }
    public List<Goal> getGoalsByUserId(Long userId) {
        return goalRepository.findByUserId(userId);
    }

    public Optional<Goal> getGoalById(Long goalId) {
        return goalRepository.findById(goalId);
    }

    public Optional<Goal> getGoalByIdAndUserId(Long goalId, Long userId) {
        return goalRepository.findByIdAndUserId(goalId, userId);
    }

    public Goal createGoal(Long userId, Goal goal) {
        // Находим пользователя по userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Связываем цель с пользователем
        goal.setUser(user);
        return goalRepository.save(goal);
    }

    public Goal updateGoal(Long userId, Long goalId, Goal updatedGoal) {
        // Проверяем наличие цели и пользователя
        Optional<Goal> existingGoal = getGoalByIdAndUserId(goalId, userId);
        if (existingGoal.isPresent()) {
            Goal goal = existingGoal.get();
            goal.setTitle(updatedGoal.getTitle());
            goal.setDescription(updatedGoal.getDescription());
            goal.setIsCompleted(updatedGoal.getIsCompleted());
            goal.setStartTime(updatedGoal.getStartTime());
            goal.setSteps(updatedGoal.getSteps());
            return goalRepository.save(goal);
        } else {
            return null;
        }
    }

    public boolean deleteGoal(Long userId, Long goalId) {
        Optional<Goal> existingGoal = getGoalByIdAndUserId(goalId, userId);
        if (existingGoal.isPresent()) {
            goalRepository.delete(existingGoal.get());
            return true;
        } else {
            return false;
        }
    }
}

