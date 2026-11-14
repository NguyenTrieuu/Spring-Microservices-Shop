package com.nhom11.notificationservice.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @KafkaListener(topics = "order-placed")
    public void nhanDonHang(String message){
        String orderId = message.split(";")[0];
        System.out.println("Đã nhận thông báo: đơn hàng"+orderId+ "vừa đặt thành công");
    }

    @KafkaListener(topics = "inventory-low-stock")
    public void canhBaoSapHetHang(String message){
        String[] parts = message.split(";");
        System.out.println("CẢNH BÁO: sản phẩm " + parts[0] + " sắp hết hàng, chỉ còn " + parts[1]);
    }
}
