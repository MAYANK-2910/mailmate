import { db, CachedEmail } from './db';
import { Email } from '../../types/email';

export class Indexer {
  public static async indexEmails(emails: Email[]) {
    const cachedEmails: CachedEmail[] = emails.map(e => ({
      id: e.id,
      threadId: e.threadId,
      senderEmail: e.from.email,
      subject: e.subject,
      snippet: e.snippet,
      date: e.date,
    }));

    await db.emails.bulkPut(cachedEmails);
    console.log(`[Indexer] Indexed ${emails.length} emails`);
  }

  public static async getCachedEmails(): Promise<CachedEmail[]> {
    return await db.emails.orderBy('date').reverse().toArray();
  }
}
