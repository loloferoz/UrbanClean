import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Control, ControlQuery } from './models';
import { catchError, Observable, throwError } from 'rxjs';
import { transformError } from '@app/core/common';

@Injectable({
  providedIn: 'root',
})
export class ControlService {
  private readonly baseUrl = `${environment.baseUrl}/api/controls`;
  private readonly httpClient = inject(HttpClient);

  createControl(control: FormData): Observable<Control> {
    return this.httpClient
      .post<Control>(this.baseUrl, control)
      .pipe(catchError(transformError));
  }

  getAllControls(): Observable<Control[]> {
    return this.httpClient.get<Control[]>(this.baseUrl);
  }

  getAllControlsByDateAndOperator(
    controlQuery: ControlQuery
  ): Observable<Control[]> {
    return this.httpClient.get<Control[]>(
      `${this.baseUrl}/?userId=${controlQuery.userId}&date=${this.formatDate(controlQuery.date)}`
    );
  }

  getControl(id: string): Observable<Control> {
    if (id === null) {
      return throwError(() => 'Control id is not set');
    }
    return this.httpClient.get<Control>(`${this.baseUrl}/${id}`);
  }

  updateControl(id: string, control: Omit<Control, 'id'>): Observable<Control> {
    if (id === null) {
      return throwError(() => 'Control id is not set');
    }
    return this.httpClient
      .patch<Control>(`${this.baseUrl}/${id}`, control)
      .pipe(catchError(transformError));
  }

  deleteControl(id: string | undefined): Observable<Control> {
    if (id === null) {
      return throwError(() => 'Control id is not set');
    }
    return this.httpClient
      .delete<Control>(`${this.baseUrl}/${id}`)
      .pipe(catchError(transformError));
  }

  private formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
