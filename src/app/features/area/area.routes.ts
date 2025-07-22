import { Routes } from '@angular/router';

const areaRoutes: Routes = [
  { path: '', redirectTo: 'area', pathMatch: 'full' },
  {
    path: 'area',
    loadComponent: () =>
      import('./area-detail/area-detail.component').then(
        c => c.AreaDetailComponent
      ),
  },
];
export default areaRoutes;
