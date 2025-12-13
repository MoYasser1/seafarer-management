// src/app/seafarers/services/seafarer.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap, take } from 'rxjs/operators';
import {
  Seafarer,
  Employee,
  Vendor,
  SaveSeafarerRequest,
  ApiResponse
} from '../models/seafarer.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeafarerService {
  private readonly baseUrl = environment.apiUrl ? `${environment.apiUrl}/api` : '/api';

  constructor(private http: HttpClient) { }

  /**
   * الحصول على Bearer Token من localStorage
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ==================== SEAFARER CRUD ====================

  /**
   * Get all seafarers
   */
  async getAllSeafarers(): Promise<Seafarer[]> {
    try {
      const params = new HttpParams()
        .set('Direction', 'ltr')
        .set('InCT', '');

      const response = await this.http.get<any>(
        `${this.baseUrl}/MarineServices/GetAllSeafarers`,
        {
          headers: this.getAuthHeaders(),
          params
        }
      ).toPromise();

      console.log('Raw Seafarers Response:', response);

      let data = response;
      if (response.data) data = response.data;
      if (response.Data) data = response.Data;
      if (response.result) data = response.result;
      if (response.Result) data = response.Result;

      if (!Array.isArray(data)) {
        console.warn('Seafarers response is not an array:', data);
        return [];
      }

      console.log('Found', data.length, 'seafarers');
      return data;
    } catch (error) {
      throw this.handleErrorSync(error);
    }
  }

  /**
   * Get seafarer by ID
   */
  getSeafarerById(id: number): Observable<Seafarer> {
    const params = new HttpParams()
      .set('Direction', 'ltr')
      .set('InCT', '');

    console.log('Fetching seafarer by ID:', id);

    return this.http.get<any>(
      `${this.baseUrl}/MarineServices/GetAllSeafarers`,
      {
        headers: this.getAuthHeaders(),
        params
      }
    ).pipe(
      take(1),
      map(response => {
        console.log('Raw response for getSeafarerById:', response);

        let data = response;
        if (response.data) data = response.data;
        if (response.Data) data = response.Data;

        const seafarers = Array.isArray(data) ? data : [];
        const seafarer = seafarers.find((s: Seafarer) => s.Id === id);

        if (!seafarer) {
          console.error('Seafarer not found with ID:', id);
          throw new Error('Seafarer not found');
        }

        console.log('Found seafarer:', seafarer);
        return seafarer;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Create seafarer
   */
  createSeafarer(data: SaveSeafarerRequest): Observable<any> {
    const params = new HttpParams().set('InCT', '');

    console.log('Creating seafarer:', data);
    console.log('Full request payload:', JSON.stringify(data, null, 2));

    return this.http.post<any>(
      `${this.baseUrl}/MarineServices/SaveSeafarer`,
      data,
      {
        headers: this.getAuthHeaders(),
        params
      }
    ).pipe(
      tap(response => console.log('Create response:', response)),
      map(response => response.data || response),
      catchError(error => {
        console.error('Create seafarer error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          errorObject: error.error,
          errorString: JSON.stringify(error.error, null, 2),
          fullError: error
        });

        // Try to extract meaningful error message
        if (error.error) {
          console.error('API Error Content:', error.error);
          if (error.error.Message) console.error('📝 Message:', error.error.Message);
          if (error.error.ExceptionMessage) console.error('📝 ExceptionMessage:', error.error.ExceptionMessage);
          if (error.error.InnerException) console.error('📝 InnerException:', error.error.InnerException);
          if (error.error.StackTrace) console.error('📝 StackTrace:', error.error.StackTrace);
          if (error.error.ModelState) console.error('📝 ModelState:', error.error.ModelState);

          // Log the entire error object structure
          console.error('📋 Full error object keys:', Object.keys(error.error));
        }

        return this.handleError(error);
      })
    );
  }

  /**
   * Update seafarer
   */
  updateSeafarer(id: number, data: SaveSeafarerRequest): Observable<any> {
    data.entity.Id = id;

    const params = new HttpParams().set('InCT', '');

    console.log('Updating seafarer:', id, data);
    console.log('Full update payload:', JSON.stringify(data, null, 2));

    return this.http.post<any>(
      `${this.baseUrl}/MarineServices/SaveSeafarer`,
      data,
      {
        headers: this.getAuthHeaders(),
        params
      }
    ).pipe(
      tap(response => console.log('Update response:', response)),
      map(response => response.data || response),
      catchError(error => {
        console.error('Update seafarer error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          errorObject: error.error,
          errorString: JSON.stringify(error.error, null, 2),
          fullError: error
        });

        // Try to extract meaningful error message
        if (error.error) {
          console.error('API Error Content:', error.error);
          if (error.error.Message) console.error('📝 Message:', error.error.Message);
          if (error.error.ExceptionMessage) console.error('📝 ExceptionMessage:', error.error.ExceptionMessage);
          if (error.error.ModelState) console.error('📝 ModelState:', error.error.ModelState);
        }

        return this.handleError(error);
      })
    );
  }

  /**
   * Toggle active status
   */
  async toggleActiveStatus(id: number, isActive: boolean): Promise<void> {
    try {
      const params = new HttpParams()
        .set('Id', id.toString())
        .set('InCT', '')
        .set('Status', isActive ? '1' : '2')
        .set('EmpId', '1');

      console.log(`Toggling seafarer ${id} to ${isActive ? 'active' : 'inactive'}`);

      await this.http.post<any>(
        `${this.baseUrl}/MarineServices/ActivateAndInActivateSeafarer`,
        null,
        {
          headers: this.getAuthHeaders(),
          params
        }
      ).toPromise();

      console.log('Toggle successful');
    } catch (error) {
      console.error('Toggle error:', error);
      throw this.handleErrorSync(error);
    }
  }

  // ==================== DROPDOWNS ====================

  /**
   * Get employees list
   */
  getEmployees(): Observable<Employee[]> {
    const params = new HttpParams()
      .set('Id', '0')
      .set('text', '')
      .set('Direction', 'ltr')
      .set('InCT', '');

    return this.http.get<any>(
      `${this.baseUrl}/POS/FillEmployee`,
      {
        headers: this.getAuthHeaders(),
        params
      }
    ).pipe(
      tap(response => console.log('Raw Employees Response:', response)),
      map(response => {
        let data = response;
        if (response.data) data = response.data;
        if (response.Data) data = response.Data;

        if (!Array.isArray(data)) {
          console.warn('Employees response is not an array');
          return [];
        }

        console.log('Processing', data.length, 'employees');

        // Log first employee to see structure
        if (data.length > 0) {
          console.log('First employee sample:', data[0]);
          console.log('Employee keys:', Object.keys(data[0]));
        }

        const mapped = data.map((item: any) => ({
          // API returns Value, Text, Code
          EmpId: item.Value || item.EmpId || item.Id || item.id || 0,
          EmpName: item.Text || item.EmpName || item.Name || item.name || 'Unknown',
          EmpCode: item.Code || item.EmpCode || item.code || '',
          JobName: item.JobName || item.Job || item.job || ''
        }));

        console.log('First mapped employee:', mapped[0]);

        return mapped; // Temporarily removed filter to debug
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get vendors list
   */
  getVendors(): Observable<Vendor[]> {
    const params = new HttpParams()
      .set('Id', '0')
      .set('text', '')
      .set('Direction', 'ltr')
      .set('InCT', '');

    return this.http.get<any>(
      `${this.baseUrl}/LegalAffairs/FillVendor`,
      {
        headers: this.getAuthHeaders(),
        params
      }
    ).pipe(
      tap(response => {
        console.log('Raw Vendors Response:', response);
        console.log('Response Type:', typeof response);
        console.log('Is Array?:', Array.isArray(response));
      }),
      map(response => {
        let data = response;

        if (response.data) data = response.data;
        else if (response.Data) data = response.Data;
        else if (response.result) data = response.result;
        else if (response.Result) data = response.Result;

        if (!Array.isArray(data)) {
          console.error('Vendors data is not an array:', data);
          console.log('Available keys:', Object.keys(response));
          return [];
        }

        console.log('Processing', data.length, 'vendors');

        if (data.length > 0) {
          console.log('First vendor:', data[0]);
          console.log('Available keys:', Object.keys(data[0]));
        }

        // API returns Value, Code, Text instead of VendorId, VendorCode, VendorName
        return data.map((item: any) => ({
          VendorId: item.Value || item.VendorId || item.vendorId || item.Id || item.id || 0,
          VendorName: item.Text || item.VendorName || item.vendorName || item.Name || item.name || 'Unknown Vendor',
          VendorCode: item.Code || item.VendorCode || item.vendorCode || ''
        })).filter(v => v.VendorId > 0);
      }),
      tap(vendors => console.log('Final vendors count:', vendors.length)),
      catchError(error => {
        console.error('Error loading vendors:', error);
        return this.handleError(error);
      })
    );
  }

  // ==================== ERROR HANDLING ====================

  private handleError(error: any): Observable<never> {
    let errorMessage = 'حدث خطأ غير متوقع';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'جلسة العمل انتهت. الرجاء تسجيل الدخول مرة أخرى';
        localStorage.removeItem('auth_token');
      } else if (error.status === 404) {
        errorMessage = 'البيانات المطلوبة غير موجودة';
      } else if (error.status === 500) {
        errorMessage = 'خطأ في الخادم. الرجاء المحاولة لاحقاً';
      } else if (error.status === 0) {
        errorMessage = 'فشل الاتصال بالخادم. تحقق من الاتصال بالإنترنت';
      } else {
        errorMessage = error.error?.message || error.message ||
          `خطأ في الخادم: ${error.status}`;
      }
    }

    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  private handleErrorSync(error: any): Error {
    let errorMessage = 'حدث خطأ غير متوقع';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      if (error.status === 401) {
        errorMessage = 'جلسة العمل انتهت. الرجاء تسجيل الدخول مرة أخرى';
        localStorage.removeItem('auth_token');
      } else if (error.status === 404) {
        errorMessage = 'البيانات المطلوبة غير موجودة';
      } else if (error.status === 500) {
        errorMessage = 'خطأ في الخادم. الرجاء المحاولة لاحقاً';
      } else if (error.status === 0) {
        errorMessage = 'فشل الاتصال بالخادم';
      } else {
        errorMessage = error.error?.message || error.message ||
          `خطأ: ${error.status}`;
      }
    }

    console.error('API Error:', errorMessage, error);
    return new Error(errorMessage);
  }
}
