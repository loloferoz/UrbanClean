import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { UserRole } from './features/user/models';

const managerRoutes: Routes = [
  {
    path: 'area',
    loadChildren: () => import('./features/area/area.routes'),
  },
  {
    path: 'center',
    loadComponent: () =>
      import('./features/center/center-list/center-list.component').then(
        c => c.CenterListComponent
      ),
    canActivate: [authGuard],
    data: {
      roles: [UserRole.ADMIN],
    },
  },
  {
    path: 'client',
    loadChildren: () => import('./features/client/client.routes'),
  },
  {
    path: 'control',
    loadComponent: () =>
      import('./features/control/control-list/control-list.component').then(
        c => c.ControlListComponent
      ),
  },
  {
    path: 'element',
    loadComponent: () =>
      import('./features/element/element-list/element-list.component').then(
        c => c.ElementListComponent
      ),
  },
  {
    path: 'hired-service',
    loadComponent: () =>
      import(
        './features/hired-service/hired-service-list/hired-service-list.component'
      ).then(c => c.HiredServiceListComponent),
  },
  {
    path: 'incident',
    loadComponent: () =>
      import(
        './features/incident/incident-layout/incident-layout.component'
      ).then(c => c.IncidentLayoutComponent),
  },
  {
    path: 'location',
    loadComponent: () =>
      import(
        './features/location/location-layout/location-layout.component'
      ).then(c => c.LocationLayoutComponent),
  },
  {
    path: 'sector',
    loadComponent: () =>
      import('./features/sector/sector-list/sector-list.component').then(
        c => c.SectorListComponent
      ),
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./features/user/user-list/user-list.component').then(
        c => c.UserListComponent
      ),
  },
  {
    path: 'work-day',
    loadComponent: () =>
      import('./features/work-day/work-day-list/work-day-list.component').then(
        c => c.WorkDayListComponent
      ),
  },
  { path: '', redirectTo: 'incident', pathMatch: 'full' },
];
export default managerRoutes;
