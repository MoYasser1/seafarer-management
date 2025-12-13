// src/app/app.routes.ts

import { Routes } from '@angular/router';

// ✅ استيراد الـ Components (تأكد من المسارات الصحيحة)
import { LoginComponent } from './auth/login/login';
import { AuthGuard } from './auth/auth.guard'; // ✅ Class-based guard for Angular 12
import { SeafarerListComponent } from './seafarers/seafarer-list/seafarer-list';
import { SeafarerFormComponent } from './seafarers/seafarer-form/seafarer-form';

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
    component: SeafarerListComponent,
    canActivate: [AuthGuard] // ✅ Using class-based guard
  },
  {
    path: 'seafarers/add',
    component: SeafarerFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'seafarers/edit/:id',
    component: SeafarerFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
