package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

public class PostDTO {
    private String id;
    private String title;
    private String content;
    private List<String> images;
    private boolean isPublic;
    private String userEmail;
    private String username;

    public PostDTO() {
        this.images = new ArrayList<>();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<String> getImages() { return images; }

    // Custom setter to handle JSON string or List
    @JsonSetter("images")
    public void setImages(Object images) {
        if (images instanceof String) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                this.images = mapper.readValue((String) images, new TypeReference<List<String>>() {});
            } catch (Exception e) {
                this.images = new ArrayList<>();
            }
        } else if (images instanceof List) {
            this.images = (List<String>) images;
        } else {
            this.images = new ArrayList<>();
        }
    }

    public boolean getIsPublic() { return isPublic; }
    public void setIsPublic(boolean isPublic) { this.isPublic = isPublic; }
}