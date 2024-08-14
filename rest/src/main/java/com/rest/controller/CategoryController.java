package com.rest.controller;

import com.rest.dto.CategoryDTO;
import com.rest.model.Category;
import com.rest.model.User;
import com.rest.service.CategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setType(categoryDTO.getType());

        User user = new User();
        user.setId(categoryDTO.getUserId());
        category.setUser(user);

        Category createdCategory = categoryService.createCategory(category);

        CategoryDTO createdCategoryDTO = new CategoryDTO(createdCategory.getId(), createdCategory.getName(), createdCategory.getType(), createdCategory.getUser().getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategoryDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.getCategoryById(id);
        if (category != null) {
            CategoryDTO categoryDTO = new CategoryDTO(category.getId(), category.getName(), category.getType(), category.getUser().getId());
            return ResponseEntity.ok(categoryDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // Метод для получения всех категорий пользователя
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByUserId(@PathVariable Long userId) {
        List<Category> categories = categoryService.getAllCategoriesByUser(userId);
        List<CategoryDTO> categoryDTOs = categories.stream()
                .map(category -> new CategoryDTO(category.getId(), category.getName(), category.getType(), category.getUser().getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categoryDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
        Category category = categoryService.getCategoryById(id);
        category.setName(categoryDTO.getName());
        category.setType(categoryDTO.getType());

        User user = new User();
        user.setId(categoryDTO.getUserId());
        category.setUser(user);

        Category updatedCategory = categoryService.updateCategory(id, category);

        CategoryDTO updatedCategoryDTO = new CategoryDTO(updatedCategory.getId(), updatedCategory.getName(), updatedCategory.getType(), updatedCategory.getUser().getId());

        return ResponseEntity.ok(updatedCategoryDTO);
    }

    // Метод для удаления категории
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}

