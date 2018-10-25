import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogPost } from '@app/view/dashboard/shared/components/action-panel-dialog/action-panel-dialog.component';
import { SafeHtml } from '@angular/platform-browser';

export interface DialogConfirmData {
  title: string;
  enableComment: boolean;
  content: SafeHtml;
  error?: string;
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  public comment: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent, DialogPost>,
              @Inject(MAT_DIALOG_DATA) public data: DialogConfirmData) {
  }

  public submit() {
    this.dialogRef.close({ success: true, data: this.comment });
  }

  public closeDialog() {
    this.dialogRef.close({ success: false, data: null });
  }

}
