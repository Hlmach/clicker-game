const DB_NAME = "ClickerGameDB";
const STORE_NAME = "GameState";
const DB_VERSION = 4;

// Створення store
function createObjectStore(db) {
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    db.createObjectStore(STORE_NAME);
    console.log("[DB] objectStore 'GameState' created");
  }
}

export const saveGameState = (state) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    createObjectStore(db);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;

    if (!db.objectStoreNames.contains(STORE_NAME)) {
      console.error("[DB] STORE_NAME not found on save!");
      return;
    }

    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(state, "state");
    console.log("[DB] Saved state:", state);
  };

  request.onerror = (event) => {
    console.error("IndexedDB Save Error:", event.target.error);
  };
};

export const loadGameState = () =>
  new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      createObjectStore(db);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.error("[DB] STORE_NAME not found on load!");
        resolve({});
        return;
      }

      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get("state");

      getRequest.onsuccess = () => {
        const data = getRequest.result || {};
        console.log("[DB] Loaded state:", data);
        resolve(data);
      };
    };

    request.onerror = (event) => {
      console.error("IndexedDB Load Error:", event.target.error);
      resolve({});
    };
  });
