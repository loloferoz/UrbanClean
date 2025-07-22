import { Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';
import { isNotAuthenticatedGuard } from '@app/core/guards/is-not-authenticated.guard';

const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then(c => c.LoginComponent),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then(c => c.RegisterComponent),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'complete-register/:token',
    loadComponent: () =>
      import('./complete-register/complete-register.component').then(
        c => c.CompleteRegisterComponent
      ),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component').then(
        c => c.ForgotPasswordComponent
      ),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
export default authRoutes;
