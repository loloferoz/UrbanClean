import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { isManagerGuard } from './core/guards/is-manager.guard';
import { isOperatorGuard } from './core/guards/is-operator.guard';

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
    canActivate: [isManagerGuard],
  },
  {
    path: 'operator',
    loadChildren: () => import('./operator.routes'),
    canActivate: [isOperatorGuard],
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

// canMatch: [(route: Route, segments: UrlSegment[]) => {
//   const router = inject(Router);
//   const auth = inject(AuthService)
//   return auth.authStatus().userRole === UserRole.MANAGER || router.createUrlTree(['']);
// }]
