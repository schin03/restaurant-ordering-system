package com.app.service;

import org.springframework.stereotype.Service;

import com.app.dto.Order;
import com.app.dto.OrderItem;
import com.app.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepo;

    public OrderService(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    public double calculateTotal(Order req) {
        double total = 0;

        for (var item : req.getItems()) {
            total += item.getPrice() * item.getQuantity();
        }

        return total;
    }

    public Order saveOrder(Order order) {
        double total = calculateTotal(order);

        order.setTotal(total);

        for (OrderItem item : order.getItems()) {
            item.setOrder(order);
        }

        return orderRepo.save(order);
    }

}
