import { useState, useEffect } from "react";
import { Send, ArrowDownLeft, CheckCircle, Plus, X } from "lucide-react";
import {
  T, FONT, inputSt, fmt,
  initStorage, loadBal, loadTx, loadBenes,
  saveBal, saveTx, saveBenes,
} from "./utils";
import { Overlay, BottomNav, BluetoothPanel, LaunchScreen } from "./components";
import { HomeScreen, SendScreen, ReceiveScreen, HistoryScreen } from "./screens";

export default function App() {
  const [screen,        setScreen]        = useState("home");
  const [balance,       setBalance]       = useState(15000);
  const [transactions,  setTransactions]  = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [pendingSend,   setPendingSend]   = useState(null);
  const [overlay,       setOverlay]       = useState(null); // "confirm"|"success"|"addBen"
  const [successData,   setSuccessData]   = useState(null);
  const [newBenName,    setNewBenName]    = useState("");
  const [launch,        setLaunch]        = useState(true);
  const [initRecipient, setInitRecipient] = useState("");
  const [showBT,        setShowBT]        = useState(false);

  useEffect(() => {
    initStorage();
    setBalance(loadBal());
    setTransactions(loadTx());
    setBeneficiaries(loadBenes());
  }, []);

  // ── Navigation ──────────────────────────────────────────────────────────────
  function navigate(dest) {
    if (dest === "addBen") { setOverlay("addBen"); return; }
    if (dest === "home")   { setInitRecipient(""); }
    setScreen(dest);
  }
  function useBeneficiary(name) { setInitRecipient(name); setScreen("send"); }

  // ── Transfer flow ────────────────────────────────────────────────────────────
  function handleAICommand(r)   { setPendingSend({ name: r.recipient, amount: r.amount, note: "AI command" }); setOverlay("confirm"); }
  function handleFormSend(data) { setPendingSend(data); setOverlay("confirm"); }

  function executeTransfer() {
    const { name, amount, note } = pendingSend;
    const newBal = balance - amount;
    const tx = { id: "tx_" + Date.now(), type: "debit", name, amount, note: note || "Transfer", date: new Date().toISOString() };
    const newTx = [tx, ...transactions];
    setBalance(newBal); setTransactions(newTx); saveBal(newBal); saveTx(newTx);
    setSuccessData({ amount, name });
    setOverlay("success");
  }

  function closeSuccess() { setOverlay(null); setSuccessData(null); setPendingSend(null); setScreen("home"); }

  function handleSimReceive(amount, from = "Nearby Device") {
    const newBal = balance + amount;
    const tx = { id: "tx_" + Date.now(), type: "credit", from, amount, note: "BT Transfer", date: new Date().toISOString() };
    const newTx = [tx, ...transactions];
    setBalance(newBal); setTransactions(newTx); saveBal(newBal); saveTx(newTx);
    setSuccessData({ amount, name: from, isReceive: true });
    setOverlay("success"); setShowBT(false);
  }

  // ── Beneficiary ──────────────────────────────────────────────────────────────
  function addBeneficiary() {
    const name = newBenName.trim();
    if (!name) return;
    if (!beneficiaries.some((b) => b.name.toLowerCase() === name.toLowerCase())) {
      const updated = [{ id: "b_" + Date.now(), name }, ...beneficiaries];
      setBeneficiaries(updated); saveBenes(updated);
    }
    setNewBenName(""); setOverlay(null); useBeneficiary(name);
  }

  // ── Button style shorthands ──────────────────────────────────────────────────
  const pBtn = { border: "none", borderRadius: 14, padding: "15px 0", fontFamily: FONT, fontSize: 15, fontWeight: 700, cursor: "pointer", background: `linear-gradient(135deg,${T.P},${T.Plight})`, color: "#fff", boxShadow: `0 6px 20px ${T.Pglow}`, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 };
  const gBtn = { border: "none", borderRadius: 14, padding: "15px 0", fontFamily: FONT, fontSize: 15, fontWeight: 700, cursor: "pointer", background: T.chip, color: T.text2, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" };

  return (
    <div style={{ position: "relative", maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: T.bg, fontFamily: FONT, boxShadow: "0 0 60px rgba(61,26,142,0.15)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Launch screen */}
      {launch && <LaunchScreen onDone={() => setLaunch(false)} />}

      {/* Status bar */}
      <div style={{ height: 44, background: T.P, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Konekta</span>
      </div>

      {/* Screens */}
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 72 }}>
        {screen === "home"    && <HomeScreen    balance={balance} transactions={transactions} beneficiaries={beneficiaries} onNavigate={navigate} onUseBeneficiary={useBeneficiary} onAICommand={handleAICommand} onOpenBluetooth={() => setShowBT(true)} />}
        {screen === "send"    && <SendScreen    balance={balance} beneficiaries={beneficiaries} initialRecipient={initRecipient} onBack={() => navigate("home")} onSend={handleFormSend} />}
        {screen === "receive" && <ReceiveScreen onBack={() => navigate("home")} onSimReceive={handleSimReceive} />}
        {screen === "history" && <HistoryScreen transactions={transactions} onBack={() => navigate("home")} />}
      </div>

      <BottomNav active={screen} onSwitch={navigate} />

      {/* Bluetooth panel */}
      {showBT && <BluetoothPanel onClose={() => setShowBT(false)} onSimReceive={handleSimReceive} />}

      {/* ── Confirm Overlay ── */}
      <Overlay show={overlay === "confirm"} onClose={() => setOverlay(null)}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: T.Psoft, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Send size={26} color={T.P} />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 6 }}>Confirm Transfer</h3>
          <p style={{ color: T.text3, fontSize: 14, marginBottom: 20 }}>
            Send <strong style={{ color: T.text }}>{fmt(pendingSend?.amount)}</strong> to <strong style={{ color: T.text }}>{pendingSend?.name}</strong>?
          </p>
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
            {[["Amount", fmt(pendingSend?.amount)], ["Recipient", pendingSend?.name], ["Method", "Offline / Bluetooth"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: T.text3, fontSize: 13 }}>{k}</span>
                <span style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setOverlay(null)} style={gBtn}>Cancel</button>
            <button onClick={executeTransfer} style={pBtn}>Confirm</button>
          </div>
        </div>
      </Overlay>

      {/* ── Success Overlay ── */}
      <Overlay show={overlay === "success"} onClose={closeSuccess}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: successData?.isReceive ? T.Grpale : T.Psoft, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {successData?.isReceive
              ? <ArrowDownLeft size={28} color={T.Gr} strokeWidth={2.5} />
              : <CheckCircle   size={28} color={T.P}  strokeWidth={2.5} />}
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 6 }}>
            {successData?.isReceive ? "Money Received" : "Transfer Successful"}
          </h3>
          <p style={{ color: T.text3, fontSize: 14, marginBottom: 20 }}>
            {successData?.isReceive ? "Funds received offline via Bluetooth." : "Sent offline. No internet used."}
          </p>
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: T.text3, fontSize: 13 }}>{successData?.isReceive ? "Received" : "Sent"}</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: successData?.isReceive ? T.Gr : T.P, fontFamily: "'DM Mono', monospace" }}>{fmt(successData?.amount)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: T.text3, fontSize: 13 }}>{successData?.isReceive ? "From" : "To"}</span>
              <span style={{ fontWeight: 600, color: T.text }}>{successData?.name}</span>
            </div>
          </div>
          <button onClick={closeSuccess} style={{ ...gBtn, flex: "unset", width: "100%" }}>Done</button>
        </div>
      </Overlay>

      {/* ── Add Beneficiary Overlay ── */}
      <Overlay show={overlay === "addBen"} onClose={() => setOverlay(null)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, margin: 0 }}>Add Beneficiary</h3>
            <p style={{ fontSize: 13, color: T.text3, marginTop: 4 }}>Save people you send to often.</p>
          </div>
          <button onClick={() => setOverlay(null)} style={{ width: 32, height: 32, borderRadius: "50%", background: T.chip, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color={T.text2} />
          </button>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Name</div>
        <input value={newBenName} onChange={(e) => setNewBenName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addBeneficiary()} placeholder="e.g. Ope Adeyemi"
          style={{ ...inputSt({ marginBottom: 16 }) }} />
        <button onClick={addBeneficiary}
          style={{ border: "none", borderRadius: 14, padding: "15px 0", width: "100%", fontFamily: FONT, fontSize: 15, fontWeight: 700, cursor: "pointer", background: `linear-gradient(135deg, ${T.P}, ${T.Plight})`, color: "#fff", boxShadow: `0 6px 20px ${T.Pglow}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Plus size={16} /> Save Beneficiary
        </button>
      </Overlay>
    </div>
  );
}
