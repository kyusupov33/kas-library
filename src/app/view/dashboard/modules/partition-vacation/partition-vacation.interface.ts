import { Period } from '@shared/model/application/period.model';
import { Exclude, Expose } from 'class-transformer';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';
import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';

@Exclude()
export class ApprovablePeriod extends Period {

  @Expose()
  public approvable: boolean = null;

  @Expose()
  public editable: boolean = null;

  @Expose()
  public type: APPLICATION_TYPE = null;

  @Expose()
  public processStage: ProcessStage = null;

}

export interface ApprovableEmployeeMap {
  applicationId: string;
  periods: ApprovablePeriod[];
}

export interface ApprovableMap {
  [key: string]: ApprovableEmployeeMap;
}

export interface DepartmentInfo {
  withDepartments: boolean;
  departmentId: string;
}

export interface PartitionSelectCalendar {
  value: boolean;
}

export interface PartitionTypeRoute {
  tableType: TableRouteTypes;
}
