import { Component } from '@angular/core';

@Component({
  selector: 'dictionary-head-panel',
  styleUrls: ['./dictionary-head-panel.component.scss'],
  template: `
    <mat-toolbar>
      <mat-toolbar-row fxLayoutAlign="space-between center">
        <ng-content></ng-content>
      </mat-toolbar-row>
    </mat-toolbar>`
})
export class DictionaryHeadPanelComponent {
}
