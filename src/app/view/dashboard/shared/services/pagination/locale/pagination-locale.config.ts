import { MatPaginatorIntl } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { forwardRef } from '@angular/core';
import { PaginationLocaleService } from '@app/view/dashboard/shared/services/pagination/locale/pagination-locale.service';

export const PAGINATION_LOCALE_PROVIDES = [
  {
    provide: MatPaginatorIntl,
    useClass: forwardRef(() => PaginationLocaleService),
    deps: [TranslateService]
  }
];
