package com.nhom11.orderservice.service;

import com.nhom11.orderservice.dto.OrderRequest;
import com.nhom11.orderservice.model.Order;
import com.nhom11.orderservice.repository.OrderRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.UUID;
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final RestClient restClient;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public OrderService(OrderRepository orderRepository, KafkaTemplate<String, String> kafkaTemplate, @Value("${inventory.url}") String inventoryUrl) {
        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
        this.restClient = RestClient.create(inventoryUrl);
    }
    
    public void placeOrder(OrderRequest request){
        Boolean conHang = restClient.get().uri("/api/inventory?productId={productId}&quantity={quantity}",
                request.getProductId(), request.getQuantity()).retrieve().body(Boolean.class);
        if(conHang == null || !conHang){
            throw new IllegalArgumentException("Không đủ sản phẩm trong kho");
        }
        Order order = new Order();

        order.setOrderId(UUID.randomUUID().toString());
        order.setProductId(request.getProductId());
        order.setPrice((request.getPrice()));
        order.setQuantity(request.getQuantity());

        orderRepository.save(order);

        kafkaTemplate.send("order-placed", order.getOrderId());
    }
}
