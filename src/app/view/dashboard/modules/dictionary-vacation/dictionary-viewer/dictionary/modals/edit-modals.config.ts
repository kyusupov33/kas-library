import { TableRouteTypes } from '@shared/model/table-builder/common/table-route-types.enum';
import { HumanResourceEditDialogComponent } from '@modules/dictionary-vacation/dictionary-viewer/dictionary/modals/human-resource-edit-dialog/human-resource-edit-dialog.component';
import { HumanResourceUserDialogComponent } from '@modules/dictionary-vacation/dictionary-viewer/dictionary/modals/human-resource-user-dialog/human-resource-user-dialog.component';
import { AssistantDialogComponent } from '@modules/dictionary-vacation/dictionary-viewer/dictionary/modals/assistant-dialog/assistant-dialog.component';
import { OtherSettingsEditDialogComponent } from '@modules/dictionary-vacation/dictionary-viewer/dictionary/modals/other-settings-edit-dialog/other-settings-edit-dialog.component';

export const EditModalsConfig = {
  [TableRouteTypes.HR_ROUTE]: HumanResourceEditDialogComponent,
  [TableRouteTypes.HR_USER]: HumanResourceUserDialogComponent,
  [TableRouteTypes.ASSISTANT]: AssistantDialogComponent,
  [TableRouteTypes.OTHER_SETTINGS]: OtherSettingsEditDialogComponent
};
