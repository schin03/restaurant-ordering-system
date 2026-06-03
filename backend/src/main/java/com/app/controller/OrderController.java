package com.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.OrderRequest;


@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    
    @PostMapping
    public String createOrder(@RequestBody OrderRequest orderRequest) {
        System.out.println("ORDER RECEIVED");
        System.out.println(orderRequest.getCustomerName());

        for (var item : orderRequest.getItems()) {
            System.out.println(item.getEnglishName());
        }

        return "Order received";
    }
    
    @GetMapping("/test")
    public String test() {
        return "backend working";
    }

}
