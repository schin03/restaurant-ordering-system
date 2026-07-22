package com.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.Order;
import com.app.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "https://ordering-system-henna.vercel.app/")
public class OrderController {
    
    private final OrderService orderService;

    public OrderController(OrderService os) {
        orderService = os;
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.saveOrder(order);
    }
    
    @GetMapping("/test")
    public String test() {
        return "backend working";
    }

}
