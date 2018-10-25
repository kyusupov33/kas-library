import { Injectable } from '@angular/core';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';
import { ApplicationGrant } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.class';
import { ApplicationGrantSched } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-sched.class';
import { LoggerService } from '@core/services/logger/logger.service';
import { ApplicationGrantFact } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-fact.class';
import { ApplicationGrantCorrect } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-correct.class';
import { ApplicationGrantOsoe } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-osoe.class';
import { ApplicationGrantOsnp } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-osnp.class';
import { ApplicationGrantOptions } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { ApplicationGrantKid } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-kid.class';
import { ApplicationGrantPreg } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-preg.class';
import { ApplicationGrantStud } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-stud.class';

interface Class {
  new(...args: any[]): any;
}

@Injectable()
export class SchedulePermissionService {

  private supplier: Map<APPLICATION_TYPE, typeof ApplicationGrant> = new Map();

  constructor(public logger: LoggerService) {
    this.registryOnInit();
  }

  public permissionFactoryByType(type: APPLICATION_TYPE, options: ApplicationGrantOptions): ApplicationGrant {
    this.logger.trace('Permission factory', type, options);
    const Grant: Class = this.supplier.get(type) as any;
    const invalidInstance = !options || !Grant;

    if (invalidInstance) {
      throw new Error('Not found options for permission factory or incorrect application type');
    }

    return new Grant(options);
  }

  private registryOnInit() {
    this.supplier.set(APPLICATION_TYPE.SCHED, ApplicationGrantSched);
    this.supplier.set(APPLICATION_TYPE.FACT, ApplicationGrantFact);
    this.supplier.set(APPLICATION_TYPE.CORR, ApplicationGrantCorrect);
    this.supplier.set(APPLICATION_TYPE.OSNP, ApplicationGrantOsnp);
    this.supplier.set(APPLICATION_TYPE.OSOE, ApplicationGrantOsoe);
    this.supplier.set(APPLICATION_TYPE.KID, ApplicationGrantKid);
    this.supplier.set(APPLICATION_TYPE.PREG, ApplicationGrantPreg);
    this.supplier.set(APPLICATION_TYPE.STUD, ApplicationGrantStud);
  }

}
