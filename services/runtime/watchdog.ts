/**
 * Watchdog timer to detect and recover from Gmail UI crashes or aggressive re-renders.
 */
export class Watchdog {
  private timer: number | null = null;

  constructor(
    private checkFn: () => boolean,
    private recoverFn: () => void,
    private interval: number = 3000
  ) {}

  public start() {
    if (this.timer) return;
    this.timer = window.setInterval(() => {
      if (!this.checkFn()) {
        console.warn('[Mailman] Watchdog detected unmounted state. Recovering...');
        this.recoverFn();
      }
    }, this.interval);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
