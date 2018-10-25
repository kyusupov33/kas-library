import { Component, EventEmitter, Input, OnChanges, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTable, PageEvent } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import {
  SubmitActionInterface,
  TableBuilderInterface
} from '@app/view/dashboard/shared/components/table-builder/table-builder.interface';
import { PageConfigInterface, PAGINATION_CONFIG } from '@shared/config/pagination.config';
import { PaginationService } from '@app/view/dashboard/shared/services/pagination/pagination.service';
import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { TableDataSortService } from '@app/view/dashboard/shared/services/table-data-sort/table-data-sort.service';

@Component({
  selector: 'table-builder',
  templateUrl: './table-builder.component.html',
  styleUrls: ['./table-builder.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableBuilderComponent implements TableBuilderInterface, OnChanges {
  @ViewChild(MatSort) public sort: MatSort;
  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatTable) public table: MatTable<object>;

  @Input() public pagination: boolean;
  @Input() public sortable: boolean;
  @Input() public type: TableRouteTypes;
  @Input() public dataSource: object;
  @Input() public headers: string[];
  @Input() public actions: string[];
  @Output() public onSubmit = new EventEmitter<SubmitActionInterface>();
  @Output() public setTableDataByPage: EventEmitter<void> = new EventEmitter();

  public PAGINATION_CONFIG: PageConfigInterface = PAGINATION_CONFIG;

  constructor(private translateService: TranslateService,
              private tableDataSortService: TableDataSortService,
              public paginationService: PaginationService) {
  }

  public ngOnChanges() {
    this.refreshTable();
  }

  public submit(action: string, index: number) {
    this.onSubmit.emit({ action, index });
  }

  public sortData(event: MatSort) {
    this.tableDataSortService.changeActiveSortColumn(event);
    this.setTableDataByPage.emit();
  }

  public switchTableDataOnPageEvent(page: PageEvent): void {
    this.paginationService.change(page);
    this.setTableDataByPage.emit();
  }

  public translate(key: string): string {
    return this.translateService.instant(`DASHBOARD.TABLE.MODELS.${this.type}.${key}`);
  }

  private refreshTable(): void {
    if (this.table.dataSource) {
      this.table.renderRows();
    }
  }

}
