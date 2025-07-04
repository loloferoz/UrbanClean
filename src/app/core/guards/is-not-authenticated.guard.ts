import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/features/auth/auth.service';
import { UserRole } from '@app/features/user/models';

export const isNotAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.authStatus().isAuthenticated) {
    return true;
  }
  router.navigate([
    homeRoutePerRole(authService.authStatus().userRole as UserRole),
  ]);
  return false;
};

function homeRoutePerRole(role: UserRole) {
  switch (role) {
    case UserRole.ADMIN:
      return 'manager';
    case UserRole.MANAGER:
      return 'manager';
    case UserRole.OPERATOR:
      return 'operator';
    default:
      return 'home';
  }
}
