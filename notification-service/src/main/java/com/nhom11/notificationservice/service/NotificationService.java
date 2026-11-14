package com.nhom11.notificationservice.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class NotificationService {
    private final JavaMailSender mailSender;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }
    private void guiEmail(String nguoiNhan, String tieuDe, String noiDung) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom("springshop@example.com");
        mail.setTo(nguoiNhan);
        mail.setSubject(tieuDe);
        mail.setText(noiDung);

        try {
            mailSender.send(mail);
        } catch (Exception e) {
            System.out.println("Không gửi được email: " + e.getMessage());
        }
    }

    @KafkaListener(topics = "order-placed")
    public void nhanDonHang(String message){
        String[] parts = message.split(";");
        if (parts.length < 3) {
            return;
        }

        String orderId = parts[0];
        String productId = parts[1];
        String quantity = parts[2];

        System.out.println("Đã nhận thông báo: đơn hàng " + orderId + " vừa được đặt thành công");

        guiEmail("khachhang@example.com",
                "Đơn hàng " + orderId + " đã được đặt thành công",
                "Xin chào,\n\nĐơn hàng " + orderId + " của bạn đã được đặt thành công.\n"
                        + "Sản phẩm: " + productId + "\n"
                        + "Số lượng: " + quantity + "\n\n"
                        + "Trân trọng,\nSpring Shop");
    }

    @KafkaListener(topics = "inventory-low-stock")
    public void canhBaoSapHetHang(String message){
        String[] parts = message.split(";");
        if (parts.length < 2) {
            return;
        }

        System.out.println("CẢNH BÁO: sản phẩm " + parts[0] + " sắp hết hàng, chỉ còn " + parts[1]);

        guiEmail("quantri@example.com",
                "Cảnh báo sắp hết hàng: " + parts[0],
                "Sản phẩm " + parts[0] + " chỉ còn " + parts[1] + " trong kho. Vui lòng nhập thêm hàng.");
    }
}
