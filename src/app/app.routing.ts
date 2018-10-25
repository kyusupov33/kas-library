import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      loadChildren: '@app/view/dashboard/dashboard.module#DashboardModule'
    }]
  }
];
