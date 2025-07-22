import { Address } from '@app/shared/models';

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  address: Address;
}
