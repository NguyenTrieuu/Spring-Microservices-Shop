import { Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from './product';

@Injectable({providedIn: 'root'})
export class ProductService{
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/product';
  getAll(): Observable<Product[]>{
    return this.http.get<Product[]>(this.baseUrl);
  }
}
