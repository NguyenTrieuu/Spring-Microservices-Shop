import {Component, inject, signal} from '@angular/core';
import {Product, ProductRequest} from './product';
import {ProductService} from './product.service';
import { InventoryService } from './inventory.service';
import { OrderService } from './order.service';
import {keycloak} from './keycloak';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})

export class App {
  private productService = inject(ProductService);
  private inventoryService = inject(InventoryService);
  private orderService = inject(OrderService);

  title = 'Hệ thống quản lý hàng hóa';
  username = String(keycloak.tokenParsed?.['preferred_username']??'');
  products = signal<Product[]>([]);
  message = signal('');
  error = signal('');

  constructor() {
    this.loadProducts();
  }
  clearMessages(){
    this.message.set('');
    this.error.set('');
  }

  loadProducts(){
    this.productService.getAll().subscribe({
      next: (data)=> this.products.set(data),
      error: () => this.error.set('Không tải được danh sách sản phẩm'),
    });
  }

  addProduct(
    name: HTMLInputElement,
    description: HTMLInputElement,
    price: HTMLInputElement,
    quantity: HTMLInputElement,
  ){
    this.clearMessages();
    const priceValue = Number(price.value);
    const stockValue = Number(quantity.value);

    if(name.value.trim() === ''|| priceValue<=0){
      this.error.set('Vui lòng nhập giá tiền lớn hơn 0');
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
            this.loadProducts();   // tải lại danh sách
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
    if(quantity<=0){
      this.error.set('Số lượng phải lớn hơn 0');
      return;
    }
    this.orderService.placeOrder(product.id, product.price, 1).subscribe({
      next: () => this.message.set('Đặt hàng thành công: ' + product.name),
      error: () => this.error.set('Đặt hàng thất bại (có thể sản phẩm đã hết hàng): ' + product.name),
    });
  }
  logout(){
    keycloak.logout({redirectUri:'http://localhost:4200' });
  }
}
