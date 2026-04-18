import { useState, useEffect } from "react";
import {
  Send, ArrowDownToLine, Clock, Bluetooth, Sparkles,
  Plus, ArrowUpRight, ChevronLeft, WifiOff, Shield, Zap, CheckCircle, Bot,
} from "lucide-react";
import { T, FONT, MONO, card, inputSt, primaryBtn, goldBtn, fmt, greet, askKonekta } from "./utils";
import { KonektaMark, TxRow } from "./components";

// lucide doesn't export Signal in all versions — safe inline fallback
function SignalIcon({ size = 11, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="20" x2="2" y2="14"/><line x1="7" y1="20" x2="7" y2="9"/>
      <line x1="12" y1="20" x2="12" y2="4"/><line x1="17" y1="20" x2="17" y2="9"/>
      <line x1="22" y1="20" x2="22" y2="14"/>
    </svg>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
export function HomeScreen({ balance, transactions, beneficiaries, onNavigate, onUseBeneficiary, onAICommand, onOpenBluetooth }) {
  const [aiText,    setAiText]    = useState("");
  const [aiResp,    setAiResp]    = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  async function runAI() {
    const text = aiText.trim();
    if (!text) return;
    setAiLoading(true); setAiResp(null); setAiText("");
    const r = await askKonekta(text, balance, transactions);
    setAiLoading(false);
    if      (r.action === "send")      { setAiResp({ type: "info", text: r.message }); onAICommand(r); }
    else if (r.action === "balance")   { setAiResp({ type: "success", text: r.message.replace("[BAL]", balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })) }); }
    else if (r.action === "navigate")  { setAiResp({ type: "info", text: r.message }); setTimeout(() => onNavigate(r.destination), 700); }
    else if (r.action === "bluetooth") { setAiResp({ type: "info", text: r.message }); setTimeout(() => onOpenBluetooth(), 500); }
    else                               { setAiResp({ type: r.action === "summary" ? "success" : "info", text: r.message }); }
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingBottom: 100 }}>

      {/* ── HEADER ── */}
      <div style={{
        background: `linear-gradient(150deg, #1A0A4A 0%, #2D1280 28%, ${T.P} 58%, #5228B8 78%, #6535C4 100%)`,
        padding: "52px 24px 64px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,134,11,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(101,53,196,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1.5, background: `linear-gradient(90deg, transparent 0%, ${T.G}55 35%, ${T.Gbright}88 50%, ${T.G}55 65%, transparent 100%)`, pointerEvents: "none" }} />

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <KonektaMark size={40} bg="rgba(255,255,255,0.1)" />
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 1 }}>{greet()}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Tayo</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onOpenBluetooth} title="Bluetooth Transfer"
              style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(184,134,11,0.18)", border: "1px solid rgba(232,184,75,0.45)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(184,134,11,0.2)" }}>
              <Bluetooth size={17} color={T.Gbright} strokeWidth={2} />
            </button>
            <button title="Notifications"
              style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <div style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: T.Gbright, border: "1.5px solid rgba(61,26,142,0.8)" }} />
            </button>
          </div>
        </div>

        {/* Balance */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>Total Balance</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 14 }}>
            <span style={{ fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: MONO }}>₦</span>
            <span style={{ fontSize: 42, fontWeight: 900, color: "#fff", letterSpacing: "-2px", fontFamily: MONO }}>
              {(balance || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              [<SignalIcon size={11} />, "Offline Ready"],
              [<Shield     size={11} />, "Secure"],
              [<Zap        size={11} />, "AI-Powered"],
            ].map(([icon, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.09)", borderRadius: 20, padding: "4px 10px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{icon}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, padding: "0 20px", marginTop: -26, position: "relative", zIndex: 2 }}>
        {[
          { Icon: Send,            label: "Send",    bg: T.Psoft,   iconColor: T.P,    screen: "send" },
          { Icon: ArrowDownToLine, label: "Receive", bg: T.Gpale,   iconColor: T.G,    screen: "receive" },
          { Icon: Bluetooth,       label: "BT Link", bg: T.Grpale,  iconColor: T.Gr,   screen: "bt" },
          { Icon: Clock,           label: "History", bg: "#F0EBFF", iconColor: T.Pmid, screen: "history" },
        ].map(({ Icon, label, bg, iconColor, screen }) => (
          <button key={label} onClick={() => screen === "bt" ? onOpenBluetooth() : onNavigate(screen)}
            style={{ background: T.card, border: "none", borderRadius: 16, padding: "14px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxShadow: "0 2px 14px rgba(61,26,142,0.08)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={19} color={iconColor} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.text2 }}>{label}</span>
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 20px 0" }}>
        {/* ── AI BOX ── */}
        <div style={{ ...card({ marginBottom: 22, border: `1.5px solid ${T.border}` }) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Bot size={16} color={T.P} strokeWidth={1.8} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.P, textTransform: "uppercase", letterSpacing: 0.6 }}>Konekta AI</span>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.G, marginLeft: "auto", animation: "gpulse 2s infinite" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runAI()}
              placeholder='Try: "Send 2k to Ope" · "Wetin I don spend?"'
              style={{ ...inputSt({ flex: 1, fontSize: 13 }) }}
            />
            <button onClick={runAI} disabled={aiLoading}
              style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${T.P},${T.Plight})`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: aiLoading ? 0.6 : 1 }}>
              {aiLoading
                ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                : <Sparkles size={17} color="#fff" />}
            </button>
          </div>
          {aiLoading && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10 }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: T.P, opacity: 0.4, animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
              <span style={{ fontSize: 11, color: T.text3, marginLeft: 4 }}>Thinking...</span>
            </div>
          )}
          {aiResp && (
            <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 10, background: aiResp.type === "success" ? T.Grpale : T.Psoft, fontSize: 13, color: aiResp.type === "success" ? T.Gr : T.P, fontWeight: 500, lineHeight: 1.5 }}>
              {aiResp.text}
            </div>
          )}
        </div>

        {/* ── BENEFICIARIES ── */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: T.text }}>Beneficiaries</span>
            <button onClick={() => onNavigate("addBen")} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 13, color: T.P, fontWeight: 700, fontFamily: FONT, display: "flex", alignItems: "center", gap: 4 }}>
              <Plus size={14} /> Add
            </button>
          </div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
            {beneficiaries.map((b, i) => {
              const gradients = [
                `linear-gradient(135deg, ${T.P} 0%, #7B3FD8 60%, ${T.Gbright}55 100%)`,
                `linear-gradient(145deg, #5228B8 0%, ${T.Plight} 55%, rgba(184,134,11,0.6) 100%)`,
                `linear-gradient(120deg, #2A1260 0%, ${T.P} 50%, #8B5CF6 100%)`,
                `linear-gradient(150deg, ${T.Pmid} 0%, #6D28D9 60%, ${T.G}66 100%)`,
              ];
              return (
                <div key={b.id} onClick={() => onUseBeneficiary(b.name)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", flexShrink: 0 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: gradients[i % gradients.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff", border: `2.5px solid ${T.card}`, boxShadow: `0 3px 14px ${T.Pglow}, 0 0 0 1px rgba(184,134,11,0.15)` }}>
                    {b.name[0].toUpperCase()}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.text2 }}>{b.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RECENT ── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: T.text }}>Recent</span>
            <button onClick={() => onNavigate("history")} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 13, color: T.P, fontWeight: 700, fontFamily: FONT }}>See All</button>
          </div>
          {transactions.length === 0
            ? <div style={{ textAlign: "center", padding: "32px 0" }}>
                <ArrowUpRight size={32} color={T.border} style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: T.text3, fontWeight: 500 }}>No transactions yet</div>
              </div>
            : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {transactions.slice(0, 3).map((tx) => <TxRow key={tx.id} tx={tx} />)}
              </div>}
        </div>
      </div>

      <style>{`
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes gpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }
      `}</style>
    </div>
  );
}

// ─── SEND SCREEN ─────────────────────────────────────────────────────────────
export function SendScreen({ balance, beneficiaries, initialRecipient, onBack, onSend }) {
  const [recipient, setRecipient] = useState(initialRecipient || "");
  const [amount,    setAmount]    = useState("");
  const [note,      setNote]      = useState("");
  const [selBene,   setSelBene]   = useState(initialRecipient || null);

  useEffect(() => {
    setRecipient(initialRecipient || "");
    setSelBene(initialRecipient || null);
  }, [initialRecipient]);

  function submit() {
    const amt = parseFloat(amount);
    if (!recipient.trim() || !amt || amt <= 0 || amt > balance) return;
    onSend({ name: recipient.trim(), amount: amt, note });
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingBottom: 32 }}>
      <div style={{ background: T.card, padding: "52px 20px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${T.border}` }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: T.chip, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={20} color={T.text} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 800, color: T.text }}>Send Money</span>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 12, color: T.text3, marginBottom: 16, fontWeight: 500 }}>
          Available: <span style={{ color: T.P, fontWeight: 800 }}>{fmt(balance)}</span>
        </div>

        <div style={{ ...card({ marginBottom: 14 }) }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Saved Contacts</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
            {beneficiaries.map((b) => (
              <button key={b.id} onClick={() => { setSelBene(b.name); setRecipient(b.name); }}
                style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${selBene === b.name ? T.P : T.border}`, background: selBene === b.name ? T.P : T.bg, color: selBene === b.name ? "#fff" : T.text2, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}>
                {b.name}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Recipient</div>
          <input value={recipient} onChange={(e) => { setRecipient(e.target.value); setSelBene(null); }} placeholder="Enter name" style={inputSt()} />
        </div>

        <div style={{ ...card({ marginBottom: 14 }) }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Amount</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 20, fontWeight: 800, color: T.P }}>₦</span>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="0.00"
              style={{ ...inputSt({ paddingLeft: 32, fontSize: 26, fontWeight: 800, color: T.P, fontFamily: MONO }) }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {[1000, 2000, 5000, 10000].map((v) => (
              <button key={v} onClick={() => setAmount(String(v))}
                style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${T.border}`, background: T.bg, fontFamily: FONT, fontSize: 12, fontWeight: 700, color: T.P, cursor: "pointer" }}>
                ₦{v >= 1000 ? v / 1000 + "k" : v}
              </button>
            ))}
          </div>
        </div>

        <div style={{ ...card({ marginBottom: 20 }) }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Note (optional)</div>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What's this for?" style={inputSt()} />
        </div>

        <button onClick={submit} style={primaryBtn()}>
          <Send size={17} /> Send Money
        </button>
      </div>
    </div>
  );
}

// ─── RECEIVE SCREEN ──────────────────────────────────────────────────────────
export function ReceiveScreen({ onBack, onSimReceive }) {
  const [reqAmt, setReqAmt] = useState("");
  const [copied, setCopied] = useState(false);

  function copyTag() {
    navigator.clipboard.writeText("@tayo.konekta").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingBottom: 32 }}>
      <div style={{ background: T.card, padding: "52px 20px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${T.border}` }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: T.chip, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={20} color={T.text} />
        </button>
        <span style={{ fontSize: 17, fontWeight: 800, color: T.text }}>Receive Money</span>
      </div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ ...card({ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }) }}>
          {/* QR mock */}
          <div style={{ width: 180, height: 180, borderRadius: 20, background: `linear-gradient(145deg,${T.P},${T.Plight})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            {[{ t: "12px", l: "12px", bw: "3px 0 0 3px" }, { t: "12px", r: "12px", bw: "3px 3px 0 0" }, { b: "12px", l: "12px", bw: "0 0 3px 3px" }, { b: "12px", r: "12px", bw: "0 3px 3px 0" }].map((c, i) => (
              <div key={i} style={{ position: "absolute", width: 18, height: 18, borderColor: T.Gbright, borderStyle: "solid", borderWidth: c.bw, top: c.t, bottom: c.b, left: c.l, right: c.r }} />
            ))}
            <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 9, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, letterSpacing: 1 }}>
              KONEKTA<br />██ ░█ ██<br />░█ ██ ░░<br />██ ░░ ██<br />SCAN ME
            </div>
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text, textAlign: "center" }}>Tayo Adeyemi</div>
            <div style={{ fontSize: 13, color: T.text3, textAlign: "center", fontFamily: MONO, marginTop: 4 }}>@tayo.konekta</div>
          </div>
          <button onClick={copyTag} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 18px", borderRadius: 20, border: `1.5px solid ${copied ? T.Gr : T.border}`, background: copied ? T.Grpale : T.bg, cursor: "pointer", fontFamily: FONT, fontSize: 13, fontWeight: 600, color: copied ? T.Gr : T.text2, transition: "all 0.2s" }}>
            {copied && <CheckCircle size={14} />} {copied ? "Copied!" : "Copy Tag"}
          </button>
        </div>

        <div style={card()}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Request Amount</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontWeight: 800, color: T.P }}>₦</span>
            <input value={reqAmt} onChange={(e) => setReqAmt(e.target.value)} type="number" placeholder="0.00"
              style={{ ...inputSt({ paddingLeft: 30, fontSize: 20, fontWeight: 700, fontFamily: MONO, color: T.P }) }} />
          </div>
        </div>

        <button onClick={() => onSimReceive(parseFloat(reqAmt) || 2000, "Nearby Device")} style={goldBtn()}>
          <ArrowDownToLine size={17} /> Simulate Incoming Transfer
        </button>

        <div style={{ ...card({ background: T.Gpale, border: "1px solid rgba(184,134,11,0.2)" }) }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <WifiOff size={15} color={T.G} />
            <span style={{ fontSize: 12, color: T.G, fontWeight: 600, lineHeight: 1.5 }}>Share QR or tag. Bluetooth transfers work fully offline.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HISTORY SCREEN ──────────────────────────────────────────────────────────
export function HistoryScreen({ transactions, onBack }) {
  const [filter, setFilter] = useState("all");
  const filtered = transactions.filter((tx) =>
    filter === "all" ? true : filter === "sent" ? tx.type === "debit" : tx.type === "credit"
  );

  return (
    <div style={{ background: T.bg, minHeight: "100vh", paddingBottom: 32 }}>
      <div style={{ background: T.card, padding: "52px 20px 16px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: T.chip, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={20} color={T.text} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 800, color: T.text }}>History</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "sent", "received"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${filter === f ? T.P : T.border}`, background: filter === f ? T.P : T.bg, color: filter === f ? "#fff" : T.text2, fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0
          ? <div style={{ textAlign: "center", padding: "48px 0" }}>
              <Clock size={32} color={T.border} style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 14, color: T.text3, fontWeight: 500 }}>No transactions here</div>
            </div>
          : filtered.map((tx) => <TxRow key={tx.id} tx={tx} />)}
      </div>
    </div>
  );
}
