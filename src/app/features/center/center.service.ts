import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Center } from './models';
import { transformError } from '@app/core/common';

@Injectable({
  providedIn: 'root',
})
export class CenterService {
  private readonly baseUrl = `${environment.baseUrl}/api/centers`;
  httpClient = inject(HttpClient);

  createCenter(center: Omit<Center, 'id'>): Observable<Center> {
    return this.httpClient
      .post<Center>(this.baseUrl, center)
      .pipe(catchError(transformError));
  }

  getAllCenters(): Observable<Center[]> {
    return this.httpClient.get<Center[]>(this.baseUrl);
  }

  getCenter(id: string): Observable<Center> {
    if (id === null) {
      return throwError(() => 'Center id is not set');
    }
    return this.httpClient.get<Center>(`${this.baseUrl}/${id}`);
  }

  updateCenter(id: string, center: Omit<Center, 'id'>): Observable<Center> {
    if (id === null) {
      return throwError(() => 'Center id is not set');
    }
    return this.httpClient
      .patch<Center>(`${this.baseUrl}/${id}`, center)
      .pipe(catchError(transformError));
  }

  deleteCenter(id: string | undefined): Observable<Center> {
    if (id === null) {
      return throwError(() => 'Center id is not set');
    }
    return this.httpClient
      .delete<Center>(`${this.baseUrl}/${id}`)
      .pipe(catchError(transformError));
  }
}
