import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Settings } from "../types";
import type { Repository, StoreMap, StoreName } from "./repository";

const DB_NAME = "speak-lab";
const DB_VERSION = 1;

interface SpeakLabDB extends DBSchema {
  kv: { key: string; value: Settings };
  materials: { key: string; value: StoreMap["materials"] };
  sentences: { key: string; value: StoreMap["sentences"] };
  reviews: { key: string; value: StoreMap["reviews"] };
  attempts: { key: string; value: StoreMap["attempts"] };
  audio: { key: string; value: StoreMap["audio"] };
  sessions: { key: string; value: StoreMap["sessions"] };
  plans: { key: string; value: StoreMap["plans"] };
}

export const STORE_NAMES: StoreName[] = [
  "materials",
  "sentences",
  "reviews",
  "attempts",
  "audio",
  "sessions",
  "plans",
];

const KEY_PATH: Record<StoreName, string> = {
  materials: "id",
  sentences: "id",
  reviews: "id",
  attempts: "id",
  audio: "id",
  sessions: "id",
  plans: "date",
};

export class IndexedDBRepository implements Repository {
  private dbp: Promise<IDBPDatabase<SpeakLabDB>> | null = null;
  private listeners = new Set<(s: StoreName | "settings") => void>();
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof BroadcastChannel !== "undefined") {
      // Keep multiple open tabs consistent.
      this.channel = new BroadcastChannel("speak-lab");
      this.channel.onmessage = (e) => this.emit(e.data, false);
    }
  }

  private db() {
    if (!this.dbp) {
      this.dbp = openDB<SpeakLabDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv", { keyPath: "id" });
          for (const name of STORE_NAMES) {
            if (!db.objectStoreNames.contains(name)) {
              db.createObjectStore(name, { keyPath: KEY_PATH[name] });
            }
          }
        },
      });
    }
    return this.dbp;
  }

  private emit(store: StoreName | "settings", broadcast = true) {
    for (const fn of this.listeners) fn(store);
    if (broadcast) this.channel?.postMessage(store);
  }

  async getSettings() {
    return (await (await this.db()).get("kv", "settings")) ?? null;
  }
  async putSettings(s: Settings) {
    await (await this.db()).put("kv", s);
    this.emit("settings");
  }
  async all<K extends StoreName>(store: K): Promise<StoreMap[K][]> {
    return (await (await this.db()).getAll(store)) as StoreMap[K][];
  }
  async get<K extends StoreName>(store: K, key: string) {
    return (await (await this.db()).get(store, key)) as StoreMap[K] | undefined;
  }
  async put<K extends StoreName>(store: K, value: StoreMap[K]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (await this.db()).put(store, value as any);
    this.emit(store);
  }
  async putMany<K extends StoreName>(store: K, values: StoreMap[K][]) {
    const tx = (await this.db()).transaction(store, "readwrite");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await Promise.all([...values.map((v) => tx.store.put(v as any)), tx.done]);
    this.emit(store);
  }
  async remove<K extends StoreName>(store: K, key: string) {
    await (await this.db()).delete(store, key);
    this.emit(store);
  }
  async clearAll() {
    const db = await this.db();
    const tx = db.transaction(["kv", ...STORE_NAMES], "readwrite");
    await Promise.all([tx.objectStore("kv").clear(), ...STORE_NAMES.map((s) => tx.objectStore(s).clear()), tx.done]);
    this.emit("settings");
    for (const s of STORE_NAMES) this.emit(s);
  }
  subscribe(fn: (s: StoreName | "settings") => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }
}

let singleton: Repository | null = null;
export function getRepo(): Repository {
  if (!singleton) singleton = new IndexedDBRepository();
  return singleton;
}
