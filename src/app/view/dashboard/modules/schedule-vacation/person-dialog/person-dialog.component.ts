import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { Person } from '@shared/model/person/person.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MODAL_CONFIG } from '@shared/config/modal.config';
import { PersonFinderComponent } from '@app/view/dashboard/shared/components/person-finder/person-finder.component';

@Component({
  selector: 'person-dialog',
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonDialogComponent implements OnChanges {

  @Input() public dataId: string;
  @Input() public titleKey: string;
  @Input() public person: Person = new Person();
  @Input() public exclude: Person[] = [];
  @Input() public editable: boolean = true;
  @Input() public removable: boolean;
  @Input() public required: boolean;
  @Output() public upload: EventEmitter<Person> = new EventEmitter();

  public personForm: FormGroup;
  public readonly primaryKey = 'fullName';

  constructor(private builder: FormBuilder, public dialog: MatDialog) {
  }

  public ngOnChanges() {
    this.initialForm();
  }

  public searchPearson() {
    if (this.editable) {
      const exclude = this.exclude;
      const fullName = this.personForm.get(this.primaryKey).value;
      const data = { fullName, exclude };
      const params = { ...MODAL_CONFIG, data };
      const dialogRef = this.dialog.open(PersonFinderComponent, params);
      dialogRef.afterClosed().subscribe((person) => this.emit(person));
    }
  }

  public deletePearson() {
    this.emit(new Person());
  }

  private initialForm() {
    const required = this.required ? [Validators.required] : [];
    const { fullName, positionName } = this.person;
    const inputValue = fullName ? `${fullName} (${positionName})` : null;
    const formValue = { value: inputValue, disabled: true };
    const personFormGroup = { [this.primaryKey]: [formValue, Validators.compose(required)] };
    this.personForm = this.builder.group(personFormGroup);
  }

  private emit(person) {
    if (person instanceof Person) {
      this.upload.emit(person);
    }
  }

}
