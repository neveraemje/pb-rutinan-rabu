export type TrainingType = "Rabuan" | "Sabtuan";
export type PaymentMethod = "Tunai" | "Transfer";

export interface Member { id: string; name: string; phone: string; active: boolean; joinedAt: string }
export interface Session { id: string; type: TrainingType; date: string; time: string; venue: string; fee: number; participantIds: string[] }
export interface Payment { id: string; sessionId: string; memberId: string; amount: number; method: PaymentMethod; date: string }
export interface Expense { id: string; title: string; amount: number; date: string; category: string; type: TrainingType; sessionId?: string }
export interface ClubData { members: Member[]; sessions: Session[]; payments: Payment[]; expenses: Expense[] }

