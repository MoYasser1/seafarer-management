
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { AuthGuard } from './auth/auth.guard';
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
    canActivate: [AuthGuard]
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
