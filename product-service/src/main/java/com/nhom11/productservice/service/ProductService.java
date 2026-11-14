package com.nhom11.productservice.service;

import com.nhom11.productservice.dto.ProductRequest;
import com.nhom11.productservice.dto.ProductResponse;
import com.nhom11.productservice.model.Product;
import com.nhom11.productservice.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service

public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductResponse createProduct(ProductRequest request){
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());

        productRepository.save(product);

        return new ProductResponse(product.getId(), product.getName(), product.getDescription(), product.getPrice());
    }
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    public List<ProductResponse> getAllProducts(){
        List<ProductResponse> result = new ArrayList<>();

        for(Product p : productRepository.findAll()){
            result.add(new ProductResponse(p.getId(), p.getName(), p.getDescription(), p.getPrice()));
        }
        return result;
    }

}
