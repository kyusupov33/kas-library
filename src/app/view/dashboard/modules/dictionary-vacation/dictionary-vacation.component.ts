import { Component } from '@angular/core';
import { fadeAnimation } from '@core/animation/fade.animation';

@Component({
  selector: 'dictionary-vacation',
  template: `
    <router-outlet></router-outlet>`,
  animations: [fadeAnimation]
})
export class DictionaryVacationComponent {
}
