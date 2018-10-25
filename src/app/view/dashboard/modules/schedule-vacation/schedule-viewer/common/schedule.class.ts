import { ChangeDetectorRef, Injector, Input, OnChanges, OnDestroy, OnInit, ViewRef } from '@angular/core';
import { Application } from '@shared/model/application/application.model';
import { Person } from '@shared/model/person/person.model';
import { Store } from '@ngxs/store';
import { LoggerService } from '@core/services/logger/logger.service';
import { ApiService } from '@core/services/api/api.service';
import { TaskDataType } from '@shared/model/activiti/tasks/task-data.model';
import { UserState } from '@store/dashboard/states/user/user.state';
import { AuthStore } from '@store/auth/auth.store';
import { ScheduleInterface } from '@modules/schedule-vacation/schedule-viewer/common/schedule.interface';
import {
  CalendarDialogInterface,
  DialogResponseEvent,
  ScheduleResolverService
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-resolver/schedule-resolver.service';
import { ScheduleErrorHandlerService } from '@modules/schedule-vacation/schedule-viewer/common/schedule-error-handler/schedule-error-handler.service';
import { ActivitiRegistryService } from '@app/view/dashboard/shared/services/activiti-registry/activiti-registry.service';
import { Router } from '@angular/router';
import { SchedulePermissionService } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/schedule-permission.service';
import { ApplicationGrant } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.class';
import {
  ActionList,
  ActionResultInterface,
  EditableTypeInterface
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { CalendarEvent } from '@modules/schedule-vacation/schedule-viewer/schedule/components/schedule-year-calendar/schedule-month-viewer/schedule-month-viewer.component';
import { tap } from 'rxjs/operators';
import { DialogPost } from '@app/view/dashboard/shared/components/action-panel-dialog/action-panel-dialog.component';
import { DashboardRoutesPagePath } from '@app/view/dashboard/dashboard-routes.enum';
import { ScheduleRouterKeys } from '@modules/schedule-vacation/schedule-vacation-routes.enum';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';
import { VacationType } from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/schedule-calendar.interface';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { ScheduleState } from '@store/dashboard/states/schedule/schedule.state';

export abstract class Schedule implements ScheduleInterface, OnInit, OnChanges, OnDestroy {

  @Input() public year: string;
  @Input() public application: Application;

  @Emitter(ScheduleState.reset)
  public scheduleStateReset: Emittable<Application>;

  @Emitter(ScheduleState.updateSchedule)
  public scheduleStateUpdate: Emittable<Application>;

  @Emitter(ScheduleState.validateRequiredPerson)
  public scheduleStateRequiredPerson: Emittable<Person>;

  public readonly user: Person;
  public readonly userId: string;
  public taskId: string;
  public scheduleIsLoaded: boolean;
  public scheduleEditableType: Partial<EditableTypeInterface> = {};
  public scheduleIsPlan: boolean;
  public scheduleActionList: ActionList;

  protected api: ApiService;
  protected logger: LoggerService;
  protected errorHandler: ScheduleErrorHandlerService;
  protected changeDetectorRef: ChangeDetectorRef;
  protected activityRegistry: ActivitiRegistryService;
  protected scheduleResolver: ScheduleResolverService;
  protected permissions: SchedulePermissionService;
  protected route: Router;
  protected permission: ApplicationGrant;
  private onInit: boolean;

  protected constructor(context: Injector) {
    const store = context.get(Store);
    this.api = context.get(ApiService);
    this.logger = context.get(LoggerService);
    this.route = context.get(Router);
    this.changeDetectorRef = context.get(ChangeDetectorRef);
    this.errorHandler = context.get(ScheduleErrorHandlerService);
    this.activityRegistry = context.get(ActivitiRegistryService);
    this.scheduleResolver = context.get(ScheduleResolverService);
    this.permissions = context.get(SchedulePermissionService);
    this.user = store.selectSnapshot(UserState.getUser);
    this.userId = store.selectSnapshot(AuthStore.getAuthData).userId;
  }

  public ngOnInit() {
    this.onInit = true;
    this.scheduleOnInitOrUpdate();
  }

  public ngOnChanges() {
    this.scheduleSetup();
  }

  public scheduleSetup() {
    if (this.onInit) {
      this.logger.trace('[OnSetup Schedule]');
      const options = { application: this.application, isTask: !!this.taskId, userId: this.userId };
      this.permission = this.permissions.permissionFactoryByType(this.application.type.code, options);
      this.permissionSetup(this.permission);
    }
  }

  public async ngOnDestroy() {
    await this.scheduleOnDestroy();
  }

  public async scheduleOnDestroy() {
    this.logger.trace('[OnDestroy Schedule]');
    await this.scheduleStateReset.emit().toPromise();
  }

  public abstract scheduleOnInitOrUpdate(): void;

  public scheduleDayOnHandler(event: CalendarEvent) {
    this.logger.trace('[onclick] day event: ', event);
    const initiatorStage = this.scheduleEditableType.isCalendarEditable;
    const options: CalendarDialogInterface = { initiatorStage, event, application: this.application };
    this.scheduleResolver.getDialogModalTypeByOption(options)
      .then((type) => this.openModalOrRedirectByPeriodType(type, event.payload))
      .catch((error) => this.logger.error(error));
  }

  public scheduleAfterOnInit(application: Application = null) {
    this.logger.debug('[AfterOnInit Schedule]');
    this.scheduleStateUpdate.emit(application)
      .pipe(tap(() => {
        this.logger.debug.groupCollapsed('Schedule permissions')
          .pipe(({ log, stringify }) => log(...stringify(this.scheduleEditableType, true)))
          .closeAll();
      })).subscribe(() => this.scheduleContentChecked());

  }

  public async scheduleDoCheck({ action, data }) {
    this.logger.trace('[DoCheck Schedule]');
    await this.scheduleResolver.resolve({ action, data });
    this.scheduleOnInitOrUpdate();
  }

  public scheduleContentChecked() {
    this.scheduleStateRequiredPerson.emit()
      .subscribe(() => {
        this.scheduleIsLoaded = true;
        this.scheduleSetup();
        this.detectChanges();
      });
  }

  public scheduleDispatchAction(action: ActionResultInterface) {
    this.logger.trace('[Dispatch Action Schedule]');
    const options = { action, taskId: this.taskId, application: this.application };
    this.activityRegistry.invokeByType(options).subscribe(
      async (data) => this.scheduleDoCheck({ action, data }),
      (error: Error) => this.scheduleErrorHandler(error)
    );
  }

  public scheduleErrorHandler(error: Error) {
    this.errorHandler.catchError({ error, application: this.application });
  }

  protected getTaskByApplicationIdAndAssignee(application: Application) {
    this.api.getTaskByApplicationIdAndAssignee(application.id, this.userId)
      .subscribe(async ({ id }: TaskDataType) => {
        this.taskId = id;
        this.logger.debug('Get task if assignee to me, taskId: ', id);
        this.scheduleAfterOnInit(application);
      });
  }

  protected detectChanges() {
    if (!(this.changeDetectorRef as ViewRef).destroyed) {
      this.changeDetectorRef.detectChanges();
    }
  }

  private openModalOrRedirectByPeriodType(options: DialogResponseEvent, payload: VacationType) {
    const { type, applicationId, subscribeByReference, operation } = options;
    this.logger.trace('open dialog by response', options);
    if (type) {
      const dialogRef = this.scheduleResolver.openDialogByEvent(options);
      if (subscribeByReference) {
        dialogRef.afterClosed().subscribe((confirmed: DialogPost) => {
          if (confirmed.success) {
            this.registryOperation(operation, payload);
          }
        });
      }
    } else if (applicationId) {
      const url = `/${DashboardRoutesPagePath.SCHEDULE_VACATION}/${ScheduleRouterKeys.APPLICATION_ID}/${applicationId}`;
      this.route.navigate([url]).then();
    }
  }

  private permissionSetup(permission: ApplicationGrant) {
    this.scheduleActionList = permission.getButtons();
    this.scheduleEditableType = permission.getEditableFlags();
  }

  private registryOperation(operation: APPLICATION_TYPE, payload: VacationType) {
    if (operation === APPLICATION_TYPE.FACT) {
      this.activityRegistry.leaveApplication(payload.period);
    }
  }

}
