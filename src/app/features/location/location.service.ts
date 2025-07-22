import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Location } from './models';
import { catchError, Observable, throwError } from 'rxjs';
import { transformError } from '@app/core/common';
import { ElementType } from '../element/models';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private readonly baseUrl = `${environment.baseUrl}/api/locations`;
  private httpClient = inject(HttpClient);

  createLocation(location: Omit<Location, 'id'>): Observable<Location> {
    return this.httpClient
      .post<Location>(this.baseUrl, location)
      .pipe(catchError(transformError));
  }

  getAllLocations(): Observable<Location[]> {
    return this.httpClient.get<Location[]>(
      `${this.baseUrl}?filterLocation=all`
    );
  }

  getAllLocationsByElement(query: ElementType): Observable<Location[]> {
    return this.httpClient.get<Location[]>(
      `${this.baseUrl}?filterLocation=element&elementType=${query}`
    );
  }

  getAllLocationsWithIncident(): Observable<Location[]> {
    return this.httpClient.get<Location[]>(
      `${this.baseUrl}?filterLocation=incident`
    );
  }

  getLocation(id: string | null): Observable<Location> {
    if (id === null) {
      return throwError(() => 'Location id is not set');
    }
    return this.httpClient.get<Location>(`${this.baseUrl}/${id}`);
  }

  updateLocation(
    id: string | undefined,
    Location: Location
  ): Observable<Location> {
    if (id === null) {
      return throwError(() => 'Location id is not set');
    }
    return this.httpClient
      .patch<Location>(`${this.baseUrl}/${id}`, Location)
      .pipe(catchError(transformError));
  }

  deleteLocation(id: string | undefined): Observable<Location> {
    if (id === null) {
      return throwError(() => 'Location id is not set');
    }
    return this.httpClient
      .delete<Location>(`${this.baseUrl}/${id}`)
      .pipe(catchError(transformError));
  }
}
