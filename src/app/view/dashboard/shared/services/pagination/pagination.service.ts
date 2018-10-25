import { Injectable } from '@angular/core';
import { PageEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '@core/services/logger/logger.service';

export class PaginationModel {
  public pageIndex: number;
  public pageSize: number;
  public pageTotal: number;
}

@Injectable()
export class PaginationService {
  private paginationModel: Partial<PaginationModel> = {
    pageIndex: 0,
    pageSize: 20,
    pageTotal: 0
  };

  constructor(private logger: LoggerService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  get page(): number {
    return this.paginationModel.pageIndex;
  }

  get pageCount(): number {
    return this.paginationModel.pageSize;
  }

  get pageTotal(): number {
    return this.paginationModel.pageTotal;
  }

  set pageTotal(value: number) {
    this.paginationModel.pageTotal = value;
  }

  public async setQueryParams({ page, size }) {
    const queryParams = { ...this.route.snapshot.queryParams, page, size };
    await this.router.navigate([], { relativeTo: this.route, queryParams });
  }

  public change(pageEvent: PageEvent) {
    this.paginationModel.pageIndex = pageEvent.pageIndex;
    this.paginationModel.pageSize = pageEvent.pageSize;
    this.setQueryParams({ page: pageEvent.pageIndex, size: pageEvent.pageSize })
      .then(() => this.logger.trace('pageEvent', pageEvent))
      .catch((err: Error) => this.logger.error(err));
  }

}
