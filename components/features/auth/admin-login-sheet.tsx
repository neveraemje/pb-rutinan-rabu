"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { Button, Input } from "@/components/ui-kit";

export function AdminLoginSheet({
  open,
  onClose,
  onLogin,
}: {
  open: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => boolean;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const submit = () => {
    if (!onLogin(username.trim(), password)) {
      setError("Username atau password salah.");
      return;
    }
    setUsername("");
    setPassword("");
    setError("");
  };

  return (
    <div className="fixed inset-y-0 left-1/2 z-[110] flex w-full max-w-[393px] -translate-x-1/2 items-end bg-black/50">
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="absolute bottom-[430px] right-6 grid size-10 place-items-center rounded-full bg-white text-2xl shadow"
      >
        ×
      </button>
      <section className="w-full rounded-t-[24px] bg-white px-4 pb-8 pt-7 shadow-2xl">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#dde3ff] text-[#3929b5]">
          <LockKeyhole size={30} />
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold">Login Admin</h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Login diperlukan untuk mengubah data.
        </p>
        <form
          className="mt-6 grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <Input
            autoFocus
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
          />
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="mt-2 h-12 rounded-full">
            Masuk
          </Button>
        </form>
      </section>
    </div>
  );
}
