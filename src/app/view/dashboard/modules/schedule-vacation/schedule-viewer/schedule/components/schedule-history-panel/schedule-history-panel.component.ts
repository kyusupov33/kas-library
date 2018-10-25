import { ChangeDetectorRef, Component, Input, ViewRef } from '@angular/core';
import { ApiService } from '@core/services/api/api.service';
import { fadeAnimation } from '@core/animation/fade.animation';

@Component({
  selector: 'schedule-history-panel',
  templateUrl: './schedule-history-panel.component.html',
  styleUrls: ['./schedule-history-panel.component.scss'],
  animations: [fadeAnimation]
})
export class ScheduleHistoryPanelComponent {

  @Input() public userId: string;
  @Input() public year: number;
  public historyList: any[] = [];

  constructor(private api: ApiService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.getScheduleHistoryList();
  }

  private getScheduleHistoryList(): void {
    this.api.getScheduleHistory(this.userId, this.year)
      .subscribe((data) => {
        this.historyList = data || [];
        this.detectChanges();
      });
  }

  protected detectChanges() {
    if (!(this.changeDetectorRef as ViewRef).destroyed) {
      this.changeDetectorRef.detectChanges();
    }
  }

}
