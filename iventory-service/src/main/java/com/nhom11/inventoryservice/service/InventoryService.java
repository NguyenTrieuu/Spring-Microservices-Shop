package com.nhom11.inventoryservice.service;

import com.nhom11.inventoryservice.model.Inventory;
import com.nhom11.inventoryservice.repository.InventoryRepository;
import com.nhom11.inventoryservice.dto.InventoryResponse;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.KafkaTemplate;
import java.util.ArrayList;
import java.util.List;


@Service
public class InventoryService{
    private final InventoryRepository inventoryRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final int MUC_TOI_THIEU = 5;

    public InventoryService(InventoryRepository inventoryRepository,KafkaTemplate<String, String> kafkaTemplate) {
        this.inventoryRepository = inventoryRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public void reduceStock(String productId, int amount){
        Inventory inventory = inventoryRepository.findByProductId(productId);

        if (inventory == null) {
            return;
        }
        int conLai = inventory.getQuantity()-amount;
        if(conLai<0){
            conLai =0;
        }
        inventory.setQuantity(conLai);
        inventoryRepository.save(inventory);

        if(conLai < MUC_TOI_THIEU){
            kafkaTemplate.send("inventory-low-stock", productId + ";" + conLai);
        }
    }
    public void setStock(String productId, int quantity){
        Inventory inventory = inventoryRepository.findByProductId(productId);

        if(inventory == null){
            inventory = new Inventory();
            inventory.setProductId(productId);
        }
        inventory.setQuantity(quantity);
        inventoryRepository.save(inventory);
    }
    public List<InventoryResponse> getAllStock() {
        List<InventoryResponse> result = new ArrayList<>();
        for (Inventory inventory : inventoryRepository.findAll()) {
            result.add(new InventoryResponse(inventory.getProductId(), inventory.getQuantity()));
        }
        return result;
    }
    public boolean isInStock(String productId, int quantity){
        Inventory inventory = inventoryRepository.findByProductId(productId);

        if(inventory == null){
            return false;
        }
        return inventory.getQuantity() >= quantity;
    }

    public void deleteStock(String productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId);
        if (inventory != null) {
            inventoryRepository.delete(inventory);
        }
    }
}
