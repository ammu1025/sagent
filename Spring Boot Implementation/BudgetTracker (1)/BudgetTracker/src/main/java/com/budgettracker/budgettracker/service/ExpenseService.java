package com.budgettracker.budgettracker.service;

import com.budgettracker.budgettracker.entity.Category;
import com.budgettracker.budgettracker.entity.Expense;
import com.budgettracker.budgettracker.entity.User;
import com.budgettracker.budgettracker.repository.CategoryRepository;
import com.budgettracker.budgettracker.repository.ExpenseRepository;
import com.budgettracker.budgettracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public ExpenseService(ExpenseRepository expenseRepository,
                          UserRepository userRepository,
                          CategoryRepository categoryRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public Expense save(Expense expense) {

        // ✅ Extract IDs from JSON
        Integer userId = expense.getUser().getUserId();
        Integer categoryId = expense.getCategory().getCategoryId();

        // ✅ Fetch REAL entities from DB
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        // ✅ Attach managed entities
        expense.setUser(user);
        expense.setCategory(category);

        return expenseRepository.save(expense);
    }

    public List<Expense> getAll() {
        return expenseRepository.findAll();
    }
}
