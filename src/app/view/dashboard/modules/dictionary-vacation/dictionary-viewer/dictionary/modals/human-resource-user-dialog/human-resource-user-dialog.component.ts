import { Component, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { EMPTY } from 'rxjs';
import { HumanResourceUser } from '@shared/model/table-builder/dictionary/entities/hr-user/human-resource-user.model';
import { MODAL_CONFIG } from '@shared/config/modal.config';
import { PersonFinderComponent } from '@app/view/dashboard/shared/components/person-finder/person-finder.component';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  element: HumanResourceUser;
}

@Component({
  selector: 'human-resource-user-dialog',
  templateUrl: './human-resource-user-dialog.component.html',
  styleUrls: ['./human-resource-user-dialog.component.scss']
})
export class HumanResourceUserDialogComponent {
  public TableRouteTypes = TableRouteTypes;
  public element: HumanResourceUser;
  public tableAction = TABLE_BUILDER_ACTION_TYPE;
  public dialog: MatDialog;
  public form: FormGroup;
  private notify: NotificationsService;
  private formBuilder: FormBuilder;
  private translateService: TranslateService;

  constructor(context: Injector,
              public dialogRef: MatDialogRef<HumanResourceUserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialog = context.get(MatDialog);
    this.notify = context.get(NotificationsService);
    this.formBuilder = context.get(FormBuilder);
    this.translateService = context.get(TranslateService);
    this.getInitialData();
  }

  public submit(action: TABLE_BUILDER_ACTION_TYPE) {
    const title = this.translateService.instant('DASHBOARD.TABLE.WARNINGS.TITLE');
    const content = this.translateService.instant('DASHBOARD.TABLE.WARNINGS.MODELS.HR_USER');
    if (this.element.userId) {
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

  public setPerson(person): void {
    if (person) {
      this.element = person;
    }
  }

  private getInitialData(): void {
    const { element } = this.data;
    this.element = (element) ? element : new HumanResourceUser();
    this.form = (element) ? this.setCurrentFormValue(element) : this.formInit();
  }

  private setCurrentFormValue(element: HumanResourceUser): FormGroup {
    return this.formBuilder.group({
      person: [{ value: element.FULL_NAME, disabled: true }, Validators.required]
    });
  }

  private formInit(): FormGroup {
    return this.formBuilder.group({
      person: [{ value: '', disabled: true }, Validators.required]
    });
  }
}
