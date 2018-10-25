import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableBuilderActionMap } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';

@Component({
  selector: 'table-builder-actions',
  templateUrl: './table-builder-actions.component.html',
  styleUrls: ['./table-builder-actions.component.scss']
})
export class TableBuilderActionsComponent {
  @Input() public actions: string[];

  @Output() public onClick = new EventEmitter();

  public TableBuilderActionMap = TableBuilderActionMap;

  public submit(action) {
    this.onClick.emit(action);
  }

}
