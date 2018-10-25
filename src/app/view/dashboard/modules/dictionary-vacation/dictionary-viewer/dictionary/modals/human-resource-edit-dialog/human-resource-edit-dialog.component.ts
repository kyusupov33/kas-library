import { Component, Inject, Injector, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialog, MatDialogRef } from '@angular/material';
import { ApiService } from '@core/services/api/api.service';
import { Store } from '@ngxs/store';
import { LoggerService } from '@core/services/logger/logger.service';
import { SpinnerService } from '@core/services/spinner/spinner.service';
import { MODAL_CONFIG } from '@shared/config/modal.config';
import { PersonFinderComponent } from '@app/view/dashboard/shared/components/person-finder/person-finder.component';
import { HumanResource } from '@shared/model/table-builder/dictionary/entities/hr-route/human-resource.model';
import { Person } from '@shared/model/person/person.model';
import { DepartmentDefinition } from '@shared/model/department/DepartmentDefinition';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import { EMPTY } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DictionaryModuleState } from '@store/dashboard/states/dictionary-module/dictionary-module.state';

export interface DialogData {
  element: HumanResource;
}

@Component({
  selector: 'human-resource-edit-dialog',
  templateUrl: './human-resource-edit-dialog.component.html',
  styleUrls: ['./human-resource-edit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HumanResourceEditDialogComponent {
  public TableRouteTypes = TableRouteTypes;
  public departmentDefinition: DepartmentDefinition;
  public element: HumanResource;
  public tableAction = TABLE_BUILDER_ACTION_TYPE;
  public dialog: MatDialog;
  public form: FormGroup;
  private timer: number;
  private api: ApiService;
  private store: Store;
  private logger: LoggerService;
  private spinner: SpinnerService;
  private notify: NotificationsService;
  private formBuilder: FormBuilder;
  private translateService: TranslateService;

  constructor(context: Injector,
              public dialogRef: MatDialogRef<HumanResourceEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.api = context.get(ApiService);
    this.store = context.get(Store);
    this.logger = context.get(LoggerService);
    this.spinner = context.get(SpinnerService);
    this.dialog = context.get(MatDialog);
    this.notify = context.get(NotificationsService);
    this.formBuilder = context.get(FormBuilder);
    this.translateService = context.get(TranslateService);
    this.getInitialData();
  }

  public submit(action: TABLE_BUILDER_ACTION_TYPE) {
    const title = this.translateService.instant('DASHBOARD.TABLE.WARNINGS.TITLE');
    const content = this.translateService.instant('DASHBOARD.TABLE.WARNINGS.MODELS.HR_ROUTE');
    if (this.element.departmentName && this.element.mainCuratorName) {
      this.dialogRef.close({ success: true, element: this.element, action });
    } else {
      this.notify.warn(title, content);
      return EMPTY;
    }
  }

  public closeDialog() {
    this.dialogRef.close({ success: false });
  }

  public searchMainCurator(): void {
    const data = { fullName: '', exclude: [] };
    const params = { ...MODAL_CONFIG, data };
    const dialogRef = this.dialog.open(PersonFinderComponent, params);
    dialogRef.afterClosed().subscribe((person) => this.setPerson(person));
  }

  public searchBackUpCurator(): void {
    const exclude = this.store.selectSnapshot(DictionaryModuleState.getDictionaryContent);
    const data = { fullName: '', exclude };
    const params = { ...MODAL_CONFIG, data };
    const dialogRef = this.dialog.open(PersonFinderComponent, params);
    dialogRef.afterClosed().subscribe((person) => this.setCuratorBackUp(person));
  }

  public keyPress(event) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  public searchDepartment(departmentId) {
    if (departmentId) {
      clearInterval(this.timer);
      this.timer = window.setTimeout(() => {
        this.api.getDepartmentsById(departmentId)
          .subscribe(
            (data) => this.departmentDefinition = data,
            (error) => this.logger.warn(error),
            () => this.spinner.hide()
          );
      }, 500);
    }
  }

  public deleteBackUpCurator(): void {
    this.element.backupCuratorName = null;
    this.element.backupCuratorUserId = null;
  }

  public setDepartment(event: MatAutocompleteSelectedEvent): void {
    const { id, name } = event.option.value;
    this.element.departmentName = name ? name : null;
    this.element.departmentCode = id ? id : null;
  }

  public setPerson(person: Person): void {
    if (person) {
      this.element.mainCuratorUserId = person.userId;
      this.element.mainCuratorName = person.fullName;
    }
  }

  public setCuratorBackUp(person: Person): void {
    if (person) {
      this.element.backupCuratorUserId = person.userId;
      this.element.backupCuratorName = person.fullName;
    }
  }

  public displayOptionValue(value: DepartmentDefinition): string {
    return value.name;
  }

  private getInitialData(): void {
    const { element } = this.data;
    this.element = (element) ? element : new HumanResource();
    this.form = (element) ? this.setCurrentFormValue(element) : this.formInit();
  }

  private setCurrentFormValue(element: HumanResource): FormGroup {
    const department = { id: element.departmentCode, name: element.departmentName };
    return this.formBuilder.group({
      department: [department, Validators.required],
      main_curator: [{ value: element.MAIN_CURATOR, disabled: true }, Validators.required],
      backup_curator: [{ value: element.BACKUP_CURATOR, disabled: true }]
    });
  }

  private formInit(): FormGroup {
    return this.formBuilder.group({
      department: ['', Validators.required],
      main_curator: [{ value: '', disabled: true }, Validators.required],
      backup_curator: [{ value: '', disabled: true }]
    });
  }

}
