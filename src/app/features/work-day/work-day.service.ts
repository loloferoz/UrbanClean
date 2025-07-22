import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WorkDay } from './models';
import { transformError } from '@app/core/common';

@Injectable({
  providedIn: 'root',
})
export class WorkDayService {
  private readonly baseUrl = `${environment.baseUrl}/api/work-days`;
  private readonly httpClient = inject(HttpClient);

  createWorkDay(workDay: Omit<WorkDay, 'id'>): Observable<WorkDay> {
    return this.httpClient
      .post<WorkDay>(this.baseUrl, workDay)
      .pipe(catchError(transformError));
  }

  getAllWorkDays(): Observable<WorkDay[]> {
    return this.httpClient.get<WorkDay[]>(this.baseUrl);
  }

  getAllWorkDaysByDate(date: Date): Observable<WorkDay[]> {
    return this.httpClient.get<WorkDay[]>(
      `${this.baseUrl}?date=${this.formatDate(date)}`
    );
  }

  getWorkDay(id: string): Observable<WorkDay> {
    if (id === null) {
      return throwError(() => 'WorkDay id is not set');
    }
    return this.httpClient.get<WorkDay>(`${this.baseUrl}/${id}`);
  }

  getMyWorkDay(): Observable<WorkDay> {
    return this.httpClient.get<WorkDay>(`${this.baseUrl}/current`);
  }

  updateWorkDay(id: string, center: Omit<WorkDay, 'id'>): Observable<WorkDay> {
    if (id === null) {
      return throwError(() => 'WorkDay id is not set');
    }
    return this.httpClient
      .patch<WorkDay>(`${this.baseUrl}/${id}`, center)
      .pipe(catchError(transformError));
  }

  deleteWorkDay(id: string | undefined): Observable<WorkDay> {
    if (id === null) {
      return throwError(() => 'WorkDay id is not set');
    }
    return this.httpClient
      .delete<WorkDay>(`${this.baseUrl}/${id}`)
      .pipe(catchError(transformError));
  }

  private formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
