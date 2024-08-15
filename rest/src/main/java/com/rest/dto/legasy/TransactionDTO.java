package com.rest.dto.legasy;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private Double amount;
    private LocalDateTime date;
    private String description;
    private Long categoryId;
    private Long userId;
}
