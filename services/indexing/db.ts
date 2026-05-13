import Dexie, { Table } from 'dexie';

export interface CachedEmail {
  id: string;
  threadId: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  date: number;
  category?: string;
  priority?: number;
}

export interface SenderMetadata {
  email: string;
  name: string;
  frequency: number;
  lastInteraction: number;
}

export class MailmanDB extends Dexie {
  emails!: Table<CachedEmail>;
  senders!: Table<SenderMetadata>;

  constructor() {
    super('MailmanDB');
    this.version(1).stores({
      emails: 'id, threadId, senderEmail, date, category',
      senders: 'email, frequency, lastInteraction'
    });
  }
}

export const db = new MailmanDB();
