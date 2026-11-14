package com.nhom11.orderservice.service;

import com.nhom11.orderservice.dto.OrderRequest;
import com.nhom11.orderservice.model.Order;
import com.nhom11.orderservice.repository.OrderRepository;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
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
    private final CircuitBreakerFactory<?, ?> circuitBreakerFactory;

    public OrderService(OrderRepository orderRepository, KafkaTemplate<String, String> kafkaTemplate,CircuitBreakerFactory<?,?> circuitBreakerFactory, @Value("${inventory.url}") String inventoryUrl) {
        this.orderRepository = orderRepository;
        this.restClient = RestClient.create(inventoryUrl);
        this.kafkaTemplate = kafkaTemplate;
        this.circuitBreakerFactory = circuitBreakerFactory;
    }

    public void placeOrder(OrderRequest request){
        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("inventory");

        Boolean conHang = circuitBreaker.run(
                () -> restClient.get()
                        .uri("/api/inventory?productId={productId}&quantity={quantity}",
                                request.getProductId(), request.getQuantity())
                        .retrieve()
                        .body(Boolean.class),
                throwable -> {
                    // In ra loại lỗi để quan sát khi test
                    System.out.println("Fallback chạy vì: " + throwable.getClass().getSimpleName());
                    return null;
                });
        if(conHang == null){
            throw new IllegalStateException("Không kiểm tra được kho, vui lòng thử lại sau");
        }
        if(!conHang){
            throw new IllegalArgumentException("Sản phẩm không đủ hàng trong kho");
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
