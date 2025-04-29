package com.example.backend.service;


import com.example.backend.model.FoodCommunity;
import com.example.backend.repository.FoodCommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FoodCommunityService {

    @Autowired
    private FoodCommunityRepository foodCommunityRepository;

    public FoodCommunity createCommunity(FoodCommunity community) {
        return foodCommunityRepository.save(community);
    }

    public List<FoodCommunity> getAllCommunities() {
        return foodCommunityRepository.findAll();
    }

    public Optional<FoodCommunity> getCommunityById(String id) {
        return foodCommunityRepository.findById(id);
    }

}

