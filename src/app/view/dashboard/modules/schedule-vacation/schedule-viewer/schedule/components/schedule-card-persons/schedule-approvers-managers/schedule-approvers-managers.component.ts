import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Application } from '@shared/model/application/application.model';
import { Person } from '@shared/model/person/person.model';
import { Store } from '@ngxs/store';
import { ManagerState } from '@store/dashboard/states/manager/manager.state';
import { EditableTypeInterface } from '@modules/schedule-vacation/schedule-viewer/common/schedule-permission/application-grant/application-grant.interface';
import { Emittable, Emitter } from '@ngxs-labs/emitter';
import { ScheduleState } from '@store/dashboard/states/schedule/schedule.state';

interface PersonKey {
  [key: string]: Person;
}

@Component({
  selector: 'schedule-approvers-managers',
  templateUrl: './schedule-approvers-managers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ScheduleApproversManagersComponent implements OnChanges {

  @Input() public application: Application;
  @Input() public editableType: EditableTypeInterface;

  @Emitter(ScheduleState.setSchedulePersons)
  public setSchedulePersons: Emittable<PersonKey>;

  public excludeList: Person[] = [];
  public manager: Person;

  constructor(private store: Store) {
    this.manager = this.store.selectSnapshot(ManagerState.getUser);
  }

  public ngOnChanges() {
    this.excludeList = this.getExcludeList();
  }

  public updateApplicationApprovers(key: string, person: Person) {
    const personValue = { [key]: person };
    this.setSchedulePersons.emit(personValue);
  }

  private getExcludeList() {
    return [
      this.application.manager,
      this.application.firstApprover,
      this.application.secondApprover,
      this.application.initiator
    ];
  }

}
