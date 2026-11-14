import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class OrderService{
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/order';

  placeOrder(productId: String,price: number, quantity: number): Observable<string>{
    return this.http.post(this.baseUrl, {productId,price,quantity},{ responseType: 'text' } );
  }
}
