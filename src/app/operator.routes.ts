import { Routes } from '@angular/router';

const operatorRoutes: Routes = [
  {
    path: 'control-litter-bin',
    loadComponent: () =>
      import(
        './features/control/control-litter-bin/control-litter-bin.component'
      ).then(c => c.ControlLitterBinComponent),
  },
  {
    path: 'control-organic',
    loadComponent: () =>
      import(
        './features/control/control-organic/control-organic.component'
      ).then(c => c.ControlOrganicComponent),
  },
  {
    path: 'control-plastic',
    loadComponent: () =>
      import(
        './features/control/control-plastic/control-plastic.component'
      ).then(c => c.ControlPlasticComponent),
  },
  {
    path: 'control-cardboard',
    loadComponent: () =>
      import(
        './features/control/control-cardboard/control-cardboard.component'
      ).then(c => c.ControlCardboardComponent),
  },
  {
    path: 'control-glass',
    loadComponent: () =>
      import('./features/control/control-glass/control-glass.component').then(
        c => c.ControlGlassComponent
      ),
  },
  {
    path: 'incident',
    loadComponent: () =>
      import(
        './features/incident/incident-layout/incident-layout.component'
      ).then(c => c.IncidentLayoutComponent),
  },
  { path: '', redirectTo: 'incident', pathMatch: 'full' },
];
export default operatorRoutes;
