import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Truck, Users, Calendar, Activity } from "lucide-react";

// State / Stats page
// - Mock data for depanneurs, assurés and depannage events
// - Calculates: number of depanneurs, depannages (weekly/par mois),
//   growth of assurés this year, percentage of assurés that needed depannage,
//   busiest month
// - Uses Tailwind + primary color #FFC120

type Depanneur = {
  id: number;
  nom: string;
  actif: boolean;
};

type Assure = {
  id: number;
  nom: string;
  joinedAt: string; // ISO date
};

type DepannageEvent = {
  id: number;
  assureId: number;
  depanneurId: number;
  date: string; // ISO date
};

const PRIMARY = "#FFC120";

// helper to format month name
const monthName = (isoMonth: string) => {
  const d = new Date(isoMonth + "-01T00:00:00");
  return d.toLocaleString("default", { month: "short" });
};

export default function StatePage() {
  // --- Mock data (replace with real data from your API) ---
  const depanneurs: Depanneur[] = [
    { id: 1, nom: "Benali Karim", actif: true },
    { id: 2, nom: "Maamar Rachid", actif: false },
    { id: 3, nom: "Touati Sofiane", actif: true },
    { id: 4, nom: "Ziani Amine", actif: true },
    { id: 5, nom: "Khelifi Nora", actif: true },
    { id: 6, nom: "Djerad Samir", actif: false },
  ];

  // current year months (12 months)
  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const mm = String(m).padStart(2, "0");
    return `${currentYear}-${mm}`;
  });

  // mock: new assurés each month
  const newAssuresPerMonth = [12, 18, 15, 10, 22, 30, 25, 20, 28, 18, 14, 16];

  // mock: depannages per month (counts)
  const depannagesPerMonth = [5, 8, 6, 10, 12, 20, 22, 18, 14, 9, 7, 11];

  // build events (one event per count, random assureId)
  const allAssures: Assure[] = [];
  let nextAssureId = 1;
  months.forEach((month, idx) => {
    const added = newAssuresPerMonth[idx];
    for (let j = 0; j < added; j++) {
      // distribute join dates across the month
      const day = Math.min(28, Math.floor(Math.random() * 25) + 1);
      allAssures.push({
        id: nextAssureId++,
        nom: `Assuré ${nextAssureId}`,
        joinedAt: `${month}-${String(day).padStart(2, "0")}`,
      });
    }
  });

  // create depannage events referencing random assurés
  const events: DepannageEvent[] = [];
  let eventId = 1;
  months.forEach((month, idx) => {
    const count = depannagesPerMonth[idx];
    for (let k = 0; k < count; k++) {
      // pick random assure and depanneur
      const assure = allAssures[Math.floor(Math.random() * allAssures.length)];
      const depanneur = depanneurs[Math.floor(Math.random() * depanneurs.length)];
      const day = Math.min(28, Math.floor(Math.random() * 25) + 1);
      events.push({
        id: eventId++,
        assureId: assure.id,
        depanneurId: depanneur.id,
        date: `${month}-${String(day).padStart(2, "0")}`,
      });
    }
  });

  // --- Stats calculations ---
  const totalDepanneurs = depanneurs.length;

  // weekly / par mois depannage counts (simple approximation)
  // weekly: sum of last 30 days divided by 4 ~ rough weekly; we'll compute last 7 days from events
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const eventsLast7Days = events.filter((ev) => new Date(ev.date) >= sevenDaysAgo);
  const depannagesWeekly = eventsLast7Days.length;

  // par mois: events in current month
  const currentMonthStr = `${currentYear}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const depannagesThisMonth = events.filter((ev) => ev.date.startsWith(currentMonthStr)).length;

  // total assurés added this year
  const totalAssuresThisYear = newAssuresPerMonth.reduce((s, n) => s + n, 0);

  // unique assurés who needed depannage this year
  const uniqueAssuresWithEvents = new Set(events.map((e) => e.assureId));
  const uniqueCount = uniqueAssuresWithEvents.size;

  // percentage of assurés who needed depannage (unique / totalAssuresThisYear)
  const percentAssuresNeedingDepannage = totalAssuresThisYear
    ? Math.round((uniqueCount / totalAssuresThisYear) * 100 * 10) / 10
    : 0;

  // busiest month (by depannagesPerMonth)
  const busiestMonthIndex = depannagesPerMonth.reduce((bestIdx, val, idx, arr) => (val > arr[bestIdx] ? idx : bestIdx), 0);
  const busiestMonth = { month: months[busiestMonthIndex], count: depannagesPerMonth[busiestMonthIndex] };

  // prepare chart data
  const chartData = months.map((m, i) => ({
    month: monthName(m),
    depannages: depannagesPerMonth[i],
    newAssures: newAssuresPerMonth[i],
  }));

  // UI state: toggle weekly vs monthly chart
  const [mode, setMode] = useState<"par mois" | "par semaine">("par mois");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold-text">Statistiques</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode("par semaine")}
            className={`px-3 py-1 rounded-md border ${mode === "par semaine" ? "bg-[#FFC120] text-white" : "bg-white"}`}
          >
            par semaine
          </button>
          <button
            onClick={() => setMode("par mois")}
            className={`px-3 py-1 rounded-md border ${mode === "par mois" ? "bg-[#FFC120] text-white" : "bg-white"}`}
          >
            par mois
          </button>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-[#FFF4DF]">
            <Truck size={28} className="text-[#FFC120]" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Total dépanneurs</div>
            <div className="text-2xl font-bold">{totalDepanneurs}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-[#FFF4DF]">
            <Activity size={28} className="text-[#FFC120]" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Dépannages (par semaine)</div>
            <div className="text-2xl font-bold">{depannagesWeekly}</div>
            <div className="text-xs text-gray-400">last 7 days</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-[#FFF4DF]">
            <Users size={28} className="text-[#FFC120]" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Assurés ajoutés (cette année)</div>
            <div className="text-2xl font-bold">{totalAssuresThisYear}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-[#FFF4DF]">
            <Calendar size={28} className="text-[#FFC120]" />
          </div>
          <div>
            <div className="text-sm text-gray-500">% assurés ayant besoin dépannage</div>
            <div className="text-2xl font-bold">{percentAssuresNeedingDepannage}%</div>
            <div className="text-xs text-gray-400">assurés ajoutés cette année</div>
          </div>
        </div>
      </div>

      {/* Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Dépannages par mois</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="depannages" fill={PRIMARY} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-sm text-gray-600">Busiest month: <span className="font-semibold">{monthName(busiestMonth.month)} ({busiestMonth.count})</span></div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-3">Nouveaux assurés par mois</h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="newAssures" stroke={PRIMARY} strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-sm text-gray-600">Total de cette année: <span className="font-semibold">{totalAssuresThisYear}</span></div>
        </div>
      </div>

      {/* small summary */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
        <h4 className="font-semibold mb-2">Quick insights</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Total dépanneurs: <strong>{totalDepanneurs}</strong></li>
          <li>• Dépannages de ce mois: <strong>{depannagesThisMonth}</strong></li>
          <li>• L'augmentation d'assurés cette année: <strong>{totalAssuresThisYear}</strong></li>
          <li>• Pourcentage d'assurés ayant eu besoin d'un dépannage: <strong>{percentAssuresNeedingDepannage}%</strong></li>
          <li>• Le mois le plus chargé: <strong>{monthName(busiestMonth.month)}</strong></li>
        </ul>
      </div>
    </div>
  );
}
