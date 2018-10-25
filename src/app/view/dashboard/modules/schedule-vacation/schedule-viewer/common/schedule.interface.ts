import { Application } from '@shared/model/application/application.model';
import {
  ActionList,
  ActionResultInterface,
  EditableTypeInterface
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { CalendarEvent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-year-calendar/schedule-month-viewer/schedule-month-viewer.component';

export interface ScheduleDoCheckInterface {
  action: ActionResultInterface;
  data: any;
}

export interface ScheduleInterface {
  scheduleIsPlan: boolean;
  scheduleIsLoaded: boolean;
  scheduleActionList: ActionList;
  scheduleEditableType: Partial<EditableTypeInterface>;
  scheduleSetup(): void;
  scheduleOnInitOrUpdate(): void;
  scheduleAfterOnInit(application: Application, isTask: boolean): void;
  scheduleDoCheck(params: ScheduleDoCheckInterface): void;
  scheduleContentChecked(application: Application): void;
  scheduleDispatchAction(actionType: ActionResultInterface): void;
  scheduleErrorHandler(error: Error): void;
  scheduleOnDestroy(): void;
  scheduleDayOnHandler(event: CalendarEvent): void;
}
