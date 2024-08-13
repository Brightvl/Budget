package com.rest.controller;

import com.rest.dto.TransactionDTO;
import com.rest.model.Category;
import com.rest.model.Transaction;
import com.rest.model.User;
import com.rest.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(@RequestBody TransactionDTO transactionDTO) {
        Transaction transaction = new Transaction();
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setDate(transactionDTO.getDate());
        transaction.setDescription(transactionDTO.getDescription());

        Category category = new Category();
        category.setId(transactionDTO.getCategoryId());
        transaction.setCategory(category);

        User user = new User();
        user.setId(transactionDTO.getUserId());
        transaction.setUser(user);

        Transaction createdTransaction = transactionService.createTransaction(transaction);

        TransactionDTO createdTransactionDTO = new TransactionDTO(createdTransaction.getId(), createdTransaction.getAmount(), createdTransaction.getDate(), createdTransaction.getDescription(), createdTransaction.getCategory().getId(), createdTransaction.getUser().getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransactionDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id) {
        Transaction transaction = transactionService.getTransactionById(id);
        if (transaction != null) {
            TransactionDTO transactionDTO = new TransactionDTO(transaction.getId(), transaction.getAmount(), transaction.getDate(), transaction.getDescription(), transaction.getCategory().getId(), transaction.getUser().getId());
            return ResponseEntity.ok(transactionDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(@PathVariable Long id, @RequestBody TransactionDTO transactionDTO) {
        Transaction transaction = transactionService.getTransactionById(id);
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setDate(transactionDTO.getDate());
        transaction.setDescription(transactionDTO.getDescription());

        Category category = new Category();
        category.setId(transactionDTO.getCategoryId());
        transaction.setCategory(category);

        User user = new User();
        user.setId(transactionDTO.getUserId());
        transaction.setUser(user);

        Transaction updatedTransaction = transactionService.updateTransaction(id, transaction);

        TransactionDTO updatedTransactionDTO = new TransactionDTO(updatedTransaction.getId(), updatedTransaction.getAmount(), updatedTransaction.getDate(), updatedTransaction.getDescription(), updatedTransaction.getCategory().getId(), updatedTransaction.getUser().getId());

        return ResponseEntity.ok(updatedTransactionDTO);
    }
}
