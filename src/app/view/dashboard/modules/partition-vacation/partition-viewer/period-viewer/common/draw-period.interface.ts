import { SafeStyle } from '@angular/platform-browser';
import { ApprovablePeriod } from '@modules/partition-vacation/partition-vacation.interface';
import { EmployeeSimple } from '@shared/model/person/employee-simple.model';

export interface GridLineInterface<T = any> {
  width: string | SafeStyle;
  offsetLeft: string | SafeStyle;
  zIndex: number;
  data: T;
  tooltip: string;
}

export interface DrawPeriodConfigInterface {
  dayPx: string;
  monthCount: number;
  borderRightWidth: string;
  maxZIndex: number;
  minZIndex: number;
}

export type ApprovableEmployees = Array<Partial<EmployeeSimple<any>>>;

export type GridApprovableLine<T = ApprovablePeriod> = GridLineInterface<T>;
