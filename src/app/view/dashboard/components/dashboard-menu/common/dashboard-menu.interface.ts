import { SerialDate } from '@core/utils/date/date.class';

export interface ParamsInterface {
  year: SerialDate;
}

export interface DashboardMenuLink {
  icon: string;
  titleKey: string;
  dataId?: string;
  params?: ParamsInterface;
  visible?: boolean;
  routerLink?: any;
  roleLink?: string[];
}

export interface DashboardMenuItem {
  titleKey: string;
  links?: DashboardMenuLink[];
  visibleLength?: number;
}
