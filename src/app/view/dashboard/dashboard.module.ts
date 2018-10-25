import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardSharedModule } from '@app/view/dashboard/shared/dashboard-shared.module';
import { WelcomeComponent } from '@app/view/dashboard/components/welcome/welcome.component';
import { DashboardComponent } from '@app/view/dashboard/dashboard.component';
import { ErrorsComponent } from '@app/view/dashboard/components/errors/errors.component';
import { DashboardInitialService } from '@app/view/dashboard/dashboard-initial.service';
import { routes } from '@app/view/dashboard/dashboard.routing';
import { DashboardMenuComponent } from './components/dashboard-menu/dashboard-menu.component';
import { DashboardMenuBlockComponent } from './components/dashboard-menu/dashboard-menu-block/dashboard-menu-block.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    DashboardSharedModule,
    NgxPermissionsModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [
    WelcomeComponent,
    DashboardComponent,
    ErrorsComponent,
    DashboardMenuComponent,
    DashboardMenuBlockComponent
  ],
  providers: [
    DashboardInitialService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class DashboardModule {
}
