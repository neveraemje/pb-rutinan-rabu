"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function PwaSplash() {
  const [phase, setPhase] = useState<"visible" | "leaving" | "hidden">(
    "visible",
  );

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setPhase("leaving"), 1200);
    const hideTimer = window.setTimeout(() => setPhase("hidden"), 1600);
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`pwa-splash fixed inset-0 z-[200] hidden items-center justify-center bg-[#3b66d8] text-white transition-opacity duration-400 ${phase === "leaving" ? "opacity-0" : "opacity-100"}`}
      aria-hidden="true"
    >
      <div className="flex w-[246px] flex-col items-center gap-[13px]">
        <Image
          src="/splash-shuttle.svg"
          alt=""
          width={106}
          height={118}
          priority
        />
        <p className="w-full text-center text-[24px] font-bold leading-normal tracking-[1.92px]">
          PB RUTINAN RABU
        </p>
      </div>
    </div>
  );
}
