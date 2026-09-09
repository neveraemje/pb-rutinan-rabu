"use client";

import { useEffect, useState } from "react";
import { Apple, Download, Smartphone, X } from "lucide-react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallAppSheet({
  open,
  onClose,
  onToast,
}: {
  open: boolean;
  onClose: () => void;
  onToast: (message: string) => void;
}) {
  const [installPrompt, setInstallPrompt] =
    useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
  });

  useEffect(() => {
    const rememberPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const markInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", rememberPrompt);
    window.addEventListener("appinstalled", markInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", rememberPrompt);
      window.removeEventListener("appinstalled", markInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstalled(true);
      onClose();
      onToast("Aplikasi berhasil dipasang");
    }
    setInstallPrompt(null);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-y-0 left-1/2 z-[120] flex w-full max-w-[393px] -translate-x-1/2 items-end bg-black/50"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        className="absolute bottom-[526px] right-6 grid size-10 place-items-center rounded-full bg-white shadow"
      >
        <X size={22} />
      </button>
      <section className="w-full rounded-t-[28px] bg-white px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-6 shadow-2xl">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-[#dde3ff] text-[#4169dc]">
          <Smartphone size={30} />
        </div>
        <h2 className="text-center text-2xl font-bold">Pasang Aplikasi</h2>
        <p className="mx-auto mt-2 max-w-[320px] text-center text-sm leading-5 text-[#6f6f6f]">
          Tambahkan PB Rutinan Rabu ke layar utama agar lebih mudah dibuka.
        </p>

        {installed ? (
          <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
            Aplikasi sudah terpasang di perangkat ini.
          </div>
        ) : installPrompt ? (
          <button
            type="button"
            onClick={install}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#7d87ff] to-[#3929b5] font-bold text-white shadow"
          >
            <Download size={20} /> Pasang sekarang
          </button>
        ) : null}

        <div className="mt-6 grid gap-3">
          <Instruction
            icon={<AndroidIcon />}
            title="Android (Chrome)"
            text='Ketuk menu ⋮, lalu pilih “Tambahkan ke layar utama” atau “Instal aplikasi”.'
          />
          <Instruction
            icon={<Apple size={23} strokeWidth={2.25} />}
            title="iPhone (Safari)"
            text='Ketuk Bagikan, lalu pilih “Tambahkan ke Layar Utama” dan tekan Tambah.'
          />
        </div>
      </section>
    </div>
  );
}

function AndroidIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="m7.2 7.1-1.3-2.2.8-.5L8 6.6A8.1 8.1 0 0 1 12 5.5c1.5 0 2.8.4 4 1.1l1.3-2.2.8.5-1.3 2.2A6.4 6.4 0 0 1 19 12H5c0-2 .8-3.7 2.2-4.9ZM8.5 9.4a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Zm7 0a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6ZM5 13h14v6.2c0 1-.8 1.8-1.8 1.8h-.7v2h-2v-2h-5v2h-2v-2h-.7c-1 0-1.8-.8-1.8-1.8V13Zm-3 1.2c0-.7.6-1.2 1.2-1.2H4v6h-.8c-.6 0-1.2-.5-1.2-1.2v-3.6ZM20 13h.8c.6 0 1.2.5 1.2 1.2v3.6c0 .7-.6 1.2-1.2 1.2H20v-6Z" />
    </svg>
  );
}

function Instruction({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-[#f4f5fb] p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#4169dc] shadow-sm">
        {icon}
      </span>
      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-1 text-sm leading-5 text-[#6f6f6f]">{text}</p>
      </div>
    </div>
  );
}
