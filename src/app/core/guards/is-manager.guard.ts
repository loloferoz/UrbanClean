import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/features/auth/auth.service';
import { UserRole } from '@app/features/user/models';

export const isManagerGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (
    authService.authStatus().isAuthenticated &&
    (authService.authStatus().userRole === UserRole.MANAGER ||
      authService.authStatus().userRole === UserRole.ADMIN)
  )
    return true;

  router.navigate(['/auth']);
  return false;
};
