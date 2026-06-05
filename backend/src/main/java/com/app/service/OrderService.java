package com.app.service;

import org.springframework.stereotype.Service;

import com.app.dto.OrderRequest;

@Service
public class OrderService {
    
    public double calculateTotal(OrderRequest req) {
        double total = 0;

        for (var item : req.getItems()) {
            total += item.getPrice() * item.getQuantity();
        }

        return total;
    }

}  
