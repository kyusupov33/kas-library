import { Observable } from 'rxjs';
import { DictionaryQueryRequest } from '@shared/model/table-builder/dictionary/dictionary-request-query.model';
import { DictionaryResponseQueryModel } from '@shared/model/table-builder/dictionary/dictionary-response-query.model';

export type ResponseType = DictionaryResponseQueryModel;
export type DictionaryTypeFunction = (body: DictionaryQueryRequest) => Observable<ResponseType>;
