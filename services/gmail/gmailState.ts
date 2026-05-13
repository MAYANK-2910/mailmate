/**
 * Utilities for extracting session and user state from Gmail's internal variables.
 */
export class GmailState {
  static getUserEmail(): string | null {
    // Gmail often stores user info in GLOBALS or specifically in certain elements
    const element = document.querySelector('a[href^="https://accounts.google.com/SignOutOptions"]');
    if (element) {
      const ariaLabel = element.getAttribute('aria-label') || '';
      const match = ariaLabel.match(/\(([^)]+)\)/);
      return match ? match[1] : null;
    }
    return null;
  }

  static getTheme(): 'dark' | 'light' {
    return document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  }
}
