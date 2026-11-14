import { Component } from '@angular/core';
import { Product } from './product';

// [MỚI] @Component: nhãn dán (giống annotation bên Java) báo đây là một thành phần giao diện.
// // templateUrl: file HTML của thành phần này.
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'Hệ thống quản lý hàng hóa';

  // Danh sách sản phẩm giả. Ở Bước 13 sẽ thay bằng dữ liệu thật từ Gateway.
  products: Product[] = [
    { id: '1', name: 'iPhone 15', description: 'Điện thoại Apple', price: 1200 },
    { id: '2', name: 'Galaxy S24', description: 'Điện thoại Samsung', price: 1000 },
    { id: '3', name: 'MacBook Air', description: 'Laptop mỏng nhẹ', price: 1500 },
  ];
}
