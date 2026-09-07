import type { ClubData } from "./types";
import { seedData } from "./seed";

const KEY = "pb-rutinan-rabu-demo-v1";
export const cloneSeed = (): ClubData => JSON.parse(JSON.stringify(seedData));
export const loadData = (): ClubData => {
  if (typeof window === "undefined") return cloneSeed();
  try { const saved = localStorage.getItem(KEY); return saved ? JSON.parse(saved) : cloneSeed(); } catch { return cloneSeed(); }
};
export const saveData = (data: ClubData) => localStorage.setItem(KEY, JSON.stringify(data));
export const resetData = () => { const data = cloneSeed(); saveData(data); return data; };

