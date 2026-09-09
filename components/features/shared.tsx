"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import type { ClubData, TrainingType } from "@/lib/types";
import { paymentStatus, totals } from "@/lib/calculations";

export type AppTab = "Beranda" | "Jadwal" | "QRIS" | "Anggota" | "Keuangan";
export const TODAY = "2026-09-06";
export const uid = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export function AppHeader({
  data,
  onInstall,
}: {
  data: ClubData;
  onInstall: () => void;
}) {
  const all = totals(data),
    rabuan = totals(data, "Rabuan"),
    sabtuan = totals(data, "Sabtuan");
  const amount = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value);
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());
  return (
    <header className="relative h-[350px] overflow-hidden bg-indigo-900 text-white">
      <Image src="/racket.png" alt="" fill priority className="object-cover" />
      {/* <Image
        src="/home-shuttle-watermark.svg"
        alt=""
        width={132}
        height={132}
        className="absolute right-[24px] top-[24px] rotate-12"
      /> */}
      <div className="absolute left-4 top-9 flex w-[361px] flex-col items-start gap-2 text-xl font-bold leading-5">
        <Image
          src="/icon-badminton-shuttle.svg"
          alt=""
          width={32}
          height={32}
        />
        PB Rutinan Rabu
      </div>
      <button
        type="button"
        onClick={onInstall}
        aria-label="Pasang Aplikasi"
        title="Pasang Aplikasi"
        className="absolute right-4 top-8 grid size-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 active:scale-95"
      >
        <Download size={21} />
      </button>

      <div className="absolute inset-x-6 top-[77px] flex flex-col gap-6 mt-14">
        {/* <div className="flex items-start gap-1">
          <span className="text-[11px] leading-[14px] text-white/80">Rp</span>
          <div>
            <p className="text-[28px] font-bold leading-[34px]">
              {amount(all.balance)}
            </p>
            <p className="text-[11px] leading-[14px] text-white/80">
              Total Saldo
            </p>
          </div>
        </div> */}
        <div className="flex items-start gap-1">
          <span className="text-[13px] leading-[14px] text-white/80">Rp</span>
          <div>
            <p className="text-[28px] font-bold leading-[34px]">
              {amount(rabuan.balance)}
            </p>
            <p className="text-[13px] leading-[14px] text-white/80">
              Saldo Rabuan
            </p>
          </div>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-1">
            <span className="text-[13px] leading-[14px] text-white/80">Rp</span>
            <div>
              <p className="text-[28px] font-bold leading-[34px]">
                {amount(sabtuan.balance)}
              </p>
              <p className="text-[13px] leading-[14px] text-white/80">
                Saldo Sabtuan
              </p>
            </div>
          </div>
          <p
            suppressHydrationWarning
            className="max-w-[168px] pt-1 text-right text-[13px] font-semibold leading-[18px] text-white"
          >
            {today}
          </p>
        </div>
        {/* <div className="grid grid-cols-2 gap-4 pt-4">
          <Balance value={rabuan.balance} label="Saldo Rabuan" />
          <Balance value={sabtuan.balance} label="Saldo Sabtuan" right />
        </div> */}
      </div>
    </header>
  );
}
function Balance({
  value,
  label,
  right = false,
}: {
  value: number;
  label: string;
  right?: boolean;
}) {
  return (
    <div className={`flex gap-1 ${right ? "justify-end text-left" : ""}`}>
      <span className="text-[11px] leading-[14px] text-white/80">Rp</span>
      <div>
        <p className=" text-2xl font-semibold leading-5">
          {new Intl.NumberFormat("id-ID").format(value)}
        </p>
        <p className="mt-1 text-[13px] leading-[14px] text-white/80">{label}</p>
      </div>
    </div>
  );
}

export function AppBottomNav({
  tab,
  setTab,
  onCreate,
}: {
  tab: AppTab;
  setTab: (tab: AppTab) => void;
  onCreate: () => void;
}) {
  const items: {
    label: string;
    tab?: AppTab;
    icon?: string;
    center?: boolean;
  }[] = [
    { label: "Home", tab: "Beranda", icon: "/icon-home-03.svg" },
    { label: "Keuangan", tab: "Keuangan", icon: "/icon-wallet-01.svg" },
    { label: "Latihan", tab: "Jadwal", center: true },
    { label: "QRIS", tab: "QRIS", icon: "/icon-qr-code.svg" },
    { label: "Anggota", tab: "Anggota", icon: "/icon-users-round.svg" },
  ];
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 grid h-[88px] w-full max-w-[393px] -translate-x-1/2 grid-cols-5 border-t border-[#e7e7e7] bg-white/90 pb-6 backdrop-blur-[10px]">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() =>
            item.center ? onCreate() : item.tab && setTab(item.tab)
          }
          className="relative h-16 text-xs leading-4 text-[#1a1a1a]"
        >
          {item.center ? (
            <span className="absolute -top-[18px] grid h-14 w-[79px] place-items-center rounded-[40px] bg-gradient-to-b from-[#fafafa] to-[#dfdfe0] shadow-[inset_0_2px_1px_rgb(255_255_255/0.7)]">
              <span className="grid h-11 w-[67px] place-items-center rounded-[40px] border border-[#3929b5] bg-gradient-to-b from-[#7d87ff] to-[#3929b5] text-[32px] font-light leading-none text-white shadow-[0_-4px_10px_rgb(0_0_0/0.15)]">
                +
              </span>
            </span>
          ) : (
            <span
              className={`absolute left-1/2 top-[6px] grid h-8 w-12 -translate-x-1/2 place-items-center rounded-[40px] ${item.tab === tab ? "bg-[#dde3ff]" : ""}`}
            >
              <Image
                src={
                  item.tab === "Keuangan" && tab !== "Keuangan"
                    ? "/icon-wallet-01-neutral.svg"
                    : item.icon!
                }
                alt=""
                width={24}
                height={24}
              />
            </span>
          )}
          <span className="absolute inset-x-0 bottom-[6px] text-center">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}

export function Avatar({
  name,
  small = false,
  large = false,
}: {
  name: string;
  small?: boolean;
  large?: boolean;
}) {
  const palette = [
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
    "bg-fuchsia-100 text-fuchsia-700",
    "bg-orange-100 text-orange-700",
  ];
  const index =
    [...name.toLowerCase()].reduce(
      (hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0,
      0,
    ) % palette.length;
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full font-bold ${large ? "size-20 text-2xl" : small ? "size-9 text-sm" : "size-10"} ${palette[index]}`}
    >
      {name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")}
    </div>
  );
}

export function PaymentStatus({
  paid,
  fee,
  recorded = paid > 0,
}: {
  paid: number;
  fee: number;
  recorded?: boolean;
}) {
  const status = paymentStatus(paid, fee, recorded);
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold ${status === "Sudah Bayar" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
    >
      {status}
    </span>
  );
}

export function TypePills({
  value,
  onChange,
}: {
  value: TrainingType;
  onChange: (type: TrainingType) => void;
}) {
  return (
    <div className="flex gap-2">
      {(["Rabuan", "Sabtuan"] as TrainingType[]).map((type) => (
        <button
          type="button"
          key={type}
          onClick={() => onChange(type)}
          className={`h-10 rounded-full border px-4 font-medium ${value === type ? "border-[#5445ff] bg-[#f0f1ff] text-[#5445d6]" : "border-[#e2e2e2] bg-white"}`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

export function FloatingCalendar({
  date,
  onSelect,
  onClose,
}: {
  date: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}) {
  const current = new Date(`${date || TODAY}T00:00:00`),
    year = current.getFullYear(),
    month = current.getMonth();
  const cells = [
    ...Array(new Date(year, month, 1).getDay()).fill(null),
    ...Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => i + 1,
    ),
  ];
  const choose = (day: number) =>
    onSelect(
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    );
  return (
    <div
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="w-full max-w-[393px] px-6">
        <div className="rounded-[24px] border border-[#e7e7e7] bg-white p-5 shadow-[0_16px_50px_rgb(0_0_0/0.28)]">
          <div className="mb-4 text-center font-bold capitalize">
            {new Intl.DateTimeFormat("id-ID", {
              month: "long",
              year: "numeric",
            }).format(current)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#8b8b8b]">
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, index) =>
              day ? (
                <button
                  type="button"
                  key={index}
                  onClick={() => choose(day)}
                  className={`aspect-square rounded-full text-sm ${day === current.getDate() ? "bg-[#5445d6] font-bold text-white" : "hover:bg-[#f0f1ff]"}`}
                >
                  {day}
                </button>
              ) : (
                <span key={index} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
