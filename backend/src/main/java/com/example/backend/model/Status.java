package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "statuses")
public class Status {

    @Id
    private String id;
    private String userEmail;
    private String username;           // <--- add this
    private String mediaUrl;
    private String description;
    private MediaType mediaType;
    private LocalDateTime timestamp;

    public enum MediaType {
        IMAGE,
        VIDEO
    }

    public Status() {}

    // Updated constructor to include username
    public Status(String userEmail, String username, String mediaUrl, String description, MediaType mediaType, LocalDateTime timestamp) {
        this.userEmail = userEmail;
        this.username = username;
        this.mediaUrl = mediaUrl;
        this.description = description;
        this.mediaType = mediaType;
        this.timestamp = timestamp;
    }

    // Getters and setters including username
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MediaType getMediaType() {
        return mediaType;
    }

    public void setMediaType(MediaType mediaType) {
        this.mediaType = mediaType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
