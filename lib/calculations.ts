import type { ClubData, Session, TrainingType } from "./types";

export const rupiah = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
export const shortRupiah = (value: number) => `Rp${new Intl.NumberFormat("id-ID").format(value)}`;
export const formatDate = (date: string, opts?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("id-ID", opts ?? { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T00:00:00+07:00`));
export const paidFor = (data: ClubData, sessionId: string, memberId: string) => data.payments.filter(p => p.sessionId === sessionId && p.memberId === memberId).reduce((sum, p) => sum + p.amount, 0);
export const paymentStatus = (paid: number, _fee: number) => paid <= 0 ? "Belum Bayar" : "Sudah Bayar";
export const sessionIncome = (data: ClubData, sessionId: string) => data.payments.filter(p => p.sessionId === sessionId).reduce((sum, p) => sum + p.amount, 0);
export const totals = (data: ClubData, type: TrainingType | "Semua" = "Semua", month = "Semua") => {
  const sessions = data.sessions.filter(s => type === "Semua" || s.type === type);
  const ids = new Set(sessions.map(s => s.id));
  const payments = data.payments.filter(p => ids.has(p.sessionId) && (month === "Semua" || p.date.startsWith(month)));
  const expenses = data.expenses.filter(e => (type === "Semua" || e.type === type) && (month === "Semua" || e.date.startsWith(month)));
  const income = payments.reduce((sum, p) => sum + p.amount, 0);
  const expense = expenses.reduce((sum, e) => sum + e.amount, 0);
  return { income, expense, balance: income - expense };
};
export const sessionHasPayments = (data: ClubData, sessionId: string) => data.payments.some(p => p.sessionId === sessionId);
export const participantHasPayments = (data: ClubData, sessionId: string, memberId: string) => data.payments.some(p => p.sessionId === sessionId && p.memberId === memberId);
export const sessionDateTime = (s: Session) => new Date(`${s.date}T${s.time}:00+07:00`).getTime();
