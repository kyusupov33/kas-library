export enum ScheduleRouterKeys {
  YEAR = 'year',
  APPLICATION_ID = 'applicationId',
  TASK_ID = 'taskId',
  COMPLETED_TASK = 'completed'
}

const KEYS = ScheduleRouterKeys;
export const ScheduleVacationRoutesPagePath = {

  // SEGMENT: year/:year
  byYearType: `${KEYS.YEAR}/:${KEYS.YEAR}`,

  // SEGMENT: applicationId/:applicationId
  byApplicationId: `${KEYS.APPLICATION_ID}/:${KEYS.APPLICATION_ID}`,

  // SEGMENT: taskId/:taskId
  byTaskId: `${KEYS.TASK_ID}/:${KEYS.TASK_ID}`

};
