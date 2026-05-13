/**
 * Manages Gmail route detection and transition events.
 * Relies on window.location.hash for resilient route tracking.
 */
export type GmailRoute = 'inbox' | 'thread' | 'label' | 'search' | 'settings' | 'unknown';

class RouteManager {
  private currentRoute: GmailRoute = 'unknown';
  private listeners: Set<(route: GmailRoute) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => this.handleRouteChange());
      this.handleRouteChange();
    }
  }

  private handleRouteChange() {
    const hash = window.location.hash;
    const previousRoute = this.currentRoute;

    if (hash.startsWith('#inbox')) this.currentRoute = 'inbox';
    else if (hash.startsWith('#label')) this.currentRoute = 'label';
    else if (hash.startsWith('#search')) this.currentRoute = 'search';
    else if (hash.startsWith('#settings')) this.currentRoute = 'settings';
    else if (hash.match(/#[a-zA-Z0-9]+\/[a-zA-Z0-9]+/)) this.currentRoute = 'thread';
    else this.currentRoute = 'unknown';

    if (this.currentRoute !== previousRoute) {
      this.notifyListeners();
    }
  }

  public getRoute(): GmailRoute {
    return this.currentRoute;
  }

  public onRouteOY(callback: (route: GmailRoute) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb(this.currentRoute));
  }
}

export const routeManager = new RouteManager();
