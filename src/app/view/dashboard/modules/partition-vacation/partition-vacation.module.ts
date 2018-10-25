import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PartitionVacationComponent } from '@modules/partition-vacation/partition-vacation.component';
import { PartitionViewerComponent } from '@modules/partition-vacation/partition-viewer/partition-viewer.component';
import { PartitionComponent } from '@modules/partition-vacation/partition-viewer/partition/partition.component';
import { PeriodViewerComponent } from '@modules/partition-vacation/partition-viewer/period-viewer/period-viewer.component';
import { PeriodApproveComponent } from '@modules/partition-vacation/partition-viewer/period-approve/period-approve.component';
import { routes } from '@modules/partition-vacation/partition-vacation.routing';
import { DashboardSharedModule } from '@app/view/dashboard/shared/dashboard-shared.module';
import { DrawPeriodService } from '@modules/partition-vacation/partition-viewer/period-viewer/common/draw-period.service';
import { PrintExcelDepartmentComponent } from '@modules/partition-vacation/partition-viewer/print-excel-department/print-excel-department.component';
import { PartitionSwitchYearComponent } from './partition-viewer/partition-switch-year/partition-switch-year.component';

@NgModule({
  imports: [
    DashboardSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    PartitionVacationComponent,
    PartitionViewerComponent,
    PartitionComponent,
    PeriodViewerComponent,
    PrintExcelDepartmentComponent,
    PeriodApproveComponent,
    PartitionSwitchYearComponent
  ],
  providers: [
    DrawPeriodService
  ]
})
export class PartitionVacationModule {
}
