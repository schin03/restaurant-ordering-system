package com.example.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;




@RestController
public class OrderController {
    @GetMapping("/test")
    public String test() {
        return "Backend working";
    }

    @PostMapping("/order")
    public String placeOrder(@RequestBody Order order) {
        return "Order received with " + order.getItems().size() +" items.";
    }
}
