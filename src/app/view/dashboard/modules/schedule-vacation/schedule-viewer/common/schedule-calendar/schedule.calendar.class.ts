import { Input } from '@angular/core';
import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import { Period } from '@shared/model/application/period.model';
import { CalendarMonthInterface } from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/schedule-calendar.interface';
import { ScheduleYearType } from '@modules/schedule-vacation/schedule-viewer/common/schedule.enum';

export class ScheduleCalendar {
  @Input() public year: number;
  @Input() public type: ScheduleYearType;
  @Input() public processStage: ProcessStage;
  @Input() public editable: boolean;
  @Input() public periods: Period[];
  @Input() public month: CalendarMonthInterface;
  @Input() public dayNames: string[];
}
