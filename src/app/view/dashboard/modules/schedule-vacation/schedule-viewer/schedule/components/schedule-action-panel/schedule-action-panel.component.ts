import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { Application } from '@shared/model/application/application.model';
import {
  Action,
  ActionList,
  ActionResultInterface
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { ActivitiActionsPanelService } from '@app/view/dashboard/shared/services/activiti-actions-panel/activiti-actions-panel.service';
import { SerialDate } from '@core/utils/date/date.class';

@Component({
  selector: 'schedule-action-panel',
  templateUrl: './schedule-action-panel.component.html',
  styleUrls: ['./schedule-action-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ScheduleActionPanelComponent implements OnChanges {

  @Input() public application: Application;
  @Input() public totalDuration: number;
  @Input() public actionList: ActionList;
  @Output() public onAction: EventEmitter<ActionResultInterface> = new EventEmitter();

  public yearTypeTitle: string;

  constructor(private actionPanel: ActivitiActionsPanelService) {
  }

  public invokeByAction(action: Partial<Action>) {
    if (action.isModal) {
      this.openModal(action);
    } else {
      this.onAction.emit({ name: action.type, comment: null });
    }
  }

  public ngOnChanges() {
    this.yearTypeTitle = SerialDate.getYearType(this.application.year);
    this.everyInvokeValidation();
  }

  public openModal(action: Partial<Action>) {
    this.actionPanel.openModal(action, null, (data) => this.onAction.emit(data));
  }

  public everyInvokeValidation() {
    const actionList = this.actionList || [];
    actionList.forEach((action: Partial<Action>) => {
      if (action.approveValidator) {
        action.invalid = !action.approveValidator(this.application);
      }
    });
  }

}
