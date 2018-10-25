import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SerialDate } from '@core/utils/date/date.class';

@Component({
  selector: 'partition-switch-year',
  templateUrl: './partition-switch-year.component.html',
  styleUrls: ['./partition-switch-year.component.scss']
})
export class PartitionSwitchYearComponent {

  @Input() public year: number;

  public nextYear = { year: SerialDate.yearType.NEXT };

  public selected = {
    [SerialDate.yearType.CURRENT]: false,
    [SerialDate.yearType.NEXT]: true
  };

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  public static setYearType(isNextYear: boolean): number {
    const yearType = SerialDate.yearType;
    return isNextYear ? yearType.NEXT : yearType.CURRENT;
  }

  public changeYearByTypeType(isNextYear: boolean): number {
    const year = PartitionSwitchYearComponent.setYearType(isNextYear);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { year }
    }).then();

    return year;
  }

}
