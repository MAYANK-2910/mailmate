type GmailEvent = 'refresh' | 'compose' | 'search' | 'threadOpen';

class GmailEvents {
  private listeners: Record<string, Set<() => void>> = {};

  public on(event: GmailEvent, cb: () => void) {
    if (!this.listeners[event]) this.listeners[event] = new Set();
    this.listeners[event].add(cb);
    return () => this.listeners[event].delete(cb);
  }

  public emit(event: GmailEvent) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb());
    }
  }
}

export const gmailEvents = new GmailEvents();
