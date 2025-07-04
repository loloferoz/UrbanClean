import { HttpInterceptorFn } from '@angular/common/http';
import { LanguageService } from '../services/language.service';
import { inject } from '@angular/core';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const language = inject(LanguageService);

  const newReq = req.clone({
    setHeaders: {
      'Accept-Language': language.currentLanguage(),
    },
  });

  return next(newReq);
};
