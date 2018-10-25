import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SerialDate } from '@core/utils/date/date.class';
import {
  CalendarDayInterface,
  CalendarMonthInterface,
  VacationType
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/schedule-calendar.interface';

type Day = CalendarDayInterface;
type Month = CalendarMonthInterface;

export interface CalendarEvent {
  day: CalendarDayInterface;
  month: CalendarMonthInterface;
  payload: VacationType;
}

@Component({
  selector: 'schedule-month-viewer',
  templateUrl: './schedule-month-viewer.component.html',
  styleUrls: ['./schedule-month-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleMonthViewerComponent implements OnInit {

  @Input() public month: CalendarMonthInterface;
  @Input() public dayNames: string[];
  @Output() public dayOnClick: EventEmitter<CalendarEvent> = new EventEmitter();

  public spacers: string[];
  public endSpacers: string[];

  constructor(public dialog: MatDialog) {
  }

  private static setSpacers(date): string[] {
    const spacer = [];
    const currentDayPosition = date.getDay() - 1;
    const position = currentDayPosition < 0 ? 7 + currentDayPosition : currentDayPosition;
    for (let i = 0; i < position; i++) {
      spacer.push('');
    }
    return spacer;
  }

  private static setEndSpacers(date): string[] {
    const endSpacers = (7 - (date.getDay() - 1 + SerialDate.daysInMonth(date)) % 7) % 7;
    const spacers = [];
    for (let i = 0; i < endSpacers; i++) {
      spacers.push('');
    }
    return spacers;
  }

  public ngOnInit() {
    const date = this.month.value;
    this.spacers = ScheduleMonthViewerComponent.setSpacers(date);
    this.endSpacers = ScheduleMonthViewerComponent.setEndSpacers(date);
  }

  public openCalendarDay(day: Day, month: Month) {
    const payload: VacationType = month.vacation[day.dayNumber] || null;
    this.dayOnClick.emit({ day, month, payload });
  }

}
