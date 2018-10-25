import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardSharedModule } from '@app/view/dashboard/shared/dashboard-shared.module';
import { TaskVacationComponent } from '@modules/task-vacation/task-vacation.component';
import { TaskViewerComponent } from '@modules/task-vacation/task-viewer/task-viewer.component';
import { routes } from '@modules/task-vacation/task-vacation.routing';
import { TaskListComponent } from './task-viewer/task-list/task-list.component';
import { TaskRegistryService } from '@modules/task-vacation/task-viewer/common/task-registry/task-registry.service';
import { TaskSubmitRegistryService } from '@modules/task-vacation/task-viewer/common/task-submit-registry/task-submit-registry.service';

@NgModule({
  imports: [
    DashboardSharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TaskVacationComponent,
    TaskViewerComponent,
    TaskListComponent
  ],
  providers: [
    TaskRegistryService,
    TaskSubmitRegistryService
  ]
})
export class TaskVacationModule {
}
