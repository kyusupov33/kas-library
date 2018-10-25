import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ConfirmDialogComponent } from '@app/view/dashboard/shared/components/confirm-dialog/confirm-dialog.component';
import { PaginationService } from '@app/view/dashboard/shared/services/pagination/pagination.service';
import { PAGINATION_LOCALE_PROVIDES } from '@app/view/dashboard/shared/services/pagination/locale/pagination-locale.config';
import { TableBuilderComponent } from '@app/view/dashboard/shared/components/table-builder/table-builder.component';
import { TableBuilderActionsComponent } from '@app/view/dashboard/shared/components/table-builder/table-builder-actions/table-builder-actions.component';
import { TableDataSortService } from '@app/view/dashboard/shared/services/table-data-sort/table-data-sort.service';

const COMPONENTS = [
  ConfirmDialogComponent,
  TableBuilderComponent,
  TableBuilderActionsComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [SharedModule],
  exports: [SharedModule, ...COMPONENTS],
  entryComponents: COMPONENTS,
  providers: [
    PaginationService,
    TableDataSortService,
    ...PAGINATION_LOCALE_PROVIDES
  ]
})
export class DashboardSharedModule {
}
