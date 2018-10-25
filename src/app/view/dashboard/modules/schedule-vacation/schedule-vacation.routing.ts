import { Routes } from '@angular/router';
import { ScheduleVacationComponent } from '@modules/schedule-vacation/schedule-vacation.component';
import { ScheduleVacationRoutesPagePath } from '@modules/schedule-vacation/schedule-vacation-routes.enum';
import { ScheduleViewerComponent } from '@modules/schedule-vacation/schedule-viewer/schedule-viewer.component';

export const routes: Routes = [
  {
    path: '',
    component: ScheduleVacationComponent,
    children: [
      {
        path: ScheduleVacationRoutesPagePath.byYearType,
        component: ScheduleViewerComponent
      },
      {
        path: ScheduleVacationRoutesPagePath.byApplicationId,
        component: ScheduleViewerComponent
      },
      {
        path: ScheduleVacationRoutesPagePath.byTaskId,
        component: ScheduleViewerComponent
      }
    ]
  }
];
