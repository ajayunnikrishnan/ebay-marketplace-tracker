package com.example.tracker.controller;

import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/watch")
public class WatchController {

    private final Map<Integer, Watched> store = new LinkedHashMap<>();
    private final AtomicInteger idGen = new AtomicInteger(1);

    @PostMapping
    public Mono<Watched> add(@RequestBody WatchRequest req) {
        int id = idGen.getAndIncrement();
        var w = new Watched(id, req.productId(), req.query(), 0.0);
        store.put(id, w);
        return Mono.just(w);
    }

    @GetMapping
    public Flux<Watched> list() {
        return Flux.fromIterable(store.values());
    }

    @DeleteMapping("/{id}")
    public Mono<Void> remove(@PathVariable int id) {
        store.remove(id);
        return Mono.empty();
    }

    public record WatchRequest(String productId, String query) {}
    public record Watched(int watchId, String productId, String query, double lastKnownPrice) {}
}
