import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import {
  InvokeTaskOptions,
  TaskTypeFunctionMap
} from '@modules/task-vacation/task-viewer/common/task-submit-registry/task-submit-registry.interface';
import { catchError } from 'rxjs/operators';
import { NotificationsService } from 'angular2-notifications';
import { LoggerService } from '@core/services/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TaskSubmitRegistryService {
  public TABLE_ACTION = TABLE_BUILDER_ACTION_TYPE;
  private tasks: Map<TableRouteTypes, TaskTypeFunctionMap> = new Map();

  constructor(private notify: NotificationsService,
              private translateService: TranslateService,
              private logger: LoggerService) {
    this.tasks.set(TableRouteTypes.HR_TASKS, {
      [this.TABLE_ACTION.OPEN]: this.openTask
    });
  }

  public submitTaskByType<T>(options: Partial<InvokeTaskOptions>): Observable<T> {
    const title = this.translateService.instant('DASHBOARD.TABLE.WARNINGS.TITLE');
    return this.streamByType<T>(options).pipe(
      catchError((err: Error) => {
        this.notify.warn(title, err.message);
        this.logger.warn.groupCollapsed('Warning on action submit').pipe(
          ({ warn }) => warn('error: ', err.name),
          ({ log, stringify }) => log(...stringify(err))
        ).close();
        return EMPTY;
      })
    );
  }

  private streamByType<T>(options: Partial<InvokeTaskOptions>): Observable<T | never> {
    const dictionaryExist = options.type in TableRouteTypes;
    return (dictionaryExist) ? this.tasks.get(options.type)[options.action].call(this, options) : EMPTY;
  }

  private openTask({ element }: InvokeTaskOptions): Observable<void> {
    this.logger.trace('taskId', element.id, 'applicationId', element.getVariable('applicationId').value);
    return EMPTY;
  }

}
