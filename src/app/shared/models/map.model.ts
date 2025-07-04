import { ElementType } from '@app/features/element/models';
import { Location } from '@app/features/location/models';
import { environment } from 'src/environments/environment';

export enum TabMap {
  TABLE = 'table',
  ALL = 'all',
  MAP = 'map',
}

export enum LocationType {
  CONTROL = 'control',
  INCIDENT = 'incident',
  ELEMENTS = 'elements',
}

export enum ActionMap {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  MOVE = 'move',
  VIEW = 'view',
}

export enum ActionMove {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface DataMap {
  action: ActionMap;
  currentLocation: Omit<Location, 'id'> | null;
  location: Location | null;
}

export interface TypeLocationMap {
  elementType: ElementType | null;
  LocationType: LocationType;
  icon: string | null;
}

export const configMap: google.maps.MapOptions = {
  mapId: environment.mapId,
  disableDefaultUI: true,
  keyboardShortcuts: false,
  clickableIcons: false,
  tilt: 0,
};
