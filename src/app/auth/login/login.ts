// src/app/auth/login/login.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  errorMessage = '';
  isLoading = false;
  userInfo: { name: string; photo?: string } | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * ✅ معالج تسجيل الدخول
   */
  async onLogin(): Promise<void> {
    // التحقق من المدخلات
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'الرجاء إدخال اسم المستخدم وكلمة المرور';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.userInfo = null;

    try {
      const response: LoginResponse = await this.authService.login(
        this.credentials.username,
        this.credentials.password
      );

      // عرض رسالة النجاح
      this.userInfo = {
        name: response.userName || this.credentials.username
      };

      console.log('✅ Login Response:', response);
      console.log('🚀 Redirecting to seafarers page...');

      // التوجيه بعد 1.5 ثانية
      setTimeout(() => {
        this.router.navigate(['/seafarers']).then(success => {
          if (success) {
            console.log('✅ Navigation successful');
          } else {
            console.error('❌ Navigation failed');
          }
        });
      }, 1500);
      
    } catch (error: any) {
      this.errorMessage = error.message || 'حدث خطأ أثناء تسجيل الدخول';
      this.userInfo = null;
      console.error('❌ Login Error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}