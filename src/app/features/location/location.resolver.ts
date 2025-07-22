import { ResolveFn } from '@angular/router';
import { Location } from './models';
import { LocationService } from './location.service';
import { catchError } from 'rxjs';
import { transformError } from '@app/core/common';
import { inject } from '@angular/core';

export const locationResolver: ResolveFn<Location> = route => {
  return inject(LocationService)
    .getLocation(route.paramMap.get('locationId'))
    .pipe(catchError(transformError));
};
