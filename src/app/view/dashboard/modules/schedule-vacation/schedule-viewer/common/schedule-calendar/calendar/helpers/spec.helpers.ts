import { Period } from '@shared/model/application/period.model';
import { SerialDate } from '@core/utils/date/date.class';
import {
  CalendarDayInterface,
  CalendarMonthInterface,
  CalendarVacationMap,
  VacationType
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/schedule-calendar.interface';
import { DatePipe } from '@angular/common';

export const year2018 = 2018;
export const monthsTitles = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
];

export enum MONTH {
  JANUARY = 0,
  FEBRUARY = 1,
  MARCH = 2
}

function createDaysDTO(vacation: CalendarVacationMap, year: number, positionMonth: number): CalendarDayInterface[] {
  const days: CalendarDayInterface[] = [];
  const month = new Date(year, positionMonth);
  const daysInMonth: number = SerialDate.daysInMonth(month);

  for (let day = 1; day <= daysInMonth; day++) {
    const value = new Date(year, positionMonth, day);
    const valueByString = new DatePipe('en-US').transform(value, 'dd.MM.yyyy');
    const isDayOf = SerialDate.isDayOf(value);
    const vacationType: Partial<VacationType> = vacation[day] || {};
    const marked = Object.keys(vacationType).length > 0;
    const periodOfDay: Partial<Period> = vacationType.type ? vacationType.period : {};
    const editable = !!periodOfDay.editable;
    days.push({ dayNumber: day, value, valueByString, isDayOf, marked, editable });

  }

  return days;
}

function createVacationTypeDTO(from, to, type, duration, startDate, endDate): CalendarVacationMap {
  const vacation: CalendarVacationMap = {};
  for (let i = from; i <= to; i++) {
    // @examples
    // 1: {
    //      type: 'default',
    //      period: {
    //        id: null,
    //        duration: 14,
    //        editable: true,
    //        startDate: '2017-12-31T21:00:00.000Z',
    //        endDate: '2018-01-13T21:00:00.000Z',
    //        approvable: false,
    //        processStage: null,
    //      }
    // }
    vacation[i] = {
      type, period: {
        id: null,
        duration,
        editable: true,
        startDate,
        endDate,
        applicationId: null,
        applicationType: null,
        approved: false,
        processStage: null
      }
    };
  }
  return vacation;
}

/****** TEST - 3 ****/

/**
 * @return [
 *    {
 *      id: null,
 *      duration: 14,
 *      editable: true,
 *      startDate: Mon Jan 01 2018 00:00:00 GMT+0300 (Саудовская Аравия, стандартное время),
 *      endDate: Sun Jan 14 2018 00:00:00 GMT+0300 (Саудовская Аравия, стандартное время)
 *    }
 * ]
 * @type {Period[]}
 */
export const ExpectedPeriodOfJanuary: Period[] = [
  {
    id: null,
    duration: 14,
    editable: true,
    approved: false,
    processStage: null,
    applicationId: null,
    applicationType: null,
    startDate: new Date(year2018, MONTH.JANUARY, 1),
    endDate: new Date(year2018, MONTH.JANUARY, 14)
  }
];

const vacationJanuaryTest1 = createVacationTypeDTO(
  1,
  14,
  null,
  14,
  new Date(year2018, MONTH.JANUARY, 1),
  new Date(year2018, MONTH.JANUARY, 14)
);

export const ExpectedJanuary: CalendarMonthInterface = {
  daysInMonth: 31,
  value: new Date(year2018, MONTH.JANUARY, 1),
  nameMonth: 'Январь',
  microTime: 1514754000000,
  currentYear: 2018,
  days: createDaysDTO(vacationJanuaryTest1, year2018, MONTH.JANUARY),
  vacation: vacationJanuaryTest1
};

/****** TEST - 3 ****/

export const ExpectedPeriodJanToMarch: Period[] = [
  {
    id: null,
    duration: 70,
    editable: true,
    approved: false,
    processStage: null,
    applicationId: null,
    applicationType: null,
    startDate: new Date(year2018, MONTH.JANUARY, 1),
    endDate: new Date(year2018, MONTH.MARCH, 11)
  }
];

const vacationJanuaryTest3 = createVacationTypeDTO(
  1,
  31,
  null,
  70,
  new Date(year2018, MONTH.JANUARY, 1),
  new Date(year2018, MONTH.MARCH, 11)
);

const vacationFebruaryTest3 = createVacationTypeDTO(
  1,
  28,
  null,
  70,
  new Date(year2018, MONTH.JANUARY, 1),
  new Date(year2018, MONTH.MARCH, 11)
);

const vacationMarchTest3 = createVacationTypeDTO(
  1,
  11,
  null,
  70,
  new Date(year2018, MONTH.JANUARY, 1),
  new Date(year2018, MONTH.MARCH, 11)
);

export const ExpectedJanuaryByJanToMarch = {
  daysInMonth: 31,
  value: new Date(year2018, MONTH.JANUARY, 1),
  nameMonth: 'Январь',
  microTime: new Date(year2018, MONTH.JANUARY, 1).getTime(),
  currentYear: 2018,
  days: createDaysDTO(vacationJanuaryTest3, year2018, MONTH.JANUARY),
  vacation: vacationJanuaryTest3
};

export const ExpectedFebruaryByJanToMarch = {
  daysInMonth: 28,
  value: new Date(year2018, MONTH.FEBRUARY, 1),
  nameMonth: 'Февраль',
  microTime: new Date(year2018, MONTH.FEBRUARY, 1).getTime(),
  currentYear: 2018,
  days: createDaysDTO(vacationFebruaryTest3, year2018, MONTH.FEBRUARY),
  vacation: vacationFebruaryTest3
};

export const ExpectedMarchByJanToMarch = {
  daysInMonth: 31,
  value: new Date(year2018, MONTH.MARCH, 1),
  nameMonth: 'Март',
  microTime: new Date(year2018, MONTH.MARCH, 1).getTime(),
  currentYear: 2018,
  days: createDaysDTO(vacationMarchTest3, year2018, MONTH.MARCH),
  vacation: vacationMarchTest3
};
