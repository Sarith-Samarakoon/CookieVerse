package com.example.backend.controller;

import com.example.backend.model.LearningPlan;
import com.example.backend.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learningplans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    // Create a new Learning Plan
    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@Valid @RequestBody LearningPlan learningPlan) {
        LearningPlan createdPlan = learningPlanService.createLearningPlan(learningPlan);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    
}
