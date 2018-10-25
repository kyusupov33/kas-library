import { Period } from '@shared/model/application/period.model';

export interface VacationType {
  type: string;
  period: Period;
}

export interface CalendarVacationMap {
  [key: number]: VacationType;
}

export interface CalendarMonthInterface {

  /**
   * @description
   * Текущая дата месяца
   */
  value: Date | string;
  microTime: number;

  /**
   * @description
   * Имя месяца (с учетом локализации)
   */
  nameMonth: string;

  /**
   * @description
   * Сколько дней в месяце
   * Пример: 28 (февраль - високосный)
   */
  daysInMonth: number;

  /**
   * @description
   * Год текущего месяца
   */
  currentYear: number;

  /**
   * @description
   * Массив дней месяца с системной информацией
   */
  days: CalendarDayInterface[];

  /**
   * @description
   * Отмеченные в текущем месяце дни отпуска
   */
  vacation: CalendarVacationMap;
}

export interface CalendarDayInterface {

  /**
   * @description
   * Текущая дата относительно позиции
   */
  value: Date | string;

  /**
   * @description
   * Текущая дата переведенная в текстовый формат (ru-RU)
   * Пример: 01.01.2019
   */
  valueByString: string;

  /**
   * @description
   * Позиция текущего дня в месяце
   * Пример: 1 || 2 ... 31
   */
  dayNumber: number;

  /**
   * @description
   * Является выходным днем или нет
   */
  isDayOf: boolean;

  /**
   * @description
   * Отмечен ли день в периоде отпуска
   */
  marked: boolean;

  /**
   * @description
   * Можно или нельзя заводить заявление на отпуск
   */
  editable: boolean;

}

export interface MonthParamsInterface {

  /**
   * @description
   * Текущий гол
   */
  year: number;

  /**
   * @description
   * Список месяцев
   * Пример: ['Январь', ..., 'Декабрь']
   */
  monthsTitles: string[];

  /**
   * @description
   * Периоды отпуска в текущем году
   */
  periods: Period[];

}
