import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ContractCategory, User, UserRole } from './models';
import { transformError } from '@app/core/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = `${environment.baseUrl}/api/users`;
  httpClient = inject(HttpClient);

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.httpClient
      .post<User>(this.baseUrl, user)
      .pipe(catchError(transformError));
  }

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  getAllUsersByCategory(category: ContractCategory): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}?category=${category}`);
  }

  getAllUsersByRole(role: UserRole): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseUrl}?role=${role}`);
  }

  getUser(id: string | null): Observable<User> {
    if (id === null) {
      return throwError(() => 'User id is not set');
    }
    return this.httpClient.get<User>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: string | undefined, User: User): Observable<User> {
    if (id === null) {
      return throwError(() => 'User id is not set');
    }
    return this.httpClient
      .patch<User>(`${this.baseUrl}/${id}`, User)
      .pipe(catchError(transformError));
  }

  deleteUser(id: string): Observable<User> {
    if (id === null) {
      return throwError(() => 'User id is not set');
    }
    return this.httpClient
      .delete<User>(`${this.baseUrl}/${id}`)
      .pipe(catchError(transformError));
  }
}
