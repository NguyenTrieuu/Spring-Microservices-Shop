import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

const GATEWAY = 'http://localhost:8080';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Chỉ gắn token cho request tới Gateway (không gắn cho request tới Keycloak)
  if (!req.url.startsWith(GATEWAY)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const token = auth.accessToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401) {
        auth.logout(); // token hết hạn hoặc không hợp lệ thì đăng xuất
      }
      return throwError(() => err);
    }),
  );
};
