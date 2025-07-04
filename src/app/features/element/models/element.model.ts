import { Image } from '@app/shared/models';

export enum ElementType {
  LITTER_BIN = 'litter_bin',
  ORGANIC = 'organic',
  PLASTIC = 'plastic',
  CARDBOARD = 'cardboard',
  GLASS = 'glass',
}

export interface Element {
  id: string;
  name: string;
  description: string;
  capacity: number;
  elementType: ElementType | string;
  image?: Image;
}

export interface Element {
  id: string;
  name: string;
  description: string;
  capacity: number;
  elementType: ElementType | string;
  image?: Image;
}

export const labelElementType = new Map<string, string>([
  [ElementType.LITTER_BIN, $localize`:@@word.litter_bin:Litter Bin`],
  [ElementType.ORGANIC, $localize`:@@word.organic:Organic`],
  [ElementType.PLASTIC, $localize`:@@word.plastic:Plastic`],
  [ElementType.CARDBOARD, $localize`:@@word.cardboard:Cardboard`],
  [ElementType.GLASS, $localize`:@@word.glass:Glass`],
]);
