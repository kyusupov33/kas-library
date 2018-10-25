import * as Helpers from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/helpers/spec.helper';
import { ApplicationGrantSched } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-sched.class';
import { ACTION_TYPE } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import { ApplicationType } from '@shared/model/application/application-type.model';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';
import { classToClass } from 'class-transformer';

describe('[TEST]: ApplicationType -> SCHED', () => {

  beforeEach(() => Helpers.application.type = new ApplicationType(APPLICATION_TYPE.SCHED));

  it('Should be failure validation when empty periods', () => {
    const userId = Helpers.TestUsers.user.userId;
    const options = { application: Helpers.application, isTask: false, userId };
    const builder = new ApplicationGrantSched(options);
    expect(builder.approveValidator(Helpers.application)).toEqual(false);
  });

  it('Should be success validation in current year when filled periods', () => {
    const userId = Helpers.TestUsers.user.userId;
    const options = { application: Helpers.application, isTask: false, userId };
    const builder = new ApplicationGrantSched(options);

    const fillApplication = classToClass(Helpers.application);
    fillApplication.year = Helpers.CurrentYear;
    fillApplication.periods = Helpers.InitiatorPeriodsInCurrentYear;

    expect(builder.approveValidator(fillApplication)).toEqual(true);
  });

  it('Should be failure validation in next year when no period less than 14 days', () => {
    const userId = Helpers.TestUsers.user.userId;
    const options = { application: Helpers.application, isTask: false, userId };
    const builder = new ApplicationGrantSched(options);

    const fillApplication = classToClass(Helpers.application);
    fillApplication.year = Helpers.NextYear;
    fillApplication.periods = Helpers.InitiatorPeriodsInNextYear;

    expect(builder.approveValidator(fillApplication)).toEqual(false);
  });

  it('Should be correct processStage equals DRAFT or null when open initiator(rb300099)', () => {
    const userId = Helpers.TestUsers.user.userId;
    const options = { application: Helpers.application, isTask: false, userId };
    const builder = new ApplicationGrantSched(options);

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
    const builder = new ApplicationGrantSched(options);

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
    const builder = new ApplicationGrantSched(options);
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
    const builder = new ApplicationGrantSched(options);
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
    const builder = new ApplicationGrantSched(options);
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
