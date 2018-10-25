export enum TABLE_BUILDER_ACTION_TYPE {
  /**
   * @param SAVE
   * Сохранения новой строки в таблице справочника
   */
  SAVE = 'SAVE',
  /**
   * @param DELETE
   * Удаление строки из таблицы справочника
   */
  DELETE = 'DELETE',
  /**
   * @param EDIT
   * Редактирования строки справочника по id
   */
  EDIT = 'EDIT',
  /**
   * @param CANCEL
   * Отмена изменений
   */
  CANCEL = 'CANCEL',
  /**
   * @param ADD
   * Возможность добавления в справочник
   */
  ADD = 'ADD',
  /**
   * @param Open
   * Возможность открыть подробное описание элемента справочника
   */
  OPEN = 'OPEN',
  /**
   * @param Print
   * Возможность cформировать график отпусков подразделения в Excel
   */
  PRINT = 'PRINT'
}

export interface TableBuilderActionInterface {
  [key: string]: Partial<TableBuilderActionOptions>;
}

export interface TableBuilderActionOptions {
  titleKey: string;
  iconKey: string;
}

export const TableBuilderActionMap: TableBuilderActionInterface = {
  [TABLE_BUILDER_ACTION_TYPE.SAVE]: { titleKey: 'DASHBOARD.TABLE.ACTIONS.SAVE', iconKey: 'save' },
  [TABLE_BUILDER_ACTION_TYPE.DELETE]: { titleKey: 'DASHBOARD.TABLE.ACTIONS.DELETE', iconKey: 'delete' },
  [TABLE_BUILDER_ACTION_TYPE.EDIT]: { titleKey: 'DASHBOARD.TABLE.ACTIONS.EDIT', iconKey: 'edit' },
  [TABLE_BUILDER_ACTION_TYPE.CANCEL]: { titleKey: 'DASHBOARD.TABLE.ACTIONS.CANCEL', iconKey: 'cancel' },
  [TABLE_BUILDER_ACTION_TYPE.ADD]: { titleKey: 'DASHBOARD.TABLE.ACTIONS.ADD', iconKey: 'add' },
  [TABLE_BUILDER_ACTION_TYPE.OPEN]: { titleKey: 'DASHBOARD.TABLE.ACTIONS.OPEN', iconKey: 'open_in_browser' },
  [TABLE_BUILDER_ACTION_TYPE.PRINT]: { titleKey: 'DASHBOARD.TABLE.ACTIONS.PRINT', iconKey: 'print' }
};
