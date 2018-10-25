import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { fadeAnimation } from '../../../../../../../core/animation/fade.animation';
import { Schedule } from '../../common/schedule.class';

@Component({
  selector: 'schedule-by-id',
  templateUrl: '../schedule.component.html',
  animations: [fadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleByIdComponent extends Schedule {
  @Input() public applicationId: string;

  constructor(context: Injector) {
    super(context);
  }

  public scheduleOnInitOrUpdate() {
    this.logger.debug('[OnInit ScheduleByIdComponent], applicationId', this.applicationId);
    this.api.getApplicationById(this.applicationId)
      .subscribe((application) => this.getTaskByApplicationIdAndAssignee(application));
  }

}
