import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/features/auth/auth.service';
import { UserRole } from '@app/features/user/models';

export const isOperatorGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (
    authService.authStatus().isAuthenticated &&
    authService.authStatus().userRole === UserRole.OPERATOR
  )
    return true;

  router.navigate(['/auth']);
  return false;
};
