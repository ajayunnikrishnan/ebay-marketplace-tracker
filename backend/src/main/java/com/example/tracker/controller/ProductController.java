package com.example.tracker.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ProductController {

    @GetMapping("/api/hello")
    public Mono<String> hello() {
        return Mono.just("Hello from backend!");
    }

    @GetMapping("/api/products/search")
    public Flux<Product> search(@RequestParam String query) {
        var dummy = List.of(
            new Product("1", "Sample A for \"" + query + "\"", 19.99,
                        "https://ebay.com/item/1", "https://via.placeholder.com/150"),
            new Product("2", "Sample B for \"" + query + "\"", 29.99,
                        "https://ebay.com/item/2", "https://via.placeholder.com/150"),
            new Product("3", "Sample C for \"" + query + "\"", 39.99,
                        "https://ebay.com/item/3", "https://via.placeholder.com/150")
        );
        return Flux.fromIterable(dummy);
    }

    public static record Product(
        String id,
        String title,
        double price,
        String url,
        String img
    ) {}
}
