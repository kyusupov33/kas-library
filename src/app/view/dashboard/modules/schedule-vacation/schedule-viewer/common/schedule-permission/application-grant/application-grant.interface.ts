import { Application } from '@shared/model/application/application.model';

export interface ApplicationGrantOptions {
  application: Application;
  isTask: boolean;
  userId: string;
}

export interface ApplicationGrantInterface {
  getEditableFlags(): EditableTypeInterface;

  getButtons(): ActionList;

  approveValidator(application?: Application): boolean;
}

/**
 * Типы событий для сохранения заявки
 */
export enum ACTION_TYPE {
  SAVE = 'SAVE',
  SEND_FOR_APPROVAL = 'SEND_FOR_APPROVAL',
  APPROVE = 'APPROVE',
  CORRECT = 'CORRECT',
  REPEAT_APPROVE = 'REPEAT_APPROVE',
  REJECT = 'REJECT',
  REWORK = 'REWORK',
  HR_REJECT = 'HR_REJECT',
  HR_APPROVE = 'HR_APPROVE',
  HR_SAVE_PDF = 'HR_SAVE_PDF',
  FACT_APPROVE = 'FACT_APPROVE'
}

/**
 * Статусы для поля комментарии
 * NONE - не отображать
 * OPTIONAL - не обязательно (но показать)
 * REQUIRED - обязательны для заполнения
 */
export enum COMMENTS_IN_PROCESS {
  NONE,
  OPTIONAL,
  REQUIRED
}

export interface ActionMapInterface {
  [key: string]: Partial<Action>;
}

/**
 * Тип действия при отправлении заявки
 * comment - статус для поля комментарий
 * validator - функция, определяющая можно ли выполнить действие
 * placeholderKey - ключ локализации для показа тултипа при срабатывании валидации
 */
export interface Action {
  comment: COMMENTS_IN_PROCESS;
  approveValidator: (application: Application) => boolean;
  placeholderKey: string;
  invalid?: boolean;
  isModal: boolean;
  titleKey?: string;
  type?: ACTION_TYPE;
}

export interface ActionResultInterface {
  name: ACTION_TYPE;
  comment: string;
}

export interface ActionTitleMap {
  [key: string]: string;
}

export type ActionList = Array<Partial<Action>>;

export interface EditableTypeInterface {
  isManagerEditable: boolean;
  isFirstApprovalEditable: boolean;
  isSecondApprovalEditable: boolean;
  isCalendarEditable: boolean;
}

export interface CheckedPersonApplication {
  isManager: boolean;
  isFirstApproval: boolean;
  isSecondApproval: boolean;
  isInitiator: boolean;
}

export interface ApplicationGrantInfo {
  isManagerStage: boolean;
  isFirstApprovalStage: boolean;
  isSecondApprovalStage: boolean;
  isInitiatorStage: boolean;
  isReworkTask: boolean;
  isTask: boolean;
}

export const ACTION_MATRIX = {
  [ACTION_TYPE.SAVE]: { comment: COMMENTS_IN_PROCESS.NONE, isModal: true },
  [ACTION_TYPE.REJECT]: { comment: COMMENTS_IN_PROCESS.REQUIRED, isModal: true },
  [ACTION_TYPE.REWORK]: { comment: COMMENTS_IN_PROCESS.REQUIRED, isModal: true },
  [ACTION_TYPE.APPROVE]: { comment: COMMENTS_IN_PROCESS.OPTIONAL, isModal: true },
  [ACTION_TYPE.CORRECT]: { comment: COMMENTS_IN_PROCESS.NONE, isModal: true },
  [ACTION_TYPE.HR_REJECT]: { comment: COMMENTS_IN_PROCESS.REQUIRED, isModal: true },
  [ACTION_TYPE.HR_APPROVE]: { comment: COMMENTS_IN_PROCESS.OPTIONAL, isModal: true },
  [ACTION_TYPE.HR_SAVE_PDF]: { comment: COMMENTS_IN_PROCESS.NONE, isModal: false },
  [ACTION_TYPE.FACT_APPROVE]: { comment: COMMENTS_IN_PROCESS.OPTIONAL, isModal: true }
};
