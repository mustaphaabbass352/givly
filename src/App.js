import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── PASTE YOUR SUPABASE CREDENTIALS HERE ───────────────────────────────────
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
// ────────────────────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CURRENCIES = [
  { code: "GHS", symbol: "₵",   name: "Ghanaian Cedi",     flag: "🇬🇭" },
  { code: "USD", symbol: "$",   name: "US Dollar",          flag: "🇺🇸" },
  { code: "EUR", symbol: "€",   name: "Euro",               flag: "🇪🇺" },
  { code: "GBP", symbol: "£",   name: "British Pound",      flag: "🇬🇧" },
  { code: "NGN", symbol: "₦",   name: "Nigerian Naira",     flag: "🇳🇬" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling",    flag: "🇰🇪" },
  { code: "ZAR", symbol: "R",   name: "South African Rand", flag: "🇿🇦" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar",    flag: "🇨🇦" },
  { code: "AUD", symbol: "A$",  name: "Australian Dollar",  flag: "🇦🇺" },
  { code: "JPY", symbol: "¥",   name: "Japanese Yen",       flag: "🇯🇵" },
  { code: "INR", symbol: "₹",   name: "Indian Rupee",       flag: "🇮🇳" },
  { code: "EGP", symbol: "E£",  name: "Egyptian Pound",     flag: "🇪🇬" },
];

const CAMPAIGNS = [
  { id: 1, title: "Gaza Emergency Relief", org: "UNRWA", category: "Crisis",
    description: "UNRWA delivers lifesaving food, healthcare, shelter, and education to 5 million Palestine refugees. Active on the ground in Gaza right now.",
    emoji: "🏥", color: "#C0392B", bg: "#FADBD8", donateUrl: "https://donate.unrwa.org/int/en/general", rating: "UN Agency", tag: "URGENT" },
  { id: 2, title: "Gaza Children's Medical Aid", org: "PCRF", category: "Crisis",
    description: "The Palestine Children's Relief Fund provides urgent medical care, food, water, and trauma counseling to children in Gaza. 12 consecutive 4-star Charity Navigator ratings.",
    emoji: "👶", color: "#E76F51", bg: "#FAE0D8", donateUrl: "https://www.pcrf.net/", rating: "4-Star Charity Navigator", tag: "URGENT" },
  { id: 3, title: "Ukraine Humanitarian Crisis", org: "International Rescue Committee", category: "Crisis",
    description: "The IRC provides emergency relief, healthcare, clean water, and support for millions of Ukrainians displaced by conflict. Operating for 90+ years.",
    emoji: "🇺🇦", color: "#1A5276", bg: "#D6EAF8", donateUrl: "https://www.rescue.org/", rating: "4-Star Charity Navigator", tag: "ONGOING" },
  { id: 4, title: "Sudan Emergency Response", org: "Islamic Relief USA", category: "Crisis",
    description: "Over 14.3 million people in Sudan need urgent humanitarian assistance. Islamic Relief delivers food, clean water, and medical aid to those most in need.",
    emoji: "🌍", color: "#2D6A4F", bg: "#D8F3DC", donateUrl: "https://irusa.org/middle-east/sudan/", rating: "4-Star Charity Navigator", tag: "URGENT" },
  { id: 5, title: "Doctors Without Borders", org: "MSF", category: "Medical",
    description: "Médecins Sans Frontières delivers emergency medical care in Gaza, Sudan, Ukraine, and 70+ countries. 98% score from Charity Navigator.",
    emoji: "⚕️", color: "#E74C3C", bg: "#FADBD8", donateUrl: "https://www.doctorswithoutborders.org/", rating: "98% Charity Navigator", tag: "GLOBAL" },
  { id: 6, title: "UN Crisis Relief — Gaza", org: "United Nations", category: "Crisis",
    description: "The UN's official crisis relief fund for Gaza connects donors directly to on-the-ground UN operations providing food, shelter, and emergency services.",
    emoji: "🇺🇳", color: "#2E86C1", bg: "#D6EAF8", donateUrl: "https://crisisrelief.un.org/opt-crisis", rating: "UN Official", tag: "URGENT" },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function useCurrency() {
  const [currency, setCurrency] = useState("GHS");
  const cur = CURRENCIES.find(c => c.code === currency);
  return { currency, setCurrency, sym: cur.symbol, curName: cur.name, curFlag: cur.flag };
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

// ─── UI COMPONENTS ───────────────────────────────────────────────────────────

function ProgressBar({ pct = 0, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(Math.min(pct, 100)), 200); }, [pct]);
  return (
    <div style={{ background: "#e9ecef", borderRadius: 99, height: 8, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${width}%`, background: color, borderRadius: 99, transition: "width 1.2s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

function CurrencySelector({ currency, setCurrency }) {
  const [open, setOpen] = useState(false);
  const cur = CURRENCIES.find(c => c.code === currency);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 6, padding: "7px 12px",
        border: "2px solid #e9ecef", borderRadius: 10, background: "#fff",
        cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#1a1a2e",
      }}>
        {cur.flag} {cur.symbol} {cur.code} <span style={{ fontSize: 10, color: "#aaa" }}>▼</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 150 }} />
          <div style={{
            position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#fff",
            border: "1px solid #e9ecef", borderRadius: 14, boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
            zIndex: 200, minWidth: 230, maxHeight: 300, overflowY: "auto", padding: "6px 0",
          }}>
            {CURRENCIES.map(c => (
              <button key={c.code} onClick={() => { setCurrency(c.code); setOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "10px 16px", border: "none", background: currency === c.code ? "#f5f5f5" : "transparent",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                <span style={{ fontSize: 18 }}>{c.flag}</span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>{c.symbol} {c.code}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{c.name}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Avatar({ user, size = 36 }) {
  return user?.user_metadata?.avatar_url
    ? <img src={user.user_metadata.avatar_url} alt="avatar"
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "2px solid #e9ecef" }} />
    : <div style={{
        width: size, height: size, borderRadius: "50%", background: "#1a1a2e",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 800, fontSize: size * 0.4,
      }}>{(user?.user_metadata?.full_name || user?.email || "?")[0].toUpperCase()}</div>;
}

function CampaignCard({ c, sym, user, onLogDonation }) {
  const [hovered, setHovered] = useState(false);
  const tagColors = { URGENT: "#C0392B", ONGOING: "#1A5276", GLOBAL: "#2D6A4F" };

  const handleDonate = () => {
    if (user) onLogDonation(c);
    window.open(c.donateUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.13)" : "0 4px 24px rgba(0,0,0,0.07)",
        transition: "box-shadow 0.3s, transform 0.3s",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ background: c.bg, height: 110, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50 }}>
        {c.emoji}
        {c.tag && (
          <span style={{
            position: "absolute", top: 12, right: 12, background: tagColors[c.tag], color: "#fff",
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5, padding: "3px 9px", borderRadius: 99, textTransform: "uppercase",
          }}>{c.tag}</span>
        )}
      </div>
      <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: c.color, background: c.bg, padding: "3px 9px", borderRadius: 99 }}>{c.category}</span>
          <span style={{ fontSize: 10, color: "#888", fontWeight: 600 }}>✅ {c.rating}</span>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, margin: "6px 0 2px", color: "#1a1a2e" }}>{c.title}</h3>
        <div style={{ fontSize: 11, color: c.color, fontWeight: 700, marginBottom: 8 }}>{c.org}</div>
        <p style={{ fontSize: 12.5, color: "#666", lineHeight: 1.65, margin: "0 0 14px", flex: 1 }}>{c.description}</p>
        <ProgressBar pct={0} color={c.color} />
        <div style={{ marginTop: 8, marginBottom: 16, fontSize: 11, color: "#bbb", textAlign: "center" }}>Stats tracked on charity's site</div>
        <button
          onClick={handleDonate}
          style={{
            display: "block", textAlign: "center", width: "100%", padding: "13px 0",
            background: c.color, color: "#fff", border: "none", borderRadius: 12,
            fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700,
            cursor: "pointer", letterSpacing: 0.5, transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
        >
          Donate on {c.org} ↗
        </button>
        {!user && <div style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 8 }}>Sign in to track your donations</div>}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ──────────────────────────────────────────────────────────────

function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213E 100%)", padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 28, padding: "52px 44px", maxWidth: 420, width: "100%",
        textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        animation: "pop 0.5s cubic-bezier(.34,1.56,.64,1)",
      }}>
        <div style={{
          width: 64, height: 64, background: "#1a1a2e", borderRadius: 18,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, margin: "0 auto 20px",
        }}>💚</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: "#1a1a2e", marginBottom: 8 }}>
          Givly
        </h1>
        <p style={{ color: "#888", fontSize: 14, lineHeight: 1.7, marginBottom: 36 }}>
          Donate to real humanitarian causes in Gaza, Ukraine, Sudan & beyond. Track your giving history in one place.
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%", padding: "14px 20px", border: "2px solid #e9ecef",
            borderRadius: 14, background: "#fff", cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            fontSize: 15, fontWeight: 700, color: "#1a1a2e", fontFamily: "inherit",
            transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"; }}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <div style={{ marginTop: 28, padding: "16px", background: "#FFF9E6", borderRadius: 12, border: "1px solid #F4D03F" }}>
          <p style={{ fontSize: 12, color: "#7D6608", lineHeight: 1.6 }}>
            🔒 Givly uses Google Sign-In via Supabase. We never store passwords. Donations go directly to each charity's website.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ────────────────────────────────────────────────────────────

function ProfilePage({ user, history, sym, currency }) {
  const campaignCounts = {};
  history.forEach(h => {
    campaignCounts[h.campaign_title] = (campaignCounts[h.campaign_title] || 0) + 1;
  });
  const favCampaign = Object.entries(campaignCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Profile Card */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e, #16213E)", borderRadius: 24,
        padding: "36px 32px", marginBottom: 24, color: "#fff",
        display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
      }}>
        <Avatar user={user} size={80} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
            {user.user_metadata?.full_name || "Donor"}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>{user.email}</div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { val: history.length, label: "Campaigns Supported" },
              { val: [...new Set(history.map(h => h.campaign_id))].length, label: "Unique Causes" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Favourite cause */}
      {favCampaign && (
        <div style={{
          background: "#D8F3DC", borderRadius: 16, padding: "16px 20px", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 28 }}>⭐</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>Most supported cause</div>
            <div style={{ fontSize: 13, color: "#2D6A4F" }}>{favCampaign[0]} — supported {favCampaign[1]}×</div>
          </div>
        </div>
      )}

      {/* Donation History */}
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Donation History</h3>
      {history.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 20, padding: "48px 32px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💌</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No donations yet</div>
          <div style={{ color: "#888", fontSize: 14 }}>Click "Donate" on any campaign to get started.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {history.map((h, i) => {
            const camp = CAMPAIGNS.find(c => c.id === h.campaign_id);
            return (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: "16px 20px",
                display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}>
                <span style={{ fontSize: 28 }}>{camp?.emoji || "💚"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>{h.campaign_title}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{h.org} · {timeAgo(h.donated_at)}</div>
                </div>
                <a href={camp?.donateUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: camp?.color || "#1a1a2e", fontWeight: 700, textDecoration: "none",
                    border: `1px solid ${camp?.color || "#1a1a2e"}`, padding: "4px 10px", borderRadius: 8 }}>
                  Donate again ↗
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("campaigns");
  const [filter, setFilter] = useState("All");
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { currency, setCurrency, sym, curName, curFlag } = useCurrency();

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load history when user changes
  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    const { data } = await supabase
      .from("donation_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("donated_at", { ascending: false });
    setHistory(data || []);
  };

  const logDonation = async (campaign) => {
    if (!user) return;
    await supabase.from("donation_logs").insert({
      user_id: user.id,
      campaign_id: campaign.id,
      campaign_title: campaign.title,
      org: campaign.org,
      currency: currency,
      donated_at: new Date().toISOString(),
    });
    fetchHistory();
    setToast(campaign.title);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setHistory([]);
    setProfileOpen(false);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f8fc" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>💚</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#1a1a2e" }}>Loading Givly...</div>
      </div>
    </div>
  );

  if (!user) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; }
        @keyframes pop { from { transform: scale(0.85); opacity: 0 } to { transform: scale(1); opacity: 1 } }
      `}</style>
      <LoginPage />
    </>
  );

  const categories = ["All", "Crisis", "Medical"];
  const filtered = filter === "All" ? CAMPAIGNS : CAMPAIGNS.filter(c => c.category === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #f7f8fc; color: #1a1a2e; }
        @keyframes pop { from { transform: scale(0.85); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes fadeUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        ::-webkit-scrollbar { width: 6px }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 99px }
      `}</style>

      {/* NAV */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #efefef", padding: "0 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64, position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, background: "#1a1a2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💚</div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 20 }}>Givly</span>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {["campaigns", "dashboard"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "7px 14px", borderRadius: 8, border: "none",
              background: tab === t ? "#1a1a2e" : "transparent",
              color: tab === t ? "#fff" : "#777",
              fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CurrencySelector currency={currency} setCurrency={setCurrency} />
          {/* User avatar + dropdown */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setProfileOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar user={user} size={36} />
              <span style={{ fontSize: 10, color: "#aaa" }}>▼</span>
            </button>
            {profileOpen && (
              <>
                <div onClick={() => setProfileOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 150 }} />
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff",
                  border: "1px solid #e9ecef", borderRadius: 16, boxShadow: "0 16px 48px rgba(0,0,0,0.13)",
                  zIndex: 200, minWidth: 220, overflow: "hidden", padding: "8px 0",
                }}>
                  <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{user.user_metadata?.full_name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{user.email}</div>
                  </div>
                  <button onClick={() => { setTab("profile"); setProfileOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "11px 16px", border: "none", background: "transparent",
                    cursor: "pointer", fontFamily: "inherit", fontSize: 14, color: "#1a1a2e",
                  }}>👤 My Profile & History</button>
                  <button onClick={handleSignOut} style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "11px 16px", border: "none", background: "transparent",
                    cursor: "pointer", fontFamily: "inherit", fontSize: 14, color: "#C0392B",
                  }}>🚪 Sign Out</button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>

        {/* CAMPAIGNS */}
        {tab === "campaigns" && (
          <>
            <div style={{
              background: "#FFF9E6", border: "1px solid #F4D03F", borderRadius: 12,
              padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
              <div style={{ fontSize: 13, color: "#7D6608", lineHeight: 1.6 }}>
                <strong>Real verified charities only.</strong> Clicking "Donate" takes you directly to each organization's official website. Givly does not collect any donations. Sign-in lets you track which causes you've supported.
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213E 100%)",
              borderRadius: 24, padding: "44px 40px", marginBottom: 28, color: "#fff", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, background: "rgba(255,255,255,0.03)", borderRadius: "50%" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#90E0EF", marginBottom: 10, textTransform: "uppercase" }}>Real Crises · Real Organizations · Real Impact</div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
                  Welcome back, {user.user_metadata?.full_name?.split(" ")[0]} 👋<br />
                  <span style={{ color: "#90E0EF" }}>Every {sym} Matters</span>
                </h1>
                <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 20, fontSize: 14, maxWidth: 520 }}>
                  Donate in {curFlag} {curName} or any of 12 currencies. Your giving history is saved to your profile automatically.
                </p>
                <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                  {[["6", "Verified Orgs"], [history.length.toString(), "Your Donations"], ["12", "Currencies"]].map(([val, label]) => (
                    <div key={label}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900 }}>{val}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)} style={{
                  padding: "8px 18px", borderRadius: 99, border: "2px solid",
                  borderColor: filter === c ? "#1a1a2e" : "#e9ecef",
                  background: filter === c ? "#1a1a2e" : "#fff",
                  color: filter === c ? "#fff" : "#555",
                  fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                }}>{c}</button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
              {filtered.map((c, i) => (
                <div key={c.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
                  <CampaignCard c={c} sym={sym} user={user} onLogDonation={logDonation} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, marginBottom: 6 }}>Dashboard</h2>
            <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Your giving activity and campaign overview.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Your Donations", val: history.length.toString(), icon: "💚", color: "#2D6A4F", bg: "#D8F3DC" },
                { label: "Causes Supported", val: [...new Set(history.map(h => h.campaign_id))].length.toString(), icon: "🌍", color: "#00B4D8", bg: "#CAF0F8" },
                { label: "Active Campaigns", val: "6", icon: "📢", color: "#F4A261", bg: "#FDEBD0" },
                { label: "Currencies", val: "12", icon: "💱", color: "#9B5DE5", bg: "#EDE7F6" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 18, padding: "22px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: "#999" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>All Campaigns</h3>
            <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              {CAMPAIGNS.map((c, i) => (
                <div key={c.id} style={{ marginBottom: i < CAMPAIGNS.length - 1 ? 24 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{c.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{c.title}</span>
                      <span style={{ fontSize: 10, background: c.bg, color: c.color, padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>{c.org}</span>
                    </div>
                    <a href={c.donateUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: c.color, fontWeight: 700, textDecoration: "none", border: `1px solid ${c.color}`, padding: "4px 12px", borderRadius: 8 }}>
                      Donate ↗
                    </a>
                  </div>
                  <ProgressBar pct={0} color={c.color} />
                  <div style={{ fontSize: 11, color: "#bbb", marginTop: 5 }}>
                    {history.filter(h => h.campaign_id === c.id).length > 0
                      ? `✅ You've supported this ${history.filter(h => h.campaign_id === c.id).length}×`
                      : "You haven't donated to this yet"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <ProfilePage user={user} history={history} sym={sym} currency={currency} />
        )}
      </main>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, background: "#1a1a2e", color: "#fff",
          borderRadius: 16, padding: "16px 20px", display: "flex", gap: 12, alignItems: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)", zIndex: 2000,
          animation: "slideIn 0.4s cubic-bezier(.34,1.56,.64,1)",
        }}>
          <span style={{ fontSize: 26 }}>🎉</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Donation logged!</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{toast} added to your history</div>
          </div>
        </div>
      )}
    </>
  );
}
