import {
  ExpectedFebruaryByJanToMarch,
  ExpectedJanuary,
  ExpectedJanuaryByJanToMarch,
  ExpectedMarchByJanToMarch,
  ExpectedPeriodJanToMarch,
  ExpectedPeriodOfJanuary,
  MONTH,
  monthsTitles,
  year2018
} from './helpers/spec.helpers';
import { ObjectUtils } from '@core/utils/object/object.class';
import {
  CalendarDayInterface,
  CalendarMonthInterface
} from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/schedule-calendar.interface';
import { CalendarProcessor } from '@modules/schedule-vacation/schedule-viewer/common/schedule-calendar/calendar/calendar-process.class';

describe('TEST: Correct draw calendar', () => {
  const Inputs = { year: year2018, monthsTitles };

  it('Should be 28 days in February 2018', async () => {
    const februaryDate = new Date(2018, 1, 1);
    const days: CalendarDayInterface[] = CalendarProcessor.setDays(februaryDate, {});
    await expect(days.length).toEqual(28);
  });

  it('Should be correct CalendarDayInterface[] structure in February 2018', async () => {
    const options = { ...Inputs, periods: [] };
    const dateByMonths: CalendarMonthInterface[] = CalendarProcessor.setMonthList(options);
    const FEBRUARY = dateByMonths[MONTH.FEBRUARY];
    const marked = Object.keys(FEBRUARY.vacation).length;
    await expect(marked).toEqual(0);
  });

  it('Should be correct CalendarMonthInterface: for JANUARY', async () => {
    const options = { ...Inputs, periods: ExpectedPeriodOfJanuary };
    const dateByMonths: CalendarMonthInterface[] = CalendarProcessor.setMonthList(options);
    const january = dateByMonths[MONTH.JANUARY];
    const ACTUAL_JANUARY = ObjectUtils.comparable(january, true);
    const EXPECTED_JANUARY = ObjectUtils.comparable(ExpectedJanuary, true);
    expect(ACTUAL_JANUARY).toEqual(EXPECTED_JANUARY);
  });

  it('Should be correct CalendarMonthInterface[]: for JANUARY, FEBRUARY, MARCH of periods', () => {
    const options = { ...Inputs, periods: ExpectedPeriodJanToMarch };
    const dateByMonths: CalendarMonthInterface[] = CalendarProcessor.setMonthList(options);

    const ACTUAL_JANUARY = ObjectUtils.comparable(dateByMonths[MONTH.JANUARY], true);
    const EXPECTED_JANUARY = ObjectUtils.comparable(ExpectedJanuaryByJanToMarch, true);
    expect(ACTUAL_JANUARY).toEqual(EXPECTED_JANUARY);

    const ACTUAL_FEBRUARY = ObjectUtils.comparable(dateByMonths[MONTH.FEBRUARY], true);
    const EXPECTED_FEBRUARY = ObjectUtils.comparable(ExpectedFebruaryByJanToMarch, true);
    expect(ACTUAL_FEBRUARY).toEqual(EXPECTED_FEBRUARY);

    const ACTUAL_MARCH = ObjectUtils.comparable(dateByMonths[MONTH.MARCH], true);
    const EXPECTED_MARCH = ObjectUtils.comparable(ExpectedMarchByJanToMarch, true);
    expect(ACTUAL_MARCH).toEqual(EXPECTED_MARCH);

  });

});
