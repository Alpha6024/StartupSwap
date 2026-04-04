const ROLE_CFG = {
  founder:      { gradient: "from-violet-500 to-purple-600",  emoji: "🚀" },
  "co-founder": { gradient: "from-blue-500 to-cyan-600",      emoji: "🤝" },
  investor:     { gradient: "from-emerald-500 to-green-600",  emoji: "💰" },
  mentor:       { gradient: "from-amber-500 to-orange-500",   emoji: "🧠" },
  employee:     { gradient: "from-pink-500 to-rose-600",      emoji: "💼" },
};

export default function ProfileBadge({ user, onClick }) {
  const cfg = ROLE_CFG[user?.role] || ROLE_CFG.founder;
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 active:scale-95 transition-all duration-200 text-left w-full"
    >
      {/* Avatar header */}
      <div className={`h-20 bg-gradient-to-br ${cfg.gradient} flex items-center justify-center relative`}>
        <span className="text-3xl font-black text-white/90">{user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-20 object-cover" />
        ) : user?.name?.[0]?.toUpperCase()}</span>
        <span className="absolute bottom-2 right-2 text-sm">{cfg.emoji}</span>
      </div>

      {/* Info */}
      <div className="p-3 space-y-0.5">
        <p className="font-bold text-slate-800 text-sm truncate">{user?.name}</p>
        <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
        {user?.expertise && (
          <p className="text-xs text-violet-600 font-semibold truncate">{user.expertise}</p>
        )}
        {user?.startupName && (
          <p className="text-xs text-slate-400 truncate">🏢 {user.startupName}</p>
        )}
      </div>
    </button>
  );
}
