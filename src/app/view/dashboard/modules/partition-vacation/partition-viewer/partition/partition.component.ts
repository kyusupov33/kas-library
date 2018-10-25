import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ApiService } from '@core/services/api/api.service';
import { ManagerViewDepartment } from '@shared/model/department/manager-view-department.model';
import { fadeAnimation } from '@core/animation/fade.animation';
import { ApprovableMap } from '@modules/partition-vacation/partition-vacation.interface';
import { DashboardRoutesPagePath } from '@app/view/dashboard/dashboard-routes.enum';
import { PartitionApprove } from '@modules/partition-vacation/partition-viewer/partition/common/partition-approve.class';

@Component({
  selector: 'partition',
  templateUrl: './partition.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [fadeAnimation]
})
export class PartitionComponent {

  @Input() public name: string;
  @Input() public userId: string;
  @Input() public open: boolean;
  @Input() public withDepartments: boolean;
  @Input() public department: Partial<ManagerViewDepartment> = {};
  @Input() public departmentId: string = null;
  @Input() public showHead: boolean = null;
  @Input() public indeterminate: Partial<{ value: boolean }> = {};
  @Input() public year: number;

  public hasApproveEmployees: ApprovableMap;
  public scheduleRouteRoot = DashboardRoutesPagePath.SCHEDULE_VACATION;

  constructor(private api: ApiService) {
  }

  public load() {
    const emptyEmployees = !this.department || !this.department.employees;
    if (emptyEmployees) {
      this.getDepartment();
    }
  }

  private getDepartment() {
    const departmentInfo = { withDepartments: this.withDepartments, departmentId: this.departmentId };
    this.api.getDepartment(departmentInfo, this.year, this.userId)
      .subscribe((data: ManagerViewDepartment) => {
        this.department = data;
        this.hasApproveEmployees = PartitionApprove.findApproveEmployees(data.employees);
      });
  }

}
