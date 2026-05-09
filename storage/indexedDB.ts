const DB_NAME = 'mailman-db';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('emails')) {
        const store = db.createObjectStore('emails', { keyPath: 'id' });
        store.createIndex('threadId', 'threadId', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
    };
    request.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    request.onerror = () => reject(new Error('Failed to open IndexedDB'));
  });
}
