import { Sector } from '@app/features/sector/models';

export enum HiredServiceType {
  LITTER_BIN = 'litter_bin',
  ORGANIC = 'organic',
  PLASTIC = 'plastic',
  CARDBOARD = 'cardboard',
  GLASS = 'glass',
  OTHER = 'other',
}

export interface HiredService {
  id: string;
  name: string;
  description: string;
  hiredServiceType: HiredServiceType | string;
  sectors?: Sector[];
}

export const labelHiredServiceType = new Map<string, string>([
  [HiredServiceType.LITTER_BIN, $localize`:@@word.litter_bin:Litter Bin`],
  [HiredServiceType.ORGANIC, $localize`:@@word.organic:Organic`],
  [HiredServiceType.PLASTIC, $localize`:@@word.plastic:Plastic`],
  [HiredServiceType.CARDBOARD, $localize`:@@word.cardboard:Cardboard`],
  [HiredServiceType.GLASS, $localize`:@@word.glass:Glass`],
  [HiredServiceType.OTHER, $localize`:@@word.other:Other`],
]);

export const defaultHiredService = {
  id: '',
  name: '',
  description: '',
  hiredServiceType: '',
  sectors: [],
};
