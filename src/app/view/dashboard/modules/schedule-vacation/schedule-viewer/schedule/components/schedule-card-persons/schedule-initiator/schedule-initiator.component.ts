import { Component, Input, OnChanges } from '@angular/core';
import { Application } from '@shared/model/application/application.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person } from '@shared/model/person/person.model';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';
import { ApplicationType } from '@shared/model/application/application-type.model';
import { FormGroupInitiatorKeys } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-card-persons/schedule-initiator/schedule-initiator.enum';

@Component({
  selector: 'schedule-initiator',
  templateUrl: './schedule-initiator.component.html'
})
export class ScheduleInitiatorComponent implements OnChanges {

  @Input() public user: Person;
  @Input() public application: Application;
  @Input() public showDuration: boolean = true;
  public type = APPLICATION_TYPE;
  public showPlanningDays: boolean;

  public initiatorForm: FormGroup;
  public readonly InitiatorKeys = FormGroupInitiatorKeys;

  constructor(private builder: FormBuilder) {
  }

  public ngOnChanges() {
    this.initiatorForm = this.setInitiatorForm(this.application);
    const type: ApplicationType = this.application.type || new ApplicationType();
    this.showPlanningDays = [null, APPLICATION_TYPE.CORR, APPLICATION_TYPE.SCHED].includes(type.code);
  }

  private setInitiatorForm(application: Application) {
    const initiator = application.initiator;
    return this.builder.group({
      [FormGroupInitiatorKeys.fullName]: [
        { value: initiator.fullName, disabled: true },
        Validators.required
      ],
      [FormGroupInitiatorKeys.positionName]: [
        { value: initiator.positionName, disabled: true },
        Validators.required
      ],
      [FormGroupInitiatorKeys.departmentName]: [
        { value: initiator.departmentName, disabled: true },
        Validators.required
      ]
    });
  }

}
