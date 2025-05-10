package com.example.tracker.repository;

import com.example.tracker.model.Watch;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WatchRepository extends ReactiveCrudRepository<Watch, Integer> {
}
