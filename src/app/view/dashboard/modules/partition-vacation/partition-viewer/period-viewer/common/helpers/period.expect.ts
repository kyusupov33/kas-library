import { GridApprovableLine } from '@modules/partition-vacation/partition-viewer/period-viewer/common/draw-period.interface';

export const periodsLanes: Array<Array<GridApprovableLine<any>>> = [
  [
    {
      width: 'calc(0.273972602739726% - 1px)',
      offsetLeft: '99.72602739726027%',
      zIndex: 2,
      data: {
        applicationId: 142,
        startDate: '2018-12-31',
        endDate: '2019-01-10',
        duration: 11,
        processStage: 'HR_DONE',
        type: 'FACT',
        approvable: false
      },
      tooltip: '* * 2018-12-31 * 2019-01-10 * * '
    }
  ],
  [],
  [],
  [],
  [
    {
      width: 'calc(0.821917808219178% - 1px)',
      offsetLeft: '17.26027397260274%',
      tooltip: '* * 2018-03-05 * 2018-03-07 * * ',
      zIndex: 2,
      data: {
        applicationId: 142,
        startDate: '2018-03-05',
        endDate: '2018-03-07',
        duration: 3,
        processStage: 'HR_DONE',
        type: 'FACT',
        approvable: false
      }
    },
    {
      width: 'calc(3.835616438356164% - 1px)',
      offsetLeft: '0%',
      tooltip: '* * 2018-01-01 * 2018-01-14 * * ',
      zIndex: 2,
      data: {
        applicationId: 164,
        startDate: '2018-01-01',
        endDate: '2018-01-14',
        duration: 14,
        processStage: 'HR_DONE',
        type: 'FACT',
        approvable: false
      }
    },
    {
      width: 'calc(3.835616438356164% - 1px)',
      offsetLeft: '59.45205479452055%',
      tooltip: '* * 2018-08-06 * 2018-08-19 * * ',
      zIndex: 1,
      data: {
        applicationId: 167,
        startDate: '2018-08-06',
        endDate: '2018-08-19',
        duration: 14,
        processStage: 'MANAGER_APPROVAL',
        type: 'CORR',
        approvable: false
      }
    }
  ],
  [],
  []
];
