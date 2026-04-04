import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProfileBadge from "../components/ProfileBadge";

const API     = import.meta.env.VITE_API_URL || "https://startupswap.onrender.com/api";
const BACKEND = API.replace("/api", "");

const ROLE_GRADIENTS = {
  founder:      "from-violet-500 to-purple-600",
  "co-founder": "from-blue-500 to-cyan-600",
  investor:     "from-emerald-500 to-green-600",
  mentor:       "from-amber-500 to-orange-500",
  employee:     "from-pink-500 to-rose-600",
};

const STAGE_COLOR = {
  idea: "bg-slate-100 text-slate-600",
  mvp: "bg-blue-50 text-blue-600",
  "early-stage": "bg-amber-50 text-amber-600",
  growth: "bg-emerald-50 text-emerald-600",
  scale: "bg-violet-50 text-violet-600",
};

function DetailModal({ selected, onClose }) {
  if (!selected) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center px-4 pb-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-32 bg-gradient-to-br ${ROLE_GRADIENTS[selected.role] || "from-slate-500 to-slate-700"} flex items-center justify-center`}>
          <div className="w-20 h-20 rounded-2xl bg-white/20 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-black text-white overflow-hidden">
            {selected.avatar
              ? <img src={selected.avatar} alt={selected.name} className="w-full h-full object-cover" />
              : selected.name?.[0]?.toUpperCase()
            }
          </div>
        </div>

        <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-800">{selected.name}</h3>
            <p className="text-slate-500 text-sm capitalize">
              {selected.role}{selected.location ? ` · 📍 ${selected.location}` : ""}
              {selected.age ? ` · ${selected.age} yrs` : ""}
            </p>
          </div>

          {selected.bio && <p className="text-sm text-slate-600 text-center leading-relaxed">{selected.bio}</p>}

          {selected.expertise && (
            <div className="bg-violet-50 rounded-xl px-4 py-2 text-center">
              <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Expertise</p>
              <p className="text-sm text-violet-700 font-bold">{selected.expertise}</p>
            </div>
          )}

          {(selected.startupName || selected.startupDescription) && (
            <div className="bg-slate-50 rounded-xl px-4 py-2 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Startup</p>
              <p className="text-sm font-bold text-slate-700">{selected.startupName}</p>
              {selected.startupStage && selected.startupStage !== "none" && (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block capitalize ${STAGE_COLOR[selected.startupStage] || ""}`}>
                  {selected.startupStage} stage
                </span>
              )}
              {selected.startupDescription && (
                <p className="text-xs text-slate-500 mt-1">{selected.startupDescription}</p>
              )}
            </div>
          )}

          {selected.skills?.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-1.5">Skills</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {selected.skills.map((s) => (
                  <span key={s} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {selected.industries?.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-1.5">Industries</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {selected.industries.map((ind) => (
                  <span key={ind} className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">{ind}</span>
                ))}
              </div>
            </div>
          )}

          {selected.lookingFor?.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-1.5">Looking for</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {selected.lookingFor.map((r) => (
                  <span key={r} className="bg-pink-50 text-pink-600 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{r}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {selected.linkedin && (
              <a href={selected.linkedin} target="_blank" rel="noopener noreferrer"
                className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-blue-100 transition">
                🔗 LinkedIn
              </a>
            )}
            {selected.github && (
              <a href={selected.github} target="_blank" rel="noopener noreferrer"
                className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-slate-200 transition">
                🐙 GitHub
              </a>
            )}
            {selected.website && (
              <a href={selected.website} target="_blank" rel="noopener noreferrer"
                className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-emerald-100 transition">
                🌐 Website
              </a>
            )}
            {selected.resumeUrl && (
              <a href={`${BACKEND}${selected.resumeUrl}`} target="_blank" rel="noopener noreferrer"
                className="bg-violet-50 text-violet-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-violet-100 transition">
                📄 Resume
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-100 text-slate-600 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition text-sm"
          >Close</button>
        </div>
      </div>
    </div>
  );
}

export default function Matches({ starred = [] }) {
  const [matches,  setMatches]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [tab,      setTab]      = useState("matches"); // "matches" | "starred"

  useEffect(() => {
    axios.get(`${API}/users/matches`)
      .then(({ data }) => setMatches(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const list = tab === "matches" ? matches : starred;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-14 pb-24 px-4 max-w-md mx-auto">

        <div className="pt-4 pb-3">
          <h2 className="text-xl font-black text-slate-800">Connections 💜</h2>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-2xl bg-slate-100 p-1 gap-1 mb-4">
          <button
            onClick={() => setTab("matches")}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${
              tab === "matches" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
            }`}
          >
            💜 Matches <span className="ml-1 text-xs font-normal text-slate-400">({matches.length})</span>
          </button>
          <button
            onClick={() => setTab("starred")}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition ${
              tab === "starred" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
            }`}
          >
            ⭐ Starred <span className="ml-1 text-xs font-normal text-slate-400">({starred.length})</span>
          </button>
        </div>

        {loading && tab === "matches" ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <span className="text-7xl block">{tab === "matches" ? "💜" : "⭐"}</span>
            <h3 className="text-xl font-black text-slate-700">
              {tab === "matches" ? "No matches yet!" : "No starred profiles yet!"}
            </h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              {tab === "matches"
                ? "Keep swiping to find your co-founder, investor, or mentor."
                : "Tap ⭐ on a card while swiping to save profiles here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 animate-fadeIn">
            {list.map((m) => (
              <ProfileBadge key={m._id} user={m} onClick={() => setSelected(m)} />
            ))}
          </div>
        )}
      </main>

      <DetailModal selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
