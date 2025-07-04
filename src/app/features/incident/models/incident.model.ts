import { Location } from '@app/features/location/models';
import { User } from '@app/features/user/models';
import { Image } from '@app/shared/models';

export enum IncidentPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum IncidentStatus {
  SENTED = 'sented',
  DELEGATED = 'delegated',
  FINISHED = 'finished',
}

export interface Incident {
  id: string;
  description: string;
  instruction?: string;
  observation?: string;
  start: Date | string;
  finish?: Date | string;
  incidentStatus: IncidentStatus;
  incidentPriority: IncidentPriority;
  firstImage: Image;
  lastImage: Image;
  location: Location;
  whoCreatedIt: User;
  whoIsResponsible: User;
}

export const labelIncidentPriority = new Map<string, string>([
  [IncidentPriority.LOW, $localize`:@@word.low:Low`],
  [IncidentPriority.MEDIUM, $localize`:@@word.medium:Medium`],
  [IncidentPriority.HIGH, $localize`:@@word.high:High`],
]);

export const labelIncidentStatus = new Map<string, string>([
  [IncidentStatus.SENTED, $localize`:@@word.sented:Sented`],
  [IncidentStatus.DELEGATED, $localize`:@@word.delegated:Delegated`],
  [IncidentStatus.FINISHED, $localize`:@@word.finished:Finished`],
]);
