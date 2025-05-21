package com.example.backend.controller;

import com.example.backend.model.Status;
import com.example.backend.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/status")
@CrossOrigin
public class StatusController {

    @Autowired
    private StatusService statusService;

    @PostMapping("/create")
    public ResponseEntity<?> createStatus(@RequestBody Status statusRequest) {
        try {
            Status newStatus = statusService.createStatus(
                    statusRequest.getUserEmail(),
                    statusRequest.getUsername(),  // <--- new
                    statusRequest.getMediaUrl(),
                    statusRequest.getDescription(),
                    statusRequest.getMediaType()
            );
            return ResponseEntity.ok(newStatus);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating status: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllStatuses() {
        try {
            return ResponseEntity.ok(statusService.getAllStatuses());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching statuses: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteStatus(@PathVariable String id) {
        try {
            boolean deleted = statusService.deleteStatus(id);
            if (deleted) {
                return ResponseEntity.ok("Status deleted successfully");
            } else {
                return ResponseEntity.status(404).body("Status not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting status: " + e.getMessage());
        }
    }
}
