package com.nhom11.notificationservice.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @KafkaListener(topics = "order-placed")
    public void nhanDonHang(String orderId){
        System.out.println("Đã nhận thông báo: đơn hàng"+orderId+ "vừa đặt thành công");
    }
}
