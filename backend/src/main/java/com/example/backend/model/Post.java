package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "posts")
public class Post {

    @Id
    private String id;
    private String title;
    private String content;
    private List<String> images; // Changed from String image to List<String> images
    private boolean isPublic;
    private String userEmail;
    private int likeCount;
    private boolean likedByUser;

    public Post() {
        this.images = new ArrayList<>();
    }

    public Post(String title, String content, List<String> images, boolean isPublic, String userEmail) {
        this.title = title;
        this.content = content;
        this.images = images != null ? images : new ArrayList<>();
        this.isPublic = isPublic;
        this.userEmail = userEmail;
        this.likeCount = 0;
        this.likedByUser = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images != null ? images : new ArrayList<>(); }

    public boolean getIsPublic() { return isPublic; }
    public void setIsPublic(boolean isPublic) { this.isPublic = isPublic; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }

    public boolean isLikedByUser() { return likedByUser; }
    public void setLikedByUser(boolean likedByUser) { this.likedByUser = likedByUser; }
}