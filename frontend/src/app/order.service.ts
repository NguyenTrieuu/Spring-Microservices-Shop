import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface OrderItem {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  username: string | null;
  createdAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/order';

  placeOrder(
    productId: string,
    price: number,
    quantity: number,
    username: string,
    sendEmail: boolean,
  ): Observable<string> {
    return this.http.post(
      this.baseUrl,
      { productId, price, quantity, username, sendEmail },
      { responseType: 'text' },
    );
  }

  getOrders(username?: string): Observable<OrderItem[]>{
    const url = username
      ? this.baseUrl + '?username=' + encodeURIComponent(username)
      : this.baseUrl;
    return this.http.get<OrderItem[]>(url);

  }
}
