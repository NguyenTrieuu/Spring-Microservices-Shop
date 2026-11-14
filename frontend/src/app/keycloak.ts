import Keycloak from 'keycloak-js';

// Khai báo kết nối tới Keycloak: địa chỉ, realm và client
// "export const": cho phép các file khác dùng biến keycloak này.
export const keycloak = new Keycloak({
  url: 'http://localhost:8180',
  realm: 'shop',
  clientId: 'shop-client',
});
