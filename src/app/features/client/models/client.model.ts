import { Address } from '@app/shared/models';

export enum ClientType {
  TOWN_HALL = 'town_hall',
  OTHER = 'other',
}

export interface Client {
  id: number;
  nif: string;
  name: string;
  descripcion: string;
  clientType: ClientType;
  address: Address;
}

export const labelClientType = new Map<string, string>([
  [ClientType.TOWN_HALL, $localize`:@@word.town_hall:Town Hall`],
  [ClientType.OTHER, $localize`:@@word.other:Other`],
]);
