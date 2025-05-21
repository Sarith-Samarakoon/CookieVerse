package com.example.backend.controller;

import com.example.backend.dto.PostDTO;
import com.example.backend.model.Post;
import com.example.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping("/byLoggedInUser")
    public ResponseEntity<List<PostDTO>> getPostsByLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        List<PostDTO> posts = postService.getPostsByUserEmail(userEmail);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/public")
    public ResponseEntity<List<PostDTO>> getPublicPosts() {
        List<PostDTO> posts = postService.getPublicPosts();
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody PostDTO dto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            dto.setUserEmail(authentication.getName());
            Post createdPost = postService.createPost(dto);
            return ResponseEntity.ok(createdPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody PostDTO dto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            Post updatedPost = postService.updatePost(id, dto, userEmail);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            postService.deletePost(id, userEmail);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/visibility")
    public ResponseEntity<Post> updateVisibility(@PathVariable String id, @RequestBody PostDTO dto) {
        try {
            Post updatedPost = postService.updateVisibility(id, dto.getIsPublic());
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}