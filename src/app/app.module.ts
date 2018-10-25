import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CoreModule } from "@core/core.module";
import { NgxsStoreModule } from "@store/store.module";
import { LoggerModule } from "@core/services/logger/logger.module";
import { LOGGER_CONFIG } from "@core/services/logger/logger.config";
import { TRANSLATE_CONFIG } from "@shared/config/translate.config";
import { TranslateModule } from "@ngx-translate/core";
import { ROUTER_CONFIG } from "@shared/config/router.config";
import { RouterModule } from "@angular/router";
import { routes } from "@app/app.routing";

@NgModule({
  imports: [
    CoreModule,
    NgxsStoreModule,
    LoggerModule.forRoot(LOGGER_CONFIG),
    TranslateModule.forRoot(TRANSLATE_CONFIG),
    RouterModule.forRoot(routes, ROUTER_CONFIG),
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
