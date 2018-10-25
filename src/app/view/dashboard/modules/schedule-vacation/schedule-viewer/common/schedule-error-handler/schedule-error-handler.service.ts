import { Injectable, Injector } from '@angular/core';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';
import { Application } from '@shared/model/application/application.model';
import { LoggerService } from '@core/services/logger/logger.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';

export interface ErrorDataTransfer {
  error: Error;
  application: Application;
}

@Injectable()
export class ScheduleErrorHandlerService {

  protected logger: LoggerService;
  protected translate: TranslateService;
  protected notify: NotificationsService;

  constructor(context: Injector) {
    this.logger = context.get(LoggerService);
    this.translate = context.get(TranslateService);
    this.notify = context.get(NotificationsService);
  }

  public catchError({ error, application }: ErrorDataTransfer) {
    this.logger.error(error);
    if (application.type.code === APPLICATION_TYPE.CORR) {
      const name = this.translate.instant('DASHBOARD.ERROR_CODE.CORR_NAME');
      const message = this.translate.instant('DASHBOARD.ERROR_CODE.CORR');
      this.notify.warn(name, message);
    } else if (application.type.code === APPLICATION_TYPE.FACT) {
      const name = this.translate.instant('DASHBOARD.ERROR_CODE.ERROR_TITLE');
      const message = this.translate.instant('DASHBOARD.ERROR_CODE.NOT_FOUND_ROUTE');
      this.notify.warn(name, `${message} - ${application.initiator.departmentName}`);
    } else {
      throw error;
    }
  }

}
