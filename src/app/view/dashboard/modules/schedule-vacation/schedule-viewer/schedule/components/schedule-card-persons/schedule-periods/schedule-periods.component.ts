import { Component, Input, OnChanges } from '@angular/core';
import { Application } from '@shared/model/application/application.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormGroupPeriodsKey } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-card-persons/schedule-periods/schedule-peridos.enum';
import { SerialDate } from '@core/utils/date/date.class';
import { Period } from '@shared/model/application/period.model';

@Component({
  selector: 'schedule-periods',
  templateUrl: './schedule-periods.component.html'
})
export class SchedulePeriodsComponent implements OnChanges {
  @Input() public application: Application;
  public initiatorForm: FormGroup;
  public readonly PeriodsKey = FormGroupPeriodsKey;

  constructor(private builder: FormBuilder) {
  }

  public ngOnChanges() {
    this.initiatorForm = this.setInitiatorForm(this.application);
  }

  private setInitiatorForm(application: Application) {
    const type = application.type.value;
    const period: Partial<Period> = application.periods[0] || {};
    const { startDate, duration, endDate } = period;

    return this.builder.group({
      [FormGroupPeriodsKey.type]: [
        { value: type, disabled: true },
        Validators.required
      ],
      [FormGroupPeriodsKey.startDate]: [
        { value: SerialDate.format(startDate), disabled: true },
        Validators.required
      ],
      [FormGroupPeriodsKey.duration]: [
        { value: duration, disabled: true },
        Validators.required
      ],
      [FormGroupPeriodsKey.endDate]: [
        { value: SerialDate.format(endDate), disabled: true },
        Validators.required
      ],
      [FormGroupPeriodsKey.createDate]: [{
        value: SerialDate.format(application.createDate),
        disabled: true
      }, Validators.required]
    });
  }

}
