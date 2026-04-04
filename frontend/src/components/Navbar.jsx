import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { path: "/swipe",   icon: "🔥", label: "Discover" },
  { path: "/matches", icon: "💜", label: "Matches"  },
  { path: "/profile", icon: "👤", label: "Profile"  },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <>
      {/* ── Top bar ── */}
      <header className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/swipe" className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="font-black text-slate-800 text-lg tracking-tight">StartupSwipe</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium capitalize hidden sm:block">
              {user?.role}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-black text-white shadow-sm">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
          </div>
        </div>
      </header>

      {/* ── Bottom mobile nav ── */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-100">
        <div className="max-w-md mx-auto flex">
          {NAV.map(({ path, icon, label }) => {
            const active = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`relative flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
                  active ? "text-violet-600" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {active && (
                  <span className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-b-full" />
                )}
                <span className="text-xl">{icon}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${active ? "text-violet-600" : ""}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
