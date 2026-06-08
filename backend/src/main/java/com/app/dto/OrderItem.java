package com.app.dto;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String en;
    private String zh;
    private String size;
    private int quantity;
    private double price;

    private String menuItemId;

    private double priceAtPurchase;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name="order_id")
    private Order order;

    public OrderItem() {}

    public void setId(Long id) {
        this.id = id;
    }

    public void setEn(String s) {
        en = s;
    }

    public void setZh(String s) {
        zh = s;
    } 

    public void setSize(String s) {
        size = s;
    }

    public void setQuantity(int n) {
        quantity = n;
    }

    public void setMenuItemId(String s) {
        menuItemId = s;
    }

    public void setPrice(double n) {
        price = n;
    }

    public void setOrder(Order o) {
        this.order = o;
    }

    public Long getId() {
        return id;
    }

    public String getEn() {
        return en;
    }
    
    public String getZh() {
        return zh;
    }

    public String getSize() {
        return size;
    }
    public int getQuantity() {
        return quantity;
    }

    public String getMenuItemId() {
        return menuItemId;
    }

    public double getPrice() {
        return price;
    }

    public Order getOrder() {
        return order;
    }

}
