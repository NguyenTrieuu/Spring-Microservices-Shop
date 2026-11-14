package com.nhom11.orderservice.repository;

import com.nhom11.orderservice.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsernameOrderByCreatedAtDesc(String username);
    List<Order> findAllByOrderByCreatedAtDesc();
}
