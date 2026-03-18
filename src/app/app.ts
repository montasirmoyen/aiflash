import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly themeStorageKey = 'aiflash-theme';

  protected readonly brandName = 'AIFlash';
  protected readonly isDarkMode = signal(false);

  constructor() {
    this.isDarkMode.set(this.getInitialTheme());

    effect(() => {
      const theme = this.isDarkMode() ? 'dark' : 'light';

      this.document.documentElement.setAttribute('data-theme', theme);
      this.document.body.style.colorScheme = theme;

      try {
        window.localStorage.setItem(this.themeStorageKey, theme);
      } catch {
        // ugnore
      }
    });
  }

  protected toggleTheme(): void {
    this.isDarkMode.update((currentMode) => !currentMode);
  }

  private getInitialTheme(): boolean {
    try {
      const storedTheme = window.localStorage.getItem(this.themeStorageKey);

      if (storedTheme === 'dark') {
        return true;
      }

      if (storedTheme === 'light') {
        return false;
      }
    } catch {
      // sys preference
    }

    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
