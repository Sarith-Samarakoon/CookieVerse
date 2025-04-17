package com.example.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String home() {
        return "Welcome to the Spring Boot Backend!";
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Spring Boot Welcome Back!";
    }
}
