package com.nhom11.orderservice.controller;

import com.nhom11.orderservice.dto.OrderRequest;
import com.nhom11.orderservice.service.OrderService;
import com.nhom11.orderservice.dto.OrderResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
@RestController
@RequestMapping("/api/order")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder(@RequestBody OrderRequest request){
        orderService.placeOrder(request);
        return "Đã đặt đơn thành công";
    }

    @GetMapping
    public List<OrderResponse> getOrders(@RequestParam(name = "username", required = false) String username) {
        return orderService.getOrders(username);
    }
}
