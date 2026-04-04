import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STEPS = ["Basic Info", "Startup & Role", "Skills & Links"];

const ROLES = [
  { value: "founder", emoji: "🚀", label: "Founder" },
  { value: "co-founder", emoji: "🤝", label: "Co-founder" },
  { value: "investor", emoji: "💰", label: "Investor" },
  { value: "mentor", emoji: "🧠", label: "Mentor" },
  { value: "employee", emoji: "💼", label: "Employee" },
];

const STAGES = ["idea", "mvp", "early-stage", "growth", "scale", "none"];

const COMMON_SKILLS = [
  "React", "Node.js", "Python", "ML/AI", "Product", "Design",
  "Marketing", "Sales", "Finance", "Legal", "Operations", "Blockchain",
];

const INDUSTRIES = [
  "FinTech", "HealthTech", "EdTech", "AI/ML", "SaaS", "E-commerce",
  "CleanTech", "AgriTech", "PropTech", "LegalTech", "GovTech", "Web3",
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resume, setResume] = useState(null);

  const [form, setForm] = useState({
    name: "", email: "", password: "", age: "", location: "", bio: "",
    role: "", lookingFor: [],
    startupName: "", startupStage: "none", startupDescription: "", expertise: "",
    skills: [], industries: [],
    linkedin: "", github: "", website: "",
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleArray = (field, value) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  };

  const nextStep = () => {
    setError("");
    if (step === 0 && (!form.name || !form.email || !form.password)) {
      return setError("Name, email and password are required.");
    }
    if (step === 1 && !form.role) {
      return setError("Please select your role.");
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
        else if (v) fd.append(k, v);
      });
      if (resume) fd.append("resume", resume);
      await register(fd);
      navigate("/swipe");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex items-center justify-center px-4 py-10">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-pink-600 px-6 py-5">
          <Link to="/" className="text-white/70 text-sm hover:text-white transition">← Back</Link>
          <h1 className="text-2xl font-black text-white mt-1">Create Account 🚀</h1>
          <p className="text-violet-200 text-sm">Join the startup ecosystem</p>

          {/* Progress bar */}
          <div className="flex gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? "bg-white" : "bg-white/25"}`} />
                <p className={`text-[10px] mt-1 font-medium ${i === step ? "text-white" : "text-white/50"}`}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          {/* STEP 0 - Basic Info */}
          {step === 0 && (
            <div className="space-y-3 animate-fadeIn">
              <Input label="Full Name *" value={form.name} onChange={(v) => update("name", v)} placeholder="Jane Doe" />
              <Input label="Email *" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="jane@startup.com" />
              <Input label="Password *" type="password" value={form.password} onChange={(v) => update("password", v)} placeholder="••••••••" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Age" type="number" value={form.age} onChange={(v) => update("age", v)} placeholder="28" />
                <Input label="Location" value={form.location} onChange={(v) => update("location", v)} placeholder="Mumbai, IN" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Bio</label>
                <textarea
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                  rows={3}
                  placeholder="Tell the startup world about yourself..."
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  maxLength={300}
                />
              </div>
            </div>
          )}

          {/* STEP 1 - Startup & Role */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">I am a... *</label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => update("role", r.value)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-sm font-semibold ${
                        form.role === r.value
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-slate-200 text-slate-600 hover:border-violet-200"
                      }`}
                    >
                      <span className="text-2xl">{r.emoji}</span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">Looking for...</label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => toggleArray("lookingFor", r.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        form.lookingFor.includes(r.value)
                          ? "bg-violet-600 text-white border-violet-600"
                          : "border-slate-200 text-slate-600 hover:border-violet-300"
                      }`}
                    >
                      {r.emoji} {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <Input label="Startup Name" value={form.startupName} onChange={(v) => update("startupName", v)} placeholder="Acme Inc." />

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Startup Stage</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={form.startupStage}
                  onChange={(e) => update("startupStage", e.target.value)}
                >
                  {STAGES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">Startup Description</label>
                <textarea
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
                  rows={2}
                  placeholder="What problem are you solving?"
                  value={form.startupDescription}
                  onChange={(e) => update("startupDescription", e.target.value)}
                />
              </div>

              <Input label="Area of Expertise" value={form.expertise} onChange={(v) => update("expertise", v)} placeholder="e.g. AI/ML, FinTech, SaaS" />
            </div>
          )}

          {/* STEP 2 - Skills & Links */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleArray("skills", skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        form.skills.includes(skill)
                          ? "bg-violet-600 text-white border-violet-600"
                          : "border-slate-200 text-slate-600 hover:border-violet-300"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">Industries</label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => toggleArray("industries", ind)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        form.industries.includes(ind)
                          ? "bg-pink-600 text-white border-pink-600"
                          : "border-slate-200 text-slate-600 hover:border-pink-300"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              <Input label="LinkedIn URL" value={form.linkedin} onChange={(v) => update("linkedin", v)} placeholder="https://linkedin.com/in/..." />
              <Input label="GitHub URL" value={form.github} onChange={(v) => update("github", v)} placeholder="https://github.com/..." />
              <Input label="Website / Portfolio" value={form.website} onChange={(v) => update("website", v)} placeholder="https://yoursite.com" />

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">
                  Resume (PDF/DOC, max 5MB)
                </label>
                <label className="flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {resume ? resume.name : "Upload your resume"}
                    </p>
                    <p className="text-xs text-slate-400">Click to browse</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setResume(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 border-2 border-slate-200 text-slate-600 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
              >
                ← Back
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition shadow-md"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition shadow-md disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : "Join StartupSwipe 🚀"}
              </button>
            )}
          </div>

          <p className="text-center text-sm text-slate-500 pt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-violet-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1 block">{label}</label>
      <input
        type={type}
        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}