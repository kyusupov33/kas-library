import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import {
  ApprovableEmployees,
  DrawPeriodConfigInterface,
  GridApprovableLine,
  GridLineInterface
} from '@modules/partition-vacation/partition-viewer/period-viewer/common/draw-period.interface';
import { SerialDate } from '@core/utils/date/date.class';
import { ApprovablePeriod } from '@modules/partition-vacation/partition-vacation.interface';
import { PartitionPeriodDate } from '@modules/partition-vacation/partition-viewer/partition/common/partition-period-date.class';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DrawPeriodService {

  public readonly config: DrawPeriodConfigInterface = {
    dayPx: '25px',
    borderRightWidth: '1px',
    monthCount: 12,
    maxZIndex: 2,
    minZIndex: 1
  };

  constructor(private sanitizer: DomSanitizer, private translate: TranslateService) {
  }

  public generateWidthLane({ fullCalendar, year }): SafeStyle | null {
    if (year) {
      const daysInYear = SerialDate.dayOfYear(year);
      const css = !fullCalendar ? '100%' : `calc(${daysInYear} * ${this.config.dayPx})`;
      return this.getSecurityTrustStyle(css);
    }

    return null;
  }

  public generateGridByMonths(year: number): GridApprovableLine[] {
    const daysInYear = SerialDate.dayOfYear(year);
    const monthCount = this.config.monthCount;

    const grid: GridLineInterface[] = [];
    let offset = 0;

    for (let positionMonth = 0; positionMonth < monthCount; positionMonth++) {
      const date = new Date(year, positionMonth);
      const daysInMonth = SerialDate.daysInMonth(date);
      const widthByFixed = (100 * daysInMonth) / daysInYear;
      const css = `calc(${widthByFixed}% - ${this.config.borderRightWidth})`;
      const width = this.getSecurityTrustStyle(css);
      const offsetLeft = `${offset}%`;

      grid.push({ width, offsetLeft, zIndex: 0, data: null, tooltip: null });
      offset += widthByFixed;
    }

    return grid;
  }

  public generateGridByDaysInYear<T>(year: number): Array<GridApprovableLine<T>> {
    const monthCount = this.config.monthCount;
    const daysInYear = SerialDate.dayOfYear(year);
    const dayWidth = (100) / daysInYear;
    const gridDays: GridLineInterface[] = [];
    let currentDay = 0;

    for (let positionMonth = 0; positionMonth < monthCount; positionMonth++) {
      const date = new Date(year, positionMonth);
      const daysInMonth = SerialDate.daysInMonth(date);
      for (let day = 1; day <= daysInMonth; day++) {
        const width = `${dayWidth}%`;
        const data: number = day;
        const css = `calc(${currentDay * dayWidth}% - ${this.config.borderRightWidth})`;
        const offsetLeft = this.getSecurityTrustStyle(css);
        currentDay++;
        gridDays.push({ width, offsetLeft, zIndex: 3, data, tooltip: null });
      }
    }

    return gridDays;
  }

  public generatePeriodLineByPeriods(year: number, employees: ApprovableEmployees): GridApprovableLine[][] {
    const drawLine: GridLineInterface[][] = [];
    const daysInYear = SerialDate.dayOfYear(year);

    employees.forEach((employee) => {
      const periods = employee.periods;
      const line: GridLineInterface[] = [];

      periods.forEach((period: ApprovablePeriod) => {
        const days = PartitionPeriodDate.getOffsetStartYearToCurrentDay(period.startDate);
        const offset = (100 * days) / daysInYear;
        const isNextYear = new Date(period.endDate).getFullYear() > year;
        const isPreviousYear = new Date(period.endDate).getFullYear() < year;
        let delta = period.duration;

        if (isNextYear) {
          const start = new Date(period.startDate).getTime();
          const end = new Date(year, 11, 31).getTime();
          delta = Math.abs(SerialDate.deltaByDays(start, end)) + 1;
        } else if (isPreviousYear) {
          const start = new Date(year, 0, 1).getTime();
          const end = new Date(period.endDate).getTime();
          delta = Math.abs(SerialDate.deltaByDays(start, end)) + 1;
        }

        const css = `calc(${(100 * delta) / daysInYear}% - ${this.config.borderRightWidth})`;
        const width = this.getSecurityTrustStyle(css);
        const offsetLeft = `${offset}%`;
        const zIndex = this.getZIndexByPeriod(period);

        line.push({ width, offsetLeft, zIndex, data: period, tooltip: this.getTooltip(period) });
      });

      drawLine.push(line);

    });

    return drawLine;
  }

  private getTooltip(period: ApprovablePeriod): string {
    const { startDate, endDate, processStage, type, approvable } = period;
    const typeKey = `DASHBOARD.APPLICATION_TYPE.${type}`;
    const approveKey = 'DASHBOARD.DEPARTMENT.PERIOD_FOR_APPROVE';
    const stageKey = `DASHBOARD.PROCESS_STAGE.${processStage}`;
    const from  = this.translate.instant('DASHBOARD.PARTITION_DIALOG.DATE_FROM');
    const next  = this.translate.instant('DASHBOARD.PARTITION_DIALOG.DATE_NEXT');
    const status  = this.translate.instant('DASHBOARD.PARTITION_DIALOG.DATE_STATUS');
    const approvableText = this.translate.instant(approveKey).toLocaleLowerCase();
    const statusPeriod = this.translate.instant(stageKey).toLocaleLowerCase();
    const typePeriod = this.translate.instant(typeKey);
    const actionText = approvable ? `(${approvableText})` : '';
    return `${typePeriod} ${from} ${startDate} ${next} ${endDate} ${status} ${statusPeriod} ${actionText}`;
  }

  private getZIndexByPeriod(period: ApprovablePeriod) {
    return period.type !== APPLICATION_TYPE.CORR && period.type !== APPLICATION_TYPE.SCHED
      ? this.config.maxZIndex : this.config.minZIndex;
  }

  private getSecurityTrustStyle(value: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(value);
  }

}
