import { HiredService } from '@app/features/hired-service/models';
import { Sector } from '@app/features/sector/models';
import { User } from '@app/features/user/models';

export interface WorkDay {
  id: string;
  day: Date | string | null;
  start: Date | string | null;
  finish: Date | string | null;
  user: User;
  hiredService: HiredService;
  sector: Sector;
}
