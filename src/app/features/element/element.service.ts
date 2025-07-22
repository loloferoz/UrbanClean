import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Element } from './models';
import { catchError, Observable, throwError } from 'rxjs';
import { transformError } from '@app/core/common';

@Injectable({
  providedIn: 'root',
})
export class ElementService {
  private readonly baseUrl = `${environment.baseUrl}/api/elements`;
  httpClient = inject(HttpClient);

  createElement(element: FormData): Observable<Element> {
    return this.httpClient
      .post<Element>(this.baseUrl, element)
      .pipe(catchError(transformError));
  }

  getAllElements(): Observable<Element[]> {
    return this.httpClient.get<Element[]>(this.baseUrl);
  }

  getElement(id: string): Observable<Element> {
    if (id === null) {
      return throwError(() => 'Element id is not set');
    }
    return this.httpClient.get<Element>(`${this.baseUrl}/${id}`);
  }

  updateElement(id: string, element: FormData): Observable<Element> {
    if (id === null) {
      return throwError(() => 'Element id is not set');
    }
    return this.httpClient
      .patch<Element>(`${this.baseUrl}/${id}`, element)
      .pipe(catchError(transformError));
  }

  deleteElement(id: string | undefined): Observable<Element> {
    if (id === null) {
      return throwError(() => 'Element id is not set');
    }
    return this.httpClient
      .delete<Element>(`${this.baseUrl}/${id}`)
      .pipe(catchError(transformError));
  }
}
