package com.app.dto;

import java.util.List;

public class OrderRequest {

    private String customerName;
    private String phone;
    private String email;
    private String orderType;
    private String pickupTime;
    private String address;
    private String comments;

    private List<OrderItemRequest> items;

    public OrderRequest() {
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getPhone() {
        return phone;
    }

    public String getOrdertype() {
        return orderType;
    }

    public String getEmail() {
        return email;
    }

    public String getPickupTime() {
        return pickupTime;
    }

    public String getAddress() {
        return address;
    }

    public String getComments() {
        return comments;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setCustomerName(String s) {
        customerName = s;
    }

    public void setPhone(String s) {
        phone = s;
    }

    public void setEmail(String s) {
        email = s;
    }

    public void setOrdertype(String s) {
        orderType = s;
    }

    public void setPickupTime(String s) {
        pickupTime = s;
    }

    public void setAddress(String s) {
        address = s;
    }

    public void setComments(String s) {
        comments = s;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

}
