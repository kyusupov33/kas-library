import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { fadeAnimation } from '@core/animation/fade.animation';
import { SerialDate } from '@core/utils/date/date.class';
import { ScheduleYearType } from '@modules/schedule-vacation/schedule-viewer/common/schedule.enum';
import { Schedule } from '@modules/schedule-vacation/schedule-viewer/common/schedule.class';
import { Application } from '@shared/model/application/application.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'schedule-by-plan',
  templateUrl: '../schedule.component.html',
  animations: [fadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleByPlanTypeComponent extends Schedule {

  public scheduleIsPlan: boolean = true;
  private yearType: ScheduleYearType;

  constructor(context: Injector) {
    super(context);
  }

  public scheduleOnInitOrUpdate() {
    this.yearType = this.setTypeByYear();
    this.logger.debug('[OnInit ScheduleByYearTypeComponent], yearType', this.yearType);
    this.api.getApplicationByScheduleYearType(this.yearType, this.userId).pipe(
      switchMap(async (application: Application | null) => await this.applicationSeal(application)),
      switchMap(async (application: Application | null) => await this.setCreateDateLocal(application)),
      switchMap(async (application: Application) => await this.checkAvailableDays(application))
    ).subscribe((application: Application) => this.getTaskByApplicationIdAndAssignee(application));
  }

  private setTypeByYear() {
    const yearType = SerialDate.getYearType(Number(this.year));
    return ScheduleYearType[yearType];
  }

  private setCreateDateLocal(application: Application) {
    application.createDateLocal = SerialDate.toString();
    return application;
  }

  private applicationSeal(application: Application | null): Application {
    return application || new Application(parseFloat(this.year));
  }

  private async checkAvailableDays(application: Application): Promise<Application> {
    const emptyAvailableDays = !application.availableDays;
    if (emptyAvailableDays) {
      const year = String(this.year || application.year);
      application.availableDays = await this.api.getAvailableDays(this.user.employeeId, year)
        .toPromise();
    }

    return await application;
  }

}
