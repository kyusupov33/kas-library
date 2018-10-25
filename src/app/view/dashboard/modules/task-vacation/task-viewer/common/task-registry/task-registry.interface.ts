import { TaskResponseQueryModel } from '@shared/model/table-builder/tasks/task-response-query.model';
import { TaskQueryRequest } from '@shared/model/activiti/tasks/task-query-request.model';
import { Observable } from 'rxjs';

export type ResponseType = TaskResponseQueryModel;
export type TaskTypeFunction = (body: TaskQueryRequest, completed: boolean) => Observable<ResponseType>;
