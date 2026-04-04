import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function MatchModal({ matchedUser, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient hero */}
        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 px-6 pt-8 pb-16 text-center overflow-hidden">
          {/* Animated sparkles */}
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-ping"
              style={{
                width:  `${6 + (i % 4) * 4}px`,
                height: `${6 + (i % 4) * 4}px`,
                top:    `${(i * 23) % 90}%`,
                left:   `${(i * 17 + 10) % 90}%`,
                animationDelay:    `${(i * 0.15).toFixed(2)}s`,
                animationDuration: `${1 + (i % 3) * 0.5}s`,
              }}
            />
          ))}
          <p className="text-5xl mb-2 relative z-10">🎉</p>
          <h2 className="text-3xl font-black text-white relative z-10">It's a Match!</h2>
          <p className="text-white/75 text-sm mt-1 relative z-10">
            You & <span className="font-bold text-white">{matchedUser?.name}</span> connected
          </p>
        </div>

        {/* Avatar overlapping */}
        <div className="flex justify-center -mt-12 mb-2 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 border-4 border-white shadow-2xl flex items-center justify-center text-4xl font-black text-white">
            {matchedUser?.name?.[0]?.toUpperCase()}
          </div>
        </div>

        <div className="px-6 pb-6 text-center space-y-3">
          <div>
            <h3 className="text-xl font-black text-slate-800">{matchedUser?.name}</h3>
            <p className="text-slate-500 text-sm capitalize">{matchedUser?.role}</p>
          </div>

          {matchedUser?.expertise && (
            <span className="inline-block bg-violet-50 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full">
              {matchedUser.expertise}
            </span>
          )}

          {matchedUser?.bio && (
            <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">{matchedUser.bio}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-slate-200 text-slate-600 py-3 rounded-2xl font-semibold hover:bg-slate-50 transition text-sm"
            >
              Keep Swiping 🔥
            </button>
            <Link
              to="/matches"
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3 rounded-2xl font-bold hover:opacity-90 transition shadow-md text-sm flex items-center justify-center"
            >
              View Match 💜
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
