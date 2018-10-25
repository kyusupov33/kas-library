import { Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { LoggerService } from '@core/services/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { ApiService } from '@core/services/api/api.service';
import { EMPTY, Observable, of } from 'rxjs';
import { DictionaryRegistryService } from '@modules/dictionary-vacation/dictionary-viewer/common/dictionary-registry/dictionary-registry.service';
import { switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import {
  ConfirmDialogComponent,
  DialogConfirmData
} from '@app/view/dashboard/shared/components/confirm-dialog/confirm-dialog.component';
import { MODAL_CONFIG } from '@shared/config/modal.config';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import {
  ConfirmedDialogData,
  DictionaryInterface,
  SubmitDictionaryInterface,
  SubmitOptions
} from '@modules/dictionary-vacation/dictionary-viewer/common/dictionary.interface';
import { DictionarySubmitRegistryService } from '@modules/dictionary-vacation/dictionary-viewer/common/dictionary-submit-registry/dictionary-submit-registry.service';
import { EditModalsConfig } from '@modules/dictionary-vacation/dictionary-viewer/dictionary/modals/edit-modals.config';
import { PaginationService } from '@app/view/dashboard/shared/services/pagination/pagination.service';
import { DictionaryResponseQueryModel } from '@shared/model/table-builder/dictionary/dictionary-response-query.model';
import { DictionaryModuleState } from '@store/dashboard/states/dictionary-module/dictionary-module.state';
import { Emittable, Emitter } from '@ngxs-labs/emitter';

export abstract class Dictionary implements DictionaryInterface, OnInit, OnDestroy {

  @Emitter(DictionaryModuleState.resetTasks)
  public dictionaryStateResetTask: Emittable<DictionaryResponseQueryModel>;

  @Emitter(DictionaryModuleState.setTasks)
  public dictionaryStateSetTask: Emittable<DictionaryResponseQueryModel>;

  /**
   * @param {TableRouteTypes} type
   * Тип справочника (по роутингу)
   */
  @Input() public type: TableRouteTypes;
  /**
   * @param {DictionaryResponseQueryModel} content
   * Содержит данные по справочнику
   */
  @Input() public content: object;
  /**
   * @param {boolean} pagination
   * Флаг для отображения пагинации
   */
  @Input() public pagination: boolean;
  /**
   * @param {boolean} addition
   * Флаг для возможности добавления новых данных в справочник
   */
  @Input() public addition: boolean;
  /**
   * @param {boolean} filtration
   * Флаг для возможности фильтрации
   */
  @Input() public filtration: boolean;
  /**
   * @param {boolean} sortable
   * Флаг для возможности сортировки
   */
  @Input() public sortable: boolean;

  @Input() public tableActions: TABLE_BUILDER_ACTION_TYPE[];

  @Input() public panelActions: TABLE_BUILDER_ACTION_TYPE[];

  public headers: string[];

  protected logger: LoggerService;
  protected dictionaryRegistry: DictionaryRegistryService;
  protected dictionarySubmitRegistry: DictionarySubmitRegistryService;
  protected translateService: TranslateService;
  protected store: Store;
  protected api: ApiService;
  protected dialog: MatDialog;
  protected paginationService: PaginationService;

  /**
   * Constructor for <code>Dictionary</code> class
   * @param context for <i>{@link DictionaryComponent}</i>
   */
  protected constructor(context: Injector) {
    this.logger = context.get(LoggerService);
    this.dictionaryRegistry = context.get(DictionaryRegistryService);
    this.translateService = context.get(TranslateService);
    this.store = context.get(Store);
    this.api = context.get(ApiService);
    this.dialog = context.get(MatDialog);
    this.dictionarySubmitRegistry = context.get(DictionarySubmitRegistryService);
    this.paginationService = context.get(PaginationService);
  }

  private static getCurrentAction(currentAction: string): Observable<string> {
    return of(currentAction);
  }

  /**
   * Abstract method for <code>{@link DictionaryComponent}</code>
   */
  public abstract dictionaryRequest(): void;

  public ngOnInit() {
    this.dictionaryRequest();
    this.setTableHeaders();
  }

  public async ngOnDestroy() {
    await this.dictionaryStateResetTask.emit().toPromise();
  }

  public submit({ action, index }: SubmitDictionaryInterface): void {
    const type = this.type;
    const element = !isNaN(index) ?
      this.store.selectSnapshot(DictionaryModuleState.getDictionaryContent)[index] :
      null;
    Dictionary.getCurrentAction(action)
      .pipe(switchMap((_action) => this.setSwitchedAction({ type, action: _action, element })))
      .subscribe((data) => this.logger.trace(`[ACTION] - ${action}`, data));
  }

  public setSwitchedAction({ type, action, element }): Observable<SubmitOptions> {
    switch (action) {
      case TABLE_BUILDER_ACTION_TYPE.DELETE:
        return this.confirmDeleteModal({ type, action, element });
      default:
        return this.confirmEditElementModal({ type, element });
    }
  }

  public setDictionaryDataByPage(): void {
    this.dictionaryRegistry
      .getDictionaryByType(this.type)
      .subscribe((data: DictionaryResponseQueryModel) => this.setDictionarySourceData(data));
  }

  public translate(key: string): string {
    return this.translateService.instant('DASHBOARD.DICTIONARY.' + key);
  }

  /**
   * @param {DictionaryResponseQueryModel} dictionary
   * Сохраняет в хранилище состояние справочника
   */
  protected setDictionarySourceData(dictionary: DictionaryResponseQueryModel) {
    this.logger.debug('[DICTIONARY]', dictionary);
    dictionary.type = this.type;
    this.dictionaryStateSetTask.emit(dictionary);
  }

  private submitDictionary({ type, action, element }: SubmitOptions): Observable<SubmitOptions> {
    return this.dictionarySubmitRegistry.submitDictionaryByType({ type, action, element });
  }

  private confirmDeleteModal({ type, action, element }: SubmitOptions): Observable<SubmitOptions> {
    const title = this.translateService.instant('DASHBOARD.DICTIONARY.DICTIONARY_CONFIRM.TITLE');
    const data = { title, enableComment: false, content: null };
    const config: MatDialogConfig<DialogConfirmData> = { ...MODAL_CONFIG, data };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, config);
    dialogRef.afterClosed().subscribe((confirmed: ConfirmedDialogData) => {
      if (confirmed.success) {
        this.submitDictionary({ type, action, element }).subscribe(() => this.dictionaryRequest());
      }
    });
    return EMPTY;
  }

  private confirmEditElementModal({ type, element }: Partial<SubmitOptions>): Observable<SubmitOptions> {
    const model: any = EditModalsConfig[type];
    const data = { element };
    const config: MatDialogConfig<Partial<ConfirmedDialogData>> = { ...MODAL_CONFIG, data };
    const dialogRef = this.dialog.open(model, config);
    dialogRef.afterClosed().subscribe((confirmed: ConfirmedDialogData) => {
      if (confirmed.success) {
        this.submitDictionary({ type, action: confirmed.action, element: confirmed.element })
          .subscribe(() => this.dictionaryRequest());
      }
    });
    return EMPTY;
  }

  private setTableHeaders(): void {
    const mapTitles = this.translateService.instant(`DASHBOARD.TABLE.MODELS.${this.type}`);
    this.headers = Object.keys(mapTitles);
  }

}
