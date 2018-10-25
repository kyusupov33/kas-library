import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { PartitionViewer } from '@modules/partition-vacation/partition-viewer/partition/common/partition-viewer.class';
import { PartitionSelectCalendar } from '@modules/partition-vacation/partition-vacation.interface';
import { MODAL_CONFIG } from '@shared/config/modal.config';
import { LegendProcessInfoComponent } from '@app/view/dashboard/shared/components/legend-process-info/legend-process-info.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'partition-viewer',
  templateUrl: './partition-viewer.component.html',
  styleUrls: ['./partition-viewer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PartitionViewerComponent extends PartitionViewer {

  public readonly indeterminate: PartitionSelectCalendar = { value: false };
  private dialog: MatDialog;

  constructor(context: Injector) {
    super(context);
    this.dialog = context.get(MatDialog);
  }

  public openLegend() {
    const params = { ...MODAL_CONFIG, data: null };
    this.dialog.open(LegendProcessInfoComponent, params);
  }

}
