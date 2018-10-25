import { DashboardMenuItem } from 'app/view/dashboard/components/dashboard-menu/common/dashboard-menu.interface';
import { DashboardRoutesPagePath } from '@app/view/dashboard/dashboard-routes.enum';
import { PartitionRouterKeys } from '@modules/partition-vacation/partition-vacation-routes.enum';
import { SerialDate } from '@core/utils/date/date.class';
import { ScheduleRouterKeys } from '@modules/schedule-vacation/schedule-vacation-routes.enum';
import { DictionaryVacationRoutesPagePath } from '@modules/dictionary-vacation/dictionary-vacation-routes-page.path';
import { TaskVacationRoutesPagePath } from '@modules/task-vacation/task-vacation-routes-page.path';
import { AuthenticationRoles } from '@shared/model/auth/authentication-roles.enum';

export type DashboardMenuConfig = DashboardMenuItem[];

export const dashBoardMenuConfig: DashboardMenuConfig = [
  {
    titleKey: 'DASHBOARD.MENU.MY_TASKS_TITLE',
    links: [
      {
        icon: 'accessibility',
        titleKey: 'DASHBOARD.MENU.MY_PARTITION_WITH_DEPARTMENTS',
        routerLink: ['/', DashboardRoutesPagePath.PARTITION_VACATION, PartitionRouterKeys.WITH_DEPARTMENTS, true],
        roleLink: [AuthenticationRoles.DEFAULT]
      },
      {
        icon: 'group',
        dataId: 'partition-vacation-myApproval',
        titleKey: 'DASHBOARD.MENU.PARTITION_BY_TASKS',
        routerLink: ['/', DashboardRoutesPagePath.PARTITION_VACATION, PartitionRouterKeys.MY_APPROVAL],
        roleLink: [AuthenticationRoles.DEFAULT]
      },
      {
        icon: 'print',
        titleKey: 'DASHBOARD.MENU.EXCEL_DEPARTMENT',
        routerLink: ['/', DashboardRoutesPagePath.PARTITION_VACATION, PartitionRouterKeys.PRINT_EXCEL],
        roleLink: [AuthenticationRoles.RESPONSIBLE]
      },
      {
        icon: 'list',
        titleKey: 'DASHBOARD.MENU.HR_TASKS',
        routerLink: ['/', DashboardRoutesPagePath.TASK_VACATION, TaskVacationRoutesPagePath.HR_TASKS],
        roleLink: [AuthenticationRoles.HR]
      },
      {
        icon: 'archive',
        titleKey: 'DASHBOARD.MENU.HR_TASKS_COMPLETED',
        routerLink: ['/', DashboardRoutesPagePath.TASK_VACATION, TaskVacationRoutesPagePath.HR_TASKS_COMPLETED],
        roleLink: [AuthenticationRoles.HR]
      }
    ]
  },
  {
    titleKey: 'DASHBOARD.MENU.MY_APP',
    links: [
      {
        icon: 'update',
        titleKey: 'DASHBOARD.MENU.NEXT_SCHEDULE',
        params: { year: SerialDate.yearType.NEXT },
        routerLink: ['/', DashboardRoutesPagePath.SCHEDULE_VACATION, ScheduleRouterKeys.YEAR, SerialDate.yearType.NEXT],
        roleLink: [AuthenticationRoles.DEFAULT]
      },
      {
        icon: 'schedule',
        dataId: 'schedule-vacation-year-current',
        titleKey: 'DASHBOARD.MENU.CURRENT_SCHEDULE',
        params: { year: SerialDate.yearType.CURRENT },
        routerLink: ['/',
          DashboardRoutesPagePath.SCHEDULE_VACATION, ScheduleRouterKeys.YEAR, SerialDate.yearType.CURRENT],
        roleLink: [AuthenticationRoles.DEFAULT]
      }
    ]
  },
  {
    titleKey: 'DASHBOARD.MENU.SETTINGS',
    links: [
      {
        icon: 'transfer_within_a_station',
        titleKey: 'DASHBOARD.MENU.ROUTE',
        routerLink: ['/', DashboardRoutesPagePath.DICTIONARY_VACATION, DictionaryVacationRoutesPagePath.HR_ROUTE],
        roleLink: [AuthenticationRoles.ADMIN]
      },
      {
        icon: 'portrait',
        titleKey: 'DASHBOARD.MENU.HR_USER',
        routerLink: ['/', DashboardRoutesPagePath.DICTIONARY_VACATION, DictionaryVacationRoutesPagePath.HR_USER],
        roleLink: [AuthenticationRoles.ADMIN]
      },
      {
        icon: 'group',
        titleKey: 'DASHBOARD.MENU.ASSISTANT',
        routerLink: ['/', DashboardRoutesPagePath.DICTIONARY_VACATION, DictionaryVacationRoutesPagePath.ASSISTANT],
        roleLink: [AuthenticationRoles.ADMIN]
      },
      {
        icon: 'settings',
        titleKey: 'DASHBOARD.MENU.OTHER_SETTINGS',
        routerLink: ['/', DashboardRoutesPagePath.DICTIONARY_VACATION, DictionaryVacationRoutesPagePath.OTHER_SETTINGS],
        roleLink: [AuthenticationRoles.ADMIN]
      }
    ]
  }
];
