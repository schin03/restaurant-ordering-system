package com.app.dto;

public class OrderItemRequest {
    private String name;
    private int quantity;
    private double price;

    public OrderItemRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String s) {
        name = s;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int n) {
        quantity = n;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double n) {
        price = n;
    }
}
