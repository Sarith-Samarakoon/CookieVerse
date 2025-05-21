package com.example.backend.service;

import com.example.backend.model.Status;
import com.example.backend.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class StatusService {

    @Autowired
    private StatusRepository statusRepository;

    // Updated method with username param
    public Status createStatus(String userEmail, String username, String mediaUrl, String description, Status.MediaType mediaType) {
        Status status = new Status(userEmail, username, mediaUrl, description, mediaType, LocalDateTime.now());
        status.setId(UUID.randomUUID().toString());
        return statusRepository.save(status);
    }

    public List<Status> getAllStatuses() {
        return statusRepository.findAll();
    }

    public boolean deleteStatus(String id) {
        Optional<Status> statusOptional = statusRepository.findById(id);
        if (statusOptional.isPresent()) {
            statusRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
