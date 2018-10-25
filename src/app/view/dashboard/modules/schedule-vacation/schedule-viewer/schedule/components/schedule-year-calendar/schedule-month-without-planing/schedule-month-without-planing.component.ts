import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarDialogFormKeys, DataDialogTransfer } from '../schedule-month-dialog/schedule-month-dialog.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Application } from '@shared/model/application/application.model';
import { LoggerService } from '@core/services/logger/logger.service';
import { Store } from '@ngxs/store';
import { ScheduleState } from '@store/dashboard/states/schedule/schedule.state';
import { Period } from '@shared/model/application/period.model';
import { classToClass, plainToClass } from 'class-transformer';
import { fadeAnimation } from '@core/animation/fade.animation';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';
import {
  ApplicationTypesState,
  ApplicationTypesStateModel
} from '@store/dashboard/states/application-types/application-types.state';
import { ActivitiRegistryService } from '@app/view/dashboard/shared/services/activiti-registry/activiti-registry.service';
import { DateValidators } from '@core/utils/date/date-validator.class';
import { CalendarValidators } from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/calendar/calendar-validators.class';

@Component({
  selector: 'schedule-month-without-planing',
  templateUrl: './schedule-month-without-planing.component.html',
  styleUrls: ['./schedule-month-without-planing.component.scss'],
  animations: [fadeAnimation]
})
export class ScheduleMonthWithoutPlaningComponent {

  public myForm: FormGroup;
  public types: APPLICATION_TYPE[] = [];
  public variables: ApplicationTypesStateModel;
  public selected: APPLICATION_TYPE;
  private readonly application: Application;

  constructor(public dialogRef: MatDialogRef<ScheduleMonthWithoutPlaningComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DataDialogTransfer,
              private activitiRegistry: ActivitiRegistryService,
              private logger: LoggerService,
              private store: Store) {
    const application = this.application = this.store.selectSnapshot(ScheduleState.getApplication);
    this.variables = classToClass(this.store.selectSnapshot(ApplicationTypesState.getState));
    this.logger.trace.group('Dialog info').pipe(
      ({ trace }) => trace(`Application`, this.application),
      ({ trace }) => trace(`planningDays: ${application.availableDays}`),
      ({ trace }) => trace(`totalDuration: ${application.totalDuration}`)
    ).closeAll();
  }

  public get isCrossed() {
    return this.myForm.errors && this.myForm.errors['cross'];
  }

  public get form() {
    return this.myForm.controls;
  }

  public get mismatchYear(): boolean {
    return this.myForm.errors && this.myForm.errors['mismatchYear'];
  }

  private static setDuration(currentDate, days: number) {
    const value = currentDate ? currentDate.valueOf() : null;
    const date = new Date(value);
    date.setDate(date.getDate() + days - 1);
    return date;
  }

  private static setFormGroup(data: DataDialogTransfer, startDateValue, duration: number, endDateValue, type) {
    const existVacation = !!data.dayInfo;
    const periods = data.periods;

    const startState = { value: startDateValue, disabled: existVacation };
    const durationState = { value: duration, disabled: existVacation };
    const endState = { value: endDateValue, disabled: false };

    return new FormGroup({
      [CalendarDialogFormKeys.startDate]: new FormControl(startState, Validators.required),
      [CalendarDialogFormKeys.duration]: new FormControl(durationState, Validators.required),
      [CalendarDialogFormKeys.endDate]: new FormControl(endState, Validators.required)
    }, this.getValidators(type, periods));

  }

  private static getValidators(type: APPLICATION_TYPE, periods) {
    const uniqueWithoutPlan = [APPLICATION_TYPE.OSOE, APPLICATION_TYPE.OSNP].includes(type);
    return uniqueWithoutPlan ? {
      validators: Validators.compose([
        DateValidators.dateLessThan(
          CalendarDialogFormKeys.startDate,
          CalendarDialogFormKeys.endDate,
          { mismatchYear: true }
        ),
        CalendarValidators.cross(
          CalendarDialogFormKeys.startDate,
          CalendarDialogFormKeys.endDate,
          periods,
          { cross: true }
        )
      ])
    } : {};
  }

  public updateValidators() {
    this.initialize();
  }

  public ngOnInit() {
    this.initialize();

    if (this.application.isCanWithoutPlan) {
      this.types.push(APPLICATION_TYPE.OSOE);
      this.types.push(APPLICATION_TYPE.STUD);
    }

    if (this.application.isCanWithoutPlanOSNP) {
      this.types.push(APPLICATION_TYPE.OSNP);
    }

  }

  public valueChanges(): void {
    this.myForm.get(CalendarDialogFormKeys.duration).valueChanges.subscribe((value) => {
      const startDateValue: Date = this.myForm.get(CalendarDialogFormKeys.startDate).value;
      const endDateValue: Date = ScheduleMonthWithoutPlaningComponent
        .setDuration(startDateValue, parseFloat(value));
      this.myForm.get(CalendarDialogFormKeys.endDate).patchValue(endDateValue, { emitEvent: false });
    });

    this.myForm.get(CalendarDialogFormKeys.startDate).valueChanges.subscribe((value) => {
      const endDate: Date = this.myForm.get(CalendarDialogFormKeys.endDate).value;
      const timeDiff = Math.abs(endDate.getTime() - value.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      this.myForm.get(CalendarDialogFormKeys.duration).patchValue(diffDays, { emitEvent: false });
    });

    this.myForm.get(CalendarDialogFormKeys.endDate).valueChanges.subscribe((value) => {
      const startDateValue: Date = this.myForm.get(CalendarDialogFormKeys.startDate).value;
      const timeDiff = Math.abs(value.getTime() - startDateValue.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      this.myForm.get(CalendarDialogFormKeys.duration).patchValue(diffDays, { emitEvent: false });
    });
  }

  public add() {
    const period = plainToClass(Period, this.getFormData());
    this.dialogRef.close();
    this.activitiRegistry.createWithoutPlan(this.selected, period);
  }

  public cancel() {
    this.dialogRef.close();
  }

  private initialize() {
    const { day, dayInfo } = this.data;
    const period = dayInfo ? dayInfo.period : new Period();
    const startDateValue = period.startDate || day.value;
    const endDateValue = period.endDate || ScheduleMonthWithoutPlaningComponent.setDuration(startDateValue, 14);
    this.myForm = ScheduleMonthWithoutPlaningComponent
      .setFormGroup(this.data, startDateValue, 14, endDateValue, this.selected);
    this.valueChanges();
  }

  private getFormData(): Partial<Period> {
    return {
      editable: true,
      startDate: this.getValue<Date>('startDate'),
      duration: this.getValue<number>('duration'),
      endDate: this.getValue<Date>('endDate')
    };
  }

  private getValue<T>(path: string): T {
    return this.myForm.get(path).value as T;
  }

}
