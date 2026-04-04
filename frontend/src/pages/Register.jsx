import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STEPS = ["Basic Info", "Startup & Role", "Skills & Links"];

const ROLES = [
  { value: "founder",    emoji: "🚀", label: "Founder"    },
  { value: "co-founder", emoji: "🤝", label: "Co-founder" },
  { value: "investor",   emoji: "💰", label: "Investor"   },
  { value: "mentor",     emoji: "🧠", label: "Mentor"     },
  { value: "employee",   emoji: "💼", label: "Employee"   },
];

const STAGES = ["idea", "mvp", "early-stage", "growth", "scale", "none"];

const SKILLS = [
  "React", "Node.js", "Python", "ML/AI", "Product", "Design",
  "Marketing", "Sales", "Finance", "Legal", "Operations", "Blockchain",
  "iOS", "Android", "DevOps", "Data Science",
];

const INDUSTRIES = [
  "FinTech", "HealthTech", "EdTech", "AI/ML", "SaaS", "E-commerce",
  "CleanTech", "AgriTech", "PropTech", "LegalTech", "GovTech", "Web3",
];

const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 transition bg-slate-50 focus:bg-white";

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [resume,  setResume]  = useState(null);

  const [form, setForm] = useState({
    name: "", email: "", password: "", age: "", location: "", bio: "",
    role: "", lookingFor: [],
    startupName: "", startupStage: "none", startupDescription: "", expertise: "",
    skills: [], industries: [],
    linkedin: "", github: "", website: "",
  });

  const update       = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleArray  = (k, v) => setForm((f) => ({
    ...f,
    [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v],
  }));

  const nextStep = () => {
    setError("");
    if (step === 0 && (!form.name || !form.email || !form.password))
      return setError("Name, email and password are required.");
    if (step === 1 && !form.role)
      return setError("Please choose your role.");
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
        else if (v !== "" && v !== null && v !== undefined) fd.append(k, v);
      });
      if (resume) fd.append("resume", resume);
      await register(fd);
      navigate("/swipe", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-5">
          <Link to="/" className="text-white/60 text-xs hover:text-white transition font-medium">← Back to home</Link>
          <h1 className="text-2xl font-black text-white mt-2">Create Account 🚀</h1>
          <p className="text-violet-200 text-sm">Join the startup ecosystem</p>

          {/* Progress */}
          <div className="flex gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? "bg-white" : "bg-white/25"}`} />
                <p className={`text-[10px] mt-1 font-semibold ${i === step ? "text-white" : "text-white/40"}`}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex gap-2">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* ── Step 0: Basic Info ── */}
          {step === 0 && (
            <div className="space-y-3 animate-fadeIn">
              <Field label="Full Name *">
                <input className={inputCls} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Doe" />
              </Field>
              <Field label="Email *">
                <input type="email" className={inputCls} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jane@startup.com" />
              </Field>
              <Field label="Password *">
                <input type="password" className={inputCls} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Min 8 characters" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Age">
                  <input type="number" className={inputCls} value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="28" />
                </Field>
                <Field label="Location">
                  <input className={inputCls} value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Mumbai, IN" />
                </Field>
              </div>
              <Field label="Bio">
                <textarea
                  className={`${inputCls} resize-none`} rows={3}
                  placeholder="Tell the startup world about you..."
                  value={form.bio} onChange={(e) => update("bio", e.target.value)} maxLength={300}
                />
              </Field>
            </div>
          )}

          {/* ── Step 1: Startup & Role ── */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">

              <Field label="I am a... *">
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {ROLES.map((r) => (
                    <button key={r.value} type="button" onClick={() => update("role", r.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-bold ${
                        form.role === r.value
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-slate-200 text-slate-600 hover:border-violet-200"}`}
                    >
                      <span className="text-2xl">{r.emoji}</span>{r.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Looking for...">
                <div className="flex flex-wrap gap-2 mt-1">
                  {ROLES.map((r) => (
                    <button key={r.value} type="button" onClick={() => toggleArray("lookingFor", r.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        form.lookingFor.includes(r.value)
                          ? "bg-violet-600 text-white border-violet-600"
                          : "border-slate-200 text-slate-600 hover:border-violet-300"}`}
                    >{r.emoji} {r.label}</button>
                  ))}
                </div>
              </Field>

              <Field label="Startup Name">
                <input className={inputCls} value={form.startupName} onChange={(e) => update("startupName", e.target.value)} placeholder="Acme Inc." />
              </Field>

              <Field label="Startup Stage">
                <select className={inputCls} value={form.startupStage} onChange={(e) => update("startupStage", e.target.value)}>
                  {STAGES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </Field>

              <Field label="Startup Description">
                <textarea className={`${inputCls} resize-none`} rows={2}
                  placeholder="What problem are you solving?"
                  value={form.startupDescription} onChange={(e) => update("startupDescription", e.target.value)}
                />
              </Field>

              <Field label="Area of Expertise">
                <input className={inputCls} value={form.expertise} onChange={(e) => update("expertise", e.target.value)} placeholder="e.g. AI/ML, FinTech, SaaS" />
              </Field>
            </div>
          )}

          {/* ── Step 2: Skills & Links ── */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">

              <Field label="Skills">
                <div className="flex flex-wrap gap-2 mt-1">
                  {SKILLS.map((sk) => (
                    <button key={sk} type="button" onClick={() => toggleArray("skills", sk)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        form.skills.includes(sk)
                          ? "bg-violet-600 text-white border-violet-600"
                          : "border-slate-200 text-slate-600 hover:border-violet-300"}`}
                    >{sk}</button>
                  ))}
                </div>
              </Field>

              <Field label="Industries">
                <div className="flex flex-wrap gap-2 mt-1">
                  {INDUSTRIES.map((ind) => (
                    <button key={ind} type="button" onClick={() => toggleArray("industries", ind)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        form.industries.includes(ind)
                          ? "bg-pink-600 text-white border-pink-600"
                          : "border-slate-200 text-slate-600 hover:border-pink-300"}`}
                    >{ind}</button>
                  ))}
                </div>
              </Field>

              <Field label="LinkedIn URL">
                <input className={inputCls} value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
              </Field>
              <Field label="GitHub URL">
                <input className={inputCls} value={form.github} onChange={(e) => update("github", e.target.value)} placeholder="https://github.com/..." />
              </Field>
              <Field label="Website / Portfolio">
                <input className={inputCls} value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://yoursite.com" />
              </Field>

              <Field label="Resume (PDF/DOC · max 5MB)">
                <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{resume ? resume.name : "Upload your resume"}</p>
                    <p className="text-xs text-slate-400">Click to browse</p>
                  </div>
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setResume(e.target.files[0])} />
                </label>
              </Field>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button type="button" onClick={() => setStep((s) => s - 1)}
                className="flex-1 border-2 border-slate-200 text-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-50 transition text-sm"
              >← Back</button>
            )}

            {step < STEPS.length - 1 ? (
              <button type="button" onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3 rounded-xl font-black hover:opacity-90 active:scale-95 transition-all shadow-md"
              >Continue →</button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading}
                className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3 rounded-xl font-black hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating...</>
                ) : "Join StartupSwipe 🚀"}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-slate-500 pt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
