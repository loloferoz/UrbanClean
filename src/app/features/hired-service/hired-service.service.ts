import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HiredService } from './models';
import { transformError } from '@app/core/common';

@Injectable({
  providedIn: 'root',
})
export class HiredServiceService {
  private readonly baseUrl = `${environment.baseUrl}/api/hired-services`;
  httpClient = inject(HttpClient);

  createHiredService(
    center: Omit<HiredService, 'id'>
  ): Observable<HiredService> {
    return this.httpClient
      .post<HiredService>(this.baseUrl, center)
      .pipe(catchError(transformError));
  }

  getAllHiredServices(): Observable<HiredService[]> {
    return this.httpClient.get<HiredService[]>(this.baseUrl);
  }

  getAllHiredServicesWithSectors(): Observable<HiredService[]> {
    return this.httpClient.get<HiredService[]>(`${this.baseUrl}/sectors`);
  }

  getHiredService(id: string | null): Observable<HiredService> {
    if (id === null) {
      return throwError(() => 'Hired Service id is not set');
    }
    return this.httpClient.get<HiredService>(`${this.baseUrl}/${id}`);
  }

  updateHiredService(
    id: string | undefined,
    center: HiredService
  ): Observable<HiredService> {
    if (id === null) {
      return throwError(() => 'Hired Service id is not set');
    }
    return this.httpClient
      .patch<HiredService>(`${this.baseUrl}/${id}`, center)
      .pipe(catchError(transformError));
  }

  deleteHiredService(id: string | undefined): Observable<HiredService> {
    if (id === null) {
      return throwError(() => 'Hired Service id is not set');
    }
    return this.httpClient
      .delete<HiredService>(`${this.baseUrl}/${id}`)
      .pipe(catchError(transformError));
  }
}
