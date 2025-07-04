import { Center } from '@app/features/center/models';
import { Client } from '@app/features/client/models';
import { Element } from '@app/features/element/models';
import { User } from '@app/features/user/models';

export interface Area {
  id: string;
  name: string;
  code: string;
  description: string;
  centers?: Center[];
  clients?: Client[];
  elements?: Element[];
  users?: User[];
}

export const defaultArea: Area = {
  id: '',
  name: '',
  code: '',
  description: '',
};
