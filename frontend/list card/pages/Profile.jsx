import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const COMMON_SKILLS = [
  "React", "Node.js", "Python", "ML/AI", "Product", "Design",
  "Marketing", "Sales", "Finance", "Legal", "Operations", "Blockchain",
];

const ROLES = [
  { value: "founder", emoji: "🚀", label: "Founder" },
  { value: "co-founder", emoji: "🤝", label: "Co-founder" },
  { value: "investor", emoji: "💰", label: "Investor" },
  { value: "mentor", emoji: "🧠", label: "Mentor" },
  { value: "employee", emoji: "💼", label: "Employee" },
];

const roleEmojis = {
  founder: "🚀", "co-founder": "🤝", investor: "💰", mentor: "🧠", employee: "💼",
};

const roleGradients = {
  founder: "from-violet-500 to-purple-600",
  "co-founder": "from-blue-500 to-cyan-600",
  investor: "from-emerald-500 to-green-600",
  mentor: "from-amber-500 to-orange-600",
  employee: "from-pink-500 to-rose-600",
};

export default function Profile() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    age: user?.age || "",
    role: user?.role || "",
    expertise: user?.expertise || "",
    startupName: user?.startupName || "",
    startupDescription: user?.startupDescription || "",
    skills: user?.skills || [],
    linkedin: user?.linkedin || "",
    github: user?.github || "",
    website: user?.website || "",
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleSkill = (skill) => {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter((s) => s !== skill)
        : [...f.skills, skill],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
        else if (v) fd.append(k, v);
      });
      await axios.put(`${API}/users/profile`, fd);
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const stat = (label, value) => (
    <div className="text-center">
      <p className="text-xl font-black text-slate-800">{value ?? 0}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-16 pb-24 max-w-md mx-auto">
        {/* Profile header */}
        <div className={`bg-gradient-to-br ${roleGradients[user?.role] || "from-slate-700 to-slate-900"} pt-6 pb-16 px-4 relative`}>
          <div className="flex items-start justify-between">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black text-white shadow-lg">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
            >
              {editing ? "Cancel" : "Edit Profile ✏️"}
            </button>
          </div>
          <div className="mt-3">
            <h2 className="text-2xl font-black text-white">{user?.name}</h2>
            <p className="text-white/70 text-sm capitalize">
              {roleEmojis[user?.role]} {user?.role} · {user?.location || "Nowhere yet"}
            </p>
          </div>
        </div>

        {/* Stats card overlapping header */}
        <div className="mx-4 -mt-8 bg-white rounded-2xl shadow-lg px-6 py-4 flex justify-around relative z-10">
          {stat("Matches", user?.matches?.length)}
          {stat("Liked", user?.swipedRight?.length)}
          {stat("Passed", user?.swipedLeft?.length)}
        </div>

        <div className="px-4 mt-4 space-y-4">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
              ✅ Profile updated successfully!
            </div>
          )}

          {editing ? (
            /* Edit form */
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-slate-800">Edit Profile</h3>

              <Field label="Name">
                <input className={inputCls} value={form.name} onChange={(e) => update("name", e.target.value)} />
              </Field>
              <Field label="Bio">
                <textarea className={`${inputCls} resize-none`} rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)} maxLength={300} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Location">
                  <input className={inputCls} value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City, Country" />
                </Field>
                <Field label="Age">
                  <input className={inputCls} type="number" value={form.age} onChange={(e) => update("age", e.target.value)} />
                </Field>
              </div>

              <Field label="Role">
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => update("role", r.value)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition text-xs font-semibold ${
                        form.role === r.value
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      <span className="text-xl">{r.emoji}</span>
                      {r.label}
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

              <Field label="Skills">
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                        form.skills.includes(skill)
                          ? "bg-violet-600 text-white border-violet-600"
                          : "border-slate-200 text-slate-600 hover:border-violet-300"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="LinkedIn">
                <input className={inputCls} value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." />
              </Field>
              <Field label="GitHub">
                <input className={inputCls} value={form.github} onChange={(e) => update("github", e.target.value)} placeholder="https://github.com/..." />
              </Field>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-gradient-to-r from-violet-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : "Save Changes ✓"}
              </button>
            </div>
          ) : (
            /* View mode */
            <>
              {user?.bio && (
                <div className="bg-white rounded-2xl shadow-sm p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Bio</p>
                  <p className="text-slate-700 text-sm">{user.bio}</p>
                </div>
              )}

              {user?.startupName && (
                <div className="bg-white rounded-2xl shadow-sm p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Startup</p>
                  <p className="font-bold text-slate-800">{user.startupName}</p>
                  {user.startupDescription && <p className="text-slate-600 text-sm mt-1">{user.startupDescription}</p>}
                </div>
              )}

              {user?.skills?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((s) => (
                      <span key={s} className="bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {(user?.linkedin || user?.github || user?.website || user?.resumeUrl) && (
                <div className="bg-white rounded-2xl shadow-sm p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Links</p>
                  <div className="flex flex-wrap gap-2">
                    {user.linkedin && <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl font-semibold hover:bg-blue-100 transition">LinkedIn 🔗</a>}
                    {user.github && <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl font-semibold hover:bg-slate-200 transition">GitHub 🐙</a>}
                    {user.website && <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl font-semibold hover:bg-emerald-100 transition">Website 🌐</a>}
                    {user.resumeUrl && <a href={`http://localhost:5000${user.resumeUrl}`} target="_blank" rel="noopener noreferrer" className="text-xs bg-violet-50 text-violet-700 px-3 py-1.5 rounded-xl font-semibold hover:bg-violet-100 transition">Resume 📄</a>}
                  </div>
                </div>
              )}

              <button
                onClick={logout}
                className="w-full border-2 border-red-200 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition text-sm"
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

const inputCls = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400 transition";

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block">{label}</label>
      {children}
    </div>
  );
}