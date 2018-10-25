import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskVacationInterface } from '@modules/task-vacation/task-vacation.interface';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TableViewerConfig } from '@shared/model/table-builder/common/table-viewer.config';
import { TaskModuleState } from '@store/dashboard/states/task-module/task-module.state';
import { TaskResponseQueryModel } from '@shared/model/table-builder/tasks/task-response-query.model';

@Component({
  selector: 'task-viewer',
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.scss']
})
export class TaskViewerComponent {
  public readonly taskRoutesType: TaskVacationInterface;
  public readonly TaskViewerConfig = TableViewerConfig;

  @Select(TaskModuleState.getTasksData)
  public readonly dataSource$: Observable<TaskResponseQueryModel>;

  constructor(private route: ActivatedRoute) {
    this.taskRoutesType = this.getTableRouteTypesFromRoute();
  }

  private getTableRouteTypesFromRoute(): TaskVacationInterface {
    const typeRoute = this.route.snapshot.data as TaskVacationInterface;
    return Object.keys(typeRoute).length ? typeRoute : null;
  }

}
