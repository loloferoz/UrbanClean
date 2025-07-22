import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Incident, IncidentStatus } from './models';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { transformError } from '@app/core/common';
import { AuthService } from '../auth/auth.service';
import { UserRole } from '../user/models';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  private readonly baseUrl = `${environment.baseUrl}/api/incidents`;
  private readonly httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  incidents = signal<Incident[]>([]);
  countIncidencias = computed(() => this.incidents().length);

  createIncident(incident: FormData): Observable<Incident> {
    return this.httpClient
      .post<Incident>(this.baseUrl, incident)
      .pipe(catchError(transformError));
  }

  getAllIncident(): Observable<Incident[]> {
    return this.httpClient
      .get<Incident[]>(this.baseUrl)
      .pipe(tap((incidents: Incident[]) => this.filterIncidents(incidents)));
  }

  getAllIncidentForCounter(): Observable<Incident[]> {
    return this.httpClient.get<Incident[]>(`${this.baseUrl}/counter`).pipe(
      tap((incidents: Incident[]) => {
        this.incidents.set(incidents);
      })
    );
  }

  getIncident(id: string | null): Observable<Incident> {
    if (id === null) {
      return throwError(() => 'Incident id is not set');
    }
    return this.httpClient.get<Incident>(`${this.baseUrl}/${id}`);
  }

  updateIncident(
    id: string | undefined,
    incident: FormData
  ): Observable<Incident> {
    if (id === null) {
      return throwError(() => 'Incident id is not set');
    }
    return this.httpClient
      .patch<Incident>(`${this.baseUrl}/${id}`, incident)
      .pipe(catchError(transformError));
  }

  completeIncident(
    id: string | undefined,
    incident: FormData
  ): Observable<Incident> {
    if (id === null) {
      return throwError(() => 'Incident id is not set');
    }
    return this.httpClient
      .patch<Incident>(`${this.baseUrl}/complete/${id}`, incident)
      .pipe(catchError(transformError));
  }

  deleteIncident(id: string | undefined): Observable<Incident> {
    if (id === null) {
      return throwError(() => 'Incident id is not set');
    }
    return this.httpClient
      .delete<Incident>(`${this.baseUrl}/${id}`)
      .pipe(catchError(transformError));
  }

  filterIncidents(incidents: Incident[]) {
    if (this.authService.authStatus().userRole === UserRole.OPERATOR) {
      const incidentsFiltered = incidents.filter(
        i => i.incidentStatus === IncidentStatus.DELEGATED
      );
      this.incidents.set(incidentsFiltered);
    } else {
      const incidentsFiltered = incidents.filter(
        i => i.incidentStatus === IncidentStatus.SENTED
      );
      this.incidents.set(incidentsFiltered);
    }
  }
}
