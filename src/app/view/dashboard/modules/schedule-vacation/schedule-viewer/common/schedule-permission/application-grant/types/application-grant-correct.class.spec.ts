import * as Helpers from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/helpers/spec.helper';
import { ACTION_TYPE } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import { ApplicationGrantCorrect } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-correct.class';
import { ApplicationType } from '@shared/model/application/application-type.model';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';

describe('[TEST]: ApplicationType -> CORRECT', () => {

  beforeEach(() => Helpers.application.type = new ApplicationType(APPLICATION_TYPE.CORR));

  it('Should be correct processStage equals DRAFT or null when open initiator(rb300099)', () => {
    const userId = Helpers.TestUsers.user.userId;
    const options = { application: Helpers.application, isTask: false, userId };
    const builder = new ApplicationGrantCorrect(options);

    const buttons = builder.getButtons().map((item) => item.type);
    expect(buttons).toEqual([ACTION_TYPE.SAVE, ACTION_TYPE.SEND_FOR_APPROVAL]);

    const editableTypes = builder.getEditableFlags();
    expect(editableTypes).toEqual({
      isManagerEditable: true,
      isFirstApprovalEditable: true,
      isSecondApprovalEditable: true,
      isCalendarEditable: true
    });
  });

  it('Should be correct processStage equals MANAGER_APPROVAL when open manager(rb300095)', () => {
    Helpers.application.processStage = ProcessStage.MANAGER_APPROVAL;
    const userId = Helpers.TestUsers.manager.userId;
    const options = { application: Helpers.application, isTask: true, userId };
    const builder = new ApplicationGrantCorrect(options);

    const buttons = builder.getButtons().map((item) => item.type);
    expect(buttons).toEqual([ACTION_TYPE.REWORK, ACTION_TYPE.APPROVE]);

    const editableTypes = builder.getEditableFlags();
    expect(editableTypes).toEqual({
      isManagerEditable: false,
      isFirstApprovalEditable: true,
      isSecondApprovalEditable: true,
      isCalendarEditable: false
    });
  });

  it('Should be correct processStage equals FIRST_APPROVAL when open as firstApproval(vvyakovlev)', () => {
    Helpers.application.processStage = ProcessStage.FIRST_APPROVAL;
    const userId = Helpers.TestUsers.firstApproval.userId;
    const options = { application: Helpers.application, isTask: true, userId };
    const builder = new ApplicationGrantCorrect(options);
    const buttons = builder.getButtons().map((item) => item.type);

    expect(buttons).toEqual([ACTION_TYPE.REWORK, ACTION_TYPE.APPROVE]);

    const editableTypes = builder.getEditableFlags();
    expect(editableTypes).toEqual({
      isManagerEditable: false,
      isFirstApprovalEditable: false,
      isSecondApprovalEditable: true,
      isCalendarEditable: false
    });
  });

  it('Should be correct processStage equals SECOND_APPROVAL when open as secondApproval(ridiyatulov)', () => {
    Helpers.application.processStage = ProcessStage.SECOND_APPROVAL;
    const userId = Helpers.TestUsers.secondApproval.userId;
    const options = { application: Helpers.application, isTask: true, userId };
    const builder = new ApplicationGrantCorrect(options);
    const buttons = builder.getButtons().map((item) => item.type);

    expect(buttons).toEqual([ACTION_TYPE.REWORK, ACTION_TYPE.APPROVE]);

    const editableTypes = builder.getEditableFlags();
    expect(editableTypes).toEqual({
      isManagerEditable: false,
      isFirstApprovalEditable: false,
      isSecondApprovalEditable: false,
      isCalendarEditable: false
    });
  });

  it('Should be correct processStage equals DONE when open as initiator(rb300099)', () => {
    Helpers.application.processStage = ProcessStage.DONE;
    const userId = Helpers.TestUsers.user.userId;
    const options = { application: Helpers.application, isTask: false, userId };
    const builder = new ApplicationGrantCorrect(options);
    const buttons = builder.getButtons().map((item) => item.type);

    expect(buttons).toEqual([]);

    const editableTypes = builder.getEditableFlags();
    expect(editableTypes).toEqual({
      isManagerEditable: false,
      isFirstApprovalEditable: false,
      isSecondApprovalEditable: false,
      isCalendarEditable: false
    });
  });

});
