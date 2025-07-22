import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/features/auth/auth.service';
import { UserRole } from '@app/features/user/models';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const allowedRoles = route.data['roles'] as UserRole[];
  const currentUserRole = authService.authStatus().userRole as UserRole;

  if (!currentUserRole) {
    router.navigate(['/login']); // Si no hay rol, mejor enviar al login
    return false;
  }

  if (allowedRoles.includes(currentUserRole)) {
    return true;
  }

  authService.logout(true);
  router.navigate(['/auth']);
  return false;
};
