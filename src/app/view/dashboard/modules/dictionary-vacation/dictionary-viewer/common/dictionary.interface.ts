import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import { Observable } from 'rxjs';
import { TableAbstractModels } from '@shared/model/table-builder/common/table-abstract-type';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';

export interface SubmitDictionaryInterface {
  action: TABLE_BUILDER_ACTION_TYPE;
  index: number;
}

export interface SubmitOptions {
  action: TABLE_BUILDER_ACTION_TYPE;
  type: TableRouteTypes;
  element: TableAbstractModels;
}

export interface ConfirmedDialogData {
  success: boolean;
  element: TableAbstractModels;
  action: TABLE_BUILDER_ACTION_TYPE;
  index: number;
}

export interface DictionaryInterface {
  submit: (event: SubmitDictionaryInterface) => void;
  setSwitchedAction: (options: Partial<SubmitOptions>) => Observable<SubmitOptions>;
  setDictionaryDataByPage: (event: TableRouteTypes) => void;
}
