import { User } from '@app/features/user/models';

export interface PushNotification {
  notification: {
    title: string;
    body: string;
    data: {
      user: User;
    };
  };
}
