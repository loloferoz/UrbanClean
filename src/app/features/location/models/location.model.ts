import { ElementPerLocation } from './element-per-location.model';
import { Incident } from '@app/features/incident/models';

export interface LocationAddress {
  city: string;
  street: string;
  number: number;
}

export interface Location extends LocationAddress {
  id: string;
  latitude: number;
  longitude: number;
  elementPerLocations?: ElementPerLocation[];
  incident?: Incident;
}

export const defaultLocation: Omit<Location, 'id'> = {
  city: '',
  street: '',
  number: 0,
  latitude: 40.46366700000001,
  longitude: -3.74922,
};
