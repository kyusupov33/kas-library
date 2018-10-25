import { Injectable } from '@angular/core';
import { MatSort } from '@angular/material';

export class TableDataSortModel {
  public active: string;
  public direction: string;
}

@Injectable()
export class TableDataSortService {
  private tableDataSortModel: Partial<TableDataSortModel> = {
    active: '',
    direction: ''
  };

  get activeColumn(): string {
    return this.tableDataSortModel.active;
  }

  get sortDirection(): string {
    return this.tableDataSortModel.direction;
  }

  public changeActiveSortColumn(event: MatSort) {
    this.tableDataSortModel.active = event.active;
    this.tableDataSortModel.direction = event.direction;
  }
}
