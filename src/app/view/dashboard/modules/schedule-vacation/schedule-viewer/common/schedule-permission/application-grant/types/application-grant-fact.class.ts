import { ApplicationGrant } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.class';
import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import {
  ACTION_TYPE,
  ApplicationGrantOptions
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';

export class ApplicationGrantFact extends ApplicationGrant {

  public readonly processStageButtonMap = {
    [ProcessStage.DRAFT]: [ACTION_TYPE.SEND_FOR_APPROVAL],
    [ProcessStage.REWORK]: [],
    [ProcessStage.MANAGER_APPROVAL]: [ACTION_TYPE.FACT_APPROVE],
    [ProcessStage.FIRST_APPROVAL]: [ACTION_TYPE.FACT_APPROVE],
    [ProcessStage.SECOND_APPROVAL]: [ACTION_TYPE.FACT_APPROVE],
    [ProcessStage.DONE]: [],
    [ProcessStage.HR_APPROVAL]: [ACTION_TYPE.HR_REJECT, ACTION_TYPE.HR_APPROVE, ACTION_TYPE.HR_SAVE_PDF],
    [ProcessStage.HR_DONE]: [ACTION_TYPE.HR_SAVE_PDF]
  };

  constructor(options: ApplicationGrantOptions) {
    super(options);
  }

  public getButtons() {
    return this.getActionList(this.processStageButtonMap);
  }

  public getEditableFlags() {
    return this.getEditableFlagsByTypes({ canEditableCalendarOnStage: false });
  }

  public approveValidator() {
    return this.defaultApplicationIsValid;
  }

}
