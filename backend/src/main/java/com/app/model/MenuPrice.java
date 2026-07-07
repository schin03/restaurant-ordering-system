package com.app.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="menu_prices")
public class MenuPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     private String size;

    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;


    // GETTERS

    public Long getId() {
        return id;
    }

    public String getSize() {
        return size;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public MenuItem getMenuItem() {
        return menuItem;
    }


    // SETTERS

    public void setSize(String size) {
        this.size = size;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setMenuItem(MenuItem menuItem) {
        this.menuItem = menuItem;
    }
}
