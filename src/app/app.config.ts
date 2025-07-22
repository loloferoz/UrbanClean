import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { AuthHttpInterceptor } from './core/interceptors/auth-http-interceptor';
import { SpinnerInterceptor } from './core/interceptors/spinner.interceptor';
import { languageInterceptor } from './core/interceptors/language.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export function tokenGetter() {
  return localStorage.getItem('token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        AuthHttpInterceptor,
        SpinnerInterceptor,
        languageInterceptor,
      ])
    ),
    provideAnimationsAsync(),
    importProvidersFrom([JwtModule.forRoot({ config: { tokenGetter } })]),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        autoFocus: true,
        disableClose: true,
      },
    },
    {
      provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS,
      useValue: {
        restoreFocus: false,
      },
    },
  ],
};
