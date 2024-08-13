package com.rest.controller;

import com.rest.dto.BudgetDTO;
import com.rest.model.Budget;
import com.rest.model.Category;
import com.rest.model.User;
import com.rest.service.BudgetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<BudgetDTO> createBudget(@RequestBody BudgetDTO budgetDTO) {
        Budget budget = new Budget();
        budget.setAmount(budgetDTO.getAmount());
        budget.setPeriod(budgetDTO.getPeriod());

        // Устанавливаем связи с категориями и пользователями
        Category category = new Category();
        category.setId(budgetDTO.getCategoryId());
        budget.setCategory(category);

        User user = new User();
        user.setId(budgetDTO.getUserId());
        budget.setUser(user);

        Budget createdBudget = budgetService.createBudget(budget);

        BudgetDTO createdBudgetDTO = new BudgetDTO(createdBudget.getId(), createdBudget.getAmount(), createdBudget.getPeriod(), createdBudget.getCategory().getId(), createdBudget.getUser().getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdBudgetDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetDTO> getBudgetById(@PathVariable Long id) {
        Budget budget = budgetService.getBudgetById(id);
        if (budget != null) {
            BudgetDTO budgetDTO = new BudgetDTO(budget.getId(), budget.getAmount(), budget.getPeriod(), budget.getCategory().getId(), budget.getUser().getId());
            return ResponseEntity.ok(budgetDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetDTO> updateBudget(@PathVariable Long id, @RequestBody BudgetDTO budgetDTO) {
        Budget budget = budgetService.getBudgetById(id);
        budget.setAmount(budgetDTO.getAmount());
        budget.setPeriod(budgetDTO.getPeriod());

        Category category = new Category();
        category.setId(budgetDTO.getCategoryId());
        budget.setCategory(category);

        User user = new User();
        user.setId(budgetDTO.getUserId());
        budget.setUser(user);

        Budget updatedBudget = budgetService.updateBudget(id, budget);

        BudgetDTO updatedBudgetDTO = new BudgetDTO(updatedBudget.getId(), updatedBudget.getAmount(), updatedBudget.getPeriod(), updatedBudget.getCategory().getId(), updatedBudget.getUser().getId());

        return ResponseEntity.ok(updatedBudgetDTO);
    }
}

