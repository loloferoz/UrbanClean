import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Sector } from './models';
import { catchError, Observable, throwError } from 'rxjs';
import { transformError } from '@app/core/common';

@Injectable({
  providedIn: 'root',
})
export class SectorService {
  private readonly baseUrl = `${environment.baseUrl}/api/sectors`;
  httpClient = inject(HttpClient);

  createSector(sector: Omit<Sector, 'id'>): Observable<Sector> {
    return this.httpClient
      .post<Sector>(this.baseUrl, sector)
      .pipe(catchError(transformError));
  }

  getAllSector(): Observable<Sector[]> {
    return this.httpClient.get<Sector[]>(this.baseUrl);
  }

  getSector(id: string | null): Observable<Sector> {
    if (id === null) {
      return throwError(() => 'Sector id is not set');
    }
    return this.httpClient.get<Sector>(`${this.baseUrl}/${id}`);
  }

  updateSector(id: string | undefined, sector: Sector): Observable<Sector> {
    if (id === null) {
      return throwError(() => 'Sector id is not set');
    }
    return this.httpClient
      .patch<Sector>(`${this.baseUrl}/${id}`, sector)
      .pipe(catchError(transformError));
  }

  deleteSector(id: string | undefined): Observable<Sector> {
    if (id === null) {
      return throwError(() => 'Sector id is not set');
    }
    return this.httpClient
      .delete<Sector>(`${this.baseUrl}/${id}`)
      .pipe(catchError(transformError));
  }
}
