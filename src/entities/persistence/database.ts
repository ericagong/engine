import type { PersistedFlowState } from "@/entities/types";

const DB_NAME = "engine-db";
const OBJECT_STORE_NAME = "flow-store";
const STATE_KEY = "flowState";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open(DB_NAME, DB_VERSION);

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;

      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        db.createObjectStore(OBJECT_STORE_NAME);
      }
    };

    openRequest.onsuccess = () => resolve(openRequest.result);
    openRequest.onerror = () => reject(openRequest.error);
  });
}

export async function loadFlowState(): Promise<PersistedFlowState | undefined> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, "readonly");
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
    const getRequest = objectStore.get(STATE_KEY);

    getRequest.onsuccess = () =>
      resolve(getRequest.result as PersistedFlowState | undefined);
    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function saveFlowState(state: PersistedFlowState): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(OBJECT_STORE_NAME, "readwrite");
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
    const putRequest = objectStore.put(state, STATE_KEY);

    putRequest.onsuccess = () => resolve();
    putRequest.onerror = () => reject(putRequest.error);
  });
}
