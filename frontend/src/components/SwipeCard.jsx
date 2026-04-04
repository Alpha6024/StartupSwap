import { useRef, useState } from "react";

const BACKEND = (import.meta.env.VITE_API_URL || "https://startupswap.onrender.com/api").replace("/api", "");

const THRESHOLD = 90;

const ROLE_CFG = {
  founder:      { gradient: "from-violet-500 to-purple-700",  emoji: "🚀", label: "Founder"    },
  "co-founder": { gradient: "from-blue-500 to-cyan-700",      emoji: "🤝", label: "Co-founder" },
  investor:     { gradient: "from-emerald-500 to-green-700",  emoji: "💰", label: "Investor"   },
  mentor:       { gradient: "from-amber-500 to-orange-600",   emoji: "🧠", label: "Mentor"     },
  employee:     { gradient: "from-pink-500 to-rose-600",      emoji: "💼", label: "Employee"   },
};

const STAGE_COLOR = {
  idea: "bg-slate-100 text-slate-600",
  mvp: "bg-blue-50 text-blue-600",
  "early-stage": "bg-amber-50 text-amber-600",
  growth: "bg-emerald-50 text-emerald-600",
  scale: "bg-violet-50 text-violet-600",
};

export default function SwipeCard({ user, onSwipeLeft, onSwipeRight, onSuperLike, style = {} }) {
  const startRef              = useRef(null);
  const [dragX, setDragX]     = useState(0);
  const [dragY, setDragY]     = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState(null);
  const [tab, setTab]         = useState("about"); // "about" | "startup" | "links"

  const cfg = ROLE_CFG[user?.role] || ROLE_CFG.founder;

  const getPos = (e) =>
    e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
              : { x: e.clientX,            y: e.clientY            };

  const onStart = (e) => { startRef.current = getPos(e); setDragging(true); };
  const onMove  = (e) => {
    if (!dragging || !startRef.current) return;
    const { x, y } = getPos(e);
    setDragX(x - startRef.current.x);
    setDragY(y - startRef.current.y);
  };
  const onEnd = () => {
    setDragging(false);
    if      (dragX >  THRESHOLD) triggerSwipe("right");
    else if (dragX < -THRESHOLD) triggerSwipe("left");
    else { setDragX(0); setDragY(0); }
  };

  const triggerSwipe = (dir) => {
    setExiting(dir);
    setTimeout(() => {
      if (dir === "right") onSwipeRight(user._id);
      else if (dir === "left") onSwipeLeft(user._id);
      else onSuperLike?.(user);
    }, 380);
  };

  const rotation     = dragX * 0.07;
  const connectAlpha = Math.min(Math.max(dragX  / THRESHOLD, 0), 1);
  const passAlpha    = Math.min(Math.max(-dragX / THRESHOLD, 0), 1);

  const cardStyle = {
    transform:
      exiting === "right" ? "translateX(160%) rotate(28deg)"
      : exiting === "left"  ? "translateX(-160%) rotate(-28deg)"
      : exiting === "super" ? "translateY(-160%) scale(1.05)"
      : `translate(${dragX}px, ${dragY}px) rotate(${rotation}deg)`,
    transition: dragging ? "none" : "transform 0.38s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.35s ease",
    opacity: exiting ? 0 : 1,
    ...style,
  };

  const hasStartup = user?.startupName || user?.startupDescription || user?.startupStage;
  const hasLinks   = user?.linkedin || user?.github || user?.website || user?.resumeUrl;

  return (
    <div
      className="absolute inset-0 select-none swipe-card cursor-grab active:cursor-grabbing"
      style={cardStyle}
      onMouseDown={onStart}  onMouseMove={onMove}  onMouseUp={onEnd}  onMouseLeave={onEnd}
      onTouchStart={onStart} onTouchMove={onMove}  onTouchEnd={onEnd}
    >
      <div className="h-full rounded-3xl overflow-hidden shadow-2xl bg-white flex flex-col">

        {/* ── Hero gradient ── */}
        <div className={`relative bg-gradient-to-br ${cfg.gradient} flex-shrink-0`} style={{ height: "44%" }}>

          {/* CONNECT stamp */}
          <div
            className="absolute top-7 left-5 border-4 border-green-400 rounded-2xl px-4 py-1 -rotate-12 pointer-events-none"
            style={{ opacity: connectAlpha }}
          >
            <span className="text-green-400 font-black text-xl tracking-widest">CONNECT ♥</span>
          </div>

          {/* PASS stamp */}
          <div
            className="absolute top-7 right-5 border-4 border-red-400 rounded-2xl px-4 py-1 rotate-12 pointer-events-none"
            style={{ opacity: passAlpha }}
          >
            <span className="text-red-400 font-black text-xl tracking-widest">✕ PASS</span>
          </div>

          {/* Role badge */}
          <div className="absolute top-4 left-4 bg-black/25 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
            <span className="text-sm">{cfg.emoji}</span>
            <span className="text-white text-xs font-bold">{cfg.label}</span>
          </div>

          {/* Age badge */}
          {user?.age && (
            <div className="absolute top-4 right-4 bg-black/25 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-xs font-bold">{user.age} yrs</span>
            </div>
          )}

          {/* Avatar */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <div className="w-24 h-24 rounded-2xl border-4 border-white bg-white/25 shadow-xl flex items-center justify-center text-4xl font-black text-white overflow-hidden">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : user?.name?.[0]?.toUpperCase()
              }
            </div>
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="flex-1 px-4 pt-14 pb-2 overflow-y-auto scrollbar-hide flex flex-col gap-2">

          {/* Name + location */}
          <div className="text-center">
            <h2 className="text-xl font-black text-slate-800">{user?.name}</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              {user?.location ? `📍 ${user.location}` : "🌍 Worldwide"}
            </p>
          </div>

          {/* Expertise pill */}
          {user?.expertise && (
            <div className="flex justify-center">
              <span className="bg-violet-50 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full border border-violet-100">
                ✦ {user.expertise}
              </span>
            </div>
          )}

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-slate-100 p-0.5 gap-0.5">
            {[
              { key: "about",   label: "About"   },
              ...(hasStartup ? [{ key: "startup", label: "Startup" }] : []),
              ...(hasLinks   ? [{ key: "links",   label: "Links"   }] : []),
            ].map(({ key, label }) => (
              <button
                key={key}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); setTab(key); }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                  tab === key ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "about" && (
            <div className="space-y-2">
              {user?.bio && (
                <p className="text-slate-600 text-xs text-center leading-relaxed line-clamp-3">{user.bio}</p>
              )}

              {user?.skills?.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {user.skills.slice(0, 6).map((s) => (
                      <span key={s} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                    {user.skills.length > 6 && (
                      <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full">+{user.skills.length - 6}</span>
                    )}
                  </div>
                </div>
              )}

              {user?.industries?.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-1.5">Industries</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {user.industries.map((ind) => (
                      <span key={ind} className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">{ind}</span>
                    ))}
                  </div>
                </div>
              )}

              {user?.lookingFor?.length > 0 && (
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-1.5">Looking for</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {user.lookingFor.map((r) => (
                      <span key={r} className="bg-pink-50 text-pink-600 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{r}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "startup" && hasStartup && (
            <div className="space-y-2">
              {user.startupName && (
                <div className="bg-slate-50 rounded-2xl p-3 text-center">
                  <p className="font-black text-slate-800 text-base">{user.startupName}</p>
                  {user.startupStage && user.startupStage !== "none" && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full mt-1 inline-block capitalize ${STAGE_COLOR[user.startupStage] || "bg-slate-100 text-slate-600"}`}>
                      {user.startupStage} stage
                    </span>
                  )}
                </div>
              )}
              {user.startupDescription && (
                <p className="text-slate-600 text-xs leading-relaxed text-center">{user.startupDescription}</p>
              )}
            </div>
          )}

          {tab === "links" && hasLinks && (
            <div className="flex flex-wrap gap-2 justify-center">
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noopener noreferrer"
                  onMouseDown={(e) => e.stopPropagation()}
                  className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-blue-100 transition flex items-center gap-1.5">
                  🔗 LinkedIn
                </a>
              )}
              {user.github && (
                <a href={user.github} target="_blank" rel="noopener noreferrer"
                  onMouseDown={(e) => e.stopPropagation()}
                  className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-slate-200 transition flex items-center gap-1.5">
                  🐙 GitHub
                </a>
              )}
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer"
                  onMouseDown={(e) => e.stopPropagation()}
                  className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-emerald-100 transition flex items-center gap-1.5">
                  🌐 Website
                </a>
              )}
              {user.resumeUrl && (
                <a href={`${BACKEND}${user.resumeUrl}`} target="_blank" rel="noopener noreferrer"
                  onMouseDown={(e) => e.stopPropagation()}
                  className="bg-violet-50 text-violet-600 text-xs font-semibold px-3 py-2 rounded-xl hover:bg-violet-100 transition flex items-center gap-1.5">
                  📄 Resume
                </a>
              )}
            </div>
          )}
        </div>

        {/* ── Bottom action buttons ── */}
        <div className="flex items-center justify-center gap-4 px-5 pb-4 pt-2 border-t border-slate-100 flex-shrink-0">
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); triggerSwipe("left"); }}
            className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-white border-2 border-red-200 text-red-500 text-xl flex items-center justify-center shadow-sm hover:bg-red-50 hover:scale-105 active:scale-95 transition-all"
          >✕</button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); triggerSwipe("super"); }}
            className="w-[48px] h-[48px] rounded-full bg-white border-2 border-yellow-300 text-yellow-500 text-xl flex items-center justify-center shadow-sm hover:bg-yellow-50 hover:scale-105 active:scale-95 transition-all"
          >⭐</button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); triggerSwipe("right"); }}
            className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white text-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
          >♥</button>
        </div>
      </div>
    </div>
  );
}
