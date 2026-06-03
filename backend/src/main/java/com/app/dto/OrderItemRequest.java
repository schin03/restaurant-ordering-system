package com.app.dto;

public class OrderItemRequest {
    private String id;
    private String en;
    private String zh;
    private String size;
    private int quantity;
    private double price;

    public OrderItemRequest() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEnglishName() {
        return en;
    }

    public void setEnglishName(String s) {
        en = s;
    }

    public String getChineseName() {
        return zh;
    }

    public void setChineseName(String s) {
        zh = s;
    } 

    public String getSize() {
        return size;
    }

    public void setSize(String s) {
        size = s;
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
