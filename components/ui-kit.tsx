"use client";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { Check, X } from "lucide-react";

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger";
}) {
  const styles = {
    primary: "bg-violet-700 text-white shadow-sm hover:bg-violet-800",
    outline: "border border-violet-200 bg-white text-violet-800",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-red-50 text-red-700 hover:bg-red-100",
  };
  return (
    <button
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-45 ${styles[variant]} ${className}`}
      {...props}
    />
  ); //josgf
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-14 w-full rounded-2xl border-0 bg-[#f2f2f2] px-4 text-base outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-200 ${props.className ?? ""}`}
    />
  );
}
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-14 w-full rounded-2xl border-0 bg-[#f2f2f2] px-4 text-base outline-none focus:ring-2 focus:ring-indigo-200 ${props.className ?? ""}`}
    />
  );
} //mantul
export function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-slate-700">
      {label}
      {children}
      {error && (
        <span className="text-xs font-normal text-red-600">{error}</span>
      )}
    </label>
  );
}
export function Sheet({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="relative max-h-[88dvh] w-full max-w-[480px] overflow-y-auto rounded-t-[24px] bg-white px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-20 shadow-2xl">
        <div className="absolute left-0 right-0 top-0 h-16 rounded-t-[24px] bg-[#fff0ee]" />
        <button
          aria-label="Tutup"
          onClick={onClose}
          className="absolute right-7 top-[-64px] grid size-10 place-items-center rounded-full bg-white shadow"
        >
          <X size={22} />
        </button>
        <div className="relative mb-7 text-center">
          <div className="mx-auto -mt-[52px] mb-5 grid size-20 place-items-center rounded-full bg-[#ffd9d7] text-[#f32745]">
            <span className="text-3xl font-bold">↑</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        </div>
        {children}
      </section>
    </div>
  );
}
export function FilterPills({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: "Semua" | "Rabuan" | "Sabtuan") => void;
}) {
  return (
    <div className="grid grid-cols-3 rounded-full bg-white p-1 shadow-[0_1px_8px_rgb(15_23_42/0.1)]">
      {["Semua", "Rabuan", "Sabtuan"].map((x) => (
        <button
          key={x}
          onClick={() => onChange(x as never)}
          className={`h-9 rounded-full text-sm font-semibold transition ${value === x ? "bg-violet-200 text-violet-800" : "text-slate-600"}`}
        >
          {x}
        </button>
      ))}
    </div>
  );
}
export function Checkbox({
  checked,
  onCheckedChange,
  label,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onCheckedChange(!checked)}
      className={`grid size-5 shrink-0 place-items-center rounded-[5px] border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8adff] focus-visible:ring-offset-2 ${checked ? "border-[#5b5ce8] bg-[#5b5ce8] text-white" : "border-[#737373] bg-white text-transparent"}`}
    >
      {checked && <Check size={14} strokeWidth={3} />}
    </button>
  );
}
export function Empty({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <div className="mb-3 grid size-11 place-items-center rounded-full bg-violet-50 text-violet-600">
        {icon}
      </div>
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}
