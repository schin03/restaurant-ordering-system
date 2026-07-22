package com.app.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.Order;
import com.app.service.OrderService;
import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "https://ordering-system-henna.vercel.app/")
public class PaymentController {
    private final OrderService orderService;

    public PaymentController(OrderService os) {
        orderService = os; 
    }

    @PostMapping("/create-intent")
    public Map<String, String> createPaymentIntent(@RequestBody Order req) throws Exception {
    
        double total = orderService.calculateTotal(req);
        long stripeAmount = (long)(total * 100);
        
        Stripe.apiKey = "sk_test_51TeKq56E761x5qd6XAobh1KXE1GfTGWU0LmKrP2oyQr6ngoUUwn5DnGHiyXDWu5J524dDXfWGqDAH5aRQNEFG7pJ007bDxKRYf";

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder().setAmount(stripeAmount).setCurrency("cad").build();
    
        PaymentIntent intent = PaymentIntent.create(params);

        Map<String, String> res = new HashMap<>();
        res.put("clientSecret", intent.getClientSecret());

        return res;
    }
}
