// src/app/shared/interceptors/token-interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    console.log('🔐 Token found, adding to request:', req.url);
    // استنساخ الطلب وإضافة هيدر Authorization
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.warn('⚠️ No token found for request:', req.url);
  }

  return next(req);
};