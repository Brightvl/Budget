package com.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoalDTO {
    private Long id;
    private String title;
    private String description;
    private Boolean isCompleted;
    private LocalDateTime startTime;
    private List<Long> stepIds;
}
