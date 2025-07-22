import { Address } from '@app/shared/models';

export enum CenterType {
  OFFICE = 'office',
  WORKSHOP = 'workshop',
  BASE = 'base',
  OTHER = 'other',
}

export interface Center {
  id: string;
  name: string;
  description: string;
  centerType: CenterType | string;
  address: Address;
}

export const labelCenterType = new Map<string, string>([
  [CenterType.OFFICE, $localize`:@@word.office:Office`],
  [CenterType.WORKSHOP, $localize`:@@word.workshop:Workshop`],
  [CenterType.BASE, $localize`:@@word.base:Base`],
  [CenterType.OTHER, $localize`:@@word.other:Other`],
]);
