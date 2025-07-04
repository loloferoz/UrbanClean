import { computed, effect, Injectable, signal } from '@angular/core';

const LOCALSTORAGETHEME = 'theme';

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _currentTheme = signal<Theme>(this.getTheme());
  currentTheme = computed(this._currentTheme);
  isDark = computed(() => this._currentTheme() === Theme.DARK);

  private setDarkMode = effect(() => {
    this.setTheme(this._currentTheme());
    document.documentElement.classList.toggle('dark', this.isDark());
  });

  updateTheme(theme: Theme) {
    this._currentTheme.set(theme);
  }

  private getTheme(): Theme {
    const theme = localStorage.getItem(LOCALSTORAGETHEME);
    return theme === Theme.LIGHT || theme === Theme.DARK ? theme : Theme.LIGHT;
  }

  private setTheme(theme: Theme) {
    localStorage.setItem(LOCALSTORAGETHEME, theme);
  }
}
