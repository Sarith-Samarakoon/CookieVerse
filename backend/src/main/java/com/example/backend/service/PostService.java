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
            postDTO.setImages(post.getImages());
            postDTO.setIsPublic(post.getIsPublic());
            postDTO.setUsername(username);
            return postDTO;
        }).collect(Collectors.toList());
    }

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
            postDTO.setImages(post.getImages());
            postDTO.setIsPublic(post.getIsPublic());
            postDTO.setUsername(username);
            return postDTO;
        }).collect(Collectors.toList());
    }

    public Post createPost(PostDTO dto) {
        if (dto.getUserEmail() == null || dto.getUserEmail().isEmpty()) {
            throw new IllegalArgumentException("User email is required to create a post.");
        }

        Post post = new Post();
        post.setUserEmail(dto.getUserEmail());
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setImages(dto.getImages());
        post.setIsPublic(dto.getIsPublic());

        return postRepository.save(post);
    }

    public void deletePost(String postId, String userEmail) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            if (!post.getUserEmail().equals(userEmail)) {
                throw new AccessDeniedException("You do not have permission to delete this post.");
            }
            postRepository.deleteById(postId);
        } else {
            throw new PostNotFoundException("Post not found with id: " + postId);
        }
    }

    public Post updatePost(String postId, PostDTO updatedDto, String userEmail) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            if (!post.getUserEmail().equals(userEmail)) {
                throw new AccessDeniedException("You do not have permission to update this post.");
            }
            post.setTitle(updatedDto.getTitle());
            post.setContent(updatedDto.getContent());
            post.setImages(updatedDto.getImages());
            post.setIsPublic(updatedDto.getIsPublic());
            return postRepository.save(post);
        } else {
            throw new PostNotFoundException("Post not found with id: " + postId);
        }
    }

    public Post updateVisibility(String postId, boolean isPublic) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String loggedInUserEmail = authentication.getName();
            if (!post.getUserEmail().equals(loggedInUserEmail)) {
                throw new AccessDeniedException("You do not have permission to update this post.");
            }
            post.setIsPublic(isPublic);
            return postRepository.save(post);
        } else {
            throw new PostNotFoundException("Post not found with id: " + postId);
        }
    }
}