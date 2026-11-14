import {Component, inject, signal} from '@angular/core';
import { Product } from './product';
import {ProductService} from './product.service';
import {keycloak} from './keycloak';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})

export class App {
  private productService = inject(ProductService);

  title = 'Hệ thống quản lý hàng hóa';
  username = String(keycloak.tokenParsed?.['preferred_username']??'');
  products = signal<Product[]>([]);
  error = signal('');

  constructor() {
    this.loadProducts();
  }

  loadProducts(){
    this.productService.getAll().subscribe({
      next: (data)=> this.products.set(data),
      error: () => this.error.set('Không tải được danh sách sản phẩm'),
    });
  }
  logout(){
    keycloak.logout({redirectUri:'http://localhost:4200' });
  }
}
