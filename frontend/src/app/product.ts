// Ở đây là sản phẩm có 4 thuộc tính. Cú pháp "tên: kiểu" (đảo ngược so với Java).
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}
export interface ProductRequest{
  name: String;
  description: string;
  price: number;
}
