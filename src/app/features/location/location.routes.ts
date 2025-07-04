import { Routes } from '@angular/router';
import { LocationListComponent } from './location-list/location-list.component';
import { LocationLayoutComponent } from './location-layout/location-layout.component';

const centerRoutes: Routes = [
  {
    path: '',
    component: LocationLayoutComponent,
  },
  {
    path: 'list',
    component: LocationListComponent,
  },
];
export default centerRoutes;
