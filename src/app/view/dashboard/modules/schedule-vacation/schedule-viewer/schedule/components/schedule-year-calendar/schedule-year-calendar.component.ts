import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from '@core/services/logger/logger.service';
import { Application } from '@shared/model/application/application.model';
import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import { CalendarMonthInterface } from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/schedule-calendar.interface';
import { CalendarProcessor } from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/calendar/calendar-process.class';
import { CalendarEvent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-year-calendar/schedule-month-viewer/schedule-month-viewer.component';
import { fadeAnimation } from '@core/animation/fade.animation';

@Component({
  selector: 'schedule-year-calendar',
  templateUrl: './schedule-year-calendar.component.html',
  styleUrls: ['./schedule-year-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeAnimation]
})
export class ScheduleYearCalendarComponent implements OnChanges {

  @Input() public application: Application;
  @Output() public dayOnClick: EventEmitter<CalendarEvent> = new EventEmitter();
  public readonly ProcessStage = ProcessStage;

  public months: string[] = [];
  public dayNames: string[] = [];
  public vacationMonths: CalendarMonthInterface[] = [];
  public Year = new Date().getFullYear();
  public isGenerated: boolean;

  constructor(private translate: TranslateService,
              private cd: ChangeDetectorRef,
              private logger: LoggerService) {
    this.months = this.translate.instant('DASHBOARD.CALENDAR.MONTHS');
    this.dayNames = this.translate.instant('DASHBOARD.CALENDAR.DAYS');
  }

  public ngOnChanges() {
    const year = this.application.year;
    const monthsTitles = this.months;
    const periods = this.application.periods;
    const params = { year, monthsTitles, periods };
    this.profileTime(() => {
      this.vacationMonths = CalendarProcessor.setMonthList(params);
      this.logger.debug.groupCollapsed('Initial Period[]').pipe(
        ({ debug }) => debug('params: ', params),
        ({ debug }) => debug(this.vacationMonths)
      ).close();
    });
  }

  private profileTime(callback) {
    const start = performance.now();
    window.requestAnimationFrame(() => {
      callback();
      const end = performance.now() - start;
      this.isGenerated = true;
      this.cd.detectChanges();
      this.logger.warn('Calendar generated is bottleneck ', end, 'ms');
    });
  }

}
