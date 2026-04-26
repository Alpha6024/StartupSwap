import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProfileBadge from "../components/ProfileBadge";
import MatchModal from "../components/MatchModal";
import { useAuth } from "../context/AuthContext";

const API     = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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
            </p>
          </div>

          {selected.bio && <p className="text-sm text-slate-600 text-center leading-relaxed">{selected.bio}</p>}

          {selected.expertise && (
            <div className="bg-violet-50 rounded-xl px-4 py-2 text-center">
              <p className="text-[10px] text-violet-400 font-bold uppercase tracking-widest">Expertise</p>
              <p className="text-sm text-violet-700 font-bold">{selected.expertise}</p>
            </div>
          )}

          {selected.startupName && (
            <div className="bg-slate-50 rounded-xl px-4 py-2 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Startup</p>
              <p className="text-sm font-bold text-slate-700">{selected.startupName}</p>
              {selected.startupStage && selected.startupStage !== "none" && (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block capitalize ${STAGE_COLOR[selected.startupStage] || ""}`}>
                  {selected.startupStage} stage
                </span>
              )}
            </div>
          )}

          {selected.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center">
              {selected.skills.map((s) => (
                <span key={s} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">{s}</span>
              ))}
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
            {selected.resumeUrl && (
              <a href={`${BACKEND}${selected.resumeUrl}`} target="_blank" rel="noopener noreferrer"
                className="bg-violet-50 text-violet-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-violet-100 transition">
                📄 Resume
              </a>
            )}
          </div>

          <button onClick={onClose}
            className="w-full bg-slate-100 text-slate-600 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Request card with Accept / Decline ───────────────────
function RequestCard({ user, onAccept, onDecline, accepting }) {
  const cfg = ROLE_GRADIENTS[user?.role] || "from-slate-500 to-slate-700";
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className={`h-16 bg-gradient-to-br ${cfg} flex items-center px-4 gap-3`}>
        <div className="w-10 h-10 rounded-xl bg-white/25 border-2 border-white flex items-center justify-center text-lg font-black text-white flex-shrink-0">
          {user.avatar
            ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
            : user.name?.[0]?.toUpperCase()
          }
        </div>
        <div className="min-w-0">
          <p className="font-black text-white text-sm truncate">{user.name}</p>
          <p className="text-white/70 text-xs capitalize">{user.role}</p>
        </div>
      </div>

      <div className="px-3 py-2 space-y-1.5">
        {user.expertise && (
          <p className="text-xs text-violet-600 font-semibold truncate">✦ {user.expertise}</p>
        )}
        {user.bio && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{user.bio}</p>
        )}
        {user.startupName && (
          <p className="text-xs text-slate-400 truncate">🏢 {user.startupName}</p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onDecline(user._id)}
            className="flex-1 border-2 border-red-200 text-red-500 text-xs font-bold py-2 rounded-xl hover:bg-red-50 transition active:scale-95"
          >
            ✕ Decline
          </button>
          <button
            onClick={() => onAccept(user._id)}
            disabled={accepting === user._id}
            className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-bold py-2 rounded-xl hover:opacity-90 transition active:scale-95 disabled:opacity-60 flex items-center justify-center gap-1"
          >
            {accepting === user._id
              ? <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : "♥ Accept"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Matches({ starred = [] }) {
  const { refreshUser } = useAuth();

  const [matches,   setMatches]   = useState([]);
  const [requests,  setRequests]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(null);
  const [tab,       setTab]       = useState("matches");
  const [accepting, setAccepting] = useState(null);
  const [newMatch,  setNewMatch]  = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/users/matches`),
      axios.get(`${API}/swipe/requests`),
    ])
      .then(([matchRes, reqRes]) => {
        setMatches(matchRes.data);
        setRequests(reqRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (requesterId) => {
    setAccepting(requesterId);
    try {
      const { data } = await axios.post(`${API}/swipe/accept/${requesterId}`);
      // Remove from requests, add to matches
      setRequests((prev) => prev.filter((r) => r._id !== requesterId));
      setMatches((prev) => {
        const already = prev.find((m) => m._id === requesterId);
        if (already) return prev;
        return [...prev, data.matchedUser];
      });
      setNewMatch(data.matchedUser);
      // Refresh user so Profile stats (Liked count) update
      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setAccepting(null);
    }
  };

  const handleDecline = async (requesterId) => {
    try {
      await axios.post(`${API}/swipe/decline/${requesterId}`);
      setRequests((prev) => prev.filter((r) => r._id !== requesterId));
    } catch (err) {
      console.error(err);
    }
  };

  const TABS = [
    { id: "matches",  label: "💜 Matches",  count: matches.length  },
    { id: "requests", label: "📩 Requests", count: requests.length },
    { id: "starred",  label: "⭐ Starred",  count: starred.length  },
  ];

  const list = tab === "matches" ? matches : tab === "starred" ? starred : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-14 pb-24 px-4 max-w-md mx-auto">

        <div className="pt-4 pb-3">
          <h2 className="text-xl font-black text-slate-800">Connections 💜</h2>
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl bg-slate-100 p-1 gap-1 mb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition relative ${
                tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
              }`}
            >
              {t.label}
              {t.count > 0 && (
                <span className={`ml-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  t.id === "requests" && tab !== "requests"
                    ? "bg-pink-500 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-60 gap-3">
            <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading...</p>
          </div>

        ) : tab === "requests" ? (
          requests.length === 0 ? (
            <div className="text-center py-24 space-y-4">
              <span className="text-7xl block">📩</span>
              <h3 className="text-xl font-black text-slate-700">No pending requests</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">
                When someone swipes right on you, their request will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 animate-fadeIn">
              {requests.map((r) => (
                <RequestCard
                  key={r._id}
                  user={r}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  accepting={accepting}
                />
              ))}
            </div>
          )

        ) : list.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <span className="text-7xl block">{tab === "matches" ? "💜" : "⭐"}</span>
            <h3 className="text-xl font-black text-slate-700">
              {tab === "matches" ? "No matches yet!" : "No starred profiles yet!"}
            </h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              {tab === "matches"
                ? "Accept incoming requests or wait for someone to accept yours."
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

      {newMatch && (
        <MatchModal matchedUser={newMatch} onClose={() => setNewMatch(null)} />
      )}
    </div>
  );
}
