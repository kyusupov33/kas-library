import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import {
  ACTION_TYPE,
  ApplicationGrantOptions
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { ApplicationGrantSched } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-sched.class';

export class ApplicationGrantCorrect extends ApplicationGrantSched {

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
    return super.getActionList(this.processStageButtonMap);
  }

}
