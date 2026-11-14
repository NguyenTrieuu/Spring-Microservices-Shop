import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

const KEYCLOAK = 'http://localhost:8180/realms/shop/protocol/openid-connect';
const CLIENT_ID = 'shop-client';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private refreshToken: string | null = sessionStorage.getItem('refresh_token');
  private timer: ReturnType<typeof setTimeout> | undefined;

  // Token hiện tại (khôi phục từ sessionStorage nên tải lại trang vẫn giữ đăng nhập)
  accessToken = signal<string | null>(sessionStorage.getItem('access_token'));

  // Các giá trị này tự tính lại mỗi khi token đổi
  isLoggedIn = computed(() => this.accessToken() !== null);
  username = computed(() => String(this.payload()?.['preferred_username'] ?? ''));
  roles = computed<string[]>(() => this.payload()?.['realm_access']?.['roles'] ?? []);
  isAdmin = computed(() => this.roles().includes('admin'));

  constructor() {
    if (this.accessToken()) {
      this.scheduleRefresh();
    }
  }

  login(username: string, password: string): Observable<TokenResponse> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', CLIENT_ID)
      .set('username', username)
      .set('password', password);
    // tap: thành công thì lưu token
    return this.http
      .post<TokenResponse>(KEYCLOAK + '/token', body)
      .pipe(tap((res) => this.saveTokens(res)));
  }

  logout() {
    const rt = this.refreshToken;
    this.clear();
    if (rt) {
      const body = new HttpParams().set('client_id', CLIENT_ID).set('refresh_token', rt);
      this.http.post(KEYCLOAK + '/logout', body).subscribe({ error: () => {} });
    }
    this.router.navigate(['/login']);
  }

  // Giải mã phần giữa của token (chứa tên và vai trò)
  private payload(): Record<string, any> | null {
    const token = this.accessToken();
    if (!token) {
      return null;
    }
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  private saveTokens(res: TokenResponse) {
    this.accessToken.set(res.access_token);
    this.refreshToken = res.refresh_token;
    sessionStorage.setItem('access_token', res.access_token);
    sessionStorage.setItem('refresh_token', res.refresh_token);
    this.scheduleRefresh();
  }

  // Tự xin token mới trước khi token cũ hết hạn 30 giây
  private scheduleRefresh() {
    clearTimeout(this.timer);
    const exp = Number(this.payload()?.['exp'] ?? 0) * 1000;
    const delay = Math.max(exp - Date.now() - 30_000, 0);
    this.timer = setTimeout(() => this.refresh(), delay);
  }

  private refresh() {
    if (!this.refreshToken) {
      return;
    }
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', CLIENT_ID)
      .set('refresh_token', this.refreshToken);
    this.http.post<TokenResponse>(KEYCLOAK + '/token', body).subscribe({
      next: (res) => this.saveTokens(res),
      error: () => {
        this.clear();
        this.router.navigate(['/login']);
      },
    });
  }

  private clear() {
    clearTimeout(this.timer);
    this.accessToken.set(null);
    this.refreshToken = null;
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  }
}
