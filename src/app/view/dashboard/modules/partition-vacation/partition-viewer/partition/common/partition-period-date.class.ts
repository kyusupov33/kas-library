export class PartitionPeriodDate {
  public static getOffsetStartYearToCurrentDay(date: Date | string) {
    const currentDate: any = new Date(date as string);
    const startYear: any = new Date(currentDate.getFullYear(), 0, 0);
    const diff: number = currentDate - startYear;
    const timeZoneDiff = ((startYear.getTimezoneOffset() - startYear.getTimezoneOffset()) * 60 * 1000);
    const diffWithoutZone = diff + timeZoneDiff;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diffWithoutZone / oneDay) - 1;
  }
}
