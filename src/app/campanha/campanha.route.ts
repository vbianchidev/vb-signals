import { Routes } from '@angular/router';

export const campanhaRoutes = (): Routes => [
  {
    path: '',
    loadComponent: () =>
      import('./pages/campanha-page.component').then(
        (c) => c.CampanhaPageComponent
      ),
  },
];
