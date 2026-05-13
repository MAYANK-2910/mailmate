/**
 * Optimized MutationObserver for Gmail DOM transitions.
 */
export class DomObserver {
  private observer: MutationObserver | null = null;
  private isObserving = false;

  constructor(private targetSelector: string, private callback: (mutations: MutationRecord[]) => void) {}

  public start() {
    if (this.isObserving) return;

    const target = document.querySelector(this.targetSelector) || document.body;
    this.observer = new MutationObserver((mutations) => {
      this.callback(mutations);
    });

    this.observer.observe(target, {
      childList: true,
      subtree: true,
    });

    this.isObserving = true;
  }

  public stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isObserving = false;
  }
}
