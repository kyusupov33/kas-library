import { ApplicationGrantFact } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-fact.class';
import {
  ACTION_TYPE,
  ApplicationGrantOptions
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';

export class ApplicationGrantOsnp extends ApplicationGrantFact {

  public readonly processStageButtonMap = {
    [ProcessStage.DRAFT]: [ACTION_TYPE.SEND_FOR_APPROVAL],
    [ProcessStage.REWORK]: [],
    [ProcessStage.MANAGER_APPROVAL]: [ACTION_TYPE.REJECT, ACTION_TYPE.APPROVE],
    [ProcessStage.FIRST_APPROVAL]: [ACTION_TYPE.REJECT, ACTION_TYPE.APPROVE],
    [ProcessStage.SECOND_APPROVAL]: [ACTION_TYPE.REJECT, ACTION_TYPE.APPROVE],
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

}
