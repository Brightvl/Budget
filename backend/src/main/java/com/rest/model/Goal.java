package com.rest.model;

import com.rest.model.auth.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private Boolean isCompleted = false;
    private Boolean isFailed = false;

    private Double completionPercentage = 0.0;

    private LocalDateTime startTime = LocalDateTime.now();
    private LocalDateTime endTime;
    private LocalDateTime createdTime = LocalDateTime.now();

    @OneToMany(mappedBy = "goal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Step> steps = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public void updateGoalStatus() {
        if (Boolean.TRUE.equals(isCompleted)) {
            isFailed = false;
        } else if (Boolean.TRUE.equals(isFailed)) {
            isCompleted = false;
        } else {
            isCompleted = completionPercentage >= 100;
        }

        if (endTime != null && LocalDateTime.now().isAfter(endTime) && !isCompleted) {
            isFailed = true;
        }
    }

    public void updateCompletionPercentage() {
        if (steps == null || steps.isEmpty()) {
            this.completionPercentage = 0.0;
        } else {
            double completedSteps = steps.stream().filter(Step::getIsCompleted).count();
            this.completionPercentage = (completedSteps / steps.size()) * 100.0;
        }
        updateGoalStatus();
    }
}
