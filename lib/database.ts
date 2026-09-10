import { createClient } from "@supabase/supabase-js";
import type { ClubData } from "@/lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const databaseEnabled = Boolean(url && key);
const client = databaseEnabled ? createClient(url!, key!) : null;

let lastRemoteVersion: string | null = null;
let saveQueue: Promise<void> = Promise.resolve();

export async function loadClubData(): Promise<ClubData | null> {
  if (!client) return null;
  const { data, error } = await client
    .from("club_state")
    .select("data, updated_at")
    .eq("id", "default")
    .maybeSingle();
  if (error) throw error;
  lastRemoteVersion = data?.updated_at ?? null;
  return data ? (data.data as ClubData) : null;
}

async function persistClubData(value: ClubData): Promise<void> {
  if (!client) return;
  const empty =
    value.members.length === 0 &&
    value.sessions.length === 0 &&
    value.payments.length === 0 &&
    value.expenses.length === 0;
  if (empty) throw new Error("EMPTY_DATA_BLOCKED");
  if (!lastRemoteVersion) throw new Error("REMOTE_NOT_LOADED");

  const nextVersion = new Date().toISOString();
  const { data, error } = await client
    .from("club_state")
    .update({ data: value, updated_at: nextVersion })
    .eq("id", "default")
    .eq("updated_at", lastRemoteVersion)
    .select("updated_at")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("REMOTE_DATA_CHANGED");
  lastRemoteVersion = data.updated_at;
}

export function saveClubData(value: ClubData): Promise<void> {
  const snapshot = structuredClone(value);
  const task = saveQueue
    .catch(() => undefined)
    .then(() => persistClubData(snapshot));
  saveQueue = task;
  return task;
}
