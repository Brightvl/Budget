package com.rest.controller;


import com.rest.model.User;
import com.rest.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping("/add")
    public ResponseEntity<String> addExpense(@RequestBody ExpenseRequest request, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        expenseService.addExpense(user, request.getDescription(), request.getAmount());
        return ResponseEntity.ok("Expense added successfully");
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalExpenses(@RequestParam String startDate, @RequestParam String endDate, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        BigDecimal totalExpenses = expenseService.calculateTotalExpenses(user, start, end);
        return ResponseEntity.ok(totalExpenses);
    }
}
