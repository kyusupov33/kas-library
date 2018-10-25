import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  DashboardMenuConfig,
  dashBoardMenuConfig
} from '@app/view/dashboard/components/dashboard-menu/common/dasboard-menu.config';
import {
  DashboardMenuItem,
  DashboardMenuLink
} from '@app/view/dashboard/components/dashboard-menu/common/dashboard-menu.interface';
import { AuthStore } from '@store/auth/auth.store';
import { Store } from '@ngxs/store';

@Component({
  selector: 'dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardMenuComponent implements OnInit {
  public dashBoardMenuConfig: DashboardMenuConfig = dashBoardMenuConfig;

  constructor(private store: Store) {}

  public ngOnInit() {
    this.checkPermissions();
  }

  private checkPermissions(): void {
    this.dashBoardMenuConfig.forEach((menu: DashboardMenuItem) => {
      this.checkLinkIsVisible(menu);
    });
  }

  private checkLinkIsVisible(menu: DashboardMenuItem): void {
    const roles = this.store.selectSnapshot(AuthStore.getAuthData).roles;
    let count = 0;
    menu.links.forEach((link: DashboardMenuLink) => {
      link.visible = link.roleLink.some((role: string) => roles && roles.includes(role));
      return link.visible ? count++ : null;
    });
    menu.visibleLength = count;
  }
}
