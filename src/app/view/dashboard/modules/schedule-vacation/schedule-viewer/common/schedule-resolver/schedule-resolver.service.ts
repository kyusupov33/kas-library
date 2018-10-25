import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { Application } from '@shared/model/application/application.model';
import {
  ACTION_TYPE,
  ActionTitleMap
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { CalendarEvent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-year-calendar/schedule-month-viewer/schedule-month-viewer.component';
import { ScheduleMonthDialogComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-year-calendar/schedule-month-dialog/schedule-month-dialog.component';
import { ScheduleMonthWithoutPlaningComponent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-year-calendar/schedule-month-without-planing/schedule-month-without-planing.component';
import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import { SerialDate } from '@core/utils/date/date.class';
import { ConfirmDialogComponent } from '@app/view/dashboard/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MODAL_CONFIG } from '@shared/config/modal.config';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { ScheduleState } from '@store/dashboard/states/schedule/schedule.state';

export interface CalendarDialogInterface {
  application: Application;
  initiatorStage: boolean;
  event: CalendarEvent;
}

interface Class {
  new(...args: any[]): any;
}

export interface DialogResponseEvent {
  config: MatDialogConfig;
  type: Class | null;
  applicationId: number;
  operation: APPLICATION_TYPE;
  subscribeByReference: boolean;
}

@Injectable()
export class ScheduleResolverService {

  @Emitter(ScheduleState.updateSchedule)
  public scheduleStateUpdate: Emittable<Application>;

  public titleMap: Partial<ActionTitleMap> = {};

  constructor(private translate: TranslateService,
              private dialog: MatDialog,
              private notify: NotificationsService) {
    this.titleMap = this.translate.instant('DASHBOARD.ACTION_TYPE_TITLE');
  }

  public async resolve({ action, data }) {
    this.showMessageSuccess(action.name);
    if (data instanceof Application) {
      this.scheduleStateUpdate.emit(data);
    }
  }

  public openDialogByEvent({ type, config }: DialogResponseEvent) {
    return this.dialog.open(type, config);
  }

  public async getDialogModalTypeByOption(options: CalendarDialogInterface): Promise<DialogResponseEvent> {
    const { initiatorStage, event, application } = options;
    const { day, payload: dayInfo } = event;
    const isCurrentYear = application.year === SerialDate.yearType.CURRENT;
    let data: any = { day, dayInfo, periods: application.periods };
    let isCanWithout = null;
    let type = null;
    let applicationId = null;
    let operation = null;
    let subscribeByReference = null;

    if (event.payload) {
      applicationId = event.payload.period.applicationId;
      const isProcessStageDone = application.processStage === ProcessStage.DONE;
      const isFactVacation = day.editable && isProcessStageDone;
      const title = this.translate.instant('DASHBOARD.APPLICATION_CONFIRM.TITLE');

      if (isFactVacation) {
        const error = this.translate.instant('DASHBOARD.ERROR_CODE.FACT_INVALID');
        const valid = application.validationFactVacation(dayInfo.period.startDate);
        data = { title, enableComment: false, content: null, error: valid ? null : error };
        type = ConfirmDialogComponent;
        operation = APPLICATION_TYPE.FACT;
        subscribeByReference = true;
      }

    } else if (isCurrentYear) {
      const withoutPlan = application.isCanWithoutPlan;
      const ourDays = !(new Date(day.value).getTime() <= new Date().getTime());
      isCanWithout = withoutPlan && ourDays;
    }

    if (initiatorStage) {
      type = ScheduleMonthDialogComponent;
    } else if (isCanWithout) {
      type = ScheduleMonthWithoutPlaningComponent;
    }

    const config: MatDialogConfig = { ...MODAL_CONFIG, data };
    return { type, config, applicationId, subscribeByReference, operation };
  }

  private showMessageSuccess(actionType: ACTION_TYPE) {
    const title = this.titleMap[actionType];
    const description = this.translate.instant('DASHBOARD.ACTION_TYPE_DESCRIPTION');
    this.notify.success(title, description);
  }

}
