package com.example.backend.dto;

import org.springframework.web.multipart.MultipartFile;

public class StatusRequestDto {
    private String userEmail;
    private String description;
    private MultipartFile mediaFile;

    // Getters and Setters
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public MultipartFile getMediaFile() { return mediaFile; }
    public void setMediaFile(MultipartFile mediaFile) { this.mediaFile = mediaFile; }
}