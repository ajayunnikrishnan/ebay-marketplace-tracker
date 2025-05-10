package com.example.tracker.controller;

import com.example.tracker.model.Watch;
import com.example.tracker.repository.WatchRepository;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@CrossOrigin(origins = "http://localhost:3001")
@RestController
@RequestMapping("/api/watch")
public class WatchController {

    private final WatchRepository repo;

    public WatchController(WatchRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Mono<Watch> add(@RequestBody WatchRequest req) {
        var w = new Watch(null, req.productId(), req.query(), 0.0);
        return repo.save(w);
    }

    @GetMapping
    public Flux<Watch> list() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Mono<Watch> getOne(@PathVariable Integer id) {
        return repo.findById(id);
    }

    @DeleteMapping("/{id}")
    public Mono<Void> remove(@PathVariable Integer id) {
        return repo.deleteById(id);
    }

    public record WatchRequest(String productId, String query) {}
}
