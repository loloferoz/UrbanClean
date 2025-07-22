import { UserRole } from '@app/features/user/models';

export interface AuthStatus {
  isAuthenticated: boolean;
  userId: string;
  userEmail: string;
  userRole: UserRole | string;
}

export const defaultAuthStatus: AuthStatus = {
  isAuthenticated: false,
  userId: '',
  userEmail: '',
  userRole: '',
};
