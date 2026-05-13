import { InboxLocator } from './inboxLocator';

/**
 * Manages the mounting lifecycle of the Mailman workspace.
 */
export class MountManager {
  private container: HTMLElement | null = null;

  public createMountPoint(id: string): HTMLElement {
    if (this.container) return this.container;

    this.container = document.createElement('div');
    this.container.id = id;
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    
    return this.container;
  }

  public mountToMain() {
    const main = InboxLocator.getMainContent();
    if (main && this.container && !main.contains(this.container)) {
      // Hide native list sibling if it exists
      const nativeList = main.querySelector('.aeF');
      if (nativeList instanceof HTMLElement) {
        nativeList.style.display = 'none';
      }
      
      main.insertBefore(this.container, main.firstChild);
    }
  }

  public unmountFromMain() {
    if (this.container && this.container.parentElement) {
      const main = this.container.parentElement;
      const nativeList = main.querySelector('.aeF');
      if (nativeList instanceof HTMLElement) {
        nativeList.style.display = '';
      }
      this.container.remove();
    }
  }

  public isMounted(): boolean {
    return !!(this.container && document.body.contains(this.container));
  }
}

export const mountManager = new MountManager();
