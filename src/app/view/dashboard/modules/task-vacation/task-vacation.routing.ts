import { Routes } from '@angular/router';
import { TaskVacationComponent } from '@modules/task-vacation/task-vacation.component';
import { TaskVacationRoutesPagePath } from '@modules/task-vacation/task-vacation-routes-page.path';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TaskViewerComponent } from '@modules/task-vacation/task-viewer/task-viewer.component';
import { AuthenticationRoles } from '@shared/model/auth/authentication-roles.enum';
import { NgxPermissionsGuard } from 'ngx-permissions';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [NgxPermissionsGuard],
    component: TaskVacationComponent,
    children: [
      {
        component: TaskViewerComponent,
        path: TaskVacationRoutesPagePath.HR_TASKS,
        data: {
          permissions: { only: [AuthenticationRoles.HR], redirectTo: '/' },
          tableType: TableRouteTypes.HR_TASKS,
          completed: false
        }
      },
      {
        component: TaskViewerComponent,
        path: TaskVacationRoutesPagePath.HR_TASKS_COMPLETED,
        data: {
          permissions: { only: [AuthenticationRoles.HR], redirectTo: '/' },
          tableType: TableRouteTypes.HR_TASKS,
          completed: true
        }
      }
    ]
  }
];
