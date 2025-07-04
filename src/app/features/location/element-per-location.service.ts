import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { transformError } from '@app/core/common';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ElementPerLocation } from './models';

@Injectable({
  providedIn: 'root',
})
export class ElementPerLocationService {
  private readonly baseUrl = `${environment.baseUrl}/api/elements-per-location`;
  private httpClient = inject(HttpClient);

  createElementPerLocation(
    elementPerLocation: Omit<ElementPerLocation, 'id'>
  ): Observable<ElementPerLocation> {
    return this.httpClient
      .post<ElementPerLocation>(this.baseUrl, elementPerLocation)
      .pipe(catchError(transformError));
  }

  getElementPerLocation(id: string): Observable<ElementPerLocation> {
    if (id === null) {
      return throwError(() => 'ElementPerLocation id is not set');
    }
    return this.httpClient.get<ElementPerLocation>(`${this.baseUrl}/${id}`);
  }

  updateElementPerLocation(
    id: string,
    elementPerLocation: Omit<ElementPerLocation, 'id'>
  ): Observable<ElementPerLocation> {
    if (id === null) {
      return throwError(() => 'ElementsPerLocation id is not set');
    }
    return this.httpClient
      .patch<ElementPerLocation>(`${this.baseUrl}/${id}`, elementPerLocation)
      .pipe(catchError(transformError));
  }

  deleteElementPerLocation(
    id: string | undefined
  ): Observable<ElementPerLocation> {
    if (id === null) {
      return throwError(() => 'ElementsPerLocation id is not set');
    }
    return this.httpClient
      .delete<ElementPerLocation>(`${this.baseUrl}/${id}`)
      .pipe(catchError(transformError));
  }
}
