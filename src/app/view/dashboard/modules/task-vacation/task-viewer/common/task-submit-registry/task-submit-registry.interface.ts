import { TableAbstractModels } from '@shared/model/table-builder/common/table-abstract-type';
import { Observable } from 'rxjs';
import { TaskResponseQueryModel } from '@shared/model/table-builder/tasks/task-response-query.model';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import { TaskDataType } from '@shared/model/table-builder/tasks/task-data.model';

type ResponseType = TaskResponseQueryModel | TableAbstractModels | void | string;
type TaskTypeFunction = (options: Partial<InvokeTaskOptions>) => Observable<ResponseType>;

export interface TaskTypeFunctionMap {
  [key: string]: TaskTypeFunction;
}

export interface InvokeTaskOptions {
  type: TableRouteTypes;
  action: TABLE_BUILDER_ACTION_TYPE;
  element: TaskDataType;
}
