package com.nhom11.inventoryservice.service;

import com.nhom11.inventoryservice.model.Inventory;
import com.nhom11.inventoryservice.repository.InventoryRepository;
import org.springframework.stereotype.Service;

@Service
public class InventoryService{
    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public boolean isInStock(String productId, int quantity){
        Inventory inventory = inventoryRepository.findByProductId(productId);

        if(inventory == null){
            return false;
        }
        return inventory.getQuantity() >= quantity;
    }
}
