import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { Schedule } from '@modules/schedule-vacation/schedule-viewer/common/schedule.class';
import { catchError, mergeMap } from 'rxjs/operators';
import { fadeAnimation } from '@core/animation/fade.animation';
import { TaskDataType } from '@shared/model/activiti/tasks/task-data.model';
import { Application } from '@shared/model/application/application.model';
import { EMPTY, Observable, of } from 'rxjs';
import { IdentityLinks } from '@shared/model/table-builder/tasks/common/identity-links.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'schedule-by-task',
  templateUrl: './schedule-by-task.component.html',
  styleUrls: ['./schedule-by-task.component.scss'],
  animations: [fadeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleByTaskComponent extends Schedule {

  @Input() public taskId: string;
  @Input() public applicationId: string;
  @Input() public completed: boolean;

  public notAuthorizedForTask: boolean = false;
  public taskNotFound: boolean = false;

  constructor(context: Injector) {
    super(context);
  }

  public scheduleOnInitOrUpdate() {
    this.logger.debug('[OnInit ScheduleByIdComponent], taskId', this.taskId);
    if (this.completed) {
      this.getApplicationById(this.applicationId);
    } else {
      this.api.getTaskById(this.taskId).pipe(
        mergeMap((task: TaskDataType) => (task) ? of(task) : EMPTY),
        mergeMap((task: TaskDataType) => this.getIdentityLinks(task.id)),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.taskBeClosed();
          }
          return EMPTY;
        })
      ).subscribe((id) => this.getApplicationByTaskId(id));
    }
  }

  private getIdentityLinks(taskId: string): Observable<string> {
    return this.api.getIdentityLinks(taskId).pipe(
      mergeMap((identityLinks: IdentityLinks[]) => {
        const user = identityLinks.find((item) => item.user === this.userId);
        this.notAuthorizedForTask = !user;
        this.detectChanges();
        return (user) ? of(this.taskId) : EMPTY;
      })
    );
  }

  private getApplicationById(applicationId) {
    this.api.getApplicationById(applicationId)
      .subscribe((application: Application) => {
        if (application) {
          this.scheduleAfterOnInit(application);
        } else {
          this.taskBeClosed();
        }
      });
  }

  private getApplicationByTaskId(taskId: string) {
    this.api.getApplicationByTaskId(taskId)
      .pipe(mergeMap((task: TaskDataType) => {
        this.logger.trace('[Variables]', task.variables);
        const applicationId = task.getVariable('applicationId').value;
        return this.api.getApplicationById(applicationId);
      }))
      .subscribe((application: Application) => {
        if (application) {
          this.scheduleAfterOnInit(application);
        } else {
          this.taskBeClosed();
        }
      });
  }

  private taskBeClosed() {
    this.taskNotFound = true;
    this.scheduleIsLoaded = false;
    this.detectChanges();
  }

}
