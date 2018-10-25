import { plainToClass } from 'class-transformer';
import { HumanResourceUser } from '@shared/model/table-builder/dictionary/entities/hr-user/human-resource-user.model';
import { HumanResource } from '@shared/model/table-builder/dictionary/entities/hr-route/human-resource.model';
import { Assistant } from '@shared/model/table-builder/dictionary/entities/assistant/assistant.model';
import { OtherSettings } from '@shared/model/table-builder/dictionary/entities/other-settings/other-settings.model';
import { TaskDataType } from '@shared/model/table-builder/tasks/task-data.model';
import * as MOCK from '@app/view/dashboard/shared/components/table-builder/table-builder.mocks';

describe('TEST: Correctly transform table builder content', () => {

  it('Should be correctly transform HumanResource model', async () => {
    const DICTIONARY = plainToClass(HumanResource, MOCK.HUMAN_RESOURCE_DATA);
    await expect(DICTIONARY.MAIN_CURATOR).toEqual(MOCK.HUMAN_RESOURCE_TRANSFORM_DATA.MAIN_CURATOR);
    await expect(DICTIONARY.DEPARTMENT).toEqual(MOCK.HUMAN_RESOURCE_TRANSFORM_DATA.DEPARTMENT);
    await expect(DICTIONARY.BACKUP_CURATOR).toEqual(MOCK.HUMAN_RESOURCE_TRANSFORM_DATA.BACKUP_CURATOR);
    await expect(DICTIONARY.type).toEqual(MOCK.HUMAN_RESOURCE_TRANSFORM_DATA.type);
  });

  it('Should be correctly transform HumanResourceUser model', async () => {
    const DICTIONARY = plainToClass(HumanResourceUser, MOCK.HUMAN_RESOURCE_USER_DATA);
    await expect(DICTIONARY.EMAIL).toEqual(MOCK.HUMAN_RESOURCE_USER_TRANSFORM_DATA.EMAIL);
    await expect(DICTIONARY.EMPLOYEE_ID).toEqual(MOCK.HUMAN_RESOURCE_USER_TRANSFORM_DATA.EMPLOYEE_ID);
    await expect(DICTIONARY.FULL_NAME).toEqual(MOCK.HUMAN_RESOURCE_USER_TRANSFORM_DATA.FULL_NAME);
    await expect(DICTIONARY.USER_ID).toEqual(MOCK.HUMAN_RESOURCE_USER_TRANSFORM_DATA.USER_ID);
    await expect(DICTIONARY.type).toEqual(MOCK.HUMAN_RESOURCE_USER_TRANSFORM_DATA.type);
  });

  it('Should be correctly transform Assistant model', async () => {
    const DICTIONARY = plainToClass(Assistant, MOCK.ASSISTANT_DATA);
    await expect(DICTIONARY.DEPARTMENT_CODE).toEqual(MOCK.ASSISTANT_TRANSFORM_DATA.DEPARTMENT_CODE);
    await expect(DICTIONARY.DEPARTMENT_NAME).toEqual(MOCK.ASSISTANT_TRANSFORM_DATA.DEPARTMENT_NAME);
    await expect(DICTIONARY.FULL_NAME).toEqual(MOCK.ASSISTANT_TRANSFORM_DATA.FULL_NAME);
    await expect(DICTIONARY.USER_ID).toEqual(MOCK.ASSISTANT_TRANSFORM_DATA.USER_ID);
    await expect(DICTIONARY.type).toEqual(MOCK.ASSISTANT_TRANSFORM_DATA.type);
  });

  it('Should be correctly transform OtherSettings model', async () => {
    const DICTIONARY = plainToClass(OtherSettings, MOCK.OTHER_SETTINGS_DATA);
    await expect(DICTIONARY.DISPLAY_NAME).toEqual(MOCK.OTHER_SETTINGS_TRANSFORM_DATA.DISPLAY_NAME);
    await expect(DICTIONARY.KEY).toEqual(MOCK.OTHER_SETTINGS_TRANSFORM_DATA.KEY);
    await expect(DICTIONARY.VALUE).toEqual(MOCK.OTHER_SETTINGS_TRANSFORM_DATA.VALUE);
    await expect(DICTIONARY.type).toEqual(MOCK.OTHER_SETTINGS_TRANSFORM_DATA.type);
  });

  it('Should be correctly transform TaskDataType model', async () => {
    const TASK = new TaskDataType();
    TASK.variables = MOCK.TASK_DATA_VARIABLES;
    await expect(TASK.DEPARTMENT).toEqual(MOCK.TASK_TRANSFORM_DATA.DEPARTMENT);
    await expect(TASK.FIO).toEqual(MOCK.TASK_TRANSFORM_DATA.FIO);
    await expect(TASK.POSITION).toEqual(MOCK.TASK_TRANSFORM_DATA.POSITION);
    await expect(TASK.PROCESS_STAGE).toEqual(MOCK.TASK_TRANSFORM_DATA.PROCESS_STAGE);
    await expect(TASK.START_DATE).toEqual(MOCK.TASK_TRANSFORM_DATA.START_DATE);
    await expect(TASK.TYPE).toEqual(MOCK.TASK_TRANSFORM_DATA.TYPE);
  });

});
