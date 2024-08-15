package com.rest.controller.legasy;

import com.rest.dto.legasy.BudgetDTO;
import com.rest.model.legasy.Budget;
import com.rest.model.legasy.Category;
import com.rest.model.auth.User;
import com.rest.service.legasy.BudgetService;
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

    // Метод для получения всех бюджетов пользователя
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BudgetDTO>> getBudgetsByUserId(@PathVariable Long userId) {
        List<Budget> budgets = budgetService.getAllBudgetsByUser(userId);
        List<BudgetDTO> budgetDTOs = budgets.stream()
                .map(budget -> new BudgetDTO(budget.getId(), budget.getAmount(), budget.getPeriod(), budget.getCategory().getId(), budget.getUser().getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(budgetDTOs);
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

    // Метод для удаления бюджета
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
