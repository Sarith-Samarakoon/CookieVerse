package com.example.backend.controller;

import com.example.backend.model.LikeComment;
import com.example.backend.service.LikeCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/likecomment")
public class LikeCommentController {

    @Autowired
    private LikeCommentService likeCommentService;

    @PostMapping("/toggle-like/{postId}")
    public ResponseEntity<String> toggleLike(
            @PathVariable String postId,
            @RequestHeader("userId") String userId,
            @RequestHeader("username") String username) {
        likeCommentService.toggleLike(postId, userId, username);
        return ResponseEntity.ok("Like status toggled successfully.");
    }

    @PostMapping("/comment/{postId}")
    public ResponseEntity<String> addComment(
            @PathVariable String postId,
            @RequestHeader("userId") String userId,
            @RequestHeader("username") String username,
            @RequestBody String commentContent) {
        likeCommentService.addComment(postId, userId, username, commentContent);
        return ResponseEntity.ok("Comment added successfully.");
    }

}