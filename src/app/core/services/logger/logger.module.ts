import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerConfigImpl } from '@splincode/client-logger';
import { LoggerService } from '@core/services/logger/logger.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class LoggerModule {
  public static forRoot(config: Partial<LoggerConfigImpl> = {}): ModuleWithProviders {
    return {
      ngModule: LoggerModule,
      providers: [
        LoggerService,
        {
          provide: 'LoggerConfigImpl',
          useValue: config
        }
      ]
    };
  }
}
