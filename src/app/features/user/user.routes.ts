import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';

const userRoutes: Routes = [
  {
    path: '',
    component: UserListComponent,
  },
];
export default userRoutes;
