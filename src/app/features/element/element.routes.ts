import { Routes } from '@angular/router';
import { ElementListComponent } from './element-list/element-list.component';

const elementRoutes: Routes = [
  {
    path: '',
    component: ElementListComponent,
  },
];
export default elementRoutes;
