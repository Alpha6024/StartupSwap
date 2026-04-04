import { useState } from "react";
import Navbar from "../components/Navbar";
import SwipeStack from "../components/SwipeStack";
import { useAuth } from "../context/AuthContext";

const FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "founder", label: "🚀 Founders" },
  { value: "co-founder", label: "🤝 Co-founders" },
  { value: "investor", label: "💰 Investors" },
  { value: "mentor", label: "🧠 Mentors" },
  { value: "employee", label: "💼 Employees" },
];

export default function Swipe() {
  const { user } = useAuth();
  const [filterKey, setFilterKey] = useState(0); // increment to reset SwipeStack

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-16 pb-20 px-4 max-w-md mx-auto">
        {/* Greeting */}
        <div className="pt-4 pb-3">
          <h2 className="text-lg font-black text-slate-800">
            Discover People 🔥
          </h2>
          <p className="text-slate-500 text-sm">
            Swipe right to connect, left to pass
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-slate-200 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-600 transition whitespace-nowrap"
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Swipe stack */}
        <SwipeStack key={filterKey} />

        {/* Instruction hint */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-500">✕</span>
            Pass
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">⭐</span>
            Super Like
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-500">♥</span>
            Connect
          </span>
        </div>
      </main>
    </div>
  );
}