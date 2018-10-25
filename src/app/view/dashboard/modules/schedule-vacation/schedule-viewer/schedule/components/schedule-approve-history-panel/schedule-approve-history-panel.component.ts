import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from '@core/services/api/api.service';
import { HistoryListResponse } from '@shared/model/history-list/history-list-response.model';
import { MatSort, MatTableDataSource } from '@angular/material';
import { plainToClass } from 'class-transformer';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'schedule-approve-history-panel',
  templateUrl: './schedule-approve-history-panel.component.html',
  styleUrls: ['./schedule-approve-history-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleApproveHistoryPanelComponent implements OnInit {

  @Input() public logs: HistoryListResponse[] = [];
  @Input() public id: string | number;
  public approveHistoryTableHeaders: string[] = [];
  public dataSource: MatTableDataSource<HistoryListResponse>;

  @ViewChild(MatSort) public sort: MatSort;
  public dataLoading: boolean = false;

  constructor(private api: ApiService,
              private cd: ChangeDetectorRef,
              private translateService: TranslateService) {
    const mapTitles = this.translateService.instant('DASHBOARD.APPROVAL_HISTORY');
    this.approveHistoryTableHeaders = Object.keys(mapTitles);
  }

  public ngOnInit() {
    this.getApproveHistoryList();
  }

  private getApproveHistoryList(): void {
    if (this.id) {
      this.api.getHistoryList(this.id).subscribe((response: HistoryListResponse[]) => {
        this.setHistoryPanel(response);
      });
    } else if (this.logs) {
      this.setHistoryPanel(this.logs);
    }
  }

  private setHistoryPanel(logs: HistoryListResponse[]) {
    this.dataSource = new MatTableDataSource(plainToClass(HistoryListResponse, logs));
    this.dataSource.sort = this.sort;
    this.dataLoading = true;
    this.cd.detectChanges();
  }

}
