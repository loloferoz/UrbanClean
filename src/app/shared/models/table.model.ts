import { ActionType } from './action.model';

export interface TableAction {
  action: ActionType;
  id: string;
}

export interface TableColumns {
  columns: string[];
  labels: string[];
  sortables: string[];
  chips?: string[];
  date?: string[];
  time?: string[];
  actions: {
    update: boolean;
    view: boolean;
    delete: boolean;
  };
}
