import { Component, inject, signal } from '@angular/core';
import { Product, ProductRequest } from '../../product';
import { ProductService } from '../../product.service';
import { InventoryService } from '../../inventory.service';
import { OrderService } from '../../order.service';
import { AuthService } from '../../core/auth.service';
import { Navbar } from '../../shared/navbar/navbar';

@Component({
  selector: 'app-products',
  imports: [Navbar],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private productService = inject(ProductService);
  private inventoryService = inject(InventoryService);
  private orderService = inject(OrderService);
  auth = inject(AuthService); // để giao diện biết đang là admin hay user

  products = signal<Product[]>([]);
  message = signal('');
  error = signal('');
  stock = signal<Record<string, number>>({});

  constructor() {
    this.loadProducts();
    this.loadStock();
  }

  clearMessages() {
    this.message.set('');
    this.error.set('');
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (data) => this.products.set(data),
      error: () => this.error.set('Không tải được danh sách sản phẩm'),
    });
  }

  loadStock() {
    this.inventoryService.getAllStock().subscribe({
      next: (items) => {
        const map: Record<string, number> = {};
        for (const item of items) {
          map[item.productId] = item.quantity;
        }
        this.stock.set(map);
      },
      error: () => this.error.set('Không tải được số lượng tồn kho'),
    });
  }

  // Số lượng kho của một sản phẩm; -1 nghĩa là chưa có dữ liệu kho
  stockOf(productId: string): number {
    return this.stock()[productId] ?? -1;
  }

  addProduct(
    name: HTMLInputElement,
    description: HTMLInputElement,
    price: HTMLInputElement,
    quantity: HTMLInputElement,
  ) {
    this.clearMessages();
    const priceValue = Number(price.value);
    const stockValue = Number(quantity.value);

    if (name.value.trim() === '' || priceValue <= 0) {
      this.error.set('Vui lòng nhập tên và giá lớn hơn 0');
      return;
    }

    const request: ProductRequest = {
      name: name.value.trim(),
      description: description.value.trim(),
      price: priceValue,
    };

    this.productService.create(request).subscribe({
      next: (created) => {
        this.inventoryService.setStock(created.id, stockValue).subscribe({
          next: () => {
            this.message.set('Đã thêm sản phẩm: ' + created.name);
            this.loadProducts();
            this.loadStock();
          },
          error: () => this.error.set('Đã tạo sản phẩm nhưng không ghi được số lượng kho'),
        });
      },
      error: () => this.error.set('Không tạo được sản phẩm'),
    });

    name.value = '';
    description.value = '';
    price.value = '';
  }

  order(product: Product, qty: HTMLInputElement) {
    this.clearMessages();

    const quantity = Number(qty.value);
    if (quantity <= 0) {
      this.error.set('Số lượng phải lớn hơn 0');
      return;
    }

    // Gửi kèm tên người đặt; chỉ đơn của admin mới gửi email (xem Phần 7)
    this.orderService
      .placeOrder(product.id, product.price, quantity, this.auth.username(), this.auth.isAdmin())
      .subscribe({
        next: () => {
          this.message.set('Đặt hàng thành công: ' + quantity + ' x ' + product.name);
          // Kho được trừ bất đồng bộ qua Kafka nên đợi 1 giây rồi mới tải lại
          setTimeout(() => this.loadStock(), 1000);
        },
        error: () => this.error.set('Đặt hàng thất bại (có thể không đủ hàng): ' + product.name),
      });
  }

  deleteProduct(product: Product) {
    this.clearMessages();

    if (!confirm('Bạn có chắc muốn xóa sản phẩm "' + product.name + '"?')) {
      return;
    }

    this.productService.delete(product.id).subscribe({
      next: () => {
        this.inventoryService.deleteStock(product.id).subscribe({
          next: () => {
            this.message.set('Đã xóa sản phẩm: ' + product.name);
            this.loadProducts();
            this.loadStock();
          },
          error: () => {
            this.error.set('Đã xóa sản phẩm nhưng không xóa được dòng kho');
            this.loadProducts();
          },
        });
      },
      error: () => this.error.set('Không xóa được sản phẩm: ' + product.name),
    });
  }
}
