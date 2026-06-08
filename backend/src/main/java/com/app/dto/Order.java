package com.app.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String phone;
    private String email;

    private String orderType;

    private String pickupTime;
    private String address;

    private String comments;

    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    private double totalAmount;
    private LocalDateTime createdAt;

    public Order() {
        this.createdAt = LocalDateTime.now();
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

    public List<OrderItem> getItems() {
        return items;
    }

    public double getTotal() {
        return totalAmount;
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

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public void setTotal(double total) {
        totalAmount = total;
    }

}
