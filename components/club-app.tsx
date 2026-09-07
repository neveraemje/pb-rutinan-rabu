"use client";
import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import type {
  Expense,
  Member,
  Payment,
  Session,
  TrainingType,
} from "@/lib/types";
import { cloneSeed, loadData, resetData, saveData } from "@/lib/storage";
import { loadClubData, saveClubData } from "@/lib/database";
import { sessionHasPayments } from "@/lib/calculations";
import { Button, Sheet } from "@/components/ui-kit";
import {
  AppBottomNav,
  AppHeader,
  type AppTab,
  TODAY,
  uid,
} from "@/components/features/shared";
import { HomeView } from "@/components/features/home/home-view";
import {
  PengeluaranView,
  ExpenseDetailSheet,
  ExpenseFormSheet,
} from "@/components/features/pengeluaran/pengeluaran-view";
import {
  AnggotaView,
  DeleteMemberSheet,
  MemberFormSheet,
} from "@/components/features/anggota/anggota-view";
import {
  CreateSessionScreen,
  DeleteParticipantSheet,
  DeleteSessionSheet,
  DetailSessionScreen,
  LatihanView,
  ParticipantPickerScreen,
  PaymentSheet,
} from "@/components/features/latihan/latihan-view";
import { QrisView } from "@/components/features/qris/qris-view";

type SheetName =
  | "session"
  | "member"
  | "deleteMember"
  | "expense"
  | "expenseDetail"
  | "payment"
  | "sessionDetail"
  | "deleteSession"
  | "participants"
  | "deleteParticipant"
  | "reset"
  | null;
const blankSession = (): Session => ({
  id: "",
  type: "Rabuan",
  date: "2026-09-09",
  time: "20:00",
  venue: "GOR Platinum Karya Timur",
  fee: 30000,
  participantIds: [],
});
const blankExpense = (): Expense => ({
  id: "",
  title: "",
  amount: 0,
  date: TODAY,
  category: "Lapangan",
  type: "Rabuan",
});
const blankMember = (): Member => ({
  id: "",
  name: "",
  phone: "",
  active: true,
  joinedAt: TODAY,
});
const blankPayment = (): Payment => ({
  id: "",
  sessionId: "",
  memberId: "",
  amount: 0,
  method: "Transfer",
  date: TODAY,
});

export default function ClubApp() {
  const [data, setData] = useState(cloneSeed),
    [ready, setReady] = useState(false),
    [tab, setTabState] = useState<AppTab>("Beranda"),
    [sheet, setSheetState] = useState<SheetName>(null),
    [filter, setFilter] = useState<"Semua" | TrainingType>("Semua");
  const transition = (update: () => void) => {
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      update();
      return;
    }
    (
      document as Document & {
        startViewTransition: (callback: () => void) => void;
      }
    ).startViewTransition(update);
  };
  const setTab = (next: AppTab) => transition(() => setTabState(next));
  const setSheet = (next: SheetName) => transition(() => setSheetState(next));
  const [sessionForm, setSessionForm] = useState(blankSession),
    [memberForm, setMemberForm] = useState(blankMember),
    [expenseForm, setExpenseForm] = useState(blankExpense),
    [paymentForm, setPaymentForm] = useState(blankPayment);
  const [selectedSession, setSelectedSession] = useState<string | null>(null),
    [selectedMember, setSelectedMember] = useState<string | null>(null),
    [selectedExpense, setSelectedExpense] = useState<string | null>(null),
    [error, setError] = useState(""),
    [toast, setToast] = useState("");
  const navigationRef = useRef({
    tab,
    sheet,
    editingSession: Boolean(sessionForm.id),
    editingExpense: Boolean(expenseForm.id),
  });
  useEffect(() => {
    navigationRef.current = {
      tab,
      sheet,
      editingSession: Boolean(sessionForm.id),
      editingExpense: Boolean(expenseForm.id),
    };
  }, [tab, sheet, sessionForm.id, expenseForm.id]);
  useEffect(() => {
    const rootState = { ...(history.state ?? {}), pbRutinanRoot: true };
    history.replaceState(rootState, "");
    history.pushState({ ...rootState, pbRutinanGuard: true }, "");

    const handlePhoneBack = () => {
      const current = navigationRef.current;
      let handled = true;

      switch (current.sheet) {
        case "session":
          setSheetState(current.editingSession ? "sessionDetail" : null);
          break;
        case "expense":
          setSheetState(current.editingExpense ? "expenseDetail" : null);
          break;
        case "payment":
        case "deleteSession":
        case "participants":
          setSheetState("sessionDetail");
          break;
        case "deleteParticipant":
          setSheetState("payment");
          break;
        case "member":
        case "deleteMember":
        case "expenseDetail":
        case "sessionDetail":
        case "reset":
          setSheetState(null);
          break;
        default:
          if (current.tab !== "Beranda") {
            setTabState("Beranda");
            setFilter("Semua");
          } else {
            handled = false;
          }
      }

      if (handled) {
        history.pushState({ ...rootState, pbRutinanGuard: true }, "");
      } else {
        history.back();
      }
    };

    addEventListener("popstate", handlePhoneBack);
    return () => removeEventListener("popstate", handlePhoneBack);
  }, []);
  useEffect(() => {
    let active = true;
    void loadClubData()
      .then((remote) => {
        if (active) setData(remote ?? loadData());
      })
      .catch(() => {
        if (active) {
          setData(loadData());
          setToast("Database tidak tersedia, memakai data lokal");
        }
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    saveData(data);
    void saveClubData(data).catch(() =>
      setToast("Gagal menyimpan ke database"),
    );
  }, [data, ready]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);
  const activeSession = data.sessions.find((x) => x.id === selectedSession),
    activeMember = data.members.find((x) => x.id === selectedMember),
    activeExpense = data.expenses.find((x) => x.id === selectedExpense);
  const notify = (message: string) => {
    setToast(message);
    setError("");
    setSheet(null);
  };
  const openSession = (session?: Session) => {
    const fresh = blankSession();
    fresh.participantIds = data.members
      .filter((m) => m.active)
      .slice(0, 4)
      .map((m) => m.id);
    setSessionForm(
      session
        ? { ...session, participantIds: [...session.participantIds] }
        : fresh,
    );
    setError("");
    setSheet("session");
  };
  const addMemberToSession = (name: string) => {
    const member: Member = {
      id: uid("m"),
      name: name.trim(),
      phone: "-",
      active: true,
      joinedAt: TODAY,
    };
    setData((d) => ({ ...d, members: [...d.members, member] }));
    setSessionForm((s) => ({
      ...s,
      participantIds: [...new Set([...s.participantIds, member.id])],
    }));
    setToast("Anggota baru ditambahkan");
  };
  const addMember = (name: string) => {
    const member: Member = {
      id: uid("m"),
      name: name.trim(),
      phone: "-",
      active: true,
      joinedAt: TODAY,
    };
    setData((d) => ({ ...d, members: [...d.members, member] }));
    setToast("Anggota baru ditambahkan");
    return member.id;
  };
  const openMember = (member?: Member) => {
      setMemberForm(member ? { ...member } : blankMember());
      setError("");
      setSheet("member");
    },
    openExpense = (expense?: Expense) => {
      setExpenseForm(expense ? { ...expense } : blankExpense());
      setError("");
      setSheet("expense");
    };
  const saveSession = () => {
    if (
      !sessionForm.date ||
      !sessionForm.time ||
      !sessionForm.venue.trim() ||
      sessionForm.fee <= 0
    )
      return setError("Lengkapi tanggal, waktu, tempat, dan biaya yang valid.");
    const ids = [...new Set(sessionForm.participantIds)],
      id = sessionForm.id || uid("s"),
      saved = { ...sessionForm, id, participantIds: ids };
    if (sessionForm.id) {
      const selectedIds = new Set(ids);
      setData((d) => ({
        ...d,
        sessions: d.sessions.map((x) => (x.id === id ? saved : x)),
        payments: d.payments.filter(
          (payment) =>
            payment.sessionId !== id || selectedIds.has(payment.memberId),
        ),
      }));
    } else setData((d) => ({ ...d, sessions: [...d.sessions, saved] }));
    setSelectedSession(id);
    setError("");
    setToast("Jadwal berhasil disimpan");
    setSheet("sessionDetail");
  };
  const removeSession = () => {
    if (!activeSession || sessionHasPayments(data, activeSession.id)) return;
    setData((d) => ({
      ...d,
      sessions: d.sessions.filter((x) => x.id !== activeSession.id),
      expenses: d.expenses.map((x) =>
        x.sessionId === activeSession.id ? { ...x, sessionId: undefined } : x,
      ),
    }));
    setSelectedSession(null);
    notify("Jadwal dihapus");
  };
  const saveMemberForm = () => {
    if (!memberForm.name.trim()) return setError("Nama anggota wajib diisi.");
    const editing = !!memberForm.id,
      saved = {
        ...memberForm,
        name: memberForm.name.trim(),
        phone: memberForm.phone || "-",
        joinedAt: memberForm.joinedAt || TODAY,
      };
    setData((d) => ({
      ...d,
      members: editing
        ? d.members.map((x) => (x.id === saved.id ? saved : x))
        : [...d.members, { ...saved, id: uid("m") }],
    }));
    notify(
      editing ? "Anggota berhasil diubah" : "Anggota baru berhasil ditambahkan",
    );
  };
  const removeMember = () => {
    if (!activeMember) return;
    setData((d) => ({
      ...d,
      members: d.members.map((x) =>
        x.id === activeMember.id ? { ...x, active: false } : x,
      ),
    }));
    setSelectedMember(null);
    notify("Anggota berhasil dihapus dari daftar aktif");
  };
  const saveExpenseForm = () => {
    if (
      !expenseForm.title.trim() ||
      expenseForm.amount <= 0 ||
      !expenseForm.date
    )
      return setError("Judul, tanggal, dan nominal valid wajib diisi.");
    setData((d) => ({
      ...d,
      expenses: expenseForm.id
        ? d.expenses.map((x) => (x.id === expenseForm.id ? expenseForm : x))
        : [...d.expenses, { ...expenseForm, id: uid("e") }],
    }));
    setError("");
    setToast("Pengeluaran berhasil disimpan");
    setSheet(expenseForm.id ? "expenseDetail" : null);
  };
  const removeExpense = () => {
    if (!activeExpense || !confirm("Hapus pengeluaran ini?")) return;
    setData((d) => ({
      ...d,
      expenses: d.expenses.filter((x) => x.id !== activeExpense.id),
    }));
    notify("Pengeluaran dihapus");
  };
  const openPayment = (
    sessionId: string,
    memberId: string,
    payment?: Payment,
  ) => {
    const savedPayment =
      payment ??
      data.payments
        .filter(
          (item) =>
            item.sessionId === sessionId && item.memberId === memberId,
        )
        .at(-1);
    setPaymentForm(
      savedPayment
        ? { ...savedPayment }
        : { ...blankPayment(), sessionId, memberId },
    );
    setError("");
    setSheet("payment");
  };
  const savePaymentForm = () => {
    if (
      !activeSession ||
      !Number.isFinite(paymentForm.amount) ||
      paymentForm.amount < 0 ||
      !paymentForm.date
    )
      return setError("Tanggal dan nominal pembayaran wajib valid.");
    setData((d) => {
      const otherPayments = d.payments.filter(
        (item) =>
          item.sessionId !== paymentForm.sessionId ||
          item.memberId !== paymentForm.memberId,
      );
      return {
        ...d,
        payments:
          paymentForm.amount === 0
            ? otherPayments
            : [
                ...otherPayments,
                { ...paymentForm, id: paymentForm.id || uid("p") },
              ],
      };
    });
    setError("");
    setToast("Pembayaran berhasil disimpan");
    setSheet("sessionDetail");
  };
  const removePayment = () => {
    if (!paymentForm.id || !confirm("Hapus catatan pembayaran ini?")) return;
    setData((d) => ({
      ...d,
      payments: d.payments.filter((x) => x.id !== paymentForm.id),
    }));
    setToast("Pembayaran dihapus");
    setSheet("sessionDetail");
  };
  const removeParticipant = () => {
    if (!activeSession || !paymentForm.memberId) return;
    setData((current) => ({
      ...current,
      sessions: current.sessions.map((session) =>
        session.id === activeSession.id
          ? { ...session, participantIds: session.participantIds.filter((id) => id !== paymentForm.memberId) }
          : session,
      ),
      payments: current.payments.filter(
        (payment) =>
          payment.sessionId !== activeSession.id ||
          payment.memberId !== paymentForm.memberId,
      ),
    }));
    setToast("Peserta berhasil dihapus");
    setSheet("sessionDetail");
  };
  const saveParticipants = (ids: string[]) => {
    if (!activeSession) return;
    const selectedIds = new Set(ids);
    setData((d) => ({
      ...d,
      sessions: d.sessions.map((x) =>
        x.id === activeSession.id
          ? { ...x, participantIds: [...new Set(ids)] }
          : x,
      ),
      payments: d.payments.filter(
        (payment) =>
          payment.sessionId !== activeSession.id ||
          selectedIds.has(payment.memberId),
      ),
    }));
    setToast("Peserta berhasil disimpan");
    setSheet("sessionDetail");
  };
  const hasHeader = tab === "Beranda" || tab === "Jadwal";
  return (
    <main className="app-shell relative mx-auto min-h-dvh w-full max-w-[393px] overflow-x-hidden bg-[#f7f7fb] pb-24 text-slate-900 shadow-[0_0_40px_rgb(15_23_42/0.08)]">
      {hasHeader && <AppHeader data={data} />}
      <div
        className={`relative z-10 min-h-[65dvh] bg-white pb-4 ${hasHeader ? "-mt-18 rounded-t-[28px] px-4 pt-3" : "px-0 pt-0"}`}
      >
        <div key={tab} className="app-page-enter">
        {tab === "Beranda" && (
          <HomeView
            data={data}
            filter={filter}
            setFilter={setFilter}
            onSession={(id) => {
              setSelectedSession(id);
              setSheet("sessionDetail");
            }}
          />
        )}
        {tab === "Jadwal" && (
          <LatihanView
            data={data}
            filter={filter}
            setFilter={setFilter}
            onAdd={() => openSession()}
            onDetail={(id) => {
              setSelectedSession(id);
              setSheet("sessionDetail");
            }}
          />
        )}
        {tab === "Keuangan" && (
          <PengeluaranView
            data={data}
            filter={filter}
            setFilter={setFilter}
            onExpense={(id) => {
              setSelectedExpense(id);
              setSheet("expenseDetail");
            }}
            onAdd={() => openExpense()}
            onReset={() => setSheet("reset")}
          />
        )}{" "}
        {tab === "QRIS" && <QrisView />}
        {tab === "Anggota" && (
          <AnggotaView
            data={data}
            onBack={() => setTab("Beranda")}
            onAdd={() => openMember()}
            onEdit={openMember}
            onDelete={(id) => {
              setSelectedMember(id);
              setSheet("deleteMember");
            }}
          />
        )}
        </div>
      </div>
      <AppBottomNav
        tab={tab}
        setTab={(next) => {
          setTab(next);
          setFilter("Semua");
        }}
        onCreate={() => openSession()}
      />
      {toast && (
        <div className="app-toast fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
      <CreateSessionScreen
        open={sheet === "session"}
        form={sessionForm}
        setForm={setSessionForm}
        members={data.members}
        error={error}
        onClose={() => setSheet(sessionForm.id ? "sessionDetail" : null)}
        onSave={saveSession}
        onAddMember={addMemberToSession}
      />
      <MemberFormSheet
        open={sheet === "member"}
        form={memberForm}
        setForm={setMemberForm}
        error={error}
        onClose={() => setSheet(null)}
        onSave={saveMemberForm}
      />
      <ExpenseFormSheet
        open={sheet === "expense"}
        form={expenseForm}
        setForm={setExpenseForm}
        error={error}
        onClose={() => setSheet(expenseForm.id ? "expenseDetail" : null)}
        onSave={saveExpenseForm}
      />
      {activeExpense && (
        <ExpenseDetailSheet
          open={sheet === "expenseDetail"}
          expense={activeExpense}
          onClose={() => setSheet(null)}
          onEdit={() => openExpense(activeExpense)}
          onDelete={removeExpense}
        />
      )}{" "}
      {activeSession && (
        <PaymentSheet
          key={`${paymentForm.id}-${paymentForm.memberId}-${sheet}`}
          open={sheet === "payment"}
          session={activeSession}
          member={data.members.find((m) => m.id === paymentForm.memberId)}
          form={paymentForm}
          setForm={setPaymentForm}
          error={error}
          onClose={() => setSheet("sessionDetail")}
          onSave={savePaymentForm}
          onDelete={removePayment}
          onRemoveParticipant={() => setSheet("deleteParticipant")}
        />
      )}{" "}
      {activeSession && (
        <DeleteParticipantSheet
          open={sheet === "deleteParticipant"}
          member={data.members.find((m) => m.id === paymentForm.memberId)}
          blocked={false}
          onClose={() => setSheet("payment")}
          onDelete={removeParticipant}
        />
      )}{" "}
      {activeSession && (
        <DetailSessionScreen
          open={sheet === "sessionDetail" || sheet === "deleteSession"}
          data={data}
          session={activeSession}
          onClose={() => setSheet(null)}
          onEdit={() => openSession(activeSession)}
          onDelete={() => setSheet("deleteSession")}
          onPayment={openPayment}
          onParticipants={() => {
            setError("");
            setSheet("participants");
          }}
        />
      )}{" "}
      {activeSession && (
        <DeleteSessionSheet
          open={sheet === "deleteSession"}
          blocked={sessionHasPayments(data, activeSession.id)}
          onClose={() => setSheet("sessionDetail")}
          onDelete={removeSession}
        />
      )}{" "}
      {activeSession && (
        <ParticipantPickerScreen
          key={`${activeSession.id}-${sheet}`}
          open={sheet === "participants"}
          data={data}
          session={activeSession}
          error={error}
          onClose={() => setSheet("sessionDetail")}
          onSave={saveParticipants}
          onAddMember={addMember}
        />
      )}{" "}
      {activeMember && (
        <DeleteMemberSheet
          open={sheet === "deleteMember"}
          member={activeMember}
          onClose={() => setSheet(null)}
          onDelete={removeMember}
        />
      )}
      <Sheet
        title="Reset Data Demo"
        open={sheet === "reset"}
        onClose={() => setSheet(null)}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-amber-50 text-amber-600">
            <RotateCcw />
          </div>
          <p className="font-semibold">
            Kembalikan semua data ke kondisi awal?
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Semua perubahan lokal akan diganti.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setSheet(null)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                setData(resetData());
                notify("Data demo berhasil direset");
              }}
            >
              Ya, reset
            </Button>
          </div>
        </div>
      </Sheet>
    </main>
  );
}
