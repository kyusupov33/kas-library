import { Component, Injector } from '@angular/core';
import { TaskList } from '@modules/task-vacation/task-viewer/common/task-list.class';
import { fadeAnimation } from '@core/animation/fade.animation';
import { TaskResponseQueryModel } from '@shared/model/table-builder/tasks/task-response-query.model';
import { TaskRequestOptions } from '@modules/task-vacation/task-viewer/common/task-list.interface';

@Component({
  selector: 'task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [fadeAnimation]
})
export class TaskListComponent extends TaskList {

  constructor(context: Injector) {
    super(context);
  }

  public taskRequest(options: TaskRequestOptions): void {
    this.taskRegistry
      .getTaskByType(options)
      .subscribe((data: TaskResponseQueryModel) => {
        this.setTaskSourceData(data);
      });
  }

}
