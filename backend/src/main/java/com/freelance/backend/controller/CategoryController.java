package com.freelance.backend.controller;

import com.freelance.backend.model.Category;
import com.freelance.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api") @RequiredArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepo;

    @GetMapping("/categories")
    public List<Category> getAll() { return categoryRepo.findAll(); }
}