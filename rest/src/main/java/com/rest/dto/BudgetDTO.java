package com.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@AllArgsConstructor
public class BudgetDTO {
    private Long id;
    private Double amount;
    private String period;
    private Long categoryId;
    private Long userId;
}
