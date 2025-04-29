package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.example.backend.model.FoodCommunity;
import com.example.backend.model.CommunityPost;
import com.example.backend.repository.FoodCommunityRepository;
import com.example.backend.repository.CommunityPostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;



import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/communities")
@CrossOrigin
public class FoodCommunityController {

    @Autowired
    private FoodCommunityRepository foodCommunityRepository;

    @Autowired
    private CommunityPostRepository communityPostRepository;

    // Create a new food community
    @PostMapping
    public FoodCommunity createCommunity(@RequestBody FoodCommunity foodCommunity) {
        try {
            return foodCommunityRepository.save(foodCommunity);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error creating community", e);
        }
    }

    // Get all food communities
    @GetMapping
    public List<FoodCommunity> getAllCommunities() {
        try {
            return foodCommunityRepository.findAll();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching communities", e);
        }
    }

    // Get a specific food community by ID
    @GetMapping("/{id}")
    public FoodCommunity getCommunityById(@PathVariable String id) {
        try {
            Optional<FoodCommunity> community = foodCommunityRepository.findById(id);
            if (community.isPresent()) {
                return community.get();
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Community not found");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error fetching community", e);
        }
    }

    


}
