import { PageEvent } from '@angular/material';

export interface SubmitActionInterface {
  action: string;
  index: number;
}

export interface SetTableDataInterface {
  type: string;
}

export interface TableBuilderInterface {
  switchTableDataOnPageEvent: (page: PageEvent) => void;
}
