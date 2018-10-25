import { Application } from '@shared/model/application/application.model';
import { Period } from '@shared/model/application/period.model';

export const MockLogger: any = {
  trace: () => {
  }
};

export const CurrentYear = new Date().getFullYear();
export const NextYear = CurrentYear + 1;

export const TestUsers = {
  user: {
    branchCode: '2999',
    departmentId: 119,
    departmentName: 'Подразделение 119',
    email: 'vvyakovlev@cinimex.ru',
    employeeId: '300099',
    firstName: 'Максимильян',
    fullName: 'Афонин Максимильян Евгениевич',
    id: undefined,
    valid: () => true,
    lastName: 'Афонин',
    middleName: 'Евгениевич',
    positionId: 'archis',
    positionName: 'Архитектор ИС',
    userId: 'rb300099'
  },
  manager: {
    branchCode: '2999',
    departmentId: 119,
    departmentName: 'Подразделение 119',
    email: 'vvyakovlev@cinimex.ru',
    employeeId: '300095',
    firstName: 'Макар',
    fullName: 'Мельников Макар Казимирович',
    id: undefined,
    valid: () => true,
    lastName: 'Мельников',
    middleName: 'Казимирович',
    positionId: 'archis',
    positionName: 'Архитектор ИС',
    userId: 'rb300095'
  },
  firstApproval: {
    branchCode: '2999',
    departmentId: 4,
    departmentName: 'Департамент разработки ПО',
    email: 'vvyakovlev@cinimex.ru',
    employeeId: '290593',
    firstName: 'Владимир',
    fullName: 'Яковлев Владимир Владимирович',
    id: undefined,
    valid: () => true,
    lastName: 'Яковлев',
    middleName: 'Владимирович',
    positionId: 'archis',
    positionName: 'Архитектор ИС',
    userId: 'vvyakovlev'
  },
  secondApproval: {
    branchCode: '2999',
    departmentId: 1,
    departmentName: 'ДФУ',
    email: 'ridiyatulov@cinimex.ru',
    employeeId: '1001',
    firstName: 'Расул',
    fullName: 'Идиятулов Расул Юсуфович',
    id: undefined,
    valid: () => true,
    lastName: 'Идиятулов',
    middleName: 'Юсуфович',
    positionId: 'SB',
    positionName: 'Инспектор СБ',
    userId: 'ridiyatulov'
  }
};

export const InitiatorPeriodsInCurrentYear = [
  new Period({
    startDate: new Date(CurrentYear, 0, 1),
    endDate: new Date(CurrentYear, 0, 7),
    duration: 7
  }),
  new Period({
    startDate: new Date(CurrentYear, 0, 7),
    endDate: new Date(CurrentYear, 0, 14),
    duration: 7
  }),
  new Period({
    startDate: new Date(CurrentYear, 1, 1),
    endDate: new Date(CurrentYear, 1, 7),
    duration: 7
  }),
  new Period({
    startDate: new Date(CurrentYear, 1, 7),
    endDate: new Date(CurrentYear, 1, 14),
    duration: 7
  }),
  new Period({
    startDate: new Date(CurrentYear, 2, 1),
    endDate: new Date(CurrentYear, 2, 3),
    duration: 3
  })
];

export const InitiatorPeriodsInNextYear = [
  new Period({
    startDate: new Date(NextYear, 0, 1),
    endDate: new Date(NextYear, 0, 7),
    duration: 7
  }),
  new Period({
    startDate: new Date(NextYear, 0, 7),
    endDate: new Date(NextYear, 0, 14),
    duration: 7
  }),
  new Period({
    startDate: new Date(NextYear, 1, 1),
    endDate: new Date(NextYear, 1, 7),
    duration: 7
  }),
  new Period({
    startDate: new Date(NextYear, 1, 7),
    endDate: new Date(NextYear, 1, 14),
    duration: 7
  }),
  new Period({
    startDate: new Date(NextYear, 2, 1),
    endDate: new Date(NextYear, 2, 3),
    duration: 3
  })
];

export const application = new Application(CurrentYear);

application.availableDays = 31;
application.initiator = TestUsers.user;
application.manager = TestUsers.manager;
application.firstApprover = TestUsers.firstApproval;
application.secondApprover = TestUsers.secondApproval;
