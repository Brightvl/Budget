package com.rest.controller;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class ExpenseRequest {

    private String description;
    private BigDecimal amount;

}

