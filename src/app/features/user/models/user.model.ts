import { Address, defaultAddress } from '@app/shared/models';
import { Contract } from './contract.model';

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  OPERATOR = 'operator',
  MANAGER = 'manager',
}

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  userRole: UserRole | string;
  dateOfBirth: Date | string;
  address: Address;
  contract: Contract;
}

export const labelUserRole = new Map<string, string>([
  [UserRole.ADMIN, $localize`:@@word.admin:Admin`],
  [UserRole.CLIENT, $localize`:@@word.client:Client`],
  [UserRole.OPERATOR, $localize`:@@word.operator:Operator`],
  [UserRole.MANAGER, $localize`:@@word.manager:Manager`],
]);

export const defaultUser = {
  id: '',
  name: '',
  surname: '',
  email: '',
  userRole: '',
  dateOfBirth: '',
  address: defaultAddress as Address,
  contract: {
    start: null,
    finish: null,
    workingDay: 0,
    contractTurn: '',
    contractCategory: '',
  } as Contract,
};
