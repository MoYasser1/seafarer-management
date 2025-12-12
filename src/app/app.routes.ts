// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// ✅ استيراد الـ Components (تأكد من المسارات الصحيحة)
import { LoginComponent } from './auth/login/login';
import { AuthService } from './auth/auth';
import { SeafarerListComponent } from './seafarers/seafarer-list/seafarer-list'; // ✅ ADDED
import { SeafarerFormComponent } from './seafarers/seafarer-form/seafarer-form';

// ✅ Auth Guard
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/login');
};

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'seafarers',
    component: SeafarerListComponent,  // ✅ الآن يعمل
    canActivate: [authGuard]
  },
  {
    path: 'seafarers/add',
    component: SeafarerFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'seafarers/edit/:id',
    component: SeafarerFormComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
