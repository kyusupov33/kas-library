import { Component, Injector, NgZone, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { EMPTY, interval, Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { environment } from '@env';
import { AuthenticationService } from '@core/services/authenticate/authenticate.service';
import { Authentication } from '@shared/model/auth/authentication.model';
import { EnvironmentInterface } from '@env/common';
import { DashboardRoutesPagePath } from '@app/view/dashboard/dashboard-routes.enum';
import { AuthStore } from '@store/auth/auth.store';
import { NotificationInterface, NotificationOptions } from '@shared/config/notification.config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public userData: Partial<Authentication> = {};
  public isHandset$: Observable<boolean> = null;
  public env: EnvironmentInterface = environment;
  public options: NotificationInterface = NotificationOptions;

  public readonly DashboardRoute = DashboardRoutesPagePath;

  private store: Store;
  private zone: NgZone;
  private timerSub: Subscription;
  private auth: AuthenticationService;
  private breakpointObserver: BreakpointObserver;

  constructor(context: Injector) {
    this.store = context.get(Store);
    this.zone = context.get(NgZone);
    this.auth = context.get(AuthenticationService);
    this.breakpointObserver = context.get(BreakpointObserver);
    this.userData = this.store.selectSnapshot(AuthStore.getAuthData);
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches));
  }

  public ngOnInit() {
    this.checkAuthorized();
  }

  public ngOnDestroy() {
    this.timerSub.unsubscribe();
  }

  public logout() {
    this.auth.logout()
      .pipe(catchError(() => EMPTY))
      .subscribe();
  }

  private checkAuthorized() {
    this.zone.runOutsideAngular(() => this.setIntervalByTime(environment.sessionTimeout));
  }

  private setIntervalByTime(timeOut: number) {
    this.timerSub = interval(timeOut).subscribe(() => this.sessionExpired());
  }

  private sessionExpired() {
    return this.auth.validation().subscribe(() => null, () => window.location.reload());
  }

}
