import { Injectable } from '@angular/core';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { ApiService } from '@core/services/api/api.service';
import { LoggerService } from '@core/services/logger/logger.service';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskQueryRequest } from '@shared/model/activiti/tasks/task-query-request.model';
import { AuthStore } from '@store/auth/auth.store';
import { Store } from '@ngxs/store';
import { TaskResponseQueryModel } from '@shared/model/table-builder/tasks/task-response-query.model';
import { PaginationService } from '@app/view/dashboard/shared/services/pagination/pagination.service';
import { TaskTypeFunction } from '@modules/task-vacation/task-viewer/common/task-registry/task-registry.interface';
import { TableDataSortService } from '@app/view/dashboard/shared/services/table-data-sort/table-data-sort.service';
import { SortableData } from '@shared/model/table-builder/common/table-sortable.enum';
import { TaskRequestOptions } from '@modules/task-vacation/task-viewer/common/task-list.interface';
import { ProcessQueryRequest } from '@shared/model/activiti/process/process-query-request.model';

@Injectable()
export class TaskRegistryService {
  private tasks: Map<TableRouteTypes, TaskTypeFunction> = new Map();

  constructor(private api: ApiService,
              private store: Store,
              private paginationService: PaginationService,
              private tableDataSortService: TableDataSortService,
              private logger: LoggerService) {
    this.tasks.set(TableRouteTypes.HR_TASKS, this.setHrTasks);
  }

  public getTaskByType<T = TaskResponseQueryModel>(options: Partial<TaskRequestOptions>): Observable<T> {
    const sortable = SortableData[options.type];
    const body = this.setRequestOptions(options, sortable);

    return this.streamByType<T>(options, body).pipe(
      map((data: any) => {
        this.paginationService.pageTotal = data.total;
        this.logger.trace.groupCollapsed('Initial Table Data').pipe(
          ({ trace }) => trace('type: ', options.type),
          ({ log, stringify }) => log(...stringify(data))
        ).close();
        return data;
      })
    );
  }

  private streamByType<T>(options: Partial<TaskRequestOptions>, body): Observable<T | never> {
    const { type, completed } = options;
    const taskExist = type in TableRouteTypes;
    return (taskExist) ? this.tasks.get(type).call(this, body, completed) : EMPTY;
  }

  private setHrTaskRequestOptions(options: Partial<TaskRequestOptions>, sortable: object): TaskQueryRequest {
    const userId = this.store.selectSnapshot(AuthStore.getAuthData).userId;
    const { currentProcessStage, hrMainCurator, hrBackupCurator } = options;
    const variables = { currentProcessStage, hrMainCurator, hrBackupCurator };
    const requestBody: TaskQueryRequest = new TaskQueryRequest(userId, variables);
    return this.setSortable<TaskQueryRequest>(this.getPaginate(requestBody), sortable);
  }

  private setSortable<T>(body: T | any, sortable: object): T {
    const { activeColumn, sortDirection } = this.tableDataSortService;
    if (activeColumn && sortDirection) {
      body.sort = sortable[activeColumn];
      body.order = sortDirection;
    }
    return body;
  }

  private getPaginate<T>(body: T | any) {
    body.start = this.paginationService.page * this.paginationService.pageCount;
    body.size = this.paginationService.pageCount;
    return body;
  }

  private setHrTaskCompletedRequestOptions(sortable: object): ProcessQueryRequest {
    const userId = this.store.selectSnapshot(AuthStore.getAuthData).userId;
    const requestBody: ProcessQueryRequest = new ProcessQueryRequest({ hrApproverId: userId });
    return this.setSortable<ProcessQueryRequest>(this.getPaginate(requestBody), sortable);
  }

  private setRequestOptions(options: Partial<TaskRequestOptions>, sortable: object) {
    return options.completed ? this.setHrTaskCompletedRequestOptions(sortable) :
      this.setHrTaskRequestOptions(options, sortable);
  }

  private setHrTasks(body: TaskQueryRequest, completed: boolean): Observable<TaskResponseQueryModel> {
    return completed ? this.api.getHrTasksCompleted(body) : this.api.getHrTasks(body);
  }

}
