import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api/api.service';
import { EMPTY, Observable } from 'rxjs';
import { DictionaryQueryRequest } from '@shared/model/table-builder/dictionary/dictionary-request-query.model';
import { map } from 'rxjs/operators';
import { LoggerService } from '@core/services/logger/logger.service';
import { DictionaryTypeFunction } from '@modules/dictionary-vacation/dictionary-viewer/common/dictionary-registry/dictionary-registy.interface';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { DictionaryResponseQueryModel } from '@shared/model/table-builder/dictionary/dictionary-response-query.model';
import { PaginationService } from '@app/view/dashboard/shared/services/pagination/pagination.service';
import { TableDataSortService } from '@app/view/dashboard/shared/services/table-data-sort/table-data-sort.service';
import { SortableData } from '@shared/model/table-builder/common/table-sortable.enum';

@Injectable()
export class DictionaryRegistryService {
  private dictionaries: Map<TableRouteTypes, DictionaryTypeFunction> = new Map();
  private requestBody: DictionaryQueryRequest = new DictionaryQueryRequest();

  constructor(private api: ApiService,
              private paginationService: PaginationService,
              private tableDataSortService: TableDataSortService,
              private logger: LoggerService) {
    this.dictionaries.set(TableRouteTypes.HR_ROUTE, this.setHrRoute);
    this.dictionaries.set(TableRouteTypes.HR_USER, this.setHrUser);
    this.dictionaries.set(TableRouteTypes.ASSISTANT, this.setAssistants);
    this.dictionaries.set(TableRouteTypes.OTHER_SETTINGS, this.setOtherSettings);
  }

  public getDictionaryByType<T = DictionaryResponseQueryModel>(type: TableRouteTypes): Observable<T> {
    const sortable = SortableData[type];
    const body = this.setRequestOptions(sortable);
    return this.streamByType<T>(type, body).pipe(
      map((data: any) => {
        this.paginationService.pageTotal = (data).totalElements;
        this.logger.trace.groupCollapsed('Initial Table Data').pipe(
          ({ trace }) => trace('type: ', type),
          ({ log, stringify }) => log(...stringify(data))
        ).close();
        return data;
      })
    );
  }

  private streamByType<T>(type: TableRouteTypes, body): Observable<T | never> {
    const dictionaryExist = type in TableRouteTypes;
    return (dictionaryExist) ? this.dictionaries.get(type).call(this, body) : EMPTY;
  }

  private setRequestOptions(sortable: object): DictionaryQueryRequest {
    this.requestBody.pageRequest.page = this.paginationService.page;
    this.requestBody.pageRequest.size = this.paginationService.pageCount;
    this.setSortable(sortable);
    return this.requestBody;
  }

  private setSortable(sortable: object): void {
    const { activeColumn, sortDirection } = this.tableDataSortService;
    if (activeColumn && sortDirection) {
      const sortOptions = { property: sortable[activeColumn], direction: sortDirection.toUpperCase() };
      this.requestBody.pageRequest.sortList = [sortOptions];
    } else {
      this.requestBody.pageRequest.sortList = [{ direction: 'DESC', property: 'id' }];
    }
  }

  private setHrRoute(body: DictionaryQueryRequest): Observable<DictionaryResponseQueryModel> {
    return this.api.getHumanResourceRoutes(body);
  }

  private setHrUser(body: DictionaryQueryRequest): Observable<DictionaryResponseQueryModel> {
    return this.api.getHumanResourceUsers(body);
  }

  private setAssistants(body: DictionaryQueryRequest): Observable<DictionaryResponseQueryModel> {
    return this.api.getAssistants(body);
  }

  private setOtherSettings(body: DictionaryQueryRequest): Observable<DictionaryResponseQueryModel> {
    return this.api.getOtherSettings(body);
  }
}
