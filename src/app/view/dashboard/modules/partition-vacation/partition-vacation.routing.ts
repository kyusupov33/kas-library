import { Routes } from '@angular/router';
import { PartitionVacationComponent } from '@modules/partition-vacation/partition-vacation.component';
import { PartitionVacationRoutesPagePath } from '@modules/partition-vacation/partition-vacation-routes.enum';
import { PartitionViewerComponent } from '@modules/partition-vacation/partition-viewer/partition-viewer.component';
import { AuthenticationRoles } from '@shared/model/auth/authentication-roles.enum';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PrintExcelDepartmentComponent } from '@modules/partition-vacation/partition-viewer/print-excel-department/print-excel-department.component';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [NgxPermissionsGuard],
    component: PartitionVacationComponent,
    children: [
      {
        path: PartitionVacationRoutesPagePath.byWithSubDepartments,
        component: PartitionViewerComponent,
        data: {
          permissions: {
            only: [AuthenticationRoles.DEFAULT],
            redirectTo: '/'
          }
        }
      },
      {
        path: PartitionVacationRoutesPagePath.printExcelByDepartment,
        component: PrintExcelDepartmentComponent,
        data: {
          permissions: {
            only: [AuthenticationRoles.RESPONSIBLE],
            redirectTo: '/'
          },
          tableType: TableRouteTypes.PARTITION_EXPORT
        }
      },
      {
        path: PartitionVacationRoutesPagePath.onMyApprovals,
        component: PartitionViewerComponent
      }
    ]
  }
];
