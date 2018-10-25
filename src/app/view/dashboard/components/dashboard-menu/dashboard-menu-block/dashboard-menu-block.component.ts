import { Component, Input, ViewEncapsulation } from '@angular/core';
import { DashboardMenuLink } from '@app/view/dashboard/components/dashboard-menu/common/dashboard-menu.interface';

@Component({
  selector: 'menu-block',
  templateUrl: './dashboard-menu-block.component.html',
  encapsulation: ViewEncapsulation.None
})

export class DashboardMenuBlockComponent {
  @Input() public link: DashboardMenuLink;
}
