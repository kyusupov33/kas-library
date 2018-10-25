import { Period } from '@shared/model/application/period.model';
import {
  CalendarDayInterface,
  VacationType
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/schedule-calendar.interface';

export interface DataDialogTransfer {
  dayInfo: VacationType;
  day: CalendarDayInterface;
  periods: Period[];
}

export interface FormStructure {
  startDate: Date;
  duration: number | string;
  endDate: Date;
}

export enum CalendarDialogFormKeys {
  startDate = 'startDate',
  duration = 'duration',
  endDate = 'endDate'
}
