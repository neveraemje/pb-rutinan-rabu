"use client";
import type { ClubData, TrainingType } from "@/lib/types";
import {
  formatDate,
  sessionDateTime,
  sessionIncome,
  shortRupiah,
} from "@/lib/calculations";

export function HomeView({
  data,
  filter,
  setFilter,
  onSession,
}: {
  data: ClubData;
  filter: string;
  setFilter: (type: "Semua" | TrainingType) => void;
  onSession: (id: string) => void;
}) {
  const sessions = [...data.sessions]
    .filter((session) => filter === "Semua" || session.type === filter)
    .sort((a, b) => sessionDateTime(b) - sessionDateTime(a));
  return (
    <div className="-mx-4">
      <div className="sticky top-0 z-10 mx-3 grid h-12 grid-cols-3 items-center rounded-[48px] bg-white p-1 shadow-[0_0_5px_rgb(0_0_0/0.15)]">
        {(["Semua", "Rabuan", "Sabtuan"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`h-10 rounded-[32px] text-sm font-bold leading-5 ${filter === item ? "bg-[#cfd6ff] text-[#3929b5]" : "text-[#1a1a1a]"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div>
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSession(session.id)}
            className="flex h-[72px] w-full items-center gap-2 px-4 py-4 text-left"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f2f2f2] text-lg font-semibold leading-5 text-[#4c4c4c]">
              {new Date(`${session.date}T00:00:00`).getDate()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base font-normal leading-5 text-[#202020]">
                {formatDate(session.date, { month: "long", year: "numeric" })}
              </span>
              <span className="mt-1 block truncate text-xs leading-[14px] text-[#8b8b8b]">
                {session.venue.replace("GOR ", "")}
              </span>
            </span>
            <span className="shrink-0 text-right text-xs leading-[14px]">
              <span className="block text-[#8b8b8b]">
                {session.participantIds.length} peserta
              </span>
              <span className="mt-1 block text-[#039a12]">
                +{shortRupiah(sessionIncome(data, session.id))}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
