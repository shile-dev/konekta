// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
export const T = {
  P:       "#3D1A8E",
  Pmid:    "#4E25A8",
  Plight:  "#6535C4",
  Pglow:   "rgba(61,26,142,0.18)",
  Psoft:   "#F0EBFF",
  Ptint:   "#F8F5FF",
  G:       "#B8860B",
  Glight:  "#D4A017",
  Gpale:   "#FEF7E0",
  Gbright: "#E8B84B",
  Gr:      "#1A6B4F",
  Grlight: "#22845F",
  Grpale:  "#E8F4EE",
  bg:      "#F7F5FF",
  card:    "#FFFFFF",
  text:    "#12091F",
  text2:   "#4A3F6B",
  text3:   "#9589B8",
  border:  "#E8E0F8",
  chip:    "#EDE8FA",
  red:     "#B83232",
  redpale: "#FCEAEA",
};

export const FONT = "'Outfit', 'DM Sans', system-ui, sans-serif";
export const MONO = "'DM Mono', 'Courier New', monospace";

// ─── SHARED STYLE HELPERS ────────────────────────────────────────────────────
export const card       = (ex = {}) => ({ background: T.card, borderRadius: 20, padding: "18px 20px", boxShadow: "0 2px 16px rgba(61,26,142,0.06)", ...ex });
export const inputSt    = (ex = {}) => ({ width: "100%", border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "12px 16px", fontFamily: FONT, fontSize: 14, color: T.text, outline: "none", background: T.bg, boxSizing: "border-box", transition: "border-color 0.2s", ...ex });
export const primaryBtn = (ex = {}) => ({ border: "none", borderRadius: 14, padding: "15px 0", width: "100%", fontFamily: FONT, fontSize: 15, fontWeight: 700, cursor: "pointer", background: `linear-gradient(135deg, ${T.P} 0%, ${T.Plight} 100%)`, color: "#fff", boxShadow: `0 6px 20px ${T.Pglow}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...ex });
export const goldBtn    = (ex = {}) => ({ border: "none", borderRadius: 14, padding: "15px 0", width: "100%", fontFamily: FONT, fontSize: 15, fontWeight: 700, cursor: "pointer", background: `linear-gradient(135deg, ${T.G} 0%, ${T.Glight} 100%)`, color: "#fff", boxShadow: "0 6px 20px rgba(184,134,11,0.28)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...ex });
export const ghostBtn   = (ex = {}) => ({ border: "none", borderRadius: 14, padding: "15px 0", width: "100%", fontFamily: FONT, fontSize: 15, fontWeight: 700, cursor: "pointer", background: T.chip, color: T.text2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, ...ex });

// ─── FORMATTERS ──────────────────────────────────────────────────────────────
export const fmt = (n) =>
  "₦" + (parseFloat(n) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });

export function timeAgo(iso) {
  const d = Date.now() - new Date(iso).getTime();
  if (d < 60000)    return "just now";
  if (d < 3600000)  return Math.floor(d / 60000)   + "m ago";
  if (d < 86400000) return Math.floor(d / 3600000) + "h ago";
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export function greet() {
  const h = new Date().getHours();
  return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
}

// ─── LOCALSTORAGE ────────────────────────────────────────────────────────────
const K = { bal: "knk_bal", tx: "knk_tx", benes: "knk_benes" };

export function initStorage() {
  if (!localStorage.getItem(K.bal)) {
    localStorage.setItem(K.bal, "15000");
    localStorage.setItem(K.tx, JSON.stringify([]));
    localStorage.setItem(K.benes, JSON.stringify([
      { id: "b1", name: "Ope" },
      { id: "b2", name: "Destiny" },
      { id: "b3", name: "Shile" },
    ]));
  }
}

export const loadBal   = () => parseFloat(localStorage.getItem(K.bal)   || "15000");
export const loadTx    = () => JSON.parse(localStorage.getItem(K.tx)    || "[]");
export const loadBenes = () => JSON.parse(localStorage.getItem(K.benes) || "[]");
export const saveBal   = (v) => localStorage.setItem(K.bal,   String(v));
export const saveTx    = (v) => localStorage.setItem(K.tx,    JSON.stringify(v));
export const saveBenes = (v) => localStorage.setItem(K.benes, JSON.stringify(v));

// ─── CLAUDE API ──────────────────────────────────────────────────────────────
const SYS = `You are Konekta's offline-first AI wallet assistant for Nigerian users.
Respond in JSON only. No extra text.

SEND ("Send 2k to Ope", "Abeg send 500 give Shile"):
{"action":"send","amount":2000,"recipient":"Ope","message":"Transferring ₦2,000 to Ope..."}
Convert: 2k=2000, 1.5k=1500.

BALANCE ("How much I get?", "Wetin remain?"):
{"action":"balance","message":"Your balance is ₦[BAL]."}

SUMMARY ("How much I don spend?", "Wetin I don send?"):
{"action":"summary","message":"[friendly summary]"}

RECEIVE ("Receive money", "I wan collect"):
{"action":"navigate","destination":"receive","message":"Opening receive screen 📥"}

HISTORY: {"action":"navigate","destination":"history","message":"Here is your history"}

BLUETOOTH ("Connect BT", "Scan nearby"): {"action":"bluetooth","message":"Opening Bluetooth scanner"}

UNCLEAR: {"action":"clarify","message":"[clarifying question in user's language]"}`;

export async function askKonekta(text, balance, transactions) {
  const ctx = `Balance: ₦${balance}. Transactions: ${JSON.stringify(transactions.slice(0, 8))}`;
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: SYS,
        messages: [{ role: "user", content: text + "\n\n" + ctx }],
      }),
    });
    const data = await res.json();
    const raw = data.content?.[0]?.text || "{}";
    try { return JSON.parse(raw); }
    catch { return { action: "clarify", message: raw }; }
  } catch {
    // Offline fallback
    const lo = text.toLowerCase();
    const m = lo.match(/send\s+(\d+\.?\d*k?)\s+(?:to|give)\s+(\w+)/i);
    if (m) {
      const a = m[1].toLowerCase().includes("k") ? parseFloat(m[1]) * 1000 : parseFloat(m[1]);
      return { action: "send", amount: a, recipient: m[2], message: `Offline: sending ${fmt(a)} to ${m[2]}` };
    }
    if (lo.includes("balance") || lo.includes("how much") || lo.includes("wetin remain"))
      return { action: "balance", message: `Your balance is ₦${balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}` };
    return { action: "clarify", message: "No network. Try: 'Send 2k to Ope' or 'Check balance'" };
  }
}
