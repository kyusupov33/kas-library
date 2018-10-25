import { Component, Injector } from '@angular/core';
import { PartitionTypeRoute } from '@modules/partition-vacation/partition-vacation.interface';
import { TranslateService } from '@ngx-translate/core';
import { TableViewerConfig } from '@shared/model/table-builder/common/table-viewer.config';
import { PartitionResponseQueryModel } from '@shared/model/table-builder/partition-export/partition-response-query.model';
import { plainToClass } from 'class-transformer';
import { PartitionExport } from '@shared/model/table-builder/partition-export/partition-export.model';
import { DictionaryModuleState } from '@store/dashboard/states/dictionary-module/dictionary-module.state';
import { DictionaryQueryRequest } from '@shared/model/table-builder/dictionary/dictionary-request-query.model';
import { AuthStore } from '@store/auth/auth.store';
import { PartitionViewer } from '@modules/partition-vacation/partition-viewer/partition/common/partition-viewer.class';
import { fadeAnimation } from '@core/animation/fade.animation';
import { DictionaryResponseQueryModel } from '@shared/model/table-builder/dictionary/dictionary-response-query.model';
import { Emittable, Emitter } from '@ngxs-labs/emitter';

interface PrintExcelDepartmentSubmit {
  action: string;
  index: number;
}

@Component({
  selector: 'print-excel-department',
  templateUrl: 'print-excel-department.component.html',
  styleUrls: ['print-excel-department.component.scss'],
  animations: [fadeAnimation]
})
export class PrintExcelDepartmentComponent extends PartitionViewer {

  @Emitter(DictionaryModuleState.setTasks)
  public dictionaryStateSetTask: Emittable<DictionaryResponseQueryModel>;

  public dataSource: PartitionExport[];
  public headers: string[];
  public readonly TableViewerConfig = TableViewerConfig;
  public readonly partitionRoutesType: PartitionTypeRoute;
  private translate: TranslateService;

  constructor(context: Injector) {
    super(context);
    this.translate = context.get(TranslateService);
    this.partitionRoutesType = this.getTableRouteTypesFromRoute();
  }

  public ngOnInit() {
    super.ngOnInit();
    this.setTableHeaders();
    this.getDepartmentData();
  }

  public submit({ index }: PrintExcelDepartmentSubmit) {
    const element = !isNaN(index) ?
      this.store.selectSnapshot(DictionaryModuleState.getDictionaryContent)[index] :
      null;
    if (element) {
      this.printDepartmentExcel(this.yearByRoute, element.departmentCode);
    }
  }

  private setTableHeaders(): void {
    const mapTitles = this.translate.instant(`DASHBOARD.TABLE.MODELS.${this.partitionRoutesType.tableType}`);
    this.headers = Object.keys(mapTitles);
  }

  private getDepartmentData() {
    const body: DictionaryQueryRequest<PartitionExport> = new DictionaryQueryRequest();
    const employeeId = this.store.selectSnapshot(AuthStore.getAuthData).employeeId;
    body.pageRequest.page = 0;
    body.pageRequest.size = 100;
    body.probe.employeeId = employeeId;
    body.pageRequest.sortList = [{ direction: 'DESC', property: 'id' }];
    this.api.getDepartments(body).subscribe((data: PartitionResponseQueryModel<PartitionExport>) => {
      this.dictionaryStateSetTask.emit(data);
      this.dataSource = plainToClass(PartitionExport, data.content);
    });
  }

  private getTableRouteTypesFromRoute(): PartitionTypeRoute {
    const typeRoute = this.route.snapshot.data as PartitionTypeRoute;
    return Object.keys(typeRoute).length ? typeRoute : null;
  }

}
