import { Routes } from '@angular/router';
import { AppRoutesPagePath } from '@app/app-routes.enum';
import { DashboardComponent } from '@app/view/dashboard/dashboard.component';
import { DashboardRoutesPagePath } from '@app/view/dashboard/dashboard-routes.enum';
import { WelcomeComponent } from '@app/view/dashboard/components/welcome/welcome.component';
import { ErrorsComponent } from '@app/view/dashboard/components/errors/errors.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: `/${DashboardRoutesPagePath.PAGE_HOME}`
      },
      {
        path: DashboardRoutesPagePath.KS_LIBRARY,
        loadChildren: '@modules/schedule-vacation/schedule-vacation.module#ScheduleVacationModule'
      },
      {
        path: DashboardRoutesPagePath.PAGE_HOME,
        component: WelcomeComponent
      },
      {
        path: AppRoutesPagePath.ERRORS,
        component: ErrorsComponent
      }
    ]
  }
];
