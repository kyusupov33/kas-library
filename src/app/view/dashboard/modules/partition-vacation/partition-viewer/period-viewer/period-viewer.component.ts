import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeSimple } from '@shared/model/person/employee-simple.model';
import { SerialDate } from '@core/utils/date/date.class';
import { Router } from '@angular/router';
import { GridApprovableLine } from '@modules/partition-vacation/partition-viewer/period-viewer/common/draw-period.interface';
import { ApprovablePeriod } from '@modules/partition-vacation/partition-vacation.interface';
import { ScheduleRouterKeys } from '@modules/schedule-vacation/schedule-vacation-routes.enum';
import { DashboardRoutesPagePath } from '@app/view/dashboard/dashboard-routes.enum';
import { DrawPeriodService } from '@modules/partition-vacation/partition-viewer/period-viewer/common/draw-period.service';

@Component({
  selector: 'period-viewer',
  templateUrl: './period-viewer.component.html',
  styleUrls: ['./period-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeriodViewerComponent {

  @HostBinding('style.width') public parentWidth;
  @HostBinding('style.top') public top;
  @HostBinding('style.height') public height;

  @Input() public showTitles: boolean;
  @Input() public year: number;
  @Input() public monthCount = 12;
  @Input() public employees: EmployeeSimple[] = [];

  public fullCalendar: boolean;
  public months: string[] = [];
  public gridVerticalLineMonth: GridApprovableLine[] = [];
  public gridVerticalDays: Array<GridApprovableLine<number>> = [];
  public gridPeriodLine: GridApprovableLine[][] = [];
  public daysInYear: number;

  constructor(private translate: TranslateService,
              private router: Router,
              private drawer: DrawPeriodService) {
    this.months = this.translate.instant('DASHBOARD.CALENDAR.MONTHS');
  }

  @Input()
  public set indeterminate(fullCalendar: boolean) {
    this.fullCalendar = fullCalendar;
    this.generateWidthLane(this.fullCalendar, this.year);
  }

  public ngOnInit() {
    this.daysInYear = SerialDate.dayOfYear(this.year);
    this.generateWidthLane(this.fullCalendar, this.year);
    this.gridVerticalLineMonth = this.drawer.generateGridByMonths(this.year);
    this.gridVerticalDays = this.drawer.generateGridByDaysInYear<number>(this.year);
    this.gridPeriodLine = this.drawer.generatePeriodLineByPeriods(this.year, this.employees);
  }

  private generateWidthLane(fullCalendar: boolean, year: number) {
    const opts = { fullCalendar, year };
    this.parentWidth = this.drawer.generateWidthLane(opts);
  }

  public action(period: ApprovablePeriod) {
    if (period.approvable) {
      this.router.navigate([
        '/', DashboardRoutesPagePath.SCHEDULE_VACATION,
        ScheduleRouterKeys.APPLICATION_ID,
        period.applicationId
      ]).then();
    }
  }

}
