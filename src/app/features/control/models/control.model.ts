import { ElementPerLocation } from '@app/features/location/models';
import { WorkDay } from '@app/features/work-day/models';
import { Image } from '@app/shared/models';

export enum ControlStatus {
  UNFINISHED = 'unfinished',
  COMPLETED = 'completed',
  BLOCKED = 'blocked',
}

export interface Control {
  id: string;
  observation?: string;
  controlStatus: ControlStatus;
  image: Image;
  createdDate?: Date;
  elementPerLocation: ElementPerLocation;
  workDay: WorkDay;
}

export interface ControlQuery {
  userId: string;
  date: Date;
}

export const labelControlStatus = new Map<string, string>([
  [ControlStatus.UNFINISHED, $localize`:@@word.unfinished:Unfinished`],
  [ControlStatus.COMPLETED, $localize`:@@word.completed:Completed`],
  [ControlStatus.BLOCKED, $localize`:@@word.blocked:Blocked`],
]);
