import { Component, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialog, MatDialogRef } from '@angular/material';
import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import { EMPTY } from 'rxjs';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { DepartmentDefinition } from '@shared/model/department/DepartmentDefinition';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api/api.service';
import { LoggerService } from '@core/services/logger/logger.service';
import { SpinnerService } from '@core/services/spinner/spinner.service';
import { NotificationsService } from 'angular2-notifications';
import { Assistant } from '@shared/model/table-builder/dictionary/entities/assistant/assistant.model';
import { MODAL_CONFIG } from '@shared/config/modal.config';
import { PersonFinderComponent } from '@app/view/dashboard/shared/components/person-finder/person-finder.component';
import { Person } from '@shared/model/person/person.model';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  element: Assistant;
}

@Component({
  selector: 'assistant-dialog',
  templateUrl: './assistant-dialog.component.html',
  styleUrls: ['./assistant-dialog.component.scss']
})
export class AssistantDialogComponent {
  public TableRouteTypes = TableRouteTypes;
  public departmentDefinition: DepartmentDefinition;
  public element: Assistant;
  public tableAction = TABLE_BUILDER_ACTION_TYPE;
  public dialog: MatDialog;
  public form: FormGroup;
  private timer: number;
  private api: ApiService;
  private logger: LoggerService;
  private spinner: SpinnerService;
  private notify: NotificationsService;
  private formBuilder: FormBuilder;
  private translateService: TranslateService;

  constructor(context: Injector,
              public dialogRef: MatDialogRef<AssistantDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.api = context.get(ApiService);
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
    const content = this.translateService.instant('DASHBOARD.TABLE.WARNINGS.MODELS.ASSISTANT');
    if (this.element.departmentName && this.element.userId) {
      this.dialogRef.close({ success: true, element: this.element, action });
    } else {
      this.notify.warn(title, content);
      return EMPTY;
    }
  }

  public closeDialog() {
    this.dialogRef.close({ success: false });
  }

  public searchPerson(): void {
    const data = { fullName: '', exclude: [] };
    const params = { ...MODAL_CONFIG, data };
    const dialogRef = this.dialog.open(PersonFinderComponent, params);
    dialogRef.afterClosed().subscribe((person) => this.setPerson(person));
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

  public setDepartment(event: MatAutocompleteSelectedEvent): void {
    const { id, name } = event.option.value;
    this.element.departmentName = name ? name : null;
    this.element.departmentCode = id ? id : null;
  }

  public setPerson(person: Person): void {
    if (person) {
      this.element.employeeId = person.employeeId;
      this.element.userId = person.userId;
      this.element.fullName = person.fullName;
      this.element.email = person.email;
    }
  }

  public displayOptionValue(value: DepartmentDefinition): string {
    return value.name;
  }

  private getInitialData(): void {
    const { element } = this.data;
    this.element = (element) ? element : new Assistant();
    this.form = (element) ? this.setCurrentFormValue(element) : this.formInit();
  }

  private setCurrentFormValue(element: Assistant): FormGroup {
    const department = { id: element.departmentCode, name: element.departmentName };
    return this.formBuilder.group({
      department: [department, Validators.required],
      person: [{ value: element.FULL_NAME, disabled: true }, Validators.required]
    });
  }

  private formInit(): FormGroup {
    return this.formBuilder.group({
      department: ['', Validators.required],
      person: [{ value: '', disabled: true }, Validators.required]
    });
  }

}
