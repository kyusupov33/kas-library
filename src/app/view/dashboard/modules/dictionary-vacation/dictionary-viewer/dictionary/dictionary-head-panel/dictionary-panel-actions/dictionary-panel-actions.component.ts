import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  TABLE_BUILDER_ACTION_TYPE,
  TableBuilderActionMap
} from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.interface';
import { TranslateService } from '@ngx-translate/core';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';

@Component({
  selector: 'dictionary-panel-actions',
  templateUrl: './dictionary-panel-actions.component.html',
  styleUrls: ['./dictionary-panel-actions.component.scss']
})
export class DictionaryPanelActionsComponent {
  @Input() public type: TableRouteTypes;
  @Input() public actions: TABLE_BUILDER_ACTION_TYPE[];
  public TableBuilderActionMap = TableBuilderActionMap;

  @Output() public onSubmit = new EventEmitter();

  constructor(private translateService: TranslateService) {
  }

  public translate(key: string): string {
    return this.translateService.instant(`DASHBOARD.DICTIONARY.PANEL_BTN.${this.type}.${key}`);
  }

  public submit(action: TABLE_BUILDER_ACTION_TYPE): void {
    this.onSubmit.emit({ action });
  }

}
