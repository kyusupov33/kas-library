import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';

export interface TaskVacationInterface {
  tableType: TableRouteTypes;
  completed: boolean;
}
