import { Component, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TABLE_BUILDER_ACTION_TYPE } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { EMPTY } from 'rxjs';
import { OtherSettings } from '@shared/model/table-builder/dictionary/entities/other-settings/other-settings.model';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  element: OtherSettings;
}

@Component({
  selector: 'other-settings-edit-dialog',
  templateUrl: './other-settings-edit-dialog.component.html',
  styleUrls: ['./other-settings-edit-dialog.component.scss']
})
export class OtherSettingsEditDialogComponent {
  public TableRouteTypes = TableRouteTypes;
  public element: OtherSettings;
  public tableAction = TABLE_BUILDER_ACTION_TYPE;
  public dialog: MatDialog;
  public form: FormGroup;
  private notify: NotificationsService;
  private formBuilder: FormBuilder;
  private translateService: TranslateService;

  constructor(context: Injector,
              public dialogRef: MatDialogRef<OtherSettingsEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialog = context.get(MatDialog);
    this.notify = context.get(NotificationsService);
    this.formBuilder = context.get(FormBuilder);
    this.translateService = context.get(TranslateService);
    this.getInitialData();
  }

  public submit(action: TABLE_BUILDER_ACTION_TYPE, form: FormGroup) {
    const title = this.translateService.instant('DASHBOARD.TABLE.WARNINGS.TITLE');
    const content = this.translateService.instant('DASHBOARD.TABLE.WARNINGS.MODELS.OTHER_SETTINGS');
    if (this.form.valid) {
      this.element.value = form.value;
      this.dialogRef.close({ success: true, element: this.element, action });
    } else {
      this.notify.warn(title, content);
      return EMPTY;
    }
  }

  public closeDialog() {
    this.dialogRef.close({ success: false });
  }

  private getInitialData(): void {
    const { element } = this.data;
    this.element = (element) ? element : new OtherSettings();
    this.form = (element) ? this.setCurrentFormValue(element) : this.formInit();
  }

  private setCurrentFormValue(element: OtherSettings): FormGroup {
    const pattern = /^[a-zA-Zа-яёЁА-Я0-9]/;
    return this.formBuilder.group({
      value: [element.VALUE, [Validators.required, Validators.pattern(pattern)]]
    });
  }

  private formInit(): FormGroup {
    return this.formBuilder.group({
      value: ['', Validators.required]
    });
  }

}
