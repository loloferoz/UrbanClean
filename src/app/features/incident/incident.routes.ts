import { Routes } from '@angular/router';

const incidentRoutes: Routes = [
  { path: '', redirectTo: 'incident', pathMatch: 'full' },
  {
    path: 'incident',
    loadComponent: () =>
      import('./incident-layout/incident-layout.component').then(
        c => c.IncidentLayoutComponent
      ),
  },
];
export default incidentRoutes;
