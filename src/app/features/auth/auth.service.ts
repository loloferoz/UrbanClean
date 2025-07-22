import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import {
  AuthStatus,
  CompleteRegisterRequest,
  defaultAuthStatus,
  JwtToken,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from './models';
import { catchError, filter, map, mergeMap, pipe, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { transformError } from '@app/core/common';
import { User } from '../user/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private jwtService = inject(JwtHelperService);
  private readonly baseUrl = `${environment.baseUrl}/api/auth`;

  private getAndUpdateUserAndAreaIfAuthenticated = pipe(
    filter((status: AuthStatus) => status.isAuthenticated),
    mergeMap(() =>
      this.httpClient.get<User>(`${environment.baseUrl}/api/users/me`)
    ),
    catchError(transformError)
  );

  private _authStatus = signal<AuthStatus>(this.initializeStatus());
  authStatus = computed(() => this._authStatus());

  private user$ = toObservable(this.authStatus).pipe(
    this.getAndUpdateUserAndAreaIfAuthenticated
  );
  user = toSignal<User>(this.user$);

  constructor() {
    if (this.jwtService.isTokenExpired()) {
      this.logout(true);
    }
  }

  initializeStatus(): AuthStatus {
    if (this.jwtService.isTokenExpired()) {
      return defaultAuthStatus;
    } else {
      return this.getAuthStatusFromToken();
    }
  }

  register(registerRequest: RegisterRequest) {
    return this.httpClient
      .post(`${this.baseUrl}/register`, registerRequest)
      .pipe(catchError(transformError));
  }

  completeRegister(token: string, area: CompleteRegisterRequest) {
    return this.httpClient
      .post(`${this.baseUrl}/register/complete/${token}`, area)
      .pipe(catchError(transformError));
  }

  login(loginRequest: LoginRequest) {
    this.clearToken();

    return this.httpClient
      .post<LoginResponse>(`${this.baseUrl}/login`, loginRequest)
      .pipe(
        map(value => {
          this.setToken(value.token);
          const token = this.jwtService.decodeToken();
          return this.transformJwtToken(token);
        }),
        tap(status => {
          this._authStatus.set(status);
        }),
        this.getAndUpdateUserAndAreaIfAuthenticated
      );
  }

  forgotPassword(email: string) {
    console.log(email);

    return this.httpClient
      .get(`${this.baseUrl}/email/forgot/${email}`)
      .pipe(catchError(transformError));
  }

  logout(clearToken?: boolean) {
    if (clearToken) {
      this.clearToken();
    }
    this._authStatus.set(defaultAuthStatus);
  }

  getAuthStatusFromToken(): AuthStatus {
    const token = this.jwtService.decodeToken();
    return this.transformJwtToken(token);
  }

  private transformJwtToken(token: JwtToken): AuthStatus {
    return {
      isAuthenticated: token.email ? true : false,
      userId: token.id,
      userEmail: token.email,
      userRole: token.role,
    } as AuthStatus;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(jwt: string) {
    localStorage.setItem('token', jwt);
  }

  clearToken() {
    localStorage.removeItem('token');
  }
}
