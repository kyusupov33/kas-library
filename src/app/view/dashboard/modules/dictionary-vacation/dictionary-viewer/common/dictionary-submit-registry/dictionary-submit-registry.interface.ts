import { Observable } from 'rxjs';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import { TableAbstractModels } from '@shared/model/table-builder/common/table-abstract-type';
import { DictionaryResponseQueryModel } from '@shared/model/table-builder/dictionary/dictionary-response-query.model';

type ResponseType = DictionaryResponseQueryModel | TableAbstractModels | void | string;
type DictionaryTypeFunction = (options: Partial<InvokeOptions>) => Observable<ResponseType>;

export interface DictionaryTypeFunctionMap {
  [key: string]: DictionaryTypeFunction;
}

export interface InvokeOptions {
  type: TableRouteTypes;
  action: TABLE_BUILDER_ACTION_TYPE;
  element: TableAbstractModels;
}
