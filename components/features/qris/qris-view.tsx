"use client";
import Image from "next/image";

export function QrisView() {
  return (
    <section className="min-h-[calc(100dvh-88px)] bg-[#f7f7f8] px-4 pb-6 pt-6">
      <h1 className="text-xl font-bold text-[#1a1a1a]">QRIS</h1>
      <div className="mt-5 overflow-hidden rounded-[24px] bg-white shadow-[0_4px_18px_rgba(15,23,42,0.08)]">
        <Image
          src="/qris-pb-rutinan-rabu.png"
          alt="QRIS PB Rutinan Rabu"
          width={1135}
          height={1600}
          priority
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
