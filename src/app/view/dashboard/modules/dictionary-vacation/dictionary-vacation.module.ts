import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardSharedModule } from '@app/view/dashboard/shared/dashboard-shared.module';
import { routes } from '@modules/dictionary-vacation/dictionary-vacation.routing';
import { DictionaryVacationComponent } from '@modules/dictionary-vacation/dictionary-vacation.component';
import { DictionaryViewerComponent } from '@modules/dictionary-vacation/dictionary-viewer/dictionary-viewer.component';
import { DictionaryHeadPanelComponent } from '@modules/dictionary-vacation/dictionary-viewer/dictionary/dictionary-head-panel/dictionary-head-panel.component';
import { DictionaryComponent } from '@modules/dictionary-vacation/dictionary-viewer/dictionary/dictionary.component';
import { DictionaryPanelActionsComponent } from '@modules/dictionary-vacation/dictionary-viewer/dictionary/dictionary-head-panel/dictionary-panel-actions/dictionary-panel-actions.component';
import { DictionaryRegistryService } from '@modules/dictionary-vacation/dictionary-viewer/common/dictionary-registry/dictionary-registry.service';
import { HumanResourceEditDialogComponent } from '@modules/dictionary-vacation/dictionary-viewer/dictionary/modals/human-resource-edit-dialog/human-resource-edit-dialog.component';
import { DictionarySubmitRegistryService } from '@modules/dictionary-vacation/dictionary-viewer/common/dictionary-submit-registry/dictionary-submit-registry.service';
import { HumanResourceUserDialogComponent } from './dictionary-viewer/dictionary/modals/human-resource-user-dialog/human-resource-user-dialog.component';
import { AssistantDialogComponent } from './dictionary-viewer/dictionary/modals/assistant-dialog/assistant-dialog.component';
import { OtherSettingsEditDialogComponent } from './dictionary-viewer/dictionary/modals/other-settings-edit-dialog/other-settings-edit-dialog.component';

const MODAL_COMPONENTS = [
  AssistantDialogComponent,
  HumanResourceEditDialogComponent,
  HumanResourceUserDialogComponent,
  OtherSettingsEditDialogComponent
];

@NgModule({
  imports: [
    DashboardSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    DictionaryVacationComponent,
    DictionaryViewerComponent,
    DictionaryHeadPanelComponent,
    DictionaryComponent,
    DictionaryPanelActionsComponent,
    ...MODAL_COMPONENTS
  ],
  entryComponents: [...MODAL_COMPONENTS],
  providers: [
    DictionaryRegistryService,
    DictionarySubmitRegistryService
  ]
})
export class DictionaryVacationModule {
}
