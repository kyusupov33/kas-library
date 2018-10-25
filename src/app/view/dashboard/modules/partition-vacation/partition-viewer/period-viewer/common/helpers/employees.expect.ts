import { ApprovableEmployees } from '@modules/partition-vacation/partition-viewer/period-viewer/common/draw-period.interface';

export const employeeExpect: ApprovableEmployees = [
  {
    employeeId: '2',
    firstName: 'Александр',
    lastName: 'Власов',
    middleName: 'Александрович',
    positionName: 'Главный Инспектор СБ',
    positionId: 'SB',
    periods: [{
      applicationId: 142,
      startDate: '2018-12-31',
      endDate: '2019-01-10',
      duration: 11,
      processStage: 'HR_DONE',
      type: 'FACT',
      approvable: false
    }]
  }, {
    employeeId: '57640',
    firstName: 'Алина',
    lastName: 'Лыкова',
    middleName: 'Владимировна',
    positionName: 'Аналитик',
    positionId: 'AN',
    periods: []
  }, {
    employeeId: '57221',
    firstName: 'Константин',
    lastName: 'Клычков',
    middleName: 'Сергеевич',
    positionName: 'РП',
    positionId: 'RP',
    periods: []
  }, {
    employeeId: '6711',
    firstName: 'Никита',
    lastName: 'Грабарник',
    middleName: 'Леонидович',
    positionName: 'none',
    positionId: 'none',
    periods: []
  }, {
    employeeId: '12',
    firstName: 'Сергей',
    lastName: 'Степанов',
    middleName: 'Алексеевич',
    positionName: 'Архитектор ИС',
    positionId: 'archis',
    periods: [{
      applicationId: 142,
      startDate: '2018-03-05',
      endDate: '2018-03-07',
      duration: 3,
      processStage: 'HR_DONE',
      type: 'FACT',
      approvable: false
    }, {
      applicationId: 164,
      startDate: '2018-01-01',
      endDate: '2018-01-14',
      duration: 14,
      processStage: 'HR_DONE',
      type: 'FACT',
      approvable: false
    }, {
      applicationId: 167,
      startDate: '2018-08-06',
      endDate: '2018-08-19',
      duration: 14,
      processStage: 'MANAGER_APPROVAL',
      type: 'CORR',
      approvable: false
    }]
  }, {
    employeeId: '290593',
    firstName: 'Владимир',
    lastName: 'Яковлев',
    middleName: 'Владимирович',
    positionName: 'Архитектор ИС',
    positionId: 'archis',
    periods: []
  }, {
    employeeId: '940304',
    firstName: 'Свиридов',
    lastName: 'Андрей',
    middleName: 'Дмитриевич',
    positionName: 'Архитектор ИС',
    positionId: 'archis',
    periods: []
  }
];
