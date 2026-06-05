package com.app.dto;

import java.util.List;

public class OrderRequest {
    private String customerName;
    private String phone;
    private String pickupDate;
    private String pickupTime;
    private String comments;

    private List<OrderItemRequest> items;
    
    public OrderRequest() {}

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String s) {
        customerName = s;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String s) {
        phone = s;
    }

    public String getPickupDate() {
        return pickupDate;
    }

    public void setPickupDate(String s) {
        pickupDate = s;
    }

    public String getPickupTime() {
        return pickupTime;
    }

    public void setPickupTime(String s) {
        pickupTime = s;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String s) {
        comments = s;
    }
    
    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
    
}
