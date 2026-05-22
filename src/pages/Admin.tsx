import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const ADMIN_URL = "https://functions.poehali.dev/c8c4f277-d437-4f68-bed2-f6b8353499a7";

const TOKEN_KEY = "praise247_admin_token";

type Tab = "news" | "programs" | "on-demand";

interface NewsItem {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  read_time: string;
  published: boolean;
}

interface Program {
  id: number;
  time: string;
  title: string;
  host: string;
  type: string;
  day: string;
  sort_order: number;
}

interface OnDemandItem {
  id: number;
  title: string;
  artist: string;
  duration: string;
  type: string;
  published: boolean;
}

const CONTENT_TYPES = ["Sermon", "Music", "Teaching", "Talk Show", "Devotional", "Live"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const NEWS_CATEGORIES = ["Community", "Ministry", "World", "Local", "Events", "Faith"];

function api(route: string, method = "GET", body?: object, id?: number) {
  const token = localStorage.getItem(TOKEN_KEY);
  const url = `${ADMIN_URL}?route=${route}${id ? `&id=${id}` : ""}`;
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then((r) => r.json());
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [loginUser, setLoginUser] = useState("admin");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [tab, setTab] = useState<Tab>("news");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [onDemand, setOnDemand] = useState<OnDemandItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
  const [editingProgram, setEditingProgram] = useState<Partial<Program> | null>(null);
  const [editingOnDemand, setEditingOnDemand] = useState<Partial<OnDemandItem> | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const login = async () => {
    setLoginLoading(true);
    setLoginError("");
    const res = await fetch(`${ADMIN_URL}?route=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: loginUser, password: loginPass }),
    }).then((r) => r.json());
    setLoginLoading(false);
    if (res.token) {
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const load = async () => {
    if (!token) return;
    setLoading(true);
    const [n, p, o] = await Promise.all([
      api("news"),
      api("programs"),
      api("on-demand"),
    ]);
    setNews(n.news || []);
    setPrograms(p.programs || []);
    setOnDemand(o.on_demand || []);
    setLoading(false);
  };

  useEffect(() => { if (token) load(); }, [token]);

  // ── NEWS CRUD ──
  const saveNews = async () => {
    if (!editingNews) return;
    if (editingNews.id) {
      await api("news", "PUT", editingNews, editingNews.id);
      showToast("Article updated!");
    } else {
      await api("news", "POST", { ...editingNews, published: editingNews.published ?? true });
      showToast("Article added!");
    }
    setEditingNews(null);
    load();
  };

  const deleteNews = async (id: number) => {
    if (!confirm("Delete this article?")) return;
    await api("news", "DELETE", undefined, id);
    showToast("Article deleted");
    load();
  };

  // ── PROGRAMS CRUD ──
  const saveProgram = async () => {
    if (!editingProgram) return;
    if (editingProgram.id) {
      await api("programs", "PUT", editingProgram, editingProgram.id);
      showToast("Program updated!");
    } else {
      await api("programs", "POST", { ...editingProgram, sort_order: programs.length + 1 });
      showToast("Program added!");
    }
    setEditingProgram(null);
    load();
  };

  const deleteProgram = async (id: number) => {
    if (!confirm("Delete this program?")) return;
    await api("programs", "DELETE", undefined, id);
    showToast("Program deleted");
    load();
  };

  // ── ON DEMAND CRUD ──
  const saveOnDemand = async () => {
    if (!editingOnDemand) return;
    if (editingOnDemand.id) {
      await api("on-demand", "PUT", editingOnDemand, editingOnDemand.id);
      showToast("Track updated!");
    } else {
      await api("on-demand", "POST", { ...editingOnDemand, published: editingOnDemand.published ?? true });
      showToast("Track added!");
    }
    setEditingOnDemand(null);
    load();
  };

  const deleteOnDemand = async (id: number) => {
    if (!confirm("Delete this track?")) return;
    await api("on-demand", "DELETE", undefined, id);
    showToast("Track deleted");
    load();
  };

  // ── LOGIN SCREEN ──
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 font-nunito"
        style={{ background: "var(--gospel-navy)" }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", boxShadow: "0 0 30px rgba(245,166,35,0.4)" }}>
              <Icon name="Shield" size={24} />
            </div>
            <h1 className="font-playfair text-2xl font-bold" style={{ color: "var(--gospel-cream)" }}>Admin Panel</h1>
            <p className="text-sm mt-1" style={{ color: "var(--gospel-text)", opacity: 0.5 }}>24.7PraiseRadio</p>
          </div>

          <div className="rounded-2xl p-6 border space-y-4"
            style={{ background: "var(--gospel-navy-light)", borderColor: "rgba(245,166,35,0.2)" }}>
            <div>
              <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: "var(--gospel-text)", opacity: 0.6 }}>
                Username
              </label>
              <input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none text-sm"
                style={{ borderColor: "rgba(255,255,255,0.12)", color: "var(--gospel-cream)" }} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: "var(--gospel-text)", opacity: 0.6 }}>
                Password
              </label>
              <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                className="w-full px-4 py-3 rounded-xl border bg-transparent outline-none text-sm"
                style={{ borderColor: "rgba(255,255,255,0.12)", color: "var(--gospel-cream)" }} />
            </div>
            {loginError && (
              <p className="text-sm text-red-400">{loginError}</p>
            )}
            <button onClick={login} disabled={loginLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", color: "var(--gospel-navy)" }}>
              {loginLoading ? <Icon name="Loader" size={16} className="animate-spin" /> : <Icon name="LogIn" size={16} />}
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>
          <p className="text-center text-xs mt-4" style={{ color: "var(--gospel-text)", opacity: 0.35 }}>
            Default: admin / praise247
          </p>
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ──
  return (
    <div className="min-h-screen font-nunito" style={{ background: "var(--gospel-navy)" }}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-semibold animate-fade-in"
          style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", color: "var(--gospel-navy)" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ background: "rgba(6,14,36,0.95)", borderColor: "rgba(245,166,35,0.15)" }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)" }}>
              <Icon name="Radio" size={14} />
            </div>
            <span className="font-playfair font-bold text-sm" style={{ color: "var(--gospel-gold)" }}>
              24.7PraiseRadio
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full ml-1"
              style={{ background: "rgba(245,166,35,0.15)", color: "var(--gospel-gold)" }}>
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs flex items-center gap-1 hover:opacity-80 transition"
              style={{ color: "var(--gospel-text)", opacity: 0.6 }}>
              <Icon name="ExternalLink" size={13} />
              View Site
            </a>
            <button onClick={logout}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--gospel-text)" }}>
              <Icon name="LogOut" size={13} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: "Newspaper", label: "News Articles", count: news.length },
            { icon: "Calendar", label: "Programs", count: programs.length },
            { icon: "Music", label: "On-Demand", count: onDemand.length },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-2xl border"
              style={{ background: "var(--gospel-navy-light)", borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(245,166,35,0.12)" }}>
                  <Icon name={s.icon} fallback="Star" size={18} style={{ color: "var(--gospel-gold)" }} />
                </div>
                <div>
                  <div className="font-playfair text-2xl font-bold" style={{ color: "var(--gospel-cream)" }}>{s.count}</div>
                  <div className="text-xs" style={{ color: "var(--gospel-text)", opacity: 0.5 }}>{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
          style={{ background: "rgba(255,255,255,0.05)" }}>
          {(["news", "programs", "on-demand"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
              style={tab === t ? {
                background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)",
                color: "var(--gospel-navy)"
              } : {
                color: "var(--gospel-text)", opacity: 0.6
              }}>
              {t === "on-demand" ? "On-Demand" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Icon name="Loader" size={28} className="animate-spin" style={{ color: "var(--gospel-gold)" }} />
          </div>
        )}

        {/* ── NEWS TAB ── */}
        {!loading && tab === "news" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-xl font-bold" style={{ color: "var(--gospel-cream)" }}>News Articles</h2>
              <button onClick={() => setEditingNews({ published: true, category: "Community", read_time: "3 min read" })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", color: "var(--gospel-navy)" }}>
                <Icon name="Plus" size={15} /> Add Article
              </button>
            </div>

            <div className="space-y-3">
              {news.map((item) => (
                <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl border"
                  style={{ background: "rgba(22,40,96,0.4)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: "rgba(245,166,35,0.15)", color: "var(--gospel-gold)" }}>
                        {item.category}
                      </span>
                      {!item.published && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">Draft</span>
                      )}
                    </div>
                    <p className="font-semibold text-sm" style={{ color: "var(--gospel-cream)" }}>{item.title}</p>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--gospel-text)", opacity: 0.55 }}>{item.excerpt}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--gospel-text)", opacity: 0.4 }}>{item.date} · {item.read_time}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setEditingNews(item)}
                      className="p-2 rounded-lg hover:bg-white/10 transition"
                      style={{ color: "var(--gospel-gold)" }}>
                      <Icon name="Pencil" size={15} />
                    </button>
                    <button onClick={() => deleteNews(item.id)}
                      className="p-2 rounded-lg hover:bg-red-900/30 transition text-red-400">
                      <Icon name="Trash2" size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PROGRAMS TAB ── */}
        {!loading && tab === "programs" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-xl font-bold" style={{ color: "var(--gospel-cream)" }}>Program Schedule</h2>
              <button onClick={() => setEditingProgram({ day: "Sunday", type: "Music", sort_order: programs.length + 1 })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", color: "var(--gospel-navy)" }}>
                <Icon name="Plus" size={15} /> Add Program
              </button>
            </div>

            <div className="space-y-2">
              {programs.map((prog) => (
                <div key={prog.id} className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{ background: "rgba(22,40,96,0.4)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="w-16 flex-shrink-0">
                    <span className="text-sm font-bold" style={{ color: "var(--gospel-gold)" }}>{prog.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--gospel-cream)" }}>{prog.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--gospel-text)", opacity: 0.5 }}>{prog.host} · {prog.day}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300 flex-shrink-0">
                    {prog.type}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setEditingProgram(prog)}
                      className="p-2 rounded-lg hover:bg-white/10 transition"
                      style={{ color: "var(--gospel-gold)" }}>
                      <Icon name="Pencil" size={15} />
                    </button>
                    <button onClick={() => deleteProgram(prog.id)}
                      className="p-2 rounded-lg hover:bg-red-900/30 transition text-red-400">
                      <Icon name="Trash2" size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ON-DEMAND TAB ── */}
        {!loading && tab === "on-demand" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-playfair text-xl font-bold" style={{ color: "var(--gospel-cream)" }}>On-Demand Library</h2>
              <button onClick={() => setEditingOnDemand({ published: true, type: "Sermon" })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition hover:scale-105"
                style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", color: "var(--gospel-navy)" }}>
                <Icon name="Plus" size={15} /> Add Track
              </button>
            </div>

            <div className="space-y-3">
              {onDemand.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border"
                  style={{ background: "rgba(22,40,96,0.4)", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(245,166,35,0.12)", color: "var(--gospel-gold)" }}>
                    <Icon name="Music" size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: "var(--gospel-cream)" }}>{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--gospel-text)", opacity: 0.5 }}>{item.artist} · {item.duration}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300">{item.type}</span>
                    {!item.published && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">Draft</span>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setEditingOnDemand(item)}
                      className="p-2 rounded-lg hover:bg-white/10 transition"
                      style={{ color: "var(--gospel-gold)" }}>
                      <Icon name="Pencil" size={15} />
                    </button>
                    <button onClick={() => deleteOnDemand(item.id)}
                      className="p-2 rounded-lg hover:bg-red-900/30 transition text-red-400">
                      <Icon name="Trash2" size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── NEWS MODAL ── */}
      {editingNews && (
        <Modal title={editingNews.id ? "Edit Article" : "Add Article"} onClose={() => setEditingNews(null)} onSave={saveNews}>
          <Field label="Category">
            <select value={editingNews.category || ""} onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}>
              {NEWS_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Title">
            <input type="text" value={editingNews.title || ""} onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })} />
          </Field>
          <Field label="Excerpt">
            <textarea rows={3} value={editingNews.excerpt || ""} onChange={(e) => setEditingNews({ ...editingNews, excerpt: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date">
              <input type="text" placeholder="May 20, 2026" value={editingNews.date || ""} onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })} />
            </Field>
            <Field label="Read Time">
              <input type="text" placeholder="3 min read" value={editingNews.read_time || ""} onChange={(e) => setEditingNews({ ...editingNews, read_time: e.target.value })} />
            </Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editingNews.published ?? true} onChange={(e) => setEditingNews({ ...editingNews, published: e.target.checked })} />
            <span className="text-sm" style={{ color: "var(--gospel-text)" }}>Published</span>
          </label>
        </Modal>
      )}

      {/* ── PROGRAM MODAL ── */}
      {editingProgram && (
        <Modal title={editingProgram.id ? "Edit Program" : "Add Program"} onClose={() => setEditingProgram(null)} onSave={saveProgram}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Time">
              <input type="text" placeholder="7:00 PM" value={editingProgram.time || ""} onChange={(e) => setEditingProgram({ ...editingProgram, time: e.target.value })} />
            </Field>
            <Field label="Day">
              <select value={editingProgram.day || "Sunday"} onChange={(e) => setEditingProgram({ ...editingProgram, day: e.target.value })}>
                {DAYS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Program Title">
            <input type="text" value={editingProgram.title || ""} onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })} />
          </Field>
          <Field label="Host">
            <input type="text" value={editingProgram.host || ""} onChange={(e) => setEditingProgram({ ...editingProgram, host: e.target.value })} />
          </Field>
          <Field label="Type">
            <select value={editingProgram.type || "Music"} onChange={(e) => setEditingProgram({ ...editingProgram, type: e.target.value })}>
              {CONTENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </Modal>
      )}

      {/* ── ON-DEMAND MODAL ── */}
      {editingOnDemand && (
        <Modal title={editingOnDemand.id ? "Edit Track" : "Add Track"} onClose={() => setEditingOnDemand(null)} onSave={saveOnDemand}>
          <Field label="Title">
            <input type="text" value={editingOnDemand.title || ""} onChange={(e) => setEditingOnDemand({ ...editingOnDemand, title: e.target.value })} />
          </Field>
          <Field label="Artist / Speaker">
            <input type="text" value={editingOnDemand.artist || ""} onChange={(e) => setEditingOnDemand({ ...editingOnDemand, artist: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Duration">
              <input type="text" placeholder="48:22" value={editingOnDemand.duration || ""} onChange={(e) => setEditingOnDemand({ ...editingOnDemand, duration: e.target.value })} />
            </Field>
            <Field label="Type">
              <select value={editingOnDemand.type || "Sermon"} onChange={(e) => setEditingOnDemand({ ...editingOnDemand, type: e.target.value })}>
                {CONTENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editingOnDemand.published ?? true} onChange={(e) => setEditingOnDemand({ ...editingOnDemand, published: e.target.checked })} />
            <span className="text-sm" style={{ color: "var(--gospel-text)" }}>Published</span>
          </label>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose, onSave }: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-lg rounded-2xl border p-6 animate-scale-in"
        style={{ background: "var(--gospel-navy-light)", borderColor: "rgba(245,166,35,0.2)" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-playfair text-lg font-bold" style={{ color: "var(--gospel-cream)" }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition"
            style={{ color: "var(--gospel-text)" }}>
            <Icon name="X" size={18} />
          </button>
        </div>
        <div className="space-y-4">{children}</div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition hover:bg-white/5"
            style={{ borderColor: "rgba(255,255,255,0.1)", color: "var(--gospel-text)" }}>
            Cancel
          </button>
          <button onClick={onSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, var(--gospel-gold), #fde68a)", color: "var(--gospel-navy)" }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactElement }) {
  const inputStyle = {
    borderColor: "rgba(255,255,255,0.12)",
    color: "var(--gospel-cream)",
    background: "transparent",
  };
  const cls = "w-full px-3 py-2.5 rounded-xl border outline-none text-sm";
  const child = children as React.ReactElement<React.InputHTMLAttributes<HTMLElement>>;
  return (
    <div>
      <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: "var(--gospel-text)", opacity: 0.6 }}>
        {label}
      </label>
      {child.type === "textarea"
        ? <textarea {...(child.props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} className={cls} style={{ ...inputStyle, resize: "none" }} />
        : child.type === "select"
        ? <select {...(child.props as React.SelectHTMLAttributes<HTMLSelectElement>)} className={cls} style={{ ...inputStyle, background: "var(--gospel-navy-light)" }}>
            {(child.props as React.SelectHTMLAttributes<HTMLSelectElement> & { children?: React.ReactNode }).children}
          </select>
        : <input {...(child.props as React.InputHTMLAttributes<HTMLInputElement>)} className={cls} style={inputStyle} />
      }
    </div>
  );
}