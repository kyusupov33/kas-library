import { EmployeeSimple } from '@shared/model/person/employee-simple.model';
import { ApprovableMap, ApprovablePeriod } from '@modules/partition-vacation/partition-vacation.interface';

export class PartitionApprove {
  public static findApproveEmployees(employees: Array<EmployeeSimple<ApprovablePeriod>> = []) {
    const result: Partial<ApprovableMap> = {};
    employees.forEach((employee) => {
      let applicationId = null;

      const periods = employee.periods.filter((period) => {
        const approve = period.approvable;
        applicationId = approve ? period.applicationId : applicationId;
        return approve;
      });

      if (periods.length) {
        result[employee.employeeId] = { applicationId, periods };
      }

    });

    return result;
  }
}
