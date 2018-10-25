import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { Params } from '@angular/router';
import { Application } from '@shared/model/application/application.model';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ScheduleState } from '@store/dashboard/states/schedule/schedule.state';
import { LoggerService } from '@core/services/logger/logger.service';
import { Viewer } from '@app/view/dashboard/modules/common/viewer.class';
import { ScheduleRouterKeys } from '@modules/schedule-vacation/schedule-vacation-routes.enum';

@Component({
  selector: 'schedule-viewer',
  templateUrl: './schedule-viewer.component.html',
  styleUrls: ['./schedule-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ScheduleViewerComponent extends Viewer {

  public canViewContent: boolean;
  public applicationId: string;
  public taskId: string;
  public year: string;
  public completedTask: boolean;

  @Select(ScheduleState.getApplication)
  public application$: Observable<Application>;

  private logger: LoggerService;

  constructor(context: Injector) {
    super(context);
    this.logger = context.get(LoggerService);
  }

  public emitRouterParams(params: Params, queryParams: Params) {
    this.taskId = params[ScheduleRouterKeys.TASK_ID];
    this.applicationId = params[ScheduleRouterKeys.APPLICATION_ID] || queryParams[ScheduleRouterKeys.APPLICATION_ID];
    this.year = params[ScheduleRouterKeys.YEAR];
    this.completedTask = queryParams[ScheduleRouterKeys.COMPLETED_TASK] === 'true';

    this.logger.debug.groupCollapsed(`[ScheduleViewerComponent router emit]`).pipe(
      ({ debug }) => debug(`applicationId ${this.applicationId}`),
      ({ debug }) => debug(`year ${this.year}`)
    ).closeAll();
  }

}
