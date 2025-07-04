import { Element } from '@app/features/element/models';
import { Sector } from '@app/features/sector/models';
import { Location } from './location.model';

export interface ElementPerLocation {
  id: string;
  location: Location;
  element: Element;
  numberElements: number;
  sectors: Sector[];
}
