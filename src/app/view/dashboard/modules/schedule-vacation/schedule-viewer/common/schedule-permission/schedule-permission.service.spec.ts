import { SchedulePermissionService } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/schedule-permission.service';
import { APPLICATION_TYPE } from '@shared/model/activiti/tasks/task-type.enum';
import * as Helpers from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/helpers/spec.helper';

describe('[TEST]: Permission service', function () {
  let service: SchedulePermissionService = null;

  beforeEach(() => service = new SchedulePermissionService(Helpers.MockLogger));

  it('Should be correct work permission factory', () => {
    const options = { application: null, isTask: false, userId: null };
    const builder = service.permissionFactoryByType(APPLICATION_TYPE.SCHED, options);
    expect(builder).toBeTruthy();
  });

  it('Should be correct exception', () => {
    try {
      service.permissionFactoryByType(null, null);
    } catch (e) {
      expect(e.message).toEqual('Not found options for permission factory or incorrect application type');
    }
  });

});
