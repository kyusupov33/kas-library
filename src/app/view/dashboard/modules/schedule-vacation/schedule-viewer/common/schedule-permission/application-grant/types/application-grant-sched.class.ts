import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import { ApplicationGrant } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.class';
import {
  ACTION_TYPE,
  ApplicationGrantOptions
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { Application } from '@shared/model/application/application.model';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';
import { SerialDate } from '@core/utils/date/date.class';

export class ApplicationGrantSched extends ApplicationGrant {

  public readonly processStageButtonMap = {
    [ProcessStage.DRAFT]: [ACTION_TYPE.SAVE, ACTION_TYPE.SEND_FOR_APPROVAL],
    [ProcessStage.REWORK]: [ACTION_TYPE.SAVE, ACTION_TYPE.REPEAT_APPROVE],
    [ProcessStage.MANAGER_APPROVAL]: [ACTION_TYPE.REWORK, ACTION_TYPE.APPROVE],
    [ProcessStage.FIRST_APPROVAL]: [ACTION_TYPE.REWORK, ACTION_TYPE.APPROVE],
    [ProcessStage.SECOND_APPROVAL]: [ACTION_TYPE.REWORK, ACTION_TYPE.APPROVE],
    [ProcessStage.DONE]: [ACTION_TYPE.CORRECT],
    [ProcessStage.HR_DONE]: [ACTION_TYPE.HR_SAVE_PDF]
  };

  constructor(options: ApplicationGrantOptions) {
    super(options);
  }

  public getButtons() {
    return this.getActionList(this.processStageButtonMap);
  }

  public getEditableFlags() {
    return this.getEditableFlagsByTypes({ canEditableCalendarOnStage: true });
  }

  public approveValidator(application: Application) {
    let isValid = true;
    const { type, totalDuration, availableDays, maximumDurationByPeriod } = application;
    const applicationByPlan = [APPLICATION_TYPE.SCHED, APPLICATION_TYPE.CORR].includes(type.code);

    if (applicationByPlan) {
      const nextYear = application.year > SerialDate.yearType.CURRENT;
      isValid = totalDuration === availableDays;
      if (nextYear) {
        isValid = isValid && maximumDurationByPeriod >= 14;
      }
    }

    return isValid;
  }

}
