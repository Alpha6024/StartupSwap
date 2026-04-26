import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ROLE_CARDS = [
  { emoji: "🚀", title: "Founders",    desc: "Build the next unicorn",     color: "from-violet-500/20 to-purple-500/20" },
  { emoji: "💰", title: "Investors",   desc: "Discover future unicorns",    color: "from-emerald-500/20 to-green-500/20" },
  { emoji: "🧠", title: "Mentors",     desc: "Shape the ecosystem",         color: "from-amber-500/20 to-orange-500/20"  },
  { emoji: "🤝", title: "Co-founders", desc: "Find your missing piece",     color: "from-blue-500/20 to-cyan-500/20"     },
];

// Animated count-up hook
function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return count;
}

function StatCard({ icon, label, value, color }) {
  const count = useCountUp(value);
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-3 text-center flex flex-col items-center gap-1 hover:bg-white/10 transition-all`}>
      <span className="text-2xl">{icon}</span>
      <p className={`text-xl font-black ${color}`}>
        {value === null ? "—" : count.toLocaleString()}
      </p>
      <p className="text-[10px] text-slate-400 uppercase tracking-wide leading-tight">{label}</p>
    </div>
  );
}

export default function Landing() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API}/users/stats`)
      .then(({ data }) => setStats(data))
      .catch(() => setStats(null));
  }, []);

  const STAT_CARDS = [
    { icon: "👥", label: "Total Users",  value: stats?.totalUsers ?? null, color: "text-white"         },
    { icon: "🚀", label: "Founders",     value: stats?.founders   ?? null, color: "text-violet-300"    },
    { icon: "💰", label: "Investors",    value: stats?.investors  ?? null, color: "text-emerald-300"   },
    { icon: "🧠", label: "Mentors",      value: stats?.mentors    ?? null, color: "text-amber-300"     },
    { icon: "🏢", label: "Startups",     value: stats?.startups   ?? null, color: "text-cyan-300"      },
    { icon: "💜", label: "Matches",      value: stats?.matches    ?? null, color: "text-pink-300"      },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white overflow-x-hidden">

      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute -bottom-32 left-1/3 w-64 h-64 bg-cyan-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 py-12 flex flex-col gap-10">

        {/* Logo & headline */}
        <div className="text-center animate-fadeInDown">
          <div className="text-7xl mb-4 drop-shadow-2xl">🚀</div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-violet-300 via-pink-300 to-white bg-clip-text text-transparent leading-tight">
            StartupSwipe
          </h1>
          <p className="text-slate-400 mt-3 text-base">
            The <span className="text-violet-300 font-semibold">Tinder</span> for the Startup World
          </p>
        </div>

        {/* Tagline */}
        <div className="text-center space-y-2 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <p className="text-2xl font-black text-white leading-snug">
            Find your{" "}
            <span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">co-founder</span>
            ,{" "}
            <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">investor</span>
            , or{" "}
            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">mentor</span>
          </p>
          <p className="text-slate-500 text-sm">Swipe right to connect · Left to pass · Build together</p>
        </div>

        {/* ── Live Stats Grid ── */}
        <div className="space-y-2 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Community Stats</span>
            <span className={`w-2 h-2 rounded-full ${stats ? "bg-green-400 animate-pulse" : "bg-slate-600"}`} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {STAT_CARDS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-2 gap-3 animate-slideUp" style={{ animationDelay: "0.4s" }}>
          {ROLE_CARDS.map(({ emoji, title, desc, color }) => (
            <div
              key={title}
              className={`bg-gradient-to-br ${color} border border-white/10 backdrop-blur-sm rounded-2xl p-4 hover:border-white/20 hover:-translate-y-1 transition-all duration-200`}
            >
              <span className="text-3xl">{emoji}</span>
              <p className="font-black text-sm mt-2">{title}</p>
              <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 animate-slideUp" style={{ animationDelay: "0.55s" }}>
          <Link
            to="/register"
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-4 rounded-2xl font-black text-lg text-center hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-violet-500/30"
          >
            Get Started 🚀
          </Link>
          <Link
            to="/login"
            className="w-full bg-white/8 border border-white/20 text-white py-3.5 rounded-2xl font-semibold text-center hover:bg-white/15 active:scale-95 transition-all backdrop-blur-sm"
          >
            Already have an account? Sign in →
          </Link>
        </div>

        <p className="text-center text-slate-600 text-xs pb-4 animate-fadeIn" style={{ animationDelay: "0.8s" }}>
          🔒 Free to join · No credit card required
        </p>
      </div>
    </div>
  );
}
