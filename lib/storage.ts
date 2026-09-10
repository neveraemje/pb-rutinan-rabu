import type { ClubData } from "./types";
import { seedData } from "./seed";

const KEY = "pb-rutinan-rabu-v2";
const BACKUP_KEY = "pb-rutinan-rabu-v2-backups";
export const cloneSeed = (): ClubData => JSON.parse(JSON.stringify(seedData));

export const isEmptyData = (data: ClubData) =>
  data.members.length === 0 &&
  data.sessions.length === 0 &&
  data.payments.length === 0 &&
  data.expenses.length === 0;

export const loadData = (): ClubData => {
  if (typeof window === "undefined") return cloneSeed();
  try { const saved = localStorage.getItem(KEY); return saved ? JSON.parse(saved) : cloneSeed(); } catch { return cloneSeed(); }
};
export const saveData = (data: ClubData) => {
  const next = JSON.stringify(data);
  const previous = localStorage.getItem(KEY);

  if (previous && previous !== next) {
    try {
      const previousData = JSON.parse(previous) as ClubData;
      if (!isEmptyData(previousData)) {
        const backups = JSON.parse(
          localStorage.getItem(BACKUP_KEY) ?? "[]",
        ) as { savedAt: string; data: ClubData }[];
        localStorage.setItem(
          BACKUP_KEY,
          JSON.stringify([
            { savedAt: new Date().toISOString(), data: previousData },
            ...backups,
          ].slice(0, 10)),
        );
      }
    } catch {
      // A damaged previous snapshot should not block the current save.
    }
  }

  localStorage.setItem(KEY, next);
};
export const resetData = () => { const data = cloneSeed(); saveData(data); return data; };
