import { Viewer } from '@app/view/dashboard/modules/common/viewer.class';
import { Params } from '@angular/router';
import { PartitionRouterKeys } from '@modules/partition-vacation/partition-vacation-routes.enum';
import { Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import { LoggerService } from '@core/services/logger/logger.service';
import { UserState } from '@store/dashboard/states/user/user.state';
import { PartitionSwitchYearComponent } from '@modules/partition-vacation/partition-viewer/partition-switch-year/partition-switch-year.component';
import { ApiService } from '@core/services/api/api.service';

export class PartitionViewer extends Viewer {

  public yearByRoute: number;
  public userId: string;
  public departmentId: number;
  public withDepartments: boolean;
  public checkedNextYear: boolean = false;
  protected api: ApiService;
  protected store: Store;
  protected logger: LoggerService;

  constructor(context: Injector) {
    super(context);
    this.store = context.get(Store);
    this.api = context.get(ApiService);
    this.logger = context.get(LoggerService);
    this.logger = context.get(LoggerService);
    this.departmentId = this.store.selectSnapshot(UserState.getUser).departmentId;
    this.userId = this.store.selectSnapshot(UserState.getUser).userId;
  }

  public emitRouterParams(params: Params, queryParams: Params) {
    this.withDepartments = params[PartitionRouterKeys.WITH_DEPARTMENTS] || false;
    const year = PartitionSwitchYearComponent.setYearType(this.checkedNextYear);
    this.yearByRoute = Number(queryParams[PartitionRouterKeys.YEAR] || year);

    this.logger.debug.group(`[PartitionViewerComponent router emit]`).pipe(
      ({ debug }) => debug(`year ${this.yearByRoute}`),
      ({ debug }) => debug(`withDepartments ${this.withDepartments}`)
    ).closeAll();
  }

  public printDepartmentExcel(year: number, departmentId: number) {
    window.open(`${this.api.host}/content/report/${departmentId}?year=${year}`);
  }

}
