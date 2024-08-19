package com.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class StepDTO {
    private Long id;
    private String title;
    private boolean isCompleted;
    private LocalDateTime startTime;
}
