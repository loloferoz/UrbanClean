import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/features/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (authService.authStatus().isAuthenticated) return true;
  router.navigate(['/auth']);
  return false;
};
