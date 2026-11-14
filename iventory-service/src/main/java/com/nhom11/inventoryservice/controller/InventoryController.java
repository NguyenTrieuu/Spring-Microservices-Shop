package com.nhom11.inventoryservice.controller;

import com.nhom11.inventoryservice.dto.InventoryRequest;
import com.nhom11.inventoryservice.model.Inventory;
import com.nhom11.inventoryservice.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.nhom11.inventoryservice.dto.InventoryRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public boolean isInStock(@RequestParam("productId") String productId, @RequestParam("quantity") int quantity){
        return inventoryService.isInStock(productId, quantity);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void setStock(@RequestBody InventoryRequest request){
        inventoryService.setStock(request.getProductId(), request.getQuantity());
    }


}
