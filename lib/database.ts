import { createClient } from "@supabase/supabase-js";
import type { ClubData } from "@/lib/types";

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const databaseEnabled=Boolean(url&&key);
const client=databaseEnabled?createClient(url!,key!):null;

export async function loadClubData():Promise<ClubData|null>{
  if(!client)return null;
  const {data,error}=await client.from("club_state").select("data").eq("id","default").single();
  if(error)throw error;
  return data.data as ClubData;
}

export async function saveClubData(value:ClubData):Promise<void>{
  if(!client)return;
  const {error}=await client.from("club_state").upsert({id:"default",data:value,updated_at:new Date().toISOString()});
  if(error)throw error;
}
