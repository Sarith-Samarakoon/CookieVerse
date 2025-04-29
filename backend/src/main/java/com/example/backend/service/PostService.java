package com.example.backend.service;

import com.example.backend.dto.PostDTO;
import com.example.backend.exception.PostNotFoundException;
import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Get posts by email
    public List<PostDTO> getPostsByUserEmail(String email) {
        List<Post> posts = postRepository.findByUserEmail(email);

        return posts.stream().map(post -> {
            User user = userRepository.findByEmail(post.getUserEmail()).orElse(null);
            String username = (user != null) ? user.getUsername() : "Unknown";

            PostDTO postDTO = new PostDTO();
            postDTO.setId(post.getId());
            postDTO.setUserEmail(post.getUserEmail());
            postDTO.setTitle(post.getTitle());
            postDTO.setContent(post.getContent());
            postDTO.setImage(post.getImage());
            postDTO.setIsPublic(post.getIsPublic());
            postDTO.setUsername(username);
            return postDTO;
        }).collect(Collectors.toList());
    }

    // Get only public posts
    public List<PostDTO> getPublicPosts() {
        List<Post> posts = postRepository.findByIsPublicTrue();

        return posts.stream().map(post -> {
            User user = userRepository.findByEmail(post.getUserEmail()).orElse(null);
            String username = (user != null) ? user.getUsername() : "Unknown";

            PostDTO postDTO = new PostDTO();
            postDTO.setId(post.getId());
            postDTO.setUserEmail(post.getUserEmail());
            postDTO.setTitle(post.getTitle());
            postDTO.setContent(post.getContent());
            postDTO.setImage(post.getImage());
            postDTO.setIsPublic(post.getIsPublic());
            postDTO.setUsername(username);
            return postDTO;
        }).collect(Collectors.toList());
    }

    // Create a post for the logged-in user
    public Post createPost(PostDTO dto) {
        if (dto.getUserEmail() == null || dto.getUserEmail().isEmpty()) {
            throw new IllegalArgumentException("User email is required to create a post.");
        }

        Post post = new Post();
        post.setUserEmail(dto.getUserEmail());
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setImage(dto.getImage());
        post.setIsPublic(dto.getIsPublic()); // Corrected here!

        return postRepository.save(post);
    }




}
