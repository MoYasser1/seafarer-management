import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  userName?: string;
  '.issued'?: string;
  '.expires'?: string;
  // ✅ Added for backward compatibility
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://176.9.184.190'; // ✅ Direct API URL

  constructor(private http: HttpClient) {}

  /**
   * ✅ Login using the correct API format from Postman
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const url = `${this.apiUrl}/token`;
    
    // ✅ Create form-encoded body (as per Postman collection)
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('grant_type', 'password')
      .set('mobileid', '9cb2fcb2de1c71e8');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(url, body.toString(), { headers })
      );
      
      if (response && response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        localStorage.setItem('token_expires', response['.expires'] || '');
        console.log('✅ Login successful, token stored');
        return response;
      }
      
      throw new Error('No token received');
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      
      // Better error messages in Arabic
      if (error.status === 400) {
        throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
      } else if (error.status === 0) {
        throw new Error('لا يمكن الاتصال بالخادم. تحقق من الاتصال بالإنترنت');
      } else {
        throw new Error('حدث خطأ أثناء تسجيل الدخول');
      }
    }
  }

  /**
   * ✅ Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * ✅ Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const expires = localStorage.getItem('token_expires');
    
    if (!token) return false;
    
    // Check if token is expired
    if (expires) {
      const expiryDate = new Date(expires);
      if (expiryDate < new Date()) {
        this.logout();
        return false;
      }
    }
    
    return true;
  }

  /**
   * ✅ Get authorization headers for API calls
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * ✅ Logout
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_expires');
    console.log('✅ Logged out successfully');
  }
}