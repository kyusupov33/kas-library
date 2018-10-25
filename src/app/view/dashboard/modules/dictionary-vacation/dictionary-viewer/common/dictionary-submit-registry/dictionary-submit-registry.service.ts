import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api/api.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { NotificationsService } from 'angular2-notifications';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import {
  DictionaryTypeFunctionMap,
  InvokeOptions
} from '@modules/dictionary-vacation/dictionary-viewer/common/dictionary-submit-registry/dictionary-submit-registry.interface';
import { TableAbstractModels } from '@shared/model/table-builder/common/table-abstract-type';
import { LoggerService } from '@core/services/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DictionarySubmitRegistryService {
  public TABLE_ACTION = TABLE_BUILDER_ACTION_TYPE;
  private dictionaries: Map<TableRouteTypes, DictionaryTypeFunctionMap> = new Map();

  constructor(private api: ApiService,
              private logger: LoggerService,
              private translateService: TranslateService,
              private notify: NotificationsService) {
    this.dictionaries.set(TableRouteTypes.HR_ROUTE, {
      [this.TABLE_ACTION.DELETE]: this.deleteHrRoute,
      [this.TABLE_ACTION.SAVE]: this.saveHrRoute
    });
    this.dictionaries.set(TableRouteTypes.HR_USER, {
      [this.TABLE_ACTION.SAVE]: this.saveHrUser,
      [this.TABLE_ACTION.DELETE]: this.deleteHrUser
    });
    this.dictionaries.set(TableRouteTypes.ASSISTANT, {
      [this.TABLE_ACTION.DELETE]: this.deleteAssistant,
      [this.TABLE_ACTION.SAVE]: this.saveAssistant
    });
    this.dictionaries.set(TableRouteTypes.OTHER_SETTINGS, {
      [this.TABLE_ACTION.SAVE]: this.saveOtherOption
    });
  }

  public submitDictionaryByType<T>(options: Partial<InvokeOptions>): Observable<T> {
    const title = this.translateService.instant('DASHBOARD.TABLE.WARNINGS.TITLE');
    const content = this.translateService.instant('DASHBOARD.TABLE.WARNINGS.EXIST');
    return this.streamByType<T>(options).pipe(
      tap(() => this.notificationActions(options.action)),
      catchError((err: Error) => {
        this.notify.warn(title, content);
        this.logger.warn.groupCollapsed('Warning on action submit').pipe(
          ({ warn }) => warn('error: ', err.name),
          ({ log, stringify }) => log(...stringify(err))
        ).close();
        return EMPTY;
      })
    );
  }

  private notificationActions(action: TABLE_BUILDER_ACTION_TYPE): void {
    const title = this.translateService.instant('DASHBOARD.TABLE.SUCCESS.TITLE');
    const addContent = this.translateService.instant('DASHBOARD.TABLE.SUCCESS.ADD');
    const deleteContent = this.translateService.instant('DASHBOARD.TABLE.SUCCESS.DELETE');
    if (action === TABLE_BUILDER_ACTION_TYPE.SAVE) {
      this.notify.success(title, addContent);
    } else if (action === TABLE_BUILDER_ACTION_TYPE.DELETE) {
      this.notify.info(title, deleteContent);
    }
  }

  private streamByType<T>(options: Partial<InvokeOptions>): Observable<T | never> {
    const dictionaryExist = options.type in TableRouteTypes;
    return (dictionaryExist) ? this.dictionaries.get(options.type)[options.action].call(this, options) : EMPTY;
  }

  private saveHrRoute({ element }: InvokeOptions): Observable<TableAbstractModels> {
    return this.api.putHumanResourceRoute(element);
  }

  private saveHrUser({ element }: InvokeOptions): Observable<TableAbstractModels> {
    return this.api.putHumanResourceUser(element);
  }

  private saveAssistant({ element }: InvokeOptions): Observable<TableAbstractModels> {
    return this.api.putAssistants(element);
  }

  private saveOtherOption({ element }: InvokeOptions): Observable<TableAbstractModels> {
    return this.api.putOtherSetting(element);
  }

  private deleteHrRoute({ element }: InvokeOptions): Observable<string> {
    if (element.id) {
      return this.api.deleteHumanResourceRoute(element.id);
    }
  }

  private deleteHrUser({ element }: InvokeOptions): Observable<string> {
    if (element.id) {
      return this.api.deleteHumanResourceUser(element.id);
    }
  }

  private deleteAssistant({ element }: InvokeOptions): Observable<string> {
    if (element.id) {
      return this.api.deleteAssistant(element.id);
    }
  }

}
