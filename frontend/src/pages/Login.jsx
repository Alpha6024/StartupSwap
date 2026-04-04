import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/swipe", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center px-4">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600/20   rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-8 text-center">
          <span className="text-5xl">🚀</span>
          <h1 className="text-2xl font-black text-white mt-2">Welcome Back!</h1>
          <p className="text-violet-200 text-sm mt-1">Sign in to StartupSwipe</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Email</label>
            <input
              type="email"
              autoComplete="email"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 transition bg-slate-50 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@startup.com"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 transition bg-slate-50 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3.5 rounded-xl font-black text-base hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : "Sign In →"}
          </button>

          <p className="text-center text-sm text-slate-500 pt-1">
            No account?{" "}
            <Link to="/register" className="text-violet-600 font-bold hover:underline">
              Create one →
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
