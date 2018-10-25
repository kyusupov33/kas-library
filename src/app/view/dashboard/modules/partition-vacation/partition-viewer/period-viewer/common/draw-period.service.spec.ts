import { DrawPeriodService } from '@modules/partition-vacation/partition-viewer/period-viewer/common/draw-period.service';
import { expectMonth } from '@modules/partition-vacation/partition-viewer/period-viewer/common/helpers/month-grid.expect';
import { expectYearDays } from '@modules/partition-vacation/partition-viewer/period-viewer/common/helpers/year-days-grid.expect';
import { EmployeeSimple } from '@shared/model/person/employee-simple.model';
import { employeeExpect } from '@modules/partition-vacation/partition-viewer/period-viewer/common/helpers/employees.expect';
import { periodsLanes } from '@modules/partition-vacation/partition-viewer/period-viewer/common/helpers/period.expect';

const sanitizer: any = { bypassSecurityTrustStyle: ((value: string) => value) };
const translate: any = { instant: (() => '*') };

describe('[TEST]: DrawPeriod service', () => {
  let service: DrawPeriodService;

  const year = 2018;
  const employees: Array<Partial<EmployeeSimple<any>>> = employeeExpect;

  beforeEach(() => service = new DrawPeriodService(sanitizer, translate));

  it('should be correct generate width', () => {
    const widthByFullCalendar = service.generateWidthLane({ fullCalendar: false, year });
    const widthByMonth = service.generateWidthLane({ fullCalendar: true, year });
    const incorrectWidth = service.generateWidthLane({ fullCalendar: true, year: undefined });

    expect(widthByFullCalendar).toEqual('100%');
    expect(widthByMonth).toEqual('calc(365 * 25px)');
    expect(incorrectWidth).toEqual(null);
  });

  it('should be correct generate grid by months', () => {
    const grid = service.generateGridByMonths(year);
    expect(expectMonth).toEqual(grid);
  });

  it('should be correct generate grid by year with days', () => {
    const grid = service.generateGridByDaysInYear<number>(year);
    expect(expectYearDays).toEqual(grid);
  });

  it('should be correct drawing periods', () => {
    const lanes = service.generatePeriodLineByPeriods(year, employees);
    expect(periodsLanes).toEqual(lanes);
  });

});
