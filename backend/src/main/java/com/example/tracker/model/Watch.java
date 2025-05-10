package com.example.tracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table("watch")
public class Watch {
    @Id
    private Integer watchId;
    private String productId;
    private String query;
    private Double lastKnownPrice;

    public Watch() {
    }

    public Watch(Integer watchId, String productId, String query, Double lastKnownPrice) {
        this.watchId = watchId;
        this.productId = productId;
        this.query = query;
        this.lastKnownPrice = lastKnownPrice;
    }

    public Integer getWatchId() {
        return watchId;
    }

    public void setWatchId(Integer watchId) {
        this.watchId = watchId;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public Double getLastKnownPrice() {
        return lastKnownPrice;
    }

    public void setLastKnownPrice(Double lastKnownPrice) {
        this.lastKnownPrice = lastKnownPrice;
    }
}
