"use client";
import { useState } from "react";
import {
  CalendarDays,
  Download,
  Plus,
  ReceiptText,
  RotateCcw,
  Upload,
} from "lucide-react";
import type { ClubData, Expense, TrainingType } from "@/lib/types";
import {
  formatDate,
  sessionIncome,
  shortRupiah,
  totals,
} from "@/lib/calculations";
import { Empty } from "@/components/ui-kit";
import { FloatingCalendar, TypePills } from "@/components/features/shared";

export function PengeluaranView({
  data,
  filter,
  setFilter,
  onExpense,
  onAdd,
  onReset,
}: {
  data: ClubData;
  filter: string;
  setFilter: (type: "Semua" | TrainingType) => void;
  onExpense: (id: string) => void;
  onAdd: () => void;
  onReset: () => void;
}) {
  const [kind, setKind] = useState<"all" | "in" | "out">("all");
  const rabuanBalance = totals(data, "Rabuan").balance;
  const sabtuanBalance = totals(data, "Sabtuan").balance;
  const income = data.sessions
    .filter((session) => filter === "Semua" || session.type === filter)
    .map((session) => ({ ...session, amount: sessionIncome(data, session.id) }))
    .filter((session) => session.amount > 0)
    .sort((a, b) => b.date.localeCompare(a.date));
  const expenses = data.expenses
    .filter((expense) => filter === "Semua" || expense.type === filter)
    .sort((a, b) => b.date.localeCompare(a.date));
  const transactions = [
    ...income.map((session) => ({
      id: session.id,
      kind: "in" as const,
      date: session.date,
      title: formatDate(session.date),
      subtitle: session.venue,
      amount: session.amount,
    })),
    ...expenses.map((expense) => ({
      id: expense.id,
      kind: "out" as const,
      date: expense.date,
      title: expense.title,
      subtitle: formatDate(expense.date),
      amount: expense.amount,
    })),
  ]
    .filter((transaction) => kind === "all" || transaction.kind === kind)
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date) || a.kind.localeCompare(b.kind),
    );
  const emptyScope = filter === "Semua" ? "semua latihan" : `latihan ${filter}`;
  return (
    <div className="min-h-[calc(100dvh-88px)] bg-[#f9f9f9]">
      <header className="border-b border-[#e7e7e7] bg-white px-4 pb-0 pt-8">
        <div className="flex h-9 items-center">
          <h1 className="flex-1 text-xl font-bold">Keuangan</h1>
          {kind !== "in" && (
            <button
              onClick={onAdd}
              className="flex h-9 items-center gap-1 rounded-full border border-[#dedede] bg-white px-3 text-sm text-[#5f5f5f]"
            >
              <Plus size={16} /> Tambah Pengeluaran
            </button>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <BalanceCard label="Saldo Rabuan" value={rabuanBalance} />
          <BalanceCard label="Saldo Sabtuan" value={sabtuanBalance} />
        </div>
        <div className="mt-4 grid h-11 grid-cols-3">
          <button
            onClick={() => setKind("all")}
            className={`border-b-2 text-xs font-bold ${kind === "all" ? "border-[#5b5ce8] text-[#202020]" : "border-transparent text-[#8b8b8b]"}`}
          >
            Semua Kategori
          </button>
          <button
            onClick={() => setKind("in")}
            className={`border-b-2 text-xs font-bold ${kind === "in" ? "border-[#5b5ce8] text-[#202020]" : "border-transparent text-[#8b8b8b]"}`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setKind("out")}
            className={`border-b-2 text-xs font-bold ${kind === "out" ? "border-[#5b5ce8] text-[#202020]" : "border-transparent text-[#8b8b8b]"}`}
          >
            Pengeluaran
          </button>
        </div>
      </header>
      <div className="grid h-[72px] grid-cols-3 items-center gap-1 px-4">
        {(["Semua", "Rabuan", "Sabtuan"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`h-10 rounded-full text-sm font-bold ${filter === item ? "bg-[#cfd6ff] text-[#3929b5]" : "bg-white text-[#1a1a1a]"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div>
        {transactions.length ? (
          transactions.map((transaction, index) => (
            <button
              key={`${transaction.kind}-${transaction.id}`}
              onClick={() =>
                transaction.kind === "out" && onExpense(transaction.id)
              }
              className={`flex h-[72px] w-full items-center gap-2 px-4 text-left ${index % 2 ? "bg-[#f2f2f2]" : "bg-white"}`}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full ${transaction.kind === "in" ? "bg-[#bfffd4] text-[#039a12]" : "bg-[#ffe8e6] text-[#ee2737]"}`}
              >
                {transaction.kind === "in" ? (
                  <Download size={20} />
                ) : (
                  <Upload size={20} />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <b className="block truncate font-medium">
                  {transaction.title}
                </b>
                <span className="block truncate text-xs text-[#8b8b8b]">
                  {transaction.subtitle}
                </span>
              </span>
              <span
                className={`shrink-0 text-sm ${transaction.kind === "in" ? "text-[#039a12]" : "text-[#ee2737]"}`}
              >
                {transaction.kind === "in" ? "+" : "-"}
                {shortRupiah(transaction.amount)}
              </span>
            </button>
          ))
        ) : (
          <Empty
            icon={kind === "out" ? <Upload /> : <Download />}
            title={
              kind === "all"
                ? "Belum ada transaksi"
                : kind === "in"
                  ? "Belum ada pemasukan"
                  : "Belum ada pengeluaran"
            }
            text={`Belum ada transaksi untuk ${emptyScope}.`}
          />
        )}
      </div>
      {/* <button
        onClick={onReset}
        className="mx-auto mt-8 flex items-center gap-2 text-xs font-semibold text-slate-400"
      >
        <RotateCcw size={14} /> Reset Data Demo
      </button> */}
    </div>
  );
}

function BalanceCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#f0f2ff] px-3 py-3">
      <p className="text-[11px] font-medium text-[#6f6f6f]">{label}</p>
      <p className="mt-1 truncate text-lg font-bold text-[#3929b5]">
        {shortRupiah(value)}
      </p>
    </div>
  );
}

export function ExpenseDetailSheet({
  open,
  expense,
  onClose,
  onEdit,
  onDelete,
}: {
  open: boolean;
  expense: Expense;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!open) return null;
  return (
    <ExpenseShell onClose={onClose} title="Detail Pengeluaran">
      <div className="grid gap-4 px-4">
        <div className="flex h-14 items-center gap-2 rounded-2xl bg-[#f2f2f2] px-4">
          <CalendarDays size={24} />
          <b className="text-lg">{formatDate(expense.date)}</b>
        </div>
        <div>
          <p className="mb-[10px] text-sm text-[#8b8b8b]">Pilih Hari</p>
          <TypePills value={expense.type} onChange={() => {}} />
        </div>
        <div className="flex h-14 items-center gap-2 rounded-2xl bg-[#f2f2f2] px-4 text-lg">
          <span>Rp</span>
          <b>{new Intl.NumberFormat("id-ID").format(expense.amount)}</b>
        </div>
        <div className="flex h-14 items-center gap-2 rounded-2xl bg-[#f2f2f2] px-4">
          <ReceiptText size={24} />
          <b className="truncate text-lg">{expense.title}</b>
        </div>
      </div>
      <footer className="absolute inset-x-0 bottom-0 border-t border-[#e7e7e7] bg-white/90 px-4 pb-8 pt-4">
        <div className="grid grid-cols-2 gap-[10px]">
          <button
            onClick={onDelete}
            className="h-12 rounded-full bg-gradient-to-b from-[#ff6565] to-[#b30024] font-bold text-white"
          >
            Hapus
          </button>
          <button
            onClick={onEdit}
            className="h-12 rounded-full bg-gradient-to-b from-[#7d87ff] to-[#3929b5] font-bold text-white"
          >
            Ubah
          </button>
        </div>
      </footer>
    </ExpenseShell>
  );
}

export function ExpenseFormSheet({
  open,
  form,
  setForm,
  error,
  onClose,
  onSave,
}: {
  open: boolean;
  form: Expense;
  setForm: (expense: Expense) => void;
  error: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  if (!open) return null;
  return (
    <ExpenseShell
      onClose={onClose}
      title={form.id ? "Ubah Pengeluaran" : "Tambah Pengeluaran"}
    >
      <div className="grid gap-4 px-4">
        <button
          type="button"
          onClick={() => setCalendarOpen(true)}
          className="flex h-14 items-center gap-2 rounded-2xl bg-[#f2f2f2] px-4 text-left text-lg text-[#737373]"
        >
          <CalendarDays size={24} className="text-slate-800" />
          {form.date ? formatDate(form.date) : "Pilih tanggal"}
        </button>
        <div>
          <p className="mb-[10px] text-sm text-[#8b8b8b]">Pilih Hari</p>
          <TypePills
            value={form.type}
            onChange={(type) =>
              setForm({ ...form, type, sessionId: undefined })
            }
          />
        </div>
        <label className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
            Rp
          </span>
          <input
            aria-label="Nominal"
            type="number"
            min="1"
            value={form.amount || ""}
            onChange={(e) => setForm({ ...form, amount: +e.target.value })}
            placeholder="Masukkan nominal"
            className="h-14 w-full rounded-2xl bg-[#f2f2f2] pl-12 pr-4 text-lg outline-none"
          />
        </label>
        <label className="relative">
          <ReceiptText
            size={24}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          />
          <input
            aria-label="Keterangan"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Keterangan"
            className="h-14 w-full rounded-2xl bg-[#f2f2f2] pl-12 pr-4 text-lg outline-none"
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <footer className="absolute inset-x-0 bottom-0 border-t border-[#e7e7e7] bg-white/90 px-4 pb-8 pt-4">
        <button
          onClick={onSave}
          className="h-12 w-full rounded-full bg-gradient-to-b from-[#7d87ff] to-[#3929b5] font-bold text-white"
        >
          Simpan
        </button>
      </footer>
      {calendarOpen && (
        <FloatingCalendar
          date={form.date}
          onClose={() => setCalendarOpen(false)}
          onSelect={(date) => {
            setForm({ ...form, date });
            setCalendarOpen(false);
          }}
        />
      )}
    </ExpenseShell>
  );
}

function ExpenseShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-y-0 left-1/2 z-[90] flex w-full max-w-[393px] -translate-x-1/2 items-end bg-[rgba(28,29,29,0.5)]">
      <button
        onClick={onClose}
        aria-label="Tutup"
        className="absolute bottom-[593px] right-7 grid size-10 place-items-center rounded-full bg-white text-[#4c4c4c] shadow"
      >
        <span className="text-3xl font-light">×</span>
      </button>
      <section className="relative h-[579px] w-full overflow-hidden rounded-t-[24px] bg-white pt-[167px]">
        <div className="absolute inset-x-0 top-0 h-[72px] bg-[#fff2f0]" />
        <div className="absolute left-1/2 top-[27px] -translate-x-1/2 text-center">
          <div className="mx-auto grid size-[79px] place-items-center rounded-full bg-[#ffdedb] text-[#ee2737]">
            <Upload size={40} />
          </div>
          <h2 className="mt-2 whitespace-nowrap text-2xl font-bold">{title}</h2>
        </div>
        {children}
      </section>
    </div>
  );
}
