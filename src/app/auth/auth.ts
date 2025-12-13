// src/app/auth/auth.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
// RxJS 6 uses .toPromise() instead of firstValueFrom

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  userName?: string;
  '.issued'?: string;
  '.expires'?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Check token on service init (only in browser)
    if (this.isBrowser) {
      this.checkTokenExpiry();
    }
  }

  /**
   * Login using the correct API format
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const url = `${this.apiUrl}/token`;

    // Unusual: Postman shows GET request with body
    // Backend might accept both GET and POST
    const body = `username=${username}&Password=${password}&grant_type=password&mobileid=9cb2fcb2de1c71e8`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    try {
      // Try POST first (standard OAuth2)
      const response = await this.http.post<LoginResponse>(url, body, { headers }).toPromise();

      if (response && response.access_token) {
        // Store token and user info (only in browser)
        if (this.isBrowser) {
          try {
            localStorage.setItem('auth_token', response.access_token);
            localStorage.setItem('username', response.userName || username);

            if (response['.expires']) {
              localStorage.setItem('token_expires', response['.expires']);
            }
          } catch (storageError) {
            console.warn('Could not save to localStorage:', storageError);
          }
        }

        console.log('Login successful');
        console.log('Token expires:', response['.expires']);

        return response;
      }

      throw new Error('No token received');
    } catch (error: any) {
      console.error('Login failed:', error);

      if (error.status === 400) {
        throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
      } else if (error.status === 0) {
        throw new Error('لا يمكن الاتصال بالخادم. تحقق من الاتصال بالإنترنت');
      } else {
        throw new Error(error.error?.error_description || 'حدث خطأ أثناء تسجيل الدخول');
      }
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (!this.isBrowser) return null;

    try {
      return localStorage.getItem('auth_token');
    } catch (error) {
      console.warn('Could not read from localStorage:', error);
      return null;
    }
  }

  /**
   * Get username
   */
  getUsername(): string | null {
    if (!this.isBrowser) return null;

    try {
      return localStorage.getItem('username');
    } catch (error) {
      console.warn('Could not read from localStorage:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;

    const token = this.getToken();

    if (!token) {
      console.log('No token found');
      return false;
    }

    // Check if token is expired
    try {
      const expires = localStorage.getItem('token_expires');
      if (expires) {
        const expiryDate = new Date(expires);
        const now = new Date();

        if (expiryDate <= now) {
          console.warn('Token expired at:', expiryDate);
          this.logout();
          return false;
        }

        console.log('Token valid until:', expiryDate);
      }
    } catch (error) {
      console.warn('Could not check token expiry:', error);
    }

    return true;
  }

  /**
   * Check token expiry on init
   */
  private checkTokenExpiry(): void {
    if (!this.isAuthenticated()) {
      console.log('Token check: Not authenticated');
    }
  }

  /**
   * Get authorization headers for API calls
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Logout and redirect
   */
  logout(): void {
    if (this.isBrowser) {
      try {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token_expires');
        localStorage.removeItem('username');
      } catch (error) {
        console.warn('Could not clear localStorage:', error);
      }
    }

    console.log('Logged out successfully');
    this.router.navigate(['/login']);
  }
}