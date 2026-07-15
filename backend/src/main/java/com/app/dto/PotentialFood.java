package com.app.dto;

public class PotentialFood {
    private Long id;
    private String name;

    public PotentialFood(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
