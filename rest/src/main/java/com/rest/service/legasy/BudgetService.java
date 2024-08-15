package com.rest.service.legasy;

import com.rest.model.legasy.Budget;
import com.rest.repository.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public Budget getBudgetById(Long id) {
        return budgetRepository.findById(id).orElseThrow(() -> new RuntimeException("Budget not found"));
    }

    public List<Budget> getAllBudgetsByUser(Long userId) {
        return budgetRepository.findByUserId(userId);
    }

    public Budget updateBudget(Long id, Budget budgetDetails) {
        Budget budget = getBudgetById(id);
        budget.setAmount(budgetDetails.getAmount());
        budget.setPeriod(budgetDetails.getPeriod());
        budget.setCategory(budgetDetails.getCategory());
        return budgetRepository.save(budget);
    }

    public void deleteBudget(Long id) {
        Budget budget = getBudgetById(id);
        budgetRepository.delete(budget);
    }
}
