import { Component, OnInit } from '@angular/core';
import { SerialDate } from '@core/utils/date/date.class';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public nextYear = { year: SerialDate.yearType.NEXT };

  constructor() { }

  public ngOnInit() {
  }

}
