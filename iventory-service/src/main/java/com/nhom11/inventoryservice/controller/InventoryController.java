package com.nhom11.inventoryservice.controller;

import com.nhom11.inventoryservice.model.Inventory;
import com.nhom11.inventoryservice.service.InventoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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
}
