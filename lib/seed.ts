import type { ClubData } from "./types";

export const seedData: ClubData = {
  members: [
    { id: "m1", name: "Andi Pratama", phone: "0812 3456 7810", active: true, joinedAt: "2025-11-12" },
    { id: "m2", name: "Bima Saputra", phone: "0813 5551 2098", active: true, joinedAt: "2026-01-08" },
    { id: "m3", name: "Citra Lestari", phone: "0857 1200 4421", active: true, joinedAt: "2026-02-15" },
    { id: "m4", name: "Dimas Wardana", phone: "0819 8766 1200", active: true, joinedAt: "2026-03-02" },
    { id: "m5", name: "Eka Ramadhani", phone: "0821 8870 3131", active: true, joinedAt: "2026-03-18" },
    { id: "m6", name: "Farhan Akbar", phone: "0852 4420 1129", active: false, joinedAt: "2025-10-10" },
  ],
  sessions: [
    { id: "s1", type: "Rabuan", date: "2026-07-15", time: "20:00", venue: "GOR Platinum Karya Timur", fee: 30000, participantIds: ["m1","m2","m3","m6"] },
    { id: "s2", type: "Sabtuan", date: "2026-08-22", time: "19:30", venue: "Hall Bintang Sport", fee: 35000, participantIds: ["m1","m3","m4","m5"] },
    { id: "s3", type: "Rabuan", date: "2026-09-09", time: "20:00", venue: "GOR Platinum Karya Timur", fee: 30000, participantIds: ["m1","m2","m3","m4","m5"] },
    { id: "s4", type: "Sabtuan", date: "2026-09-12", time: "19:30", venue: "Hall Bintang Sport", fee: 35000, participantIds: ["m1","m2","m4","m5"] },
    { id: "s5", type: "Rabuan", date: "2026-09-16", time: "20:00", venue: "GOR Platinum Karya Timur", fee: 30000, participantIds: ["m1","m2","m3"] },
  ],
  payments: [
    { id: "p1", sessionId: "s1", memberId: "m1", amount: 30000, method: "Transfer", date: "2026-07-15" },
    { id: "p2", sessionId: "s1", memberId: "m2", amount: 15000, method: "Tunai", date: "2026-07-15" },
    { id: "p3", sessionId: "s1", memberId: "m2", amount: 15000, method: "Transfer", date: "2026-07-18" },
    { id: "p4", sessionId: "s1", memberId: "m3", amount: 10000, method: "Tunai", date: "2026-07-15" },
    { id: "p5", sessionId: "s1", memberId: "m6", amount: 30000, method: "Tunai", date: "2026-07-15" },
    { id: "p6", sessionId: "s2", memberId: "m1", amount: 35000, method: "Transfer", date: "2026-08-22" },
    { id: "p7", sessionId: "s2", memberId: "m3", amount: 20000, method: "Tunai", date: "2026-08-22" },
    { id: "p8", sessionId: "s2", memberId: "m4", amount: 35000, method: "Transfer", date: "2026-08-23" },
  ],
  expenses: [
    { id: "e1", title: "Sewa lapangan", amount: 80000, date: "2026-07-15", category: "Lapangan", type: "Rabuan", sessionId: "s1" },
    { id: "e2", title: "Shuttlecock", amount: 45000, date: "2026-07-10", category: "Peralatan", type: "Rabuan" },
    { id: "e3", title: "Sewa lapangan", amount: 100000, date: "2026-08-22", category: "Lapangan", type: "Sabtuan", sessionId: "s2" },
    { id: "e4", title: "Air mineral", amount: 24000, date: "2026-08-22", category: "Konsumsi", type: "Sabtuan" },
    { id: "e5", title: "Shuttlecock", amount: 52000, date: "2026-09-02", category: "Peralatan", type: "Rabuan" },
  ],
};

