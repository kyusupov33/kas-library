import { Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '@core/services/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { ApiService } from '@core/services/api/api.service';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TaskRegistryService } from '@modules/task-vacation/task-viewer/common/task-registry/task-registry.service';
import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import { PaginationService } from '@app/view/dashboard/shared/services/pagination/pagination.service';
import { TaskResponseQueryModel } from '@shared/model/table-builder/tasks/task-response-query.model';
import { finalize, switchMap } from 'rxjs/operators';
import {
  SubmitTaskInterface,
  SubmitTaskOptions,
  TaskRequestOptions
} from '@modules/task-vacation/task-viewer/common/task-list.interface';
import { TaskModuleState } from '@store/dashboard/states/task-module/task-module.state';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TaskSubmitRegistryService } from '@modules/task-vacation/task-viewer/common/task-submit-registry/task-submit-registry.service';
import { DashboardRoutesPagePath } from '@app/view/dashboard/dashboard-routes.enum';
import { ScheduleRouterKeys } from '@modules/schedule-vacation/schedule-vacation-routes.enum';
import { Router } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material';
import { AuthStore } from '@store/auth/auth.store';
import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import { Emittable, Emitter } from '@ngxs-labs/emitter';

export abstract class TaskList implements OnInit, OnDestroy {

  @Emitter(TaskModuleState.resetTasks)
  public taskStateResetTask: Emittable<TaskResponseQueryModel>;

  @Emitter(TaskModuleState.setTasks)
  public taskStateSetTask: Emittable<TaskResponseQueryModel>;

  @Input()
  public completed: boolean;

  /**
   * @param {TableRouteTypes} type
   * Тип справочника (по роутингу)
   */
  @Input() public type: TableRouteTypes;
  /**
   * @param {TaskResponseQueryModel} data
   * Содержит данные по справочнику
   */
  @Input() public data: object;
  /**
   * @param {boolean} pagination
   * Флаг для отображения пагинации
   */
  @Input() public pagination: boolean;
  /**
   * @param {boolean} addition
   * Флаг для возможности добавления новых данных в справочник
   */
  @Input() public addition: boolean;
  /**
   * @param {boolean} filtration
   * Флаг для возможности фильтрации
   */
  @Input() public filtration: boolean;
  /**
   * @param {boolean} sortable
   * Флаг для возможности сортировки
   */
  @Input() public sortable: boolean;

  @Input() public tableActions: TABLE_BUILDER_ACTION_TYPE[];

  public checked: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public headers: string[];

  protected logger: LoggerService;
  protected taskRegistry: TaskRegistryService;
  protected translateService: TranslateService;
  protected store: Store;
  protected api: ApiService;
  protected paginationService: PaginationService;
  protected taskSubmitRegistry: TaskSubmitRegistryService;
  protected router: Router;

  /**
   * Constructor for <code>Dictionary</code> class
   * @param context for <i>{@link DictionaryComponent}</i>
   */
  protected constructor(context: Injector) {
    this.logger = context.get(LoggerService);
    this.taskRegistry = context.get(TaskRegistryService);
    this.translateService = context.get(TranslateService);
    this.store = context.get(Store);
    this.api = context.get(ApiService);
    this.paginationService = context.get(PaginationService);
    this.taskSubmitRegistry = context.get(TaskSubmitRegistryService);
    this.router = context.get(Router);
  }

  private static getCurrentAction(currentAction: string): Observable<string> {
    return of(currentAction);
  }

  /**
   * Abstract method for <code>{@link TaskListComponent}</code>
   */
  public abstract taskRequest(options: TaskRequestOptions): void;

  public ngOnInit() {
    this.initTaskList();
    this.setTableHeaders();
  }

  public async ngOnDestroy() {
    await this.taskStateResetTask.emit().toPromise();
  }

  public onSwitchChange(event: MatSlideToggleChange) {
    this.checked.next(event.checked);
  }

  public submit({ action, index }: SubmitTaskInterface): void {
    const type = this.type;
    const element = !isNaN(index) ?
      this.store.selectSnapshot(TaskModuleState.getTasksData)[index] :
      null;
    TaskList.getCurrentAction(action)
      .pipe(switchMap((_action) => this.setSwitchedAction({ type, action: _action, element })))
      .subscribe(() => this.logger.trace(`[ACTION] - ${action}`));
  }

  public setSwitchedAction({ type, action, element }): Observable<SubmitTaskOptions> {
    switch (action) {
      case TABLE_BUILDER_ACTION_TYPE.OPEN:
        return this.openTaskByElementId({ type, action, element });
    }
  }

  public openTaskByElementId({ type, action, element }: SubmitTaskOptions): Observable<SubmitTaskOptions> {
    const applicationId = element.getVariable('applicationId').value;
    const url = ['/', DashboardRoutesPagePath.SCHEDULE_VACATION, ScheduleRouterKeys.TASK_ID, element.id];
    const queryParams = { completed: this.completed, applicationId };
    return this.submitTask({ type, action, element }).pipe(
      finalize(() => this.router.navigate(url, { queryParams }))
    );
  }

  public setTasksDataByPage(): void {
    this.initTaskList();
  }

  /**
   * @param {TaskResponseQueryModel} task
   * Сохраняет в хранилище состояние справочника
   */
  protected setTaskSourceData(task: TaskResponseQueryModel) {
    this.logger.debug('[TASK]', task);
    task.type = this.type;
    this.taskStateSetTask.emit(task);
  }

  private initTaskList(): void {
    const userId = this.store.selectSnapshot(AuthStore.getAuthData).userId;
    this.checked
      .subscribe((value: boolean) => {
        const hrMainCurator = (!value) ? userId : null;
        const hrBackupCurator = (value) ? userId : null;
        const options = {
          type: this.type,
          currentProcessStage: ProcessStage.HR_APPROVAL,
          hrMainCurator,
          hrBackupCurator
        };
        this.taskRequest({ ...options, completed: this.completed });
      });
  }

  private submitTask({ type, action, element }: SubmitTaskOptions): Observable<SubmitTaskOptions> {
    return this.taskSubmitRegistry.submitTaskByType({ type, action, element });
  }

  private setTableHeaders(): void {
    const mapTitles = this.translateService.instant(`DASHBOARD.TABLE.MODELS.${this.type}`);
    this.headers = Object.keys(mapTitles);
  }

}
