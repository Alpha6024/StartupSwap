import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProfileBadge from "../components/ProfileBadge";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const roleColors = {
  founder: "from-violet-500 to-purple-600",
  "co-founder": "from-blue-500 to-cyan-600",
  investor: "from-emerald-500 to-green-600",
  mentor: "from-amber-500 to-orange-600",
  employee: "from-pink-500 to-rose-600",
};

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const { data } = await axios.get(`${API}/users/matches`);
      setMatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-16 pb-24 px-4 max-w-md mx-auto">
        <div className="pt-4 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-800">Your Matches 💜</h2>
            <p className="text-slate-500 text-sm">{matches.length} mutual connections</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <span className="text-6xl block">💜</span>
            <h3 className="text-xl font-bold text-slate-700">No matches yet!</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              Keep swiping to find your co-founder, investor, or mentor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {matches.map((match) => (
              <ProfileBadge key={match._id} user={match} onClick={() => setSelected(match)} />
            ))}
          </div>
        )}
      </main>

      {/* Match detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center px-4 pb-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient */}
            <div className={`h-32 bg-gradient-to-br ${roleColors[selected.role] || "from-slate-400 to-slate-600"} flex items-center justify-center relative`}>
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl font-black text-white shadow-lg">
                {selected.name?.[0]?.toUpperCase()}
              </div>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div className="text-center -mt-2">
                <h3 className="text-xl font-black text-slate-800">{selected.name}</h3>
                <p className="text-slate-500 text-sm capitalize">{selected.role} · {selected.location}</p>
              </div>

              {selected.bio && (
                <p className="text-sm text-slate-600 text-center">{selected.bio}</p>
              )}

              {selected.expertise && (
                <div className="bg-violet-50 rounded-xl px-4 py-2 text-center">
                  <p className="text-xs text-violet-500 font-semibold uppercase tracking-wide">Expertise</p>
                  <p className="text-sm text-violet-700 font-bold">{selected.expertise}</p>
                </div>
              )}

              {selected.startupName && (
                <div className="bg-slate-50 rounded-xl px-4 py-2 text-center">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Startup</p>
                  <p className="text-sm text-slate-700 font-bold">{selected.startupName}</p>
                  {selected.startupStage && selected.startupStage !== "none" && (
                    <p className="text-xs text-slate-500 capitalize">{selected.startupStage} stage</p>
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

              {/* Social links */}
              <div className="flex justify-center gap-3 pt-1">
                {selected.linkedin && (
                  <a href={selected.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-blue-100 transition">
                    LinkedIn 🔗
                  </a>
                )}
                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-slate-200 transition">
                    GitHub 🐙
                  </a>
                )}
                {selected.resumeUrl && (
                  <a href={`http://localhost:5000${selected.resumeUrl}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-violet-50 text-violet-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-violet-100 transition">
                    Resume 📄
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-full bg-slate-100 text-slate-600 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition text-sm mt-1"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}