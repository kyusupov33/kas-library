import { Component, Input } from '@angular/core';
import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import { Application } from '@shared/model/application/application.model';

@Component({
  selector: 'schedule-stage-panel',
  templateUrl: './schedule-stage-panel.component.html',
  styleUrls: ['./schedule-stage-panel.component.scss']
})
export class ScheduleStagePanelComponent {

  @Input() public application: Application;
  @Input() public status: ProcessStage;
  public readonly ProcessStage = ProcessStage;

}
