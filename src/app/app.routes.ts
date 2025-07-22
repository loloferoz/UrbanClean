import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { authGuard } from './core/guards/auth.guard';
import { UserRole } from './features/user/models';

export const routes: Routes = [
  {
    path: 'theme',
    loadComponent: () =>
      import('./shared/components/theme/theme.component').then(
        c => c.ThemeComponent
      ),
  },
  {
    path: 'manager',
    loadChildren: () => import('./manager.routes'),
    canActivate: [authGuard],
    data: {
      roles: [UserRole.ADMIN, UserRole.MANAGER],
    },
  },
  {
    path: 'operator',
    loadChildren: () => import('./operator.routes'),
    canActivate: [authGuard],
    data: {
      roles: [UserRole.OPERATOR],
    },
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
