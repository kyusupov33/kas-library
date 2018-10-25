export const HUMAN_RESOURCE_DATA = {
  id: '323',
  departmentCode: '2392',
  departmentName: 'Головной офис',
  mainCuratorUserId: 'ssu',
  mainCuratorName: 'Степанов Сергей Алексеевич',
  backupCuratorUserId: 'vvyakovlev',
  backupCuratorName: 'Яковлев Владимир Владимирович'
};

export const HUMAN_RESOURCE_TRANSFORM_DATA = {
  ...HUMAN_RESOURCE_DATA,
  BACKUP_CURATOR: 'Яковлев Владимир Владимирович (vvyakovlev)',
  DEPARTMENT: 'Головной офис (2392)',
  MAIN_CURATOR: 'Степанов Сергей Алексеевич (ssu)',
  type: 'HR_ROUTE'
};

export const HUMAN_RESOURCE_USER_DATA = {
  id: '130',
  email: 'someuser@example.com',
  employeeId: '12',
  fullName: 'Сергей Степанов',
  userId: 'ssu'
};

export const HUMAN_RESOURCE_USER_TRANSFORM_DATA = {
  ...HUMAN_RESOURCE_USER_DATA,
  EMAIL: 'someuser@example.com',
  EMPLOYEE_ID: '12',
  FULL_NAME: 'Сергей Степанов',
  USER_ID: 'ssu',
  type: 'HR_USER'
};

export const ASSISTANT_DATA = {
  id: '130',
  departmentCode: '26933',
  departmentName: 'Технологическая лаборатория',
  email: 'someuser@example.com',
  employeeId: '12',
  fullName: 'Сергей Степанов',
  userId: 'ssu'
};

export const ASSISTANT_TRANSFORM_DATA = {
  ...ASSISTANT_DATA,
  DEPARTMENT_CODE: '26933',
  DEPARTMENT_NAME: 'Технологическая лаборатория',
  EMAIL: 'someuser@example.com',
  FULL_NAME: 'Сергей Степанов',
  EMPLOYEE_ID: '12',
  USER_ID: 'ssu',
  type: 'ASSISTANT'
};

export const OTHER_SETTINGS_DATA = {
  id: '10',
  key: 'E_SCHED',
  value: '28.12.2018',
  displayName: 'Окончание кампании в текущем году (в формате ДД.ММ.ГГГГ)'
};

export const OTHER_SETTINGS_TRANSFORM_DATA = {
  ...OTHER_SETTINGS_DATA,
  DISPLAY_NAME: 'Окончание кампании в текущем году (в формате ДД.ММ.ГГГГ)',
  KEY: 'E_SCHED',
  VALUE: '28.12.2018',
  type: 'OTHER_SETTINGS'
};

export const TASK_DATA_VARIABLES = [
  {
    name: 'hrBackupCurator',
    type: 'string',
    value: 'ssu',
    scope: 'global'
  },
  {
    name: 'applicationType',
    type: 'string',
    value: 'OSOE',
    scope: 'global'
  },
  {
    name: 'hr_vvyakovlev',
    type: 'string',
    value: 'Владимир Яковлев',
    scope: 'global'
  },
  {
    name: 'ui_startDate',
    type: 'string',
    value: '2018-12-10T21:00:00.000Z',
    scope: 'global'
  },
  {
    name: 'initiatorId',
    type: 'string',
    value: 'rb300081',
    scope: 'global'
  },
  {
    name: 'hr_ssu',
    type: 'string',
    value: 'Сергей Степанов',
    scope: 'global'
  },
  {
    name: 'managerId',
    type: 'string',
    value: 'rb300080',
    scope: 'global'
  },
  {
    name: 'initiatorFullName',
    type: 'string',
    value: 'Лаврентий Головченко',
    scope: 'global'
  },
  {
    name: 'initiatorPositionId',
    type: 'string',
    value: 'archis',
    scope: 'global'
  },
  {
    name: 'hrCandidates',
    type: 'string',
    value: 'vvyakovlev,ssu',
    scope: 'global'
  },
  {
    name: 'hrMainCurator',
    type: 'string',
    value: 'vvyakovlev',
    scope: 'global'
  },
  {
    name: 'currentProcessStage',
    type: 'string',
    value: 'HR_APPROVAL',
    scope: 'global'
  },
  {
    name: 'managerFullName',
    type: 'string',
    value: 'Савелий Ягода',
    scope: 'global'
  },
  {
    name: 'initiatorBranchCode',
    type: 'string',
    value: '2999',
    scope: 'global'
  },
  {
    name: 'initiatorDepartmentName',
    type: 'string',
    value: 'Подразделение 116',
    scope: 'global'
  },
  {
    name: 'initiatorPositionName',
    type: 'string',
    value: 'Архитектор ИС',
    scope: 'global'
  },
  {
    name: 'applicationCreateDate',
    type: 'string',
    value: '2018-10-01T15:34:50.769',
    scope: 'global'
  },
  {
    name: 'initiatorDepartmentCode',
    type: 'string',
    value: '116',
    scope: 'global'
  },
  {
    name: 'applicationId',
    type: 'string',
    value: '409',
    scope: 'global'
  }
];

export const TASK_TRANSFORM_DATA = {
  DEPARTMENT: 'Подразделение 116',
  FIO: 'Лаврентий Головченко',
  POSITION: 'Архитектор ИС',
  PROCESS_STAGE: 'DASHBOARD.PROCESS_STAGE.HR_APPROVAL',
  START_DATE: '11.12.2018',
  TYPE: 'DASHBOARD.APPLICATION_TYPE.OSOE'
};
