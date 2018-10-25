import { environment } from '@env';

export const LOGGER_CONFIG = {
  labelUpperCase: false,
  minLevel: environment.minLevel
};
