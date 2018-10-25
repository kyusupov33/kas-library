import { LoggerLevel } from '@splincode/client-logger';
import { common, EnvironmentInterface } from '@env/common';

export const environment: EnvironmentInterface = {
  ...common,
  production: true,
  minLevel: LoggerLevel.INFO,
  hmr: false
};
