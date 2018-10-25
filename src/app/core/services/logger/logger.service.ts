import { Inject, Injectable } from '@angular/core';
import { ClientLogger, LoggerConfigImpl } from '@splincode/client-logger';

@Injectable()
export class LoggerService extends ClientLogger {

  constructor(@Inject('LoggerConfigImpl') config: Partial<LoggerConfigImpl> = {}) {
    super(config);
  }

}
