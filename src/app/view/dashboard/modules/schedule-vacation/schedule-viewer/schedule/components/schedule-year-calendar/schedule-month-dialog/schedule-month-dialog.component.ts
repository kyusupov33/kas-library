import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Period } from '@shared/model/application/period.model';
import { Store } from '@ngxs/store';
import { ObjectUtils } from '@core/utils/object/object.class';
import { DateValidators } from '@core/utils/date/date-validator.class';
import { fadeAnimation } from '@core/animation/fade.animation';
import { ScheduleState } from '@store/dashboard/states/schedule/schedule.state';
import { Application } from '@shared/model/application/application.model';
import { LoggerService } from '@core/services/logger/logger.service';
import { plainToClass } from 'class-transformer';
import { CalendarValidators } from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/calendar/calendar-validators.class';
import {
  CalendarDialogFormKeys,
  DataDialogTransfer,
  FormStructure
} from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-year-calendar/schedule-month-dialog/schedule-month-dialog.interface';
import { Emittable, Emitter } from '@ngxs-labs/emitter';

@Component({
  selector: 'schedule-month-dialog',
  templateUrl: './schedule-month-dialog.component.html',
  styleUrls: ['./schedule-month-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeAnimation]
})
export class ScheduleMonthDialogComponent implements OnInit, OnDestroy {

  @Emitter(ScheduleState.addPeriodAction)
  public scheduleStateAddPeriod: Emittable<Period[]>;

  @Emitter(ScheduleState.removePeriodAction)
  public scheduleStateRemovePeriod: Emittable<Period>;

  public myForm: FormGroup;
  public durationMax: number;
  public valueCanEdit: boolean = false;
  public canWorkOperation: boolean = true;
  private readonly minCount = 1;
  private readonly duration = 14;
  private myFormValueChanges: Subscription;
  private readonly application: Application;

  constructor(public dialogRef: MatDialogRef<ScheduleMonthDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DataDialogTransfer,
              private logger: LoggerService,
              private store: Store) {
    const application = this.application = this.store.selectSnapshot(ScheduleState.getApplication);
    this.durationMax = application.availableDays - application.totalDuration;
    this.logger.trace.group('Dialog info').pipe(
      ({ trace }) => trace(`Application`, this.application),
      ({ trace }) => trace(`planningDays: ${application.availableDays}`),
      ({ trace }) => trace(`totalDuration: ${application.totalDuration}`),
      ({ trace }) => trace(`durationMax: ${this.durationMax}`)
    ).closeAll();
  }

  public get isFilled() {
    return !this.durationMax && !this.data.dayInfo;
  }

  public get isCrossed() {
    return this.myForm.errors && this.myForm.errors['cross'];
  }

  public get form() {
    return this.myForm.controls;
  }

  public get disableAdd() {
    return this.isFilled || this.data.dayInfo || this.myForm.invalid || !this.valueCanEdit;
  }

  public get mismatchYear(): boolean {
    return this.myForm.errors && this.myForm.errors['mismatchYear'];
  }

  public get disableRemove() {
    return this.isFilled || !this.data.dayInfo || this.valueCanEdit;
  }

  private static setDuration(currentDate, days: number) {
    const value = currentDate ? currentDate.valueOf() : null;
    const date = new Date(value);
    date.setDate(date.getDate() + days - 1);
    return date;
  }

  public ngOnInit() {
    const { day, dayInfo } = this.data;
    const period = dayInfo ? dayInfo.period : new Period();
    const startDateValue = period.startDate || day.value;
    const delta = this.durationMax - this.duration >= 0 ? this.duration : this.durationMax;
    const duration = period.duration || delta;
    const endDateValue = period.endDate || ScheduleMonthDialogComponent.setDuration(startDateValue, duration);
    this.myForm = this.setFormGroup(this.data, startDateValue, duration, endDateValue);
    this.myFormValueChanges = this.valueChanges();
    this.checkCanAddValue();
  }

  public valueChanges(): Subscription {
    return this.myForm.valueChanges.subscribe((form: FormStructure) => {
      const startDateValue: Date = form.startDate;
      const countDate = form.duration as any;
      const endDateValue: Date = ScheduleMonthDialogComponent.setDuration(startDateValue, parseFloat(countDate));
      this.myForm.get(CalendarDialogFormKeys.endDate).patchValue(endDateValue, { emitEvent: false });
      this.checkCanAddValue();
    });
  }

  public add() {
    if (this.canWorkOperation && this.myForm.valid) {
      this.canWorkOperation = false;
      const period = plainToClass(Period, this.getFormData());
      this.incrementSum(period);
      this.scheduleStateAddPeriod.emit([period])
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  public remove() {
    if (this.canWorkOperation) {
      this.canWorkOperation = false;
      const period = this.data.dayInfo.period;
      this.decrementSum(period);
      this.scheduleStateRemovePeriod.emit(period)
        .subscribe(() => this.dialogRef.close());
    }
  }

  public cancel() {
    this.dialogRef.close();
  }

  public ngOnDestroy() {
    this.myFormValueChanges.unsubscribe();
  }

  private incrementSum(period: Period) {
    this.application.totalDuration = this.application.totalDuration + period.duration;
  }

  private decrementSum(period: Period) {
    this.application.totalDuration = this.application.totalDuration - period.duration;
  }

  private setFormGroup(data: DataDialogTransfer, startDateValue, duration: number, endDateValue) {
    const existVacation = !!data.dayInfo;
    const periods = data.periods;

    return new FormGroup({
      [CalendarDialogFormKeys.startDate]: new FormControl(
        { value: startDateValue, disabled: existVacation },
        Validators.required
      ),
      [CalendarDialogFormKeys.duration]: new FormControl(
        { value: duration, disabled: existVacation },
        [
          Validators.required,
          Validators.min(this.minCount),
          Validators.max(this.durationMax)
        ]
      ),
      [CalendarDialogFormKeys.endDate]: new FormControl(
        { value: endDateValue, disabled: true },
        Validators.required
      )
    }, {
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
    });

  }

  private checkCanAddValue() {
    const dayInfo = this.data.dayInfo || null;
    this.valueCanEdit = !dayInfo;

    if (dayInfo) {
      const periodFromData = this.getFormData();
      const { editable, startDate, duration, endDate } = dayInfo.period;
      this.valueCanEdit = !ObjectUtils.equals(periodFromData, { editable, startDate, duration, endDate });
      this.logger.trace('Status edit period', this.valueCanEdit, dayInfo.period);
    }
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
