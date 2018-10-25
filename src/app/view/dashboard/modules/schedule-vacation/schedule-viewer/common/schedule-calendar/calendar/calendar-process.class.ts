import { SerialDate } from '@core/utils/date/date.class';
import { Period } from '@shared/model/application/period.model';
import {
  CalendarDayInterface,
  CalendarMonthInterface,
  CalendarVacationMap,
  MonthParamsInterface,
  VacationType
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/schedule-calendar.interface';
import { DatePipe } from '@angular/common';

export class CalendarProcessor {

  public static setDays(monthDate: Date, vacation: CalendarVacationMap): CalendarDayInterface[] {
    const daysInMonth: number = SerialDate.daysInMonth(monthDate);
    const days: CalendarDayInterface[] = [];

    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
      const value = SerialDate.getDateByDay(monthDate, dayNumber);
      const valueByString = new DatePipe('en-US').transform(value, 'dd.MM.yyyy');
      const isDayOf = SerialDate.isDayOf(value);
      const vacationType: Partial<VacationType> = vacation[dayNumber] || {};
      const marked = Object.keys(vacationType).length > 0;
      const periodOfDay: Partial<Period> = vacationType.type ? vacationType.period : {};
      const editable = !!periodOfDay.editable;
      days.push({ dayNumber, value, valueByString, isDayOf, marked, editable });
    }

    return days;
  }

  public static setMonthList({ year, monthsTitles, periods }: MonthParamsInterface) {
    const dateByMonths: CalendarMonthInterface[] = [];

    for (let positionMonth = 0; positionMonth < 12; positionMonth++) {
      const monthDate: Date = new Date(year, positionMonth, 1);
      const nameMonth: string = monthsTitles[positionMonth];
      const microTime: number = monthDate.getTime();
      const daysInMonth: number = SerialDate.daysInMonth(monthDate);
      const currentYear: number = monthDate.getFullYear();
      const vacation: CalendarVacationMap = CalendarProcessor.fillVacationByMonth(positionMonth, year, periods);
      const days: CalendarDayInterface[] = CalendarProcessor.setDays(monthDate, vacation);
      dateByMonths.push({ daysInMonth, value: monthDate, nameMonth, microTime, currentYear, days, vacation });
    }

    return dateByMonths;
  }

  public static fillVacationByMonth(positionMonth: number, year: number, periods: Period[]): CalendarVacationMap {
    const vacation: CalendarVacationMap = {};

    periods.forEach((period) => {
      const type = period.applicationType ? period.applicationType.code : null;
      const markVacationType = { type, period };
      const firstDate = new Date(year, 0, 1);
      const startDateFromPeriod: Date = new Date(period.startDate as string);
      const startDate: Date = startDateFromPeriod < firstDate ? firstDate : startDateFromPeriod;
      const lastDate = new Date(year, 11, 31);
      const endDateFromPeriod = new Date(period.endDate as string);
      const endDate: Date = endDateFromPeriod > lastDate ? lastDate : endDateFromPeriod;

      if (startDate.getMonth() === positionMonth) {
        const lastEndDay = endDate.getDate();
        const lastDayInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
        const firstDay = startDate.getDate();
        const lastDay = (endDate.getMonth() > startDate.getMonth()) ? lastDayInMonth : lastEndDay;

        for (let day = firstDay; day <= lastDay; day++) {
          vacation[day] = markVacationType;
        }

      } else if (endDate.getMonth() === positionMonth) {
        const firstDayInMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1).getDate();
        const lastEndDay = endDate.getDate();
        for (let day = firstDayInMonth; day <= lastEndDay; day++) {
          vacation[day] = markVacationType;
        }
      } else if (positionMonth > startDate.getMonth() && positionMonth < endDate.getMonth()) {
        const date = new Date(year, positionMonth);
        const countDay = SerialDate.daysInMonth(date);
        for (let day = 1; day <= countDay; day++) {
          vacation[day] = markVacationType;
        }
      }

    });

    return vacation;
  }

}
