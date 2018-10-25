import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ScheduleMonthDialogComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-year-calendar/schedule-month-dialog/schedule-month-dialog.component';
import { DashboardSharedModule } from '@app/view/dashboard/shared/dashboard-shared.module';
import { ScheduleVacationComponent } from '@modules/schedule-vacation/schedule-vacation.component';
import { ScheduleViewerComponent } from '@modules/schedule-vacation/schedule-viewer/schedule-viewer.component';
import { ScheduleByIdComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/schedule-by-id/schedule-by-id.component';
import { ScheduleStagePanelComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-stage-panel/schedule-stage-panel.component';
import { ScheduleApproveHistoryPanelComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-approve-history-panel/schedule-approve-history-panel.component';
import { ScheduleInitiatorComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-card-persons/schedule-initiator/schedule-initiator.component';
import { ScheduleApproversManagersComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-card-persons/schedule-approvers-managers/schedule-approvers-managers.component';
import { ScheduleYearCalendarComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-year-calendar/schedule-year-calendar.component';
import { ScheduleMonthViewerComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-year-calendar/schedule-month-viewer/schedule-month-viewer.component';
import { PersonDialogComponent } from '@modules/schedule-vacation/person-dialog/person-dialog.component';
import { ScheduleActionPanelComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-action-panel/schedule-action-panel.component';
import { ScheduleResolverService } from '@modules/schedule-vacation/schedule-viewer/common/schedule-resolver/schedule-resolver.service';
import { routes } from '@modules/schedule-vacation/schedule-vacation.routing';
import { ScheduleErrorHandlerService } from '@modules/schedule-vacation/schedule-viewer/common/schedule-error-handler/schedule-error-handler.service';
import { ScheduleByTaskComponent } from './schedule-viewer/schedule/schedule-by-task/schedule-by-task.component';
import { SchedulePeriodsComponent } from './schedule-viewer/schedule/components/schedule-card-persons/schedule-periods/schedule-periods.component';
import { ScheduleMonthWithoutPlaningComponent } from './schedule-viewer/schedule/components/schedule-year-calendar/schedule-month-without-planing/schedule-month-without-planing.component';
import { SchedulePermissionService } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/schedule-permission.service';
import { ScheduleHistoryPanelComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-history-panel/schedule-history-panel.component';
import { ScheduleByPlanTypeComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/schedule-by-plan-type/schedule-by-plan-type.component';

const DYNAMIC_COMPONENTS = [
  ScheduleMonthDialogComponent,
  ScheduleMonthWithoutPlaningComponent
];

@NgModule({
  imports: [
    DashboardSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ScheduleVacationComponent,
    ScheduleViewerComponent,
    ScheduleByIdComponent,
    ScheduleByPlanTypeComponent,
    ScheduleStagePanelComponent,
    ScheduleHistoryPanelComponent,
    ScheduleApproveHistoryPanelComponent,
    ScheduleInitiatorComponent,
    ScheduleApproversManagersComponent,
    ScheduleYearCalendarComponent,
    ScheduleMonthViewerComponent,
    ScheduleActionPanelComponent,
    PersonDialogComponent,
    ScheduleByTaskComponent,
    SchedulePeriodsComponent,
    ...DYNAMIC_COMPONENTS
  ],
  entryComponents: [
    ...DYNAMIC_COMPONENTS
  ],
  providers: [
    ScheduleResolverService,
    ScheduleErrorHandlerService,
    SchedulePermissionService
  ]
})
export class ScheduleVacationModule {
}
