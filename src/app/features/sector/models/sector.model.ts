import { HiredService } from '@app/features/hired-service/models';

export interface Sector {
  id: string;
  name: string;
  description: string;
  hiredService?: HiredService;
}

export const defaultSector = {
  id: '',
  name: '',
  description: '',
};
