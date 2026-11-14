import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { OrderItem, OrderService } from '../../order.service';
import { ProductService } from '../../product.service';
import { AuthService } from '../../core/auth.service';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-orders',
  imports: [Navbar, DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  auth = inject(AuthService);
  private orderService = inject(OrderService);
  private productService = inject(ProductService);

  orders = signal<OrderItem[]>([]);
  names = signal<Record<string, string>>({}); // id sản phẩm -> tên sản phẩm
  keyword = signal('');
  error = signal('');

  // [MỚI] computed: danh sách đã lọc theo ô tìm kiếm, tự tính lại khi orders hoặc keyword đổi
  filtered = computed(() => {
    const k = this.keyword().trim().toLowerCase();
    return this.orders().filter((o) => o.orderId.toLowerCase().includes(k));
  });

  constructor() {
    this.loadNames();
    this.loadOrders();
  }

  loadNames() {
    this.productService.getAll().subscribe({
      next: (products) => {
        const map: Record<string, string> = {};
        for (const p of products) {
          map[p.id] = p.name;
        }
        this.names.set(map);
      },
    });
  }

  nameOf(productId: string): string {
    return this.names()[productId] ?? '(sản phẩm đã xóa)';
  }

  loadOrders() {
    this.error.set('');
    // Admin xem tất cả; người dùng thường chỉ xem đơn của mình
    const who = this.auth.isAdmin() ? undefined : this.auth.username();
    this.orderService.getOrders(who).subscribe({
      next: (data) => this.orders.set(data),
      error: () => this.error.set('Không tải được danh sách đơn hàng'),
    });
  }
}
