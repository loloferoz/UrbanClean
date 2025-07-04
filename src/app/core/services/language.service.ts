import { computed, Injectable, signal } from '@angular/core';

const LOCALSTORAGELANGUAGE = 'language';
export enum Language {
  EN = 'en',
  ES = 'es',
  CA = 'ca',
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  #currentLanguage = signal<Language>(this.getLanguage());
  currentLanguage = computed(this.#currentLanguage);

  updateLanguage(language: Language) {
    this.setLanguage(language);
    this.#currentLanguage.set(language);
  }

  getLanguage(): Language {
    const language = localStorage.getItem(LOCALSTORAGELANGUAGE);
    return language === Language.ES ||
      language === Language.EN ||
      language === Language.CA
      ? language
      : Language.ES;
  }

  private setLanguage(language: Language) {
    localStorage.setItem(LOCALSTORAGELANGUAGE, language);
  }
}
