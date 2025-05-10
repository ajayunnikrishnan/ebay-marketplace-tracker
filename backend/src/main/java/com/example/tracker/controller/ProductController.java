package com.example.tracker.controller;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "http://localhost:3001")
@RestController
public class ProductController {

    private final WebClient fakeStoreClient;

    public ProductController(@Qualifier("fakeStoreClient") WebClient fakeStoreClient) {
        this.fakeStoreClient = fakeStoreClient;
    }

    @GetMapping("/api/hello")
    public Mono<String> hello() {
        return Mono.just("Hello from backend!");
    }

    @GetMapping("/api/products/search")
    public Flux<Product> search(@RequestParam String query) {
        String q = query.trim().toLowerCase();
        return fakeStoreClient.get()
            .uri("/products")
            .retrieve()
            .bodyToFlux(FakeProduct.class)
            .filter(fp -> fp.title().toLowerCase().contains(q))
            .map(fp -> new Product(
                String.valueOf(fp.id()),
                fp.title(),
                fp.price(),
                "https://fakestoreapi.com/products/" + fp.id(),
                fp.image()
            ));
    }

    public static record FakeProduct(
        int id,
        String title,
        double price,
        String image
    ) {}

    public static record Product(
        String id,
        String title,
        double price,
        String url,
        String img
    ) {}
}
