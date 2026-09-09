"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Camera,
  CalendarDays,
  ChevronRight,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  UsersRound,
  WalletCards,
} from "lucide-react";
import type {
  ClubData,
  Member,
  Payment,
  Session,
  TrainingType,
} from "@/lib/types";
import {
  formatDate,
  paidFor,
  sessionDateTime,
  sessionIncome,
  shortRupiah,
} from "@/lib/calculations";
import { Checkbox, Empty, FilterPills } from "@/components/ui-kit";
import {
  Avatar,
  FloatingCalendar,
  PaymentStatus,
  TODAY,
  TypePills,
} from "@/components/features/shared";

export function LatihanView({
  data,
  filter,
  setFilter,
  onAdd,
  onDetail,
}: {
  data: ClubData;
  filter: string;
  setFilter: (value: "Semua" | TrainingType) => void;
  onAdd: () => void;
  onDetail: (id: string) => void;
}) {
  const sessions = [...data.sessions]
    .filter((s) => filter === "Semua" || s.type === filter)
    .sort((a, b) => sessionDateTime(b) - sessionDateTime(a));
  return (
    <div>
      <div className="hidden">
        <button onClick={onAdd}>Tambah jadwal</button>
      </div>
      <FilterPills value={filter} onChange={setFilter} />
      <div className="mt-2">
        {sessions.length ? (
          sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onDetail(session.id)}
              className="flex w-full items-center gap-2 border-b border-slate-100 bg-white py-4 text-left"
            >
              <span className="grid size-12 place-items-center rounded-full bg-slate-100 text-lg font-bold">
                {new Date(`${session.date}T00:00:00`).getDate()}
              </span>
              <span className="min-w-0 flex-1">
                <b className="block truncate">
                  {formatDate(session.date, { month: "long", year: "numeric" })}
                </b>
                <span className="text-xs text-slate-500">
                  {session.time} · {session.venue}
                </span>
              </span>
              <span className="text-right text-xs text-slate-400">
                {session.participantIds.length} peserta
                <span className="mt-1 block text-emerald-600">
                  +{shortRupiah(sessionIncome(data, session.id))}
                </span>
              </span>
              <ChevronRight size={17} />
            </button>
          ))
        ) : (
          <Empty
            icon={<CalendarDays />}
            title="Tidak ada jadwal"
            text="Belum ada jadwal pada filter ini."
          />
        )}
      </div>
    </div>
  );
}

export function CreateSessionScreen({
  open,
  form,
  setForm,
  members,
  error,
  onClose,
  onSave,
  onAddMember,
}: {
  open: boolean;
  form: Session;
  setForm: (s: Session) => void;
  members: Member[];
  error: string;
  onClose: () => void;
  onSave: () => void;
  onAddMember: (name: string) => void;
}) {
  const [calendarOpen, setCalendarOpen] = useState(false),
    [memberOpen, setMemberOpen] = useState(false),
    [name, setName] = useState("");
  if (!open) return null;
  const custom = !["GOR Platinum Karya Timur", "Four Sport Center"].includes(
    form.venue,
  );
  const venues = [
    ["Platinum Karya Timur", "GOR Platinum Karya Timur"],
    ["Four Sport Center", "Four Sport Center"],
    ["Lainnya", custom ? form.venue : "Lapangan lainnya"],
  ];
  const add = () => {
    if (!name.trim()) return;
    onAddMember(name.trim());
    setName("");
    setMemberOpen(false);
  };
  return (
    <div className="fixed inset-0 z-50 mx-auto min-h-dvh w-full max-w-[393px] overflow-hidden bg-white">
      <header className="flex h-[89px] items-end gap-4 border-b border-[#e7e7e7] px-4 pb-4">
        <button
          onClick={onClose}
          aria-label="Kembali"
          className="grid size-10 place-items-center rounded-full border shadow-sm"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="pb-2 text-xl font-bold">
          {form.id ? "Edit Jadwal Latihan" : "Buat Jadwal Latihan"}
        </h1>
      </header>
      <div className="h-[calc(100dvh-185px)] overflow-y-auto px-4 py-4">
        <button
          type="button"
          onClick={() => setCalendarOpen(true)}
          className="flex h-14 w-full items-center gap-2 rounded-2xl bg-[#f2f2f2] px-4 text-left text-lg text-neutral-900"
        >
          <CalendarDays size={24} />
          {form.date ? formatDate(form.date) : "Pilih tanggal"}
        </button>
        <p className="mb-2 mt-6 text-sm text-[#8b8b8b]">Pilih Hari</p>
        <TypePills
          value={form.type}
          onChange={(type) => setForm({ ...form, type })}
        />
        <p className="mb-2 mt-6 text-sm text-[#8b8b8b]">Pilih lapangan</p>
        <div className="flex flex-wrap gap-2">
          {venues.map(([label, value]) => (
            <button
              key={label}
              onClick={() => setForm({ ...form, venue: value })}
              className={`h-10 rounded-full border px-4 font-medium ${form.venue === value || (label === "Lainnya" && custom) ? "border-[#5445ff] bg-[#f0f1ff] text-[#5445d6]" : "border-[#e2e2e2]"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {custom && (
          <div className="relative mt-3">
            <Image
              src="/home-10.svg"
              alt=""
              width={24}
              height={24}
              className="absolute left-4 top-1/2 -translate-y-1/2"
            />
            <input
              autoFocus
              aria-label="Nama lapangan lainnya"
              value={form.venue === "Lapangan lainnya" ? "" : form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="Masukkan lapangan"
              className="h-14 w-full rounded-2xl border border-[#5445ff] bg-[#f2f2f2] pl-12 pr-4 text-lg outline-none"
            />
          </div>
        )}
        <div className="mt-6 overflow-hidden rounded-[20px] border">
          <div className="flex h-[68px] items-center bg-[#f2f2f2] px-4">
            <b className="flex-1">Peserta</b>
            <button
              onClick={() => setMemberOpen(true)}
              className="flex h-10 items-center gap-1 rounded-full border bg-white px-3 text-sm"
            >
              <Plus size={16} /> Tambah anggota baru
            </button>
          </div>
          {members
            .filter((m) => m.active || form.participantIds.includes(m.id))
            .map((member, index) => {
              const checked = form.participantIds.includes(member.id);
              const toggle = (next: boolean) =>
                setForm({
                  ...form,
                  participantIds: next
                    ? [...new Set([...form.participantIds, member.id])]
                    : form.participantIds.filter((id) => id !== member.id),
                });
              return (
                <div
                  key={member.id}
                  className={`flex h-[68px] items-center gap-3 px-4 ${index % 2 ? "bg-[#f9f9f9]" : "bg-white"}`}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={toggle}
                    label={`Pilih ${member.name}`}
                  />
                  <button
                    onClick={() => toggle(!checked)}
                    className="flex flex-1 items-center gap-2 text-left font-me"
                  >
                    <Avatar name={member.name} />
                    <b>{member.name}</b>
                  </button>
                </div>
              );
            })}
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
      <footer className="absolute inset-x-0 bottom-0 border-t bg-white/95 px-4 pb-8 pt-4">
        <button
          onClick={onSave}
          className="h-12 w-full rounded-full bg-gradient-to-b from-[#7d87ff] to-[#3929b5] font-bold text-white"
        >
          {form.id ? "Simpan" : "Buat"}
        </button>
      </footer>
      {calendarOpen && (
        <FloatingCalendar
          date={form.date || TODAY}
          onClose={() => setCalendarOpen(false)}
          onSelect={(date) => {
            setForm({ ...form, date });
            setCalendarOpen(false);
          }}
        />
      )}
      {memberOpen && (
        <SimpleMemberSheet
          name={name}
          setName={setName}
          onClose={() => setMemberOpen(false)}
          onSave={add}
        />
      )}
    </div>
  );
}

export function DetailSessionScreen({
  open,
  data,
  session,
  onClose,
  onEdit,
  onDelete,
  onPayment,
  onParticipants,
}: {
  open: boolean;
  data: ClubData;
  session: Session;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPayment: (sid: string, mid: string, p?: Payment) => void;
  onParticipants: () => void;
}) {
  const screenshotRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);
  const [captureMessage, setCaptureMessage] = useState("");
  if (!open) return null;
  const isPlatinum = session.venue === "GOR Platinum Karya Timur";
  const isFourSport = session.venue === "Four Sport Center";
  const venue = isPlatinum ? "Platinum Karya Timur" : session.venue;
  const courtImage = isPlatinum
    ? "/court-platinum-karya-timur.png"
    : isFourSport
      ? "/court-four-sport-center.png"
      : "/sut.png";
  const captureFullDetail = async () => {
    const element = screenshotRef.current;
    if (!element || capturing) return;
    setCapturing(true);
    try {
      const { toPng } = await import("html-to-image");
      const width = element.offsetWidth;
      const height = element.scrollHeight;
      const dataUrl = await toPng(element, {
        backgroundColor: "#ffffff",
        cacheBust: true,
        pixelRatio: 2,
        width,
        height,
        style: {
          height: `${height}px`,
          maxHeight: "none",
          maxWidth: "none",
          overflow: "visible",
          width: `${width}px`,
        },
      });
      const link = document.createElement("a");
      const safeVenue = venue.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      link.download = `latihan-${session.date}-${safeVenue}.png`;
      link.href = dataUrl;
      link.click();
      setCaptureMessage("Screenshot berhasil diunduh");
    } catch {
      setCaptureMessage("Screenshot gagal dibuat");
    } finally {
      setCapturing(false);
      window.setTimeout(() => setCaptureMessage(""), 2400);
    }
  };
  return (
    <div className="fixed inset-y-0 left-1/2 z-50 w-full max-w-[393px] -translate-x-1/2 overflow-y-auto bg-white">
      <div ref={screenshotRef} className="min-h-full w-full bg-white">
      <section className="relative h-[181px] overflow-hidden">
        <Image
          src={courtImage}
          alt={`Lapangan badminton ${venue}`}
          fill
          priority
          sizes="393px"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-[90px] bg-gradient-to-t from-white to-transparent" />
        <div className="absolute inset-x-4 top-8 flex">
          <button
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full bg-white shadow"
          >
            <ArrowLeft />
          </button>
          <div className="flex-1" />
          <button
            onClick={onEdit}
            className="flex h-10 items-center gap-2 rounded-full bg-white px-4 font-semibold shadow"
          >
            <Pencil size={20} /> Edit
          </button>
          <button
            onClick={captureFullDetail}
            disabled={capturing}
            aria-label="Unduh screenshot detail latihan"
            title="Unduh screenshot"
            className="ml-2 grid size-10 place-items-center rounded-full bg-white shadow disabled:opacity-60"
          >
            {capturing ? (
              <LoaderCircle className="animate-spin" size={20} />
            ) : (
              <Camera size={20} />
            )}
          </button>
          <button
            onClick={onDelete}
            className="ml-2 grid size-10 place-items-center rounded-full bg-white text-red-500 shadow"
          >
            <Trash2 size={20} />
          </button>
        </div>
        <div className="absolute bottom-3 left-4 flex h-10 max-w-[250px] items-center gap-2 rounded-full bg-white/70 px-4 font-semibold">
          <Image src="/home-10.svg" alt="" width={24} height={24} />
          <span className="truncate">{venue}</span>
        </div>
      </section>
      <div className="flex h-[57px] items-center gap-2 border-b px-4 font-semibold">
        <CalendarDays size={24} />
        {formatDate(session.date)}
      </div>
      <div className="flex h-[57px] items-center gap-2 border-b px-4 font-semibold">
        <Image
          src="/shuttlecock.svg"
          alt=""
          width={24}
          height={24}
          className="brightness-0"
        />
        {session.type}
      </div>
      <section className="border-b">
        <div className="flex h-[68px] items-center gap-2 px-4">
          <UsersRound />
          <b className="flex-1">Peserta</b>
          <button
            onClick={onParticipants}
            className="flex h-10 items-center gap-1 rounded-full border px-3 text-sm"
          >
            <Plus size={16} /> Tambah Peserta
          </button>
        </div>
        {session.participantIds.map((id) => {
          const member = data.members.find((m) => m.id === id);
          if (!member) return null;
          const paid = paidFor(data, session.id, id);
          const recorded = data.payments.some(
            (payment) =>
              payment.sessionId === session.id && payment.memberId === id,
          );
          return (
            <button
              key={id}
              onClick={() => onPayment(session.id, id)}
              className="flex min-h-[68px] w-full items-center gap-2 py-3 pl-11 pr-4 text-left"
            >
              <Avatar name={member.name} />
              <span className="min-w-0 flex-1">
                <b className="block truncate">{member.name}</b>
                {recorded && (
                  <span className="text-xs text-[#8b8b8b]">
                    {shortRupiah(paid)}
                  </span>
                )}
              </span>
              <PaymentStatus
                paid={paid}
                fee={session.fee}
                recorded={recorded}
              />
              <ChevronRight />
            </button>
          );
        })}
      </section>
      <div className="flex h-[65px] items-center gap-2 border-b px-4 text-xl font-bold text-[#039a12]">
        <WalletCards className="text-slate-800" />+
        {shortRupiah(sessionIncome(data, session.id))}
      </div>
      </div>
      {captureMessage && (
        <div className="fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {captureMessage}
        </div>
      )}
    </div>
  );
}

export function PaymentSheet({
  open,
  session,
  member,
  form,
  setForm,
  error,
  onClose,
  onSave,
  onDelete,
  onRemoveParticipant,
}: {
  open: boolean;
  session: Session;
  member?: Member;
  form: Payment;
  setForm: (p: Payment) => void;
  error: string;
  onClose: () => void;
  onSave: (recordPayment: boolean) => void;
  onDelete: () => void;
  onRemoveParticipant: () => void;
}) {
  type Choice = "0" | "20000" | "30000" | "40000" | "50000" | "other";
  const preset = form.id && form.amount === 0
    ? "other"
    : ([0, 20000, 30000, 40000, 50000] as const).includes(
          form.amount as 0 | 20000 | 30000 | 40000 | 50000,
        )
    ? (String(form.amount) as Choice)
    : "other";
  const [choice, setChoice] = useState<Choice>(preset);
  const [otherAmount, setOtherAmount] = useState(
    preset === "other" ? String(form.amount) : "0",
  );
  if (!open || !member) return null;
  const options: { value: Choice; label: string; amount?: number }[] = [
    { value: "0", label: "Belum Bayar", amount: 0 },
    { value: "20000", label: "Rp20.000", amount: 20000 },
    { value: "30000", label: "Rp30.000", amount: 30000 },
    { value: "40000", label: "Rp40.000", amount: 40000 },
    { value: "50000", label: "Rp50.000", amount: 50000 },
    { value: "other", label: "Lainnya" },
  ];
  const choose = (option: (typeof options)[number]) => {
    setChoice(option.value);
    if (option.amount !== undefined) {
      setForm({ ...form, amount: option.amount });
      return;
    }
    const amount = otherAmount === "" ? 0 : Number(otherAmount);
    setForm({ ...form, amount: Number.isFinite(amount) ? amount : 0 });
  };
  return (
    <div className="fixed inset-y-0 left-1/2 z-[90] flex w-full max-w-[393px] -translate-x-1/2 items-end bg-black/50">
      <button
        onClick={onClose}
        aria-label="Tutup"
        className="absolute bottom-[564px] right-7 grid size-10 place-items-center rounded-full bg-white shadow"
      >
        ×
      </button>
      <section className="relative h-[550px] w-full rounded-t-[24px] bg-white pt-[72px]">
        <div className="absolute inset-x-0 top-0 h-[72px] bg-[#f2f4ff]" />
        <div className="relative -mt-10 flex justify-center">
          <Avatar name={member.name} large />
        </div>
        <div className="mt-2 text-center">
          <h2 className="text-2xl font-bold">{member.name}</h2>
          <p className="mt-1 text-sm font-semibold">
            {session.type} • {formatDate(session.date)}
          </p>
        </div>
        <div className="mx-auto mt-7 flex max-w-[350px] flex-wrap justify-center gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => choose(option)}
              className={`h-11 rounded-full border px-4 text-sm font-semibold ${choice === option.value ? "border-[#5445ff] bg-[#f0f1ff] text-[#5445d6]" : "border-[#e2e2e2] bg-white"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {choice === "other" && (
          <div className="relative mx-6 mt-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2">Rp</span>
            <input
              autoFocus
              aria-label="Nominal lainnya"
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="0"
              value={otherAmount}
              onChange={(e) => {
                const raw = e.target.value;
                setOtherAmount(raw);
                const amount = raw === "" ? 0 : Number(raw);
                setForm({
                  ...form,
                  amount: Number.isFinite(amount) ? Math.max(0, amount) : 0,
                });
              }}
              className="h-14 w-full rounded-2xl border border-[#5445ff] bg-[#f2f2f2] pl-12 pr-4 text-lg outline-none"
            />
          </div>
        )}
        {error && <p className="mx-6 mt-2 text-sm text-red-600">{error}</p>}
        <footer className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-2 border-t px-4 pb-8 pt-4">
          <button
            onClick={onRemoveParticipant}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#ff6565] to-[#b30024] font-bold text-white"
          >
            <Trash2 size={18} /> Hapus Peserta
          </button>
          <button
            onClick={() => onSave(choice !== "0")}
            className="h-12 rounded-full bg-gradient-to-b from-[#7d87ff] to-[#3929b5] font-bold text-white"
          >
            Simpan
          </button>
          {form.id && (
            <button
              aria-label="Hapus pembayaran"
              onClick={onDelete}
              className="hidden"
            >
              <Trash2 />
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}

export function DeleteSessionSheet({
  open,
  blocked,
  onClose,
  onDelete,
}: {
  open: boolean;
  blocked: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-y-0 left-1/2 z-[90] flex w-full max-w-[393px] -translate-x-1/2 items-end bg-black/50">
      <section className="relative h-[355px] w-full rounded-t-[24px] bg-white pt-[108px]">
        <div className="absolute inset-x-0 top-0 h-[72px] bg-[#ffe8e6]" />
        <div className="absolute left-1/2 top-9 grid size-[79px] -translate-x-1/2 place-items-center rounded-full bg-[#ee2737] text-white">
          <Trash2 size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Hapus data latihan?</h2>
          <p
            className={`mt-1 text-sm font-semibold ${blocked ? "text-red-600" : ""}`}
          >
            {blocked
              ? "Latihan dengan riwayat pembayaran tidak dapat dihapus"
              : "Data latihan ini akan dihapus secara permanen"}
          </p>
        </div>
        <footer className="absolute inset-x-0 bottom-0 border-t px-4 pb-8 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="h-12 rounded-full bg-gray-300 font-bold"
            >
              Batal
            </button>
            <button
              disabled={blocked}
              onClick={onDelete}
              className="h-12 rounded-full bg-red-600 font-bold text-white disabled:opacity-40"
            >
              Hapus
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

export function DeleteParticipantSheet({
  open,
  member,
  blocked,
  onClose,
  onDelete,
}: {
  open: boolean;
  member?: Member;
  blocked: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  if (!open || !member) return null;
  return (
    <div className="fixed inset-y-0 left-1/2 z-[110] flex w-full max-w-[393px] -translate-x-1/2 items-end bg-black/50">
      <button
        onClick={onClose}
        aria-label="Tutup"
        className="absolute bottom-[369px] right-6 grid size-10 place-items-center rounded-full bg-white shadow"
      >
        <span className="text-3xl font-light">×</span>
      </button>
      <section className="relative h-[355px] w-full overflow-hidden rounded-t-[24px] bg-white pt-[108px]">
        <div className="absolute inset-x-0 top-0 h-[72px] bg-[#ffe8e6]" />
        <div className="absolute left-1/2 top-9 grid size-[79px] -translate-x-1/2 place-items-center rounded-full bg-[#ee2737] text-white">
          <Trash2 size={40} />
        </div>
        <div className="mx-auto w-[330px] text-center">
          <h2 className="text-2xl font-bold">Hapus peserta?</h2>
          <p
            className={`mx-auto mt-2 max-w-[305px] text-sm font-semibold leading-6 ${blocked ? "text-[#d51d2d]" : "text-[#202020]"}`}
          >
            {blocked
              ? `${member.name} memiliki riwayat pembayaran dan tidak dapat dihapus.`
              : `${member.name} akan dihapus dari latihan ini.`}
          </p>
        </div>
        <footer className="absolute inset-x-0 bottom-0 border-t border-[#e7e7e7] px-4 pb-8 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onClose}
              className="h-12 rounded-full bg-gradient-to-b from-[#eeeeee] to-[#aaaaaa] font-bold"
            >
              Batal
            </button>
            <button
              disabled={blocked}
              onClick={onDelete}
              className="h-12 rounded-full bg-gradient-to-b from-[#ff6565] to-[#b30024] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Hapus
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

export function ParticipantPickerScreen({
  open,
  data,
  session,
  error,
  onClose,
  onSave,
  onAddMember,
}: {
  open: boolean;
  data: ClubData;
  session: Session;
  error: string;
  onClose: () => void;
  onSave: (ids: string[]) => void;
  onAddMember: (name: string) => string;
}) {
  const [selected, setSelected] = useState(session.participantIds),
    [memberOpen, setMemberOpen] = useState(false),
    [name, setName] = useState("");
  if (!open) return null;
  const members = data.members.filter(
    (m) => m.active || selected.includes(m.id),
  );
  const toggle = (id: string, next: boolean) =>
    setSelected((ids) =>
      next ? [...new Set([...ids, id])] : ids.filter((x) => x !== id),
    );
  const add = () => {
    if (!name.trim()) return;
    const id = onAddMember(name.trim());
    setSelected((ids) => [...new Set([...ids, id])]);
    setName("");
    setMemberOpen(false);
  };
  return (
    <div className="fixed inset-y-0 left-1/2 z-[60] w-full max-w-[393px] -translate-x-1/2 bg-white">
      <header className="flex h-[89px] items-end gap-4 border-b px-4 pb-4">
        <button
          onClick={onClose}
          className="grid size-10 place-items-center rounded-full border"
        >
          <ArrowLeft />
        </button>
        <h1 className="min-w-0 flex-1 pb-2 text-xl font-bold">Pilih peserta</h1>
        <button
          onClick={() => setMemberOpen(true)}
          className="flex h-10 items-center gap-1 rounded-full border px-3 text-sm"
        >
          <Plus size={16} /> Tambah anggota
        </button>
      </header>
      <div className="h-[calc(100dvh-185px)] overflow-y-auto">
        {members.map((member, index) => {
          const checked = selected.includes(member.id);
          return (
            <div
              key={member.id}
              className={`flex h-[68px] items-center gap-2 px-4 ${index % 2 ? "bg-[#f9f9f9]" : ""}`}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(next) => toggle(member.id, next)}
                label={`Pilih ${member.name}`}
              />
              <button
                onClick={() => toggle(member.id, !checked)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <Avatar name={member.name} />
                <b>{member.name}</b>
              </button>
            </div>
          );
        })}
        {error && <p className="px-4 text-sm text-red-600">{error}</p>}
      </div>
      <footer className="absolute inset-x-0 bottom-0 border-t px-4 pb-8 pt-4">
        <button
          onClick={() => onSave(selected)}
          className="h-12 w-full rounded-full bg-gradient-to-b from-[#7d87ff] to-[#3929b5] font-bold text-white"
        >
          Simpan
        </button>
      </footer>
      {memberOpen && (
        <SimpleMemberSheet
          name={name}
          setName={setName}
          onClose={() => setMemberOpen(false)}
          onSave={add}
        />
      )}
    </div>
  );
}

function SimpleMemberSheet({
  name,
  setName,
  onClose,
  onSave,
}: {
  name: string;
  setName: (name: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-y-0 left-1/2 z-[80] flex w-full max-w-[393px] -translate-x-1/2 items-end bg-black/50">
      <div className="relative w-full rounded-t-[24px] bg-white pt-[72px]">
        <button
          onClick={onClose}
          className="absolute -top-[62px] right-6 grid size-10 place-items-center rounded-full bg-white shadow"
        >
          ×
        </button>
        <div className="relative mx-auto -mt-10 grid size-20 place-items-center rounded-full bg-[#5a5ed6]">
          <Image src="/user-round-plus.svg" alt="" width={40} height={40} />
        </div>
        <div className="px-4 pb-12 pt-8">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave()}
            placeholder="Nama anggota"
            className="h-14 w-full rounded-2xl bg-[#f2f2f2] px-4 text-lg outline-none"
          />
        </div>
        <div className="border-t px-4 pb-8 pt-4">
          <button
            disabled={!name.trim()}
            onClick={onSave}
            className="h-12 w-full rounded-full bg-gradient-to-b from-[#7d87ff] to-[#3929b5] font-bold text-white disabled:opacity-40"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
