import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import { Application } from '@shared/model/application/application.model';
import {
  ACTION_MATRIX,
  ACTION_TYPE,
  ActionList,
  ActionMapInterface,
  ApplicationGrantInfo,
  ApplicationGrantInterface,
  ApplicationGrantOptions,
  CheckedPersonApplication,
  COMMENTS_IN_PROCESS,
  EditableTypeInterface
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';

export abstract class ApplicationGrant implements ApplicationGrantInterface {

  public applicationGrantInfo: ApplicationGrantInfo = {
    isManagerStage: false,
    isFirstApprovalStage: false,
    isSecondApprovalStage: false,
    isReworkTask: false,
    isInitiatorStage: false,
    isTask: false
  };

  public access: boolean;
  public defaultApplicationIsValid: boolean = true;
  public readonly actionTypeOptions: ActionMapInterface = {
    ...ACTION_MATRIX,
    [ACTION_TYPE.SEND_FOR_APPROVAL]: {
      approveValidator: this.approveValidator.bind(this),
      comment: COMMENTS_IN_PROCESS.NONE,
      placeholderKey: 'DASHBOARD.ACTION_CONFIRM.VALIDATOR_YEAR_',
      isModal: true
    },
    [ACTION_TYPE.REPEAT_APPROVE]: {
      approveValidator: this.approveValidator.bind(this),
      comment: COMMENTS_IN_PROCESS.OPTIONAL,
      placeholderKey: 'DASHBOARD.ACTION_CONFIRM.VALIDATOR_YEAR_',
      isModal: true
    }
  };

  protected constructor(public options: Partial<ApplicationGrantOptions> = {}) {
    const { application, userId, isTask } = options;
    const applicationInstance = application || new Application();
    const optionsGrantInfo = { application: applicationInstance, userId, isTask };
    this.access = !ApplicationGrant.checkAccessDenied(optionsGrantInfo);
    this.applicationGrantInfo = ApplicationGrant.getApplicationGrantInfo(optionsGrantInfo);
  }

  public static checkAccessDenied({ application, userId }): boolean {
    const { processStage } = application;
    const personsByApplication = ApplicationGrant.getCheckedPersonsByApplication(application, userId);
    const { isManager, isFirstApproval, isSecondApproval, isInitiator } = personsByApplication;
    const notInitiator = ProcessStage.DRAFT === processStage && !isInitiator;
    const notManager = ProcessStage.MANAGER_APPROVAL === processStage && !isManager;
    const notFirstApprover = ProcessStage.FIRST_APPROVAL === processStage && !isFirstApproval;
    const notSecondApprover = ProcessStage.SECOND_APPROVAL === processStage && !isSecondApproval;
    return notInitiator || notManager || notFirstApprover || notSecondApprover;
  }

  public static getApplicationGrantInfo({ application, userId, isTask }): ApplicationGrantInfo {
    const { processStage } = application;
    const processStageValue = processStage || ProcessStage.DRAFT;

    const personsByApplication = ApplicationGrant.getCheckedPersonsByApplication(application, userId);
    const { isInitiator, isManager, isFirstApproval, isSecondApproval } = personsByApplication;

    return {
      isManagerStage: processStageValue === ProcessStage.MANAGER_APPROVAL && isManager,
      isFirstApprovalStage: processStageValue === ProcessStage.FIRST_APPROVAL && isFirstApproval,
      isSecondApprovalStage: processStageValue === ProcessStage.SECOND_APPROVAL && isSecondApproval,
      isReworkTask: processStageValue === ProcessStage.REWORK && isInitiator,
      isInitiatorStage: processStageValue === ProcessStage.DRAFT && isInitiator,
      isTask
    };
  }

  public static getActionByType(actionTypeOptions, actionType: ACTION_TYPE) {
    const action = actionTypeOptions[actionType];
    action.type = actionType;
    action.titleKey = `DASHBOARD.ACTION_TYPE_TITLE.${actionType}`;
    return action;
  }

  private static getCheckedPersonsByApplication(application: Application, userId: string): CheckedPersonApplication {
    const { manager, firstApprover, secondApprover, initiator } = application;
    return {
      isManager: manager && manager.userId === userId,
      isFirstApproval: firstApprover && firstApprover.userId === userId,
      isSecondApproval: secondApprover && secondApprover.userId === userId,
      isInitiator: initiator && initiator.userId === userId
    };
  }

  public abstract getEditableFlags(): EditableTypeInterface;

  public abstract getButtons(): ActionList;

  public abstract approveValidator(application?: Application): boolean;

  protected getActionList(processStageButtonMap): ActionList {
    let actions: ACTION_TYPE[] = [];
    const application = this.options.application;

    if (this.access) {
      const isTaskOnMe = this.options.isTask;
      const processStage: ProcessStage = application.processStage || ProcessStage.DRAFT;
      const canCorrect = application.canCorrect;
      const showButtons = processStage === ProcessStage.DRAFT || isTaskOnMe || canCorrect;
      actions = showButtons ? processStageButtonMap[processStage] : [];
    }

    return actions.map((actionType) => ApplicationGrant.getActionByType(this.actionTypeOptions, actionType));
  }

  protected getEditableFlagsByTypes({ canEditableCalendarOnStage }): EditableTypeInterface {
    const params = { canEditableCalendarOnStage };
    const flags: Partial<EditableTypeInterface> = this.access ? this.getFlagsByAccess(params) : {};

    return {
      isManagerEditable: false,
      isFirstApprovalEditable: false,
      isSecondApprovalEditable: false,
      isCalendarEditable: false,
      ...flags
    };
  }

  private getFlagsByAccess({ canEditableCalendarOnStage }): Partial<EditableTypeInterface> {
    const stageInfo = this.applicationGrantInfo;
    const flags: Partial<EditableTypeInterface> = {};
    const taskApproval = stageInfo.isTask && !stageInfo.isReworkTask;

    if (taskApproval) {
      const managerOrInitiator = stageInfo.isInitiatorStage || stageInfo.isManagerStage;
      flags.isManagerEditable = stageInfo.isInitiatorStage;
      flags.isFirstApprovalEditable = managerOrInitiator;
      flags.isSecondApprovalEditable = managerOrInitiator || stageInfo.isFirstApprovalStage;
      flags.isCalendarEditable = stageInfo.isInitiatorStage;
    } else {
      const isDraftStageByInitiator = stageInfo.isInitiatorStage || stageInfo.isReworkTask;
      flags.isManagerEditable = isDraftStageByInitiator;
      flags.isFirstApprovalEditable = isDraftStageByInitiator;
      flags.isSecondApprovalEditable = isDraftStageByInitiator;
      flags.isCalendarEditable = canEditableCalendarOnStage ? (isDraftStageByInitiator) : false;
    }

    return flags;
  }

}
