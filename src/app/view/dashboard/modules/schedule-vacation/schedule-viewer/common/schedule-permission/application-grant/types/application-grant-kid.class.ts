import { ApplicationGrantOptions } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { ApplicationGrantOsnp } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/types/application-grant-osnp.class';

export class ApplicationGrantKid extends ApplicationGrantOsnp {

  constructor(options: ApplicationGrantOptions) {
    super(options);
  }

}
