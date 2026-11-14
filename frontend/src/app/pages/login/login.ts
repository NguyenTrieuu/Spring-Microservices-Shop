import { Component, inject, signal } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../core/auth.service';

@Component({
  imports: [RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  error = signal('');
  loading = signal(false);

  onLogin(event: Event, username: HTMLInputElement, password: HTMLInputElement) {
    event.preventDefault(); // không cho trình duyệt tải lại trang khi gửi form

    if (username.value.trim() === '' || password.value === '') {
      this.error.set('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }
    this.error.set('');
    this.loading.set(true);

    this.auth.login(username.value.trim(), password.value).subscribe({
      next: () => {
        // Quay lại trang đang định vào, không có thì về trang chủ
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Sai tên đăng nhập hoặc mật khẩu');
      },
    });
  }
}

