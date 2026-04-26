import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const API     = import.meta.env.VITE_API_URL || "https://startupswap.onrender.com/api";
const BACKEND = API.replace("/api", "");

const SKILLS = [
  "React", "Node.js", "Python", "ML/AI", "Product", "Design",
  "Marketing", "Sales", "Finance", "Legal", "Operations", "Blockchain",
  "iOS", "Android", "DevOps", "Data Science",
];

const ROLES = [
  { value: "founder",    emoji: "🚀", label: "Founder"    },
  { value: "co-founder", emoji: "🤝", label: "Co-founder" },
  { value: "investor",   emoji: "💰", label: "Investor"   },
  { value: "mentor",     emoji: "🧠", label: "Mentor"     },
  { value: "employee",   emoji: "💼", label: "Employee"   },
];

const ROLE_GRADIENTS = {
  founder:      "from-violet-500 to-purple-700",
  "co-founder": "from-blue-500 to-cyan-700",
  investor:     "from-emerald-500 to-green-600",
  mentor:       "from-amber-500 to-orange-500",
  employee:     "from-pink-500 to-rose-600",
};

const ROLE_EMOJIS = {
  founder: "🚀", "co-founder": "🤝", investor: "💰", mentor: "🧠", employee: "💼",
};

const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 transition bg-slate-50 focus:bg-white";

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const [form, setForm] = useState({
    name:               user?.name               || "",
    bio:                user?.bio                || "",
    location:           user?.location           || "",
    age:                user?.age                || "",
    role:               user?.role               || "",
    expertise:          user?.expertise          || "",
    startupName:        user?.startupName        || "",
    startupDescription: user?.startupDescription || "",
    skills:             user?.skills             || [],
    linkedin:           user?.linkedin           || "",
    github:             user?.github             || "",
    website:            user?.website            || "",
  });

  const update      = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleSkill = (sk)   => setForm((f) => ({
    ...f,
    skills: f.skills.includes(sk) ? f.skills.filter((s) => s !== sk) : [...f.skills, sk],
  }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
        else if (v !== "" && v !== null && v !== undefined) fd.append(k, v);
      });
      const { data } = await axios.put(`${API}/users/profile`, fd);
      setUser(data);
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const gradient = ROLE_GRADIENTS[user?.role] || "from-slate-600 to-slate-800";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-14 pb-24 max-w-md mx-auto">

        {/* Header */}
        <div className={`bg-gradient-to-br ${gradient} pt-6 pb-20 px-5`}>
          <div className="flex items-start justify-between">
            <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-3xl font-black text-white shadow-lg">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <button
              onClick={() => { setEditing(!editing); setError(""); }}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              {editing ? "Cancel" : "Edit Profile ✏️"}
            </button>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-white">{user?.name}</h2>
            <p className="text-white/70 text-sm capitalize mt-0.5">
              {ROLE_EMOJIS[user?.role]} {user?.role} · {user?.location || "Everywhere"}
            </p>
          </div>
        </div>

        {/* Stats card — overlapping */}
        <div className="mx-4 -mt-10 bg-white rounded-2xl shadow-lg px-4 py-4 flex justify-around relative z-10">
          {[
            { label: "Matches",  value: user?.matches?.length },
            { label: "Liked",    value: user?.swipedRight?.length },
            { label: "Requests", value: user?.pendingRequests?.length },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black text-slate-800">{value ?? 0}</p>
              <p className="text-xs text-slate-400 font-medium">{label}</p>
            </div>
          ))}
        </div>

        <div className="px-4 mt-4 space-y-3">

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              ✅ Profile updated!
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          {editing ? (
            /* ── Edit form ── */
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4 animate-fadeIn">
              <h3 className="font-black text-slate-800">Edit Profile</h3>

              <Field label="Name">
                <input className={inputCls} value={form.name} onChange={(e) => update("name", e.target.value)} />
              </Field>
              <Field label="Bio">
                <textarea className={`${inputCls} resize-none`} rows={3} value={form.bio}
                  onChange={(e) => update("bio", e.target.value)} maxLength={300} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Location">
                  <input className={inputCls} value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City, Country" />
                </Field>
                <Field label="Age">
                  <input type="number" className={inputCls} value={form.age} onChange={(e) => update("age", e.target.value)} />
                </Field>
              </div>

              <Field label="Role">
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {ROLES.map((r) => (
                    <button key={r.value} type="button" onClick={() => update("role", r.value)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition text-xs font-bold ${
                        form.role === r.value
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-slate-200 text-slate-600 hover:border-violet-200"}`}
                    >
                      <span className="text-xl">{r.emoji}</span>{r.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Expertise">
                <input className={inputCls} value={form.expertise} onChange={(e) => update("expertise", e.target.value)} placeholder="e.g. AI/ML, FinTech" />
              </Field>
              <Field label="Startup Name">
                <input className={inputCls} value={form.startupName} onChange={(e) => update("startupName", e.target.value)} />
              </Field>
              <Field label="Startup Description">
                <textarea className={`${inputCls} resize-none`} rows={2} value={form.startupDescription}
                  onChange={(e) => update("startupDescription", e.target.value)} />
              </Field>

              <Field label="Skills">
                <div className="flex flex-wrap gap-2 mt-1">
                  {SKILLS.map((sk) => (
                    <button key={sk} type="button" onClick={() => toggleSkill(sk)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                        form.skills.includes(sk)
                          ? "bg-violet-600 text-white border-violet-600"
                          : "border-slate-200 text-slate-600 hover:border-violet-300"}`}
                    >{sk}</button>
                  ))}
                </div>
              </Field>

              <Field label="LinkedIn">
                <input className={inputCls} value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
              </Field>
              <Field label="GitHub">
                <input className={inputCls} value={form.github} onChange={(e) => update("github", e.target.value)} placeholder="https://github.com/..." />
              </Field>
              <Field label="Website">
                <input className={inputCls} value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://yoursite.com" />
              </Field>

              <button onClick={handleSave} disabled={saving}
                className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3 rounded-xl font-black hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : "Save Changes ✓"}
              </button>
            </div>
          ) : (
            /* ── View mode ── */
            <>
              {user?.bio && (
                <div className="bg-white rounded-2xl shadow-sm p-4 animate-fadeIn">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Bio</p>
                  <p className="text-slate-700 text-sm leading-relaxed">{user.bio}</p>
                </div>
              )}

              {(user?.startupName || user?.expertise) && (
                <div className="bg-white rounded-2xl shadow-sm p-4 space-y-2 animate-fadeIn">
                  {user.expertise && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Expertise</p>
                      <p className="text-violet-700 font-bold text-sm">{user.expertise}</p>
                    </div>
                  )}
                  {user.startupName && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Startup</p>
                      <p className="font-black text-slate-800">{user.startupName}</p>
                      {user.startupDescription && <p className="text-slate-600 text-sm mt-0.5">{user.startupDescription}</p>}
                    </div>
                  )}
                </div>
              )}

              {user?.skills?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-4 animate-fadeIn">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((s) => (
                      <span key={s} className="bg-violet-50 text-violet-700 text-xs font-bold px-3 py-1.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {(user?.linkedin || user?.github || user?.website || user?.resumeUrl) && (
                <div className="bg-white rounded-2xl shadow-sm p-4 animate-fadeIn">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Links</p>
                  <div className="flex flex-wrap gap-2">
                    {user.linkedin  && <a href={user.linkedin}  target="_blank" rel="noreferrer" className="text-xs bg-blue-50    text-blue-600    px-3 py-1.5 rounded-xl font-semibold hover:bg-blue-100    transition">LinkedIn 🔗</a>}
                    {user.github    && <a href={user.github}    target="_blank" rel="noreferrer" className="text-xs bg-slate-100  text-slate-700   px-3 py-1.5 rounded-xl font-semibold hover:bg-slate-200  transition">GitHub 🐙</a>}
                    {user.website   && <a href={user.website}   target="_blank" rel="noreferrer" className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl font-semibold hover:bg-emerald-100 transition">Website 🌐</a>}
                    {user.resumeUrl && <a href={`${BACKEND}${user.resumeUrl}`} target="_blank" rel="noreferrer" className="text-xs bg-violet-50 text-violet-700 px-3 py-1.5 rounded-xl font-semibold hover:bg-violet-100 transition">Resume 📄</a>}
                  </div>
                </div>
              )}

              <button
                onClick={logout}
                className="w-full border-2 border-red-200 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 active:scale-95 transition-all text-sm"
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
