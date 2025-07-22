import { Routes } from '@angular/router';

const clientRoutes: Routes = [
  { path: '', redirectTo: 'client', pathMatch: 'full' },
  {
    path: 'client',
    loadComponent: () =>
      import('./client/client.component').then(c => c.ClientComponent),
  },
];
export default clientRoutes;
