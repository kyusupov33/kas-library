import { LoggerLevel } from '@splincode/client-logger';

export interface EnvironmentInterface {
  configPath: string;
  sessionTimeout: number;
  production: boolean;
  timeBuild: string;
  minLevel: LoggerLevel;
  hmr: boolean;
}

export const common = {
  hmr: false,
  configPath: 'assets/config.json',
  minLevel: LoggerLevel.ALL,
  timeBuild: new Date().toLocaleString()
    .replace(/\s/, ''),
  sessionTimeout: 60000,
};
