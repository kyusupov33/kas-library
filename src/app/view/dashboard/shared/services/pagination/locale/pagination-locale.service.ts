import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

@Injectable()
export class PaginationLocaleService extends MatPaginatorIntl {

  public firstPageLabel: string;
  public lastPageLabel: string;
  public itemsPerPageLabel: string;
  public nextPageLabel: string;
  public previousPageLabel: string;
  public getRangeLabel: (page: number, pageSize: number, length: number) => string;

  constructor(public translate: TranslateService) {
    super();
    this.init();
  }

  public init() {
    this.translateLabels();
    this.getRangeLabel = this.rangeLocale;
  }

  private rangeLocale(page: number, pageSize: number, length: number) {
    let result;

    const OF_TEXT = this.translate.instant('DASHBOARD.PAGINATION.OF');
    const EMPTY = length === 0 || pageSize === 0;

    if (EMPTY) {
      result = `0 ${OF_TEXT} ${length}`;
    } else {
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      result = `${startIndex + 1} - ${endIndex} ${OF_TEXT} ${length}`;
    }

    return result;

  }

  private translateLabels(): void {
    this.firstPageLabel = this.translate.instant('DASHBOARD.PAGINATION.FIRST_PAGE');
    this.lastPageLabel = this.translate.instant('DASHBOARD.PAGINATION.LAST_PAGE');
    this.itemsPerPageLabel = this.translate.instant('DASHBOARD.PAGINATION.ITEMS_PER_PAGE');
    this.nextPageLabel = this.translate.instant('DASHBOARD.PAGINATION.NEXT_PAGE_LABEL');
    this.previousPageLabel = this.translate.instant('DASHBOARD.PAGINATION.PREVIOUS_PAGE_LABEL');
  }
}
