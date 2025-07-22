import { Routes } from '@angular/router';

const controlRoutes: Routes = [
  { path: '', redirectTo: 'control', pathMatch: 'full' },
  {
    path: 'control',
    loadComponent: () =>
      import('./control-list/control-list.component').then(
        c => c.ControlListComponent
      ),
  },
  {
    path: 'control-litter-bin',
    loadComponent: () =>
      import('./control-litter-bin/control-litter-bin.component').then(
        c => c.ControlLitterBinComponent
      ),
  },
  {
    path: 'control-organic',
    loadComponent: () =>
      import('./control-organic/control-organic.component').then(
        c => c.ControlOrganicComponent
      ),
  },
  {
    path: 'control-plastic',
    loadComponent: () =>
      import('./control-plastic/control-plastic.component').then(
        c => c.ControlPlasticComponent
      ),
  },
  {
    path: 'control-cardboard',
    loadComponent: () =>
      import('./control-cardboard/control-cardboard.component').then(
        c => c.ControlCardboardComponent
      ),
  },
  {
    path: 'control-glass',
    loadComponent: () =>
      import('./control-glass/control-glass.component').then(
        c => c.ControlGlassComponent
      ),
  },
];
export default controlRoutes;
