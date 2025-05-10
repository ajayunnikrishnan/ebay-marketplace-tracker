package com.example.tracker.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {


  @Bean("fakeStoreClient")
  public WebClient fakeStoreClient() {
    return WebClient.builder()
                    .baseUrl("https://fakestoreapi.com")
                    .build();
  }
}
