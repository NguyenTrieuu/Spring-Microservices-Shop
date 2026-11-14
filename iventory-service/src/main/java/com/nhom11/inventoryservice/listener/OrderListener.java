package com.nhom11.inventoryservice.listener;

import com.nhom11.inventoryservice.service.InventoryService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class OrderListener {
    private final InventoryService inventoryService;

    public OrderListener(InventoryService inventoryService){
        this.inventoryService = inventoryService;
    }

    @KafkaListener(topics = "order-placed")
    public void nhanDonHang(String message){
        String[] parts = message.split(";");

        if(parts.length < 3){
            return;
        }
        String productId = parts[1];
        int quantity = Integer.parseInt(parts[2]);

        inventoryService.reduceStock(productId, quantity);
    }
}
