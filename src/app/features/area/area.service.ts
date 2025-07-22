import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Area } from './models';
import { filter, mergeMap, Observable, throwError } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthStatus } from '../auth/models';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private readonly baseUrl = `${environment.baseUrl}/api/areas`;
  private readonly httpClient = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private area$ = toObservable(this.authService.authStatus).pipe(
    filter((status: AuthStatus) => status.isAuthenticated),
    mergeMap(() => this.httpClient.get<Area>(`${this.baseUrl}/current`))
  );
  area = toSignal<Area>(this.area$);

  getArea(id: string | null): Observable<Area> {
    if (id === null) {
      return throwError(() => 'Area id is not set');
    }
    return this.httpClient.get<Area>(`${this.baseUrl}/${id}`);
  }

  updateArea(id: string | undefined, area: Area): Observable<Area> {
    if (id === null) {
      return throwError(() => 'Area id is not set');
    }
    return this.httpClient.patch<Area>(`${this.baseUrl}/${id}`, area);
  }
}
