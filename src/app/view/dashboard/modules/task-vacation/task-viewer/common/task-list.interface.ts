import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TaskDataType } from '@shared/model/table-builder/tasks/task-data.model';
import { ProcessStage } from '@shared/model/activiti/process/process-stage.enum';

export interface SubmitTaskInterface {
  action: TABLE_BUILDER_ACTION_TYPE;
  index: number;
}

export interface SubmitTaskOptions {
  action: TABLE_BUILDER_ACTION_TYPE;
  type: TableRouteTypes;
  element: TaskDataType;
}

export interface TaskRequestOptions {
  type: TableRouteTypes;
  currentProcessStage: ProcessStage;
  hrMainCurator: string;
  hrBackupCurator: string;
  completed: boolean;
}
