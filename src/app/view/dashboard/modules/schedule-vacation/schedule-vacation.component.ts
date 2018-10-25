import { fadeAnimation } from '@core/animation/fade.animation';
import { Component } from '@angular/core';

@Component({
  selector: 'schedule-vacation',
  template: `<router-outlet></router-outlet>`,
  animations: [fadeAnimation]
})
export class ScheduleVacationComponent {
}
