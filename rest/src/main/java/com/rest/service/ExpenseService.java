package com.rest.service;


import com.rest.model.Expense;
import com.rest.model.User;
import com.rest.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense addExpense(User user, String description, BigDecimal amount) {
        Expense expense = new Expense();
        expense.setUser(user);
        expense.setDescription(description);
        expense.setAmount(amount);
        expense.setDate(LocalDate.now());

        return expenseRepository.save(expense);
    }

    public BigDecimal calculateTotalExpenses(User user, LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = expenseRepository.findByUserAndDateBetween(user, startDate, endDate);
        return expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}

