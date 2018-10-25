import { Component, Input } from '@angular/core';
import { ApprovableEmployeeMap } from '@modules/partition-vacation/partition-vacation.interface';
import { ActivitiActionsPanelService } from '@app/view/dashboard/shared/services/activiti-actions-panel/activiti-actions-panel.service';
import { ApiService } from '@core/services/api/api.service';
import { Store } from '@ngxs/store';
import { AuthStore } from '@store/auth/auth.store';
import { mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentDialog } from '@app/view/dashboard/shared/components/action-panel-dialog/action-panel-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import {
  Action,
  ACTION_MATRIX,
  ACTION_TYPE,
  ActionResultInterface
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { ApplicationGrant } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.class';

@Component({
  selector: 'period-approve',
  templateUrl: './period-approve.component.html',
  styleUrls: ['./period-approve.component.scss']
})
export class PeriodApproveComponent {

  @Input() public approve: ApprovableEmployeeMap;
  private readonly userId: string;

  constructor(private actionPanel: ActivitiActionsPanelService,
              private api: ApiService,
              private store: Store,
              private sanitizer: DomSanitizer,
              private translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute) {
    this.userId = this.store.selectSnapshot(AuthStore.getAuthData).userId;
  }

  public submit() {
    const content = this.generateContent();
    const action: Partial<Action> = ApplicationGrant.getActionByType(ACTION_MATRIX, ACTION_TYPE.APPROVE);
    this.actionPanel.openModal(action, content, (data) => this.approvePeriod(data));
  }

  public approvePeriod(action: ActionResultInterface) {
    const applicationId = this.approve.applicationId;
    this.api.getTaskByApplicationIdAndAssignee(applicationId, this.userId)
      .pipe(mergeMap(({ id }) => this.api.approve(id, true, action.comment)))
      .subscribe(() => this.completeByApplicationId(applicationId));
  }

  private completeByApplicationId(applicationId: string) {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        completeApplicationId: applicationId
      }
    });
  }

  private generateContent(): ContentDialog {
    const partitionTitles = this.translate.instant('DASHBOARD.PARTITION_DIALOG');
    const titleKey = partitionTitles['TITLE'];
    const from = partitionTitles['DATE_FROM'];
    const to = partitionTitles['DATE_NEXT'];
    const content: ContentDialog = { titleKey, body: '' };

    let html = '';
    this.approve.periods.forEach((period) => {
      html += `${from} ${period.startDate} ${to} ${period.endDate} <br>`;
    });

    content.body = this.sanitizer.bypassSecurityTrustHtml(html);

    return content;
  }

}
