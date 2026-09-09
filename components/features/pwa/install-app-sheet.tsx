"use client";

import { useEffect, useState } from "react";
import { Download, MoreVertical, Share2, Smartphone, X } from "lucide-react";

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
            icon={<MoreVertical size={22} />}
            title="Android (Chrome)"
            text='Ketuk menu ⋮, lalu pilih “Tambahkan ke layar utama” atau “Instal aplikasi”.'
          />
          <Instruction
            icon={<Share2 size={21} />}
            title="iPhone (Safari)"
            text='Ketuk Bagikan, lalu pilih “Tambahkan ke Layar Utama” dan tekan Tambah.'
          />
        </div>
      </section>
    </div>
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
