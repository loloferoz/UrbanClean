import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from './user.service';
import { catchError } from 'rxjs';
import { transformError } from '@app/core/common';
import { User } from './models';

export const userResolver: ResolveFn<User> = route => {
  return inject(UserService)
    .getUser(route.paramMap.get('userId'))
    .pipe(catchError(transformError));
};
