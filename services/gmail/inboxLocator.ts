/**
 * Resiliently locates Gmail's primary inbox containers using semantic roles.
 */
export const GMAIL_SELECTORS = {
  MAIN_CONTENT: 'div[role="main"]',
  INBOX_LIST: 'div[role="main"] .UI table',
  SIDEBAR: 'div[role="navigation"]',
  TOP_BAR: 'header[role="banner"]',
};

export class InboxLocator {
  static getMainContent(): HTMLElement | null {
    return document.querySelector<HTMLElement>(GMAIL_SELECTORS.MAIN_CONTENT);
  }

  static getInboxList(): HTMLElement | null {
    return document.querySelector<HTMLElement>(GMAIL_SELECTORS.INBOX_LIST);
  }

  /**
   * Checks if the current view is a standard inbox list.
   */
  static isInboxPresent(): boolean {
    const main = this.getMainContent();
    return !!(main && main.querySelector('table'));
  }
}
