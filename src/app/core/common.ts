import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function transformError(error: HttpErrorResponse | string) {
  let errorMessage = 'An unknown error has occurred';
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error.error) {
    errorMessage = `Error! ${error.error.message}`;
  } else if (error.status) {
    errorMessage = `Request failed with ${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  console.log(`Error: ${errorMessage}`);

  return throwError(() => errorMessage);
}
