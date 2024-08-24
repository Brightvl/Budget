package com.rest.service;

import com.rest.model.Goal;
import com.rest.repository.GoalRepository;
import com.rest.repository.UserRepository;
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

    public Optional<Goal> getGoalByIdAndUserId(Long goalId, Long userId) {
        return goalRepository.findByIdAndUserId(goalId, userId);
    }

    public Goal createGoal(Long userId, Goal goal) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        goal.setUser(user);

        goal.updateCompletionPercentage();
        goal.updateGoalStatus();

        return goalRepository.save(goal);
    }


    public Goal updateGoal(Long userId, Long goalId, Goal updatedGoal) {
        var existingGoalOptional = goalRepository.findByIdAndUserId(goalId, userId);
        if (existingGoalOptional.isPresent()) {
            var existingGoal = existingGoalOptional.get();
            existingGoal.setTitle(updatedGoal.getTitle());
            existingGoal.setDescription(updatedGoal.getDescription());
            existingGoal.setIsCompleted(updatedGoal.getIsCompleted());
            existingGoal.setIsFailed(updatedGoal.getIsFailed());
            existingGoal.setStartTime(updatedGoal.getStartTime());
            existingGoal.setEndTime(updatedGoal.getEndTime());
            existingGoal.setCreatedTime(updatedGoal.getCreatedTime());

            existingGoal.updateCompletionPercentage();
            existingGoal.updateGoalStatus();

            return goalRepository.save(existingGoal);
        } else {
            return null;
        }
    }


    public boolean deleteGoal(Long userId, Long goalId) {
        var existingGoalOptional = goalRepository.findByIdAndUserId(goalId, userId);
        if (existingGoalOptional.isPresent()) {
            goalRepository.delete(existingGoalOptional.get());
            return true;
        } else {
            return false;
        }
    }
}
