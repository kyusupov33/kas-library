import { Routes } from '@angular/router';
import { DictionaryVacationComponent } from '@modules/dictionary-vacation/dictionary-vacation.component';
import { DictionaryViewerComponent } from '@modules/dictionary-vacation/dictionary-viewer/dictionary-viewer.component';
import { DictionaryVacationRoutesPagePath } from '@modules/dictionary-vacation/dictionary-vacation-routes-page.path';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AuthenticationRoles } from '@shared/model/auth/authentication-roles.enum';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [NgxPermissionsGuard],
    component: DictionaryVacationComponent,
    children: [
      {
        component: DictionaryViewerComponent,
        path: DictionaryVacationRoutesPagePath.HR_ROUTE,
        data: {
          permissions: {
            only: [AuthenticationRoles.ADMIN],
            redirectTo: '/'
          },
          tableType: TableRouteTypes.HR_ROUTE
        }
      },
      {
        component: DictionaryViewerComponent,
        path: DictionaryVacationRoutesPagePath.HR_USER,
        data: {
          permissions: {
            only: [AuthenticationRoles.ADMIN],
            redirectTo: '/'
          },
          tableType: TableRouteTypes.HR_USER
        }
      },
      {
        component: DictionaryViewerComponent,
        path: DictionaryVacationRoutesPagePath.ASSISTANT,
        data: {
          permissions: {
            only: [AuthenticationRoles.ADMIN],
            redirectTo: '/'
          },
          tableType: TableRouteTypes.ASSISTANT
        }
      },
      {
        component: DictionaryViewerComponent,
        path: DictionaryVacationRoutesPagePath.OTHER_SETTINGS,
        data: {
          permissions: {
            only: [AuthenticationRoles.ADMIN],
            redirectTo: '/'
          },
          tableType: TableRouteTypes.OTHER_SETTINGS
        }
      }
    ]
  }
];
