import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'berzsak-theme';

  private isDarkModeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    // Initialize theme from localStorage or default to light mode
    this.isDarkModeSubject.next(this.getInitialTheme());
  }

  private getInitialTheme(): boolean {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme !== null) {
      return savedTheme === 'dark';
    }
    // Default to light mode
    return false;
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkModeSubject.value;
    this.isDarkModeSubject.next(newTheme);
    localStorage.setItem(this.THEME_KEY, newTheme ? 'dark' : 'light');
  }

  get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  get themeIcon(): number {
    return this.isDarkMode ? 1 : 0;
  }
}
