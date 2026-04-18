import { useState, useEffect } from "react";
import {
  Bluetooth, BluetoothConnected, ArrowUpRight, ArrowDownLeft,
  ArrowDownToLine, Send, Clock, Home, X, Users, WifiOff,
  CheckCircle, ChevronLeft,
} from "lucide-react";
import { T, FONT, MONO, primaryBtn, goldBtn, ghostBtn, fmt, timeAgo } from "./utils";

// ─── KONEKTA LOGO MARK ───────────────────────────────────────────────────────
export function KonektaMark({ size = 36, bg = "transparent" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {bg !== "transparent" && <rect width="80" height="80" rx="16" fill={bg} />}
      <rect x="10" y="10" width="13" height="60" rx="2" fill="#3D1A8E" />
      <polygon points="23,10 57,10 57,18 23,40" fill="#3D1A8E" />
      <polygon points="23,40 57,62 57,70 23,70" fill="#3D1A8E" />
      <rect x="57" y="10" width="13" height="60" rx="2" fill="#3D1A8E" />
      <polygon points="23,40 46,28 46,52" fill="#B8860B" opacity="0.95" />
    </svg>
  );
}

// ─── LAUNCH SCREEN ───────────────────────────────────────────────────────────
export function LaunchScreen({ onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => onDone(), 2800);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 200,
      background: `linear-gradient(155deg, ${T.P} 0%, #2A1260 50%, #1A0A4A 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: phase === 2 ? 0 : 1,
      transition: "opacity 0.6s ease",
    }}>
      {/* Decorative rings */}
      <div style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", border: "1px solid rgba(184,134,11,0.12)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", border: "1px solid rgba(184,134,11,0.18)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

      {/* Logo */}
      <div style={{
        opacity: phase >= 0 ? 1 : 0,
        transform: phase >= 0 ? "scale(1) translateY(0)" : "scale(0.7) translateY(16px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        marginBottom: 24,
      }}>
        <KonektaMark size={72} bg="rgba(255,255,255,0.08)" />
      </div>

      {/* Wordmark */}
      <div style={{
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.45s ease 0.1s, transform 0.45s ease 0.1s",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 40, fontWeight: 900, color: "#fff", letterSpacing: "-1.5px", fontFamily: FONT }}>
          KONEKTA
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 400, marginTop: 8, letterSpacing: "0.5px" }}>
          Transact anywhere. Anytime.
        </div>
      </div>

      {/* Gold line */}
      <div style={{
        width: phase >= 1 ? 48 : 0, height: 2,
        background: `linear-gradient(90deg, ${T.G}, ${T.Gbright})`,
        borderRadius: 2, marginTop: 28,
        transition: "width 0.5s ease 0.3s",
      }} />

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');`}</style>
    </div>
  );
}

// ─── TX ROW ──────────────────────────────────────────────────────────────────
export function TxRow({ tx }) {
  const isOut = tx.type === "debit";
  return (
    <div style={{ background: T.card, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 8px rgba(61,26,142,0.05)" }}>
      <div style={{ width: 44, height: 44, borderRadius: 13, background: isOut ? T.redpale : T.Grpale, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {isOut
          ? <ArrowUpRight  size={19} color={T.red} strokeWidth={2.2} />
          : <ArrowDownLeft size={19} color={T.Gr}  strokeWidth={2.2} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {isOut ? (tx.name || "Transfer") : ("From: " + (tx.from || "Konekta User"))}
        </div>
        <div style={{ fontSize: 11, color: T.text3, marginTop: 2 }}>
          {tx.note || (isOut ? "Sent" : "Received")} · {timeAgo(tx.date)}
        </div>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: isOut ? T.red : T.Gr, flexShrink: 0 }}>
        {isOut ? "-" : "+"}{fmt(tx.amount)}
      </div>
    </div>
  );
}

// ─── OVERLAY (bottom sheet) ──────────────────────────────────────────────────
export function Overlay({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(18,9,31,0.55)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(5px)" }}
    >
      <div style={{ width: "100%", maxWidth: 480, background: T.card, borderRadius: "28px 28px 0 0", padding: "28px 24px 44px", animation: "slideUp 0.28s ease" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: T.border, margin: "0 auto 24px" }} />
        {children}
      </div>
      <style>{`@keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }`}</style>
    </div>
  );
}

// ─── BOTTOM NAV ──────────────────────────────────────────────────────────────
export function BottomNav({ active, onSwitch }) {
  const items = [
    { key: "home",    Icon: Home,            label: "Home" },
    { key: "send",    Icon: Send,            label: "Send" },
    { key: "receive", Icon: ArrowDownToLine, label: "Receive" },
    { key: "history", Icon: Clock,           label: "History" },
  ];
  return (
    <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: T.card, borderTop: `1px solid ${T.border}`, display: "flex", height: 72, zIndex: 50, boxShadow: "0 -4px 24px rgba(61,26,142,0.08)" }}>
      {items.map(({ key, Icon, label }) => (
        <button key={key} onClick={() => onSwitch(key)}
          style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <Icon size={22} color={active === key ? T.P : T.text3} strokeWidth={active === key ? 2.5 : 1.8} />
          <span style={{ fontSize: 10, fontWeight: active === key ? 700 : 500, color: active === key ? T.P : T.text3, fontFamily: FONT }}>{label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── BLUETOOTH PANEL ─────────────────────────────────────────────────────────
export function BluetoothPanel({ onClose, onSimReceive }) {
  const [state,      setState]      = useState("off");
  const [devices,    setDevices]    = useState([]);
  const [connecting, setConnecting] = useState(null);
  const [connected,  setConnected]  = useState(null);

  const fakes = [
    { id: "d1", name: "Ope's Konekta",    dbm: -54 },
    { id: "d2", name: "Shile's Phone",    dbm: -68 },
    { id: "d3", name: "Destiny's Wallet", dbm: -79 },
  ];

  function scan() {
    setState("searching"); setDevices([]); setConnected(null);
    setTimeout(() => setDevices([fakes[0]]), 800);
    setTimeout(() => setDevices([fakes[0], fakes[1]]), 1500);
    setTimeout(() => { setDevices(fakes); setState("found"); }, 2400);
  }
  function connect(d) {
    setConnecting(d.id);
    setTimeout(() => { setConnecting(null); setConnected(d); setState("connected"); }, 1400);
  }
  function request(d) { onSimReceive(2000, d.name); onClose(); }
  const bars = (dbm) => dbm > -60 ? "▁▃▅" : dbm > -73 ? "▁▃░" : "▁░░";

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: "fixed", inset: 0, background: "rgba(18,9,31,0.6)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center", backdropFilter: "blur(6px)" }}>
      <div style={{ width: "100%", maxWidth: 480, background: T.card, borderRadius: "28px 28px 0 0", padding: "28px 24px 44px" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: T.border, margin: "0 auto 24px" }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.Psoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {state === "connected"
                ? <BluetoothConnected size={20} color={T.Gr} />
                : <Bluetooth size={20} color={T.P} style={state === "searching" ? { animation: "btpulse 1s infinite" } : {}} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: T.text }}>Bluetooth Transfer</div>
              <div style={{ fontSize: 12, color: T.text3, marginTop: 1 }}>
                {state === "off"       && "Find nearby Konekta users"}
                {state === "searching" && "Scanning for devices..."}
                {state === "found"     && `${devices.length} device(s) found`}
                {state === "connected" && `Connected · ${connected?.name}`}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: T.chip, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color={T.text2} />
          </button>
        </div>

        {/* Offline badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.Gpale, borderRadius: 10, padding: "8px 14px", marginBottom: 20, border: "1px solid rgba(184,134,11,0.2)" }}>
          <WifiOff size={14} color={T.G} />
          <span style={{ fontSize: 12, color: T.G, fontWeight: 600 }}>No internet needed — offline Bluetooth transfer</span>
        </div>

        {state === "off" && (
          <button onClick={scan} style={primaryBtn()}>
            <Bluetooth size={17} /> Scan for Nearby Devices
          </button>
        )}

        {state === "searching" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 16px" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ position: "absolute", inset: i * -14, borderRadius: "50%", border: `1.5px solid ${T.P}`, opacity: 0.25 - i * 0.06, animation: `ripple 1.6s ${i * 0.4}s infinite` }} />
              ))}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bluetooth size={28} color={T.P} />
              </div>
            </div>
            <div style={{ fontSize: 13, color: T.text2, fontWeight: 500 }}>Looking for Konekta devices...</div>
          </div>
        )}

        {(state === "found" || state === "connected") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {devices.map((d) => (
              <div key={d.id} style={{ background: T.bg, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, border: `1.5px solid ${connected?.id === d.id ? T.P : T.border}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: connected?.id === d.id ? T.P : T.chip, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {connected?.id === d.id
                    ? <BluetoothConnected size={18} color="#fff" />
                    : <Users size={18} color={T.text3} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: T.text3, fontFamily: MONO, marginTop: 2 }}>{bars(d.dbm)} {Math.abs(d.dbm)} dBm</div>
                </div>
                {connected?.id === d.id
                  ? <button onClick={() => request(d)} style={goldBtn({ width: "auto", padding: "8px 14px", fontSize: 12 })}>
                      <ArrowDownToLine size={14} /> Request
                    </button>
                  : <button onClick={() => connect(d)} disabled={connecting === d.id} style={primaryBtn({ width: "auto", padding: "8px 14px", fontSize: 12, opacity: connecting ? 0.6 : 1 })}>
                      {connecting === d.id ? "…" : "Connect"}
                    </button>}
              </div>
            ))}
            {state === "found" && <button onClick={scan} style={ghostBtn({ marginTop: 4 })}>Refresh Scan</button>}
          </div>
        )}

        <style>{`
          @keyframes ripple  { 0%{transform:scale(0.8);opacity:0.4} 100%{transform:scale(2.2);opacity:0} }
          @keyframes btpulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        `}</style>
      </div>
    </div>
  );
}
