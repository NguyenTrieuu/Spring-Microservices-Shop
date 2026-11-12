package com.nhom11.orderservice.service;

import com.nhom11.orderservice.dto.OrderRequest;
import com.nhom11.orderservice.model.Order;
import com.nhom11.orderservice.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;
@Service
public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public void placeOrder(OrderRequest request){
        Order order = new Order();

        order.setOrderId(UUID.randomUUID().toString());
        order.setProductId(request.getProductId());
        order.setPrice((request.getPrice()));
        order.setQuantity(request.getQuantity());

        orderRepository.save(order);
    }
}
