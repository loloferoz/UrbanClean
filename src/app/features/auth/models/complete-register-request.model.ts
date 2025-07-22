import { Client } from '@app/features/client/models';

export interface CompleteRegisterRequest {
  name: string;
  code: string;
  description: string;
  client: Client;
}
