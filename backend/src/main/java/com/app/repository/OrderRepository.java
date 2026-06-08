package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.dto.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    
}
