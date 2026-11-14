import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/inventory';

  setStock(productId: String, quantity: number): Observable<unknown> {
    return this.http.post(this.baseUrl, { productId, quantity });
  }

  getAllStock(): Observable<StockItem[]> {
    return this.http.get<StockItem[]>(this.baseUrl + '/stock');
  }

  deleteStock(productId: string): Observable<unknown> {
    return this.http.delete(this.baseUrl + '/' + productId);
  }
}
export interface StockItem {
  productId: string;
  quantity: number;
}
