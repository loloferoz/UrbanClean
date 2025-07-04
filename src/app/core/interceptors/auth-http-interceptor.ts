import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/features/auth/auth.service';
import { catchError, throwError } from 'rxjs';

export function AuthHttpInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  const authRequest = req.clone({
    setHeaders: { authorization: `Bearer ${token}` },
  });

  return next(authRequest).pipe(
    catchError(err => {
      if (err.status === 401) {
        router.navigate(['/auth/login']);
      }
      return throwError(() => err);
    })
  );
}
