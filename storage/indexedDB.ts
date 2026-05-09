import type { Email } from '../types/email';

const DB_NAME = 'mailman-db';
const DB_VERSION = 1;

interface MailmanDB {
  emails: Email;
  cache: { key: string; value: string; expiry: number };
}

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('emails')) {
        const emailStore = db.createObjectStore('emails', { keyPath: 'id' });
        emailStore.createIndex('threadId', 'threadId', { unique: false });
        emailStore.createIndex('category', 'category', { unique: false });
        emailStore.createIndex('date', 'date', { unique: false });
        emailStore.createIndex('senderEmail', 'sender.email', { unique: false });
      }

      if (!db.objectStoreNames.contains('cache')) {
        const cacheStore = db.createObjectStore('cache', { keyPath: 'key' });
        cacheStore.createIndex('expiry', 'expiry', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };
  });
}

export async function storeEmails(emails: Email[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('emails', 'readwrite');
  const store = tx.objectStore('emails');

  for (const email of emails) {
    store.put({
      ...email,
      date: email.date instanceof Date ? email.date.toISOString() : email.date,
    });
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getStoredEmails(): Promise<Email[]> {
  const db = await openDB();
  const tx = db.transaction('emails', 'readonly');
  const store = tx.objectStore('emails');

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const emails = request.result.map((e: Record<string, unknown>) => ({
        ...e,
        date: new Date(e.date as string),
      })) as Email[];
      resolve(emails);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getEmailsByCategory(category: string): Promise<Email[]> {
  const db = await openDB();
  const tx = db.transaction('emails', 'readonly');
  const store = tx.objectStore('emails');
  const index = store.index('category');

  return new Promise((resolve, reject) => {
    const request = index.getAll(category);
    request.onsuccess = () => {
      const emails = request.result.map((e: Record<string, unknown>) => ({
        ...e,
        date: new Date(e.date as string),
      })) as Email[];
      resolve(emails);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function clearEmailStore(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('emails', 'readwrite');
  tx.objectStore('emails').clear();
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function setCacheItem(key: string, value: string, ttlMs: number = 300000): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('cache', 'readwrite');
  tx.objectStore('cache').put({
    key,
    value,
    expiry: Date.now() + ttlMs,
  });
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getCacheItem(key: string): Promise<string | null> {
  const db = await openDB();
  const tx = db.transaction('cache', 'readonly');
  const store = tx.objectStore('cache');

  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => {
      const item = request.result as MailmanDB['cache'] | undefined;
      if (!item || item.expiry < Date.now()) {
        resolve(null);
      } else {
        resolve(item.value);
      }
    };
    request.onerror = () => reject(request.error);
  });
}
