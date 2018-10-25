export enum PartitionRouterKeys {
  WITH_DEPARTMENTS = 'withDepartments',
  YEAR = 'year',
  MY_APPROVAL = 'myApproval',
  PRINT_EXCEL = 'print-excel'
}

const KEYS = PartitionRouterKeys;
export const PartitionVacationRoutesPagePath = {

  // SEGMENT: /myApproval
  onMyApprovals: `${KEYS.MY_APPROVAL}`,

  // SEGMENT: /withDepartments/:withDepartments
  byWithSubDepartments: `${KEYS.WITH_DEPARTMENTS}/:${KEYS.WITH_DEPARTMENTS}`,

  // SEGMENT: /print-excel
  printExcelByDepartment: `${KEYS.PRINT_EXCEL}`

};
