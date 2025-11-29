
import { ImageSize, HistoryItem } from '../types';

const DB_NAME = 'LumierDB';
const STORE_NAME = 'history';
const DB_VERSION = 1;

// --- LocalStorage Wrapper for Preferences ---

export const savePreference = (key: string, value: any) => {
  try {
    localStorage.setItem(`lumier_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save preference', e);
  }
};

export const getPreference = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`lumier_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

// --- IndexedDB Wrapper for Heavy Assets (Images) ---

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveHistoryItemToDB = async (item: HistoryItem): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(item);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getHistoryFromDB = async (): Promise<HistoryItem[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      // Sort by timestamp descending (newest first)
      const results = request.result as HistoryItem[];
      results.sort((a, b) => b.timestamp - a.timestamp);
      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
};

export const clearHistoryDB = async (): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
};
