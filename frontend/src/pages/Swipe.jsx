import { useState } from "react";
import Navbar from "../components/Navbar";
import SwipeStack from "../components/SwipeStack";

const FILTERS = [
  { value: "",           label: "✨ All"         },
  { value: "founder",    label: "🚀 Founders"    },
  { value: "co-founder", label: "🤝 Co-founders" },
  { value: "investor",   label: "💰 Investors"   },
  { value: "mentor",     label: "🧠 Mentors"     },
  { value: "employee",   label: "💼 Employees"   },
];

export default function Swipe({ onStarred }) {
  const [activeFilter, setActiveFilter] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-14 pb-20 px-4 max-w-md mx-auto">
        <div className="pt-4 pb-2">
          <h2 className="text-xl font-black text-slate-800">Discover People 🔥</h2>
          <p className="text-slate-500 text-sm">Swipe right to connect · left to pass · ⭐ to star</p>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition whitespace-nowrap shadow-sm ${
                activeFilter === f.value
                  ? "bg-violet-600 text-white border-violet-600"
                  : "border-slate-200 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <SwipeStack roleFilter={activeFilter} onStarred={onStarred} />

        <div className="flex items-center justify-center gap-8 mt-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-400 font-bold text-sm">✕</span>
            Pass
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-full bg-yellow-50 border border-yellow-100 flex items-center justify-center text-sm">⭐</span>
            Star
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-400 font-bold text-sm">♥</span>
            Connect
          </span>
        </div>
      </main>
    </div>
  );
}
