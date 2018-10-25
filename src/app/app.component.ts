import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { LoggerService } from "@core/services/logger/logger.service";
import { environment } from "@env";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(translate: TranslateService, logger: LoggerService) {
    logger.clear();
    logger.info('Build', environment.timeBuild);
    translate.setDefaultLang('ru');
  }
}
