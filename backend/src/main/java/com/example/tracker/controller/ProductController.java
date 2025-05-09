package com.example.tracker.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ProductController {
    @GetMapping("/api/hello")
    public Mono<String> hello() {
        return Mono.just("Hello from backend!");
    }

    @GetMapping("/api/products/search")
    public Mono<String> search(@RequestParam String query) {
        return Mono.just("Searched for: " + query);
    }
}
