// src/app/auth/login/login.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../auth';

@Component({
  selector: 'app-login',
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
  ) { }

  /**
   * Login handler
   */
  async onLogin(): Promise<void> {
    // Validate inputs
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

      // Show success message
      this.userInfo = {
        name: response.userName || this.credentials.username
      };

      console.log('Login Response:', response);
      console.log('Redirecting to seafarers page...');

      // Redirect after 1.5s
      setTimeout(() => {
        this.router.navigate(['/seafarers']).then(success => {
          if (success) {
            console.log('Navigation successful');
          } else {
            console.error('Navigation failed');
          }
        });
      }, 1500);

    } catch (error: any) {
      this.errorMessage = error.message || 'حدث خطأ أثناء تسجيل الدخول';
      this.userInfo = null;
      console.error('Login Error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}