import { common, EnvironmentInterface } from '@env/common';

export const environment: EnvironmentInterface = {
  ...common,
  production: false,
  hmr: true
};
