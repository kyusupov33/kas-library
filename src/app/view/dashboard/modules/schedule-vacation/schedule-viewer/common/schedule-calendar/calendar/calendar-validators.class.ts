import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Period } from '@shared/model/application/period.model';

interface ValidatorFieldType {
  [key: string]: boolean;
}

export class CalendarValidators {
  public static cross(startDate: string, endDate: string, periods: Period[], field: ValidatorFieldType): ValidatorFn {
    return (c: AbstractControl): ValidatorFieldType | null => {
      const start: Date = new Date(c.get(startDate).value);
      const end: Date = new Date(c.get(endDate).value);

      const isCrossed = periods.some((item: Period) => {
        const startDateByDate: Date = new Date(item.startDate as string);
        const startDateByDateMs = startDateByDate.setHours(0, 0, 0, 0);
        const startMs = start.setHours(0, 0, 0, 0);
        const endMs = end.setHours(0, 0, 0, 0);
        return startDateByDateMs >= startMs && startDateByDateMs <= endMs;
      });

      return isCrossed ? field : null;
    };
  }
}
