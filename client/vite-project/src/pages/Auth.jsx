import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api, { API_BASE_URL } from '../services/api';
import useStore from '../store/useStore';

/* ─── Global keyframes ─── */
const GlobalStyles = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--mv-bg); }
    html, body, #root { min-height: 100%; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes spin { to { transform: rotate(360deg); } }
    .movetto-input {
      width: 100%;
      background: var(--mv-panel);
      border: 1px solid var(--mv-border-2);
      border-radius: 7px;
      padding: 14px 16px;
      font-size: 16px;
      color: var(--mv-text);
      outline: none;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    .movetto-input,
    .movetto-select,
    .btn-yellow,
    .btn-ghost {
      min-height: 48px;
    }
    .movetto-input:focus { border-color: #E8F400; }
    .movetto-input::placeholder { color: var(--mv-dimmer); }
    .movetto-select {
      width: 100%;
      background: var(--mv-panel);
      border: 1px solid var(--mv-border-2);
      border-radius: 7px;
      padding: 14px 16px;
      font-size: 16px;
      color: var(--mv-text);
      outline: none;
      cursor: pointer;
      appearance: none;
      font-family: inherit;
    }
    .movetto-select:focus { border-color: #E8F400; }
    .movetto-select option { background: var(--mv-panel); }
    .btn-yellow {
      width: 100%;
      background: #E8F400;
      color: #0A0B0D;
      border: none;
      padding: 14px 24px;
      border-radius: 7px;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      letter-spacing: 0.01em;
      transition: opacity 0.2s;
      font-family: inherit;
    }
    .btn-yellow:hover { opacity: 0.88; }
    .btn-ghost {
      background: transparent;
      color: var(--mv-text);
      border: 1px solid var(--mv-border-2);
      padding: 14px 24px;
      border-radius: 7px;
      font-size: 15px;
      cursor: pointer;
      transition: border-color 0.2s;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .btn-ghost:hover { border-color: var(--mv-dim); }
    .btn-ghost-auto {
      width: auto;
      flex-shrink: 0;
    }
    .form-anim { animation: fadeIn 0.3s ease; }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .auth-actions-row {
      display: flex;
      gap: 10px;
      margin-top: 16px;
    }
    .auth-error {
      background: #200808;
      border: 1px solid #FF5C3833;
      border-radius: 6px;
      padding: 14px 18px;
      font-size: 15px;
      color: #FF5C38;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .ticker-wrap {
      overflow: hidden;
      padding: 8px 0;
      background: var(--mv-panel);
      border-top: 1px solid var(--mv-border);
      border-bottom: 1px solid var(--mv-border);
    }
    .ticker-inner {
      display: flex;
      white-space: nowrap;
      animation: ticker 20s linear infinite;
    }
    .tick-item {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 0 36px;
      font-size: 14px;
      color: var(--mv-dim);
      border-right: 1px solid var(--mv-border);
    }
    .dot-live {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #00D68A;
      display: inline-block;
      animation: pulse 2s infinite;
    }
    .carrier-pulse {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #00D68A;
      flex-shrink: 0;
      animation: pulse 2s infinite;
    }
    .tab-btn {
      flex: 1;
      padding: 14px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      transition: all 0.2s;
      letter-spacing: 0.02em;
      font-family: inherit;
    }
    .strength-bar {
      height: 3px;
      border-radius: 2px;
      transition: all 0.3s;
      flex: 1;
    }
    .plan-card {
      border-radius: 8px;
      padding: 18px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .carrier-card {
      border-radius: 8px;
      padding: 18px;
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 10px;
    }
    
    /* Responsive Layout Classes */
    .auth-header {
      background: var(--mv-bg);
      border-bottom: 1px solid var(--mv-border);
      padding: 0 40px;
      height: 76px;
      display: grid;
      grid-template-columns: minmax(280px, 1fr) auto minmax(280px, 1fr);
      align-items: center;
      gap: 24px;
    }
    .auth-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      justify-self: start;
    }
    .auth-header-logo {
      flex-shrink: 0;
    }
    .auth-header-divider {
      width: 1px;
      height: 22px;
      background: var(--mv-border);
      margin: 0 4px;
    }
    .auth-back-link {
      font-size: 14px;
      color: var(--mv-muted);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      padding: 0 12px;
      border: 1px solid var(--mv-border);
      border-radius: 999px;
      background: var(--mv-panel);
      white-space: nowrap;
      transition: border-color 0.2s, color 0.2s, background 0.2s;
    }
    .auth-back-link:hover {
      color: var(--mv-text);
      border-color: var(--mv-border-2);
      background: var(--mv-card);
    }
    .auth-header-status {
      justify-self: center;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      color: var(--mv-muted);
      background: var(--mv-panel);
      border: 1px solid var(--mv-border);
      border-radius: 999px;
      padding: 8px 14px;
      font-size: 13px;
      line-height: 1;
      white-space: nowrap;
    }
    .auth-header-actions {
      justify-self: end;
      color: var(--mv-dim);
      background: var(--mv-panel);
      border: 1px solid var(--mv-border);
      border-radius: 999px;
      padding: 9px 14px;
      font-size: 14px;
      line-height: 1;
      white-space: nowrap;
    }
    .show-mobile-only { display: none; }
    .auth-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: calc(100dvh - 76px);
    }
    .auth-left {
      background: var(--mv-panel);
      border-right: 1px solid var(--mv-border);
      padding: 100px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }
    .auth-right {
      padding: 60px 48px;
      background: var(--mv-bg);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .auth-right-inner {
      max-width: 440px;
      width: 100%;
      margin: 0 auto;
    }
    .auth-tabs {
      display: flex;
      background: var(--mv-card);
      border: 1px solid var(--mv-border);
      border-radius: 8px;
      padding: 4px;
      gap: 4px;
      margin-bottom: 28px;
    }
    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: var(--mv-dim);
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
    }
    .password-toggle:active {
      background: var(--mv-card);
    }
    .mobile-value-props {
      display: none;
    }
    .auth-left-title {
      font-size: 42px;
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 12px;
    }
    .auth-left-subtitle {
      font-size: 42px;
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 32px;
      color: var(--mv-dim);
    }
    
    @media (max-width: 1024px) {
      .auth-left { padding: 60px 32px; }
      .auth-right { padding: 40px 32px; }
      .auth-left-title, .auth-left-subtitle { font-size: 32px; }
    }

    @media (max-width: 768px) {
      .auth-layout { grid-template-columns: 1fr; }
      .auth-left { display: none; }
      .auth-right { padding: 28px 20px 36px; justify-content: flex-start; min-height: calc(100dvh - 68px); }
      .auth-header { display: flex; justify-content: space-between; padding: 0 20px; height: 68px; position: sticky; top: 0; z-index: 20; }
      .auth-header-left { gap: 10px; }
      .auth-header-status { display: none; }
      .auth-header-actions { background: transparent; border: none; padding: 0; }
      .auth-back-link { height: auto; padding: 0; border: none; background: transparent; }
      .hide-mobile { display: none !important; }
      .show-mobile-only { display: block !important; }
      .mobile-value-props {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        margin-bottom: 20px;
      }
      .mobile-value-props span {
        min-width: 0;
        background: var(--mv-panel);
        border: 1px solid var(--mv-border);
        border-radius: 7px;
        padding: 10px 8px;
        font-size: 12px;
        line-height: 1.3;
        color: var(--mv-muted);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        text-align: center;
      }
      .mobile-value-props span::before {
        content: "";
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #00D68A;
        box-shadow: 0 0 9px rgba(0, 214, 138, 0.85);
        flex-shrink: 0;
      }
      .auth-tabs { margin-bottom: 22px; }
      .auth-form { gap: 14px; }
      .biz-grid { grid-template-columns: 1fr !important; }
      .plan-card { align-items: flex-start; flex-direction: column; gap: 12px; }
      .plan-card > div:first-child { margin-top: 4px; }
      .plan-card > div:last-child { width: 100%; }
      .plan-card-header { flex-direction: column; align-items: flex-start !important; gap: 4px; }
      .auth-actions-row { margin-top: 14px; }
    }
    
    @media (max-width: 480px) {
      .auth-right { padding: 22px 14px 32px; }
      .auth-header { padding: 0 12px; height: 64px; }
      .auth-header-left { gap: 8px; }
      .auth-header-logo { font-size: 22px !important; }
      .auth-header-text { display: none; }
      .mobile-value-props { grid-template-columns: 1fr; gap: 7px; margin-bottom: 18px; }
      .step-dot-circle { width: 28px !important; height: 28px !important; font-size: 12px !important; }
      .step-dot-label { font-size: 11px !important; }
      .step-dot-item { min-width: 0; }
      .auth-form-title { font-size: 24px !important; }
      .auth-form-subtitle { font-size: 14px !important; line-height: 1.5 !important; margin-bottom: 20px !important; }
      .auth-error { padding: 12px 14px; font-size: 13px; align-items: flex-start; }
      .auth-tabs { margin-bottom: 20px; }
      .btn-ghost { padding: 14px 16px; font-size: 14px; }
      .btn-yellow { padding: 14px 16px; font-size: 15px; }
      .auth-right-inner { max-width: 100%; }
      .auth-actions-row { flex-direction: column-reverse; gap: 10px; }
      .auth-actions-row .btn-ghost,
      .auth-actions-row .btn-yellow { width: 100% !important; }
      .plan-card { padding: 16px; }
      .carrier-card { padding: 16px; }
      .tick-item { padding: 0 24px; font-size: 13px; }
    }

    @media (max-width: 360px) {
      .auth-header { padding: 0 10px; height: auto; min-height: 64px; }
      .auth-header-logo { font-size: 20px !important; }
      .auth-header-actions, .auth-header-status { font-size: 13px; }
      .auth-header-status { display: none; }
      .auth-right { padding: 20px 10px; }
      .auth-right-inner { width: 100%; max-width: 100%; padding: 0; }
      .auth-form-title { font-size: 22px !important; }
      .auth-form-subtitle { font-size: 13px !important; }
      .auth-header { gap: 8px; }
      .tab-btn { padding: 12px; font-size: 14px; }
      .movetto-input, .movetto-select { padding: 12px 14px; font-size: 15px; }
      .btn-ghost, .btn-yellow { padding: 12px 14px; font-size: 14px; }
      .step-dot-circle { width: 26px !important; height: 26px !important; font-size: 11px !important; }
      .step-dot-label { font-size: 10px !important; }
      .plan-card { padding: 14px; gap: 12px; }
      .plan-card-header { flex-direction: column; align-items: flex-start !important; gap: 6px; }
      .carrier-card { padding: 14px; gap: 12px; }
      .carrier-card > div:last-child { font-size: 13px; }
      .auth-right-inner > div > div { gap: 14px; }
      .ticker-wrap { padding: 6px 0; }
      .tick-item { padding: 0 18px; font-size: 12px; }
      .auth-header-logo, .auth-header-actions { white-space: nowrap; }
      .auth-header-actions { text-align: right; }
      .btn-ghost-auto { width: 100%; }
    }
  `}</style>
);

/* ─── SVG Icons ─── */
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
    <path d="M8 3C4.5 3 2 8 2 8s2.5 5 6 5 6-5 6-5-2.5-5-6-5z" stroke="var(--mv-dim)" strokeWidth="1.4" fill="none" />
    <circle cx="8" cy="8" r="2" stroke="var(--mv-dim)" strokeWidth="1.4" fill="none" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="#FF5C38" strokeWidth="1.2" />
    <path d="M7 4v3M7 9.5v.5" stroke="#FF5C38" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/* ─── Reusable primitives ─── */
const S = {
  label: { fontSize: 14, letterSpacing: "0.1em", color: "var(--mv-dim)", textTransform: "uppercase", marginBottom: 8 },
  dividerWrap: { display: "flex", alignItems: "center", gap: 12, margin: "16px 0" },
  dividerLine: { flex: 1, height: 1, background: "var(--mv-border)" },
  dividerText: { fontSize: 14, color: "var(--mv-dimmer)" },
};

const Label = ({ children }) => <div style={S.label}>{children}</div>;

const Inp = ({ type = "text", placeholder, id, extraStyle, onInput }) => (
  <input className="movetto-input" type={type} placeholder={placeholder} id={id} style={extraStyle} onInput={onInput} />
);

const Sel = ({ children, id }) => (
  <select className="movetto-select" id={id}>{children}</select>
);

const BtnY = ({ children, onClick, extraStyle }) => (
  <button className="btn-yellow" style={extraStyle} onClick={onClick}>{children}</button>
);

const BtnG = ({ children, onClick, extraStyle }) => (
  <button className="btn-ghost" style={{ width: "100%", ...extraStyle }} onClick={onClick}>{children}</button>
);

const Divider = () => (
  <div style={S.dividerWrap}>
    <div style={S.dividerLine} />
    <span style={S.dividerText}>or</span>
    <div style={S.dividerLine} />
  </div>
);

/* ─── Password strength ─── */
function getStrength(v) {
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  const colors = ["#FF5C38", "#FFB020", "#FFB020", "#00D68A"];
  const labels = ["Too short", "Weak", "Medium", "Strong"];
  return {
    score,
    color: v.length === 0 ? "var(--mv-dim)" : colors[Math.max(0, score - 1)],
    label: v.length === 0 ? "Enter password" : labels[Math.max(0, score - 1)],
  };
}

/* ─── Step Dots ─── */
const StepDots = ({ current }) => {
  const steps = ["Account", "Business", "Plan", "Carrier"];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const isDone = n < current;
        const isActive = n === current;
        const dotStyle = isDone
          ? { background: "#00D68A22", border: "1px solid #00D68A44", color: "#00D68A" }
          : isActive
          ? { background: "#E8F400", color: "#0A0B0D" }
          : { background: "var(--mv-border)", color: "var(--mv-dim)", border: "1px solid var(--mv-border-2)" };
        return (
          <div key={n} className="step-dot-item" style={{ display: "flex", alignItems: "center", flex: n < steps.length ? 1 : "unset" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div className="step-dot-circle" style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0, ...dotStyle
              }}>
                {isDone ? "✓" : n}
              </div>
              <div className="step-dot-label" style={{ fontSize: 13, color: isDone ? "#00D68A" : isActive ? "#E8F400" : "var(--mv-dim)", marginTop: 4, whiteSpace: "nowrap" }}>
                {label}
              </div>
            </div>
            {n < steps.length && (
              <div style={{ flex: 1, height: 1, background: isDone ? "#00D68A44" : "var(--mv-border-2)", marginBottom: 14, minWidth: 16 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ─── Tabs ─── */
const Tabs = ({ active, onReg, onLogin }) => (
  <div className="auth-tabs">
    <button className="tab-btn" style={active === "reg" ? { background: "#E8F400", color: "#0A0B0D" } : { background: "transparent", color: "var(--mv-dim)" }} onClick={onReg}>
      Create account
    </button>
    <button className="tab-btn" style={active === "login" ? { background: "#E8F400", color: "#0A0B0D" } : { background: "transparent", color: "var(--mv-dim)" }} onClick={onLogin}>
      Log in
    </button>
  </div>
);

/* ─── Check circle ─── */
const CheckIcon = () => (
  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#00D68A22", border: "1px solid #00D68A44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, color: "#00D68A" }}>✓</div>
);

/* ─── Plan card ─── */
const PlanCard = ({ id, name, price, desc, badge, selected, onSelect }) => (
  <div className="plan-card" style={{ background: selected ? "#0f1000" : "var(--mv-panel)", border: `1px solid ${selected ? "#E8F400" : "var(--mv-border)"}` }} onClick={() => onSelect(id)}>
    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected ? "#E8F400" : "var(--mv-border-2)"}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#E8F400" }} />}
    </div>
    <div style={{ flex: 1 }}>
      <div className="plan-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>{name}</span>
          {badge && <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: "#E8F40020", color: "#E8F400", border: "1px solid #E8F40044" }}>{badge}</span>}
        </div>
        <span style={{ fontSize: 24, fontWeight: 800 }}>{price}<span style={{ fontSize: 15, fontWeight: 400, color: "var(--mv-dim)" }}>/mo</span></span>
      </div>
      <div style={{ fontSize: 14, color: "var(--mv-dim)", marginTop: 6 }}>{desc}</div>
    </div>
  </div>
);

/* ─── Carrier card ─── */
const CarrierCard = ({ name, sub }) => {
  const [connected, setConnected] = useState(false);
  return (
    <div className="carrier-card"
      style={{ background: connected ? "#0d1f0d" : "var(--mv-panel)", border: `1px solid ${connected ? "#00D68A44" : "var(--mv-border-2)"}` }}
      onClick={() => setConnected(v => !v)}>
      <div className="carrier-pulse" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 14, color: "var(--mv-dim)", marginTop: 2 }}>{sub}</div>
      </div>
      <div style={{ fontSize: 14, color: connected ? "#00D68A" : "#E8F400" }}>{connected ? "Connected ✓" : "Connect →"}</div>
    </div>
  );
};

/* ─── Step 1 ─── */
const Step1 = ({ onNext, onGoogleLogin, error }) => {
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { score, color, label } = getStrength(pass);
  return (
    <div className="form-anim auth-form">
      <div>
        <div className="auth-form-title" style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Create your account</div>
        <div className="auth-form-subtitle" style={{ fontSize: 16, color: "var(--mv-dim)", marginBottom: 28 }}>Takes under 2 minutes. No credit card.</div>
      </div>
      {error && (
        <div className="auth-error" style={{ padding: "12px 16px", fontSize: 14 }}>
          <AlertIcon /> {error}
        </div>
      )}
      <div>
        <Label>Full name</Label>
        <Inp placeholder="Kousik Maity" id="reg-name" />
      </div>
      <div>
        <Label>Work email</Label>
        <Inp placeholder="you@yourbusiness.com" id="reg-email" />
      </div>
      <div>
        <Label>Phone number</Label>
        <div style={{ position: "relative" }}>
          <Inp placeholder="+91 98765 43210" id="reg-phone" extraStyle={{ paddingLeft: 48 }} />
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "var(--mv-dim)", fontWeight: 600 }}>+91</span>
        </div>
      </div>
      <div>
        <Label>Password</Label>
        <div style={{ position: "relative" }}>
          <Inp type={showPass ? "text" : "password"} placeholder="Min 8 characters" id="reg-pass" extraStyle={{ paddingRight: 44 }} onInput={e => setPass(e.target.value)} />
          <span className="password-toggle" onClick={() => setShowPass(v => !v)}>
            <EyeIcon />
          </span>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="strength-bar" style={{ background: i < score ? color : "var(--mv-border)" }} />
          ))}
        </div>
        <div style={{ fontSize: 14, color, marginTop: 6 }}>{label}</div>
      </div>
      <BtnY onClick={onNext}>Continue →</BtnY>
      <Divider />
      <BtnG onClick={onGoogleLogin}><GoogleIcon /> Continue with Google</BtnG>
    </div>
  );
};

/* ─── Step 2 ─── */
const Step2 = ({ onNext, onBack }) => (
  <div className="form-anim auth-form">
    <div>
      <div className="auth-form-title" style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Tell us about your business</div>
      <div className="auth-form-subtitle" style={{ fontSize: 16, color: "var(--mv-dim)", marginBottom: 28 }}>Helps us configure the right carriers for your routes.</div>
    </div>
    <div>
      <Label>Business name</Label>
      <Inp placeholder="Maity Textiles Pvt Ltd" id="biz-name" />
    </div>
    <div className="biz-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      <div>
        <Label>City</Label>
        <Inp placeholder="Mumbai" id="biz-city" />
      </div>
      <div>
        <Label>Pincode</Label>
        <Inp placeholder="400001" id="biz-pin" />
      </div>
    </div>
    <div>
      <Label>Business type</Label>
      <Sel id="biz-type">
        <option value="">Select category</option>
        <option>Textile / Garments</option>
        <option>Electronics / Hardware</option>
        <option>Pharma / Healthcare</option>
        <option>FMCG / Food</option>
        <option>Auto Parts</option>
        <option>Other</option>
      </Sel>
    </div>
    <div>
      <Label>Monthly shipments</Label>
      <Sel id="biz-vol">
        <option value="">Select volume</option>
        <option>Less than 50</option>
        <option>50 – 200</option>
        <option>200 – 1,000</option>
        <option>1,000 – 5,000</option>
        <option>5,000+</option>
      </Sel>
    </div>
    <div>
      <Label>GSTIN (optional)</Label>
      <Inp placeholder="22AAAAA0000A1Z5" id="biz-gst" />
    </div>
    <div className="auth-actions-row" style={{ marginTop: 0 }}>
      <BtnG extraStyle={{ width: "auto", flexShrink: 0, padding: "14px 28px" }} onClick={onBack}>← Back</BtnG>
      <BtnY onClick={onNext}>Continue →</BtnY>
    </div>
  </div>
);

/* ─── Step 3 ─── */
const Step3 = ({ onNext, onBack }) => {
  const [selected, setSelected] = useState("starter");
  const plans = [
    { id: "starter", name: "Starter", price: "₹1,999", desc: "200 shipments · 3 carriers · 1 seat" },
    { id: "growth", name: "Growth", price: "₹4,999", desc: "1,000 shipments · All carriers · 5 seats · AI routes", badge: "POPULAR" },
    { id: "enterprise", name: "Enterprise", price: "₹9,999", desc: "Unlimited · API access · Dedicated AM" },
  ];
  return (
    <div className="form-anim">
      <div className="auth-form-title" style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Choose your plan</div>
      <div className="auth-form-subtitle" style={{ fontSize: 16, color: "var(--mv-dim)", marginBottom: 24 }}>14-day free trial on all plans. Cancel anytime.</div>
      {plans.map(p => <PlanCard key={p.id} {...p} selected={selected === p.id} onSelect={setSelected} />)}
      <div className="auth-actions-row">
        <BtnG extraStyle={{ width: "auto", flexShrink: 0, padding: "14px 28px" }} onClick={onBack}>← Back</BtnG>
        <BtnY onClick={onNext}>Continue →</BtnY>
      </div>
    </div>
  );
};

/* ─── Step 4 ─── */
const Step4 = ({ onNext, onBack, onSkip, submitting }) => (
  <div className="form-anim">
    <div className="auth-form-title" style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Connect your first carrier</div>
    <div className="auth-form-subtitle" style={{ fontSize: 16, color: "var(--mv-dim)", marginBottom: 24 }}>You can skip and add later from Settings.</div>
    <CarrierCard name="Delhivery" sub="Surface + Air · 94.2% on-time" />
    <CarrierCard name="Shiprocket" sub="Multi-carrier aggregator" />
    <CarrierCard name="Bluedart" sub="Premium express · D+1 in metros" />
    <div className="auth-actions-row">
      <BtnG extraStyle={{ width: "auto", flexShrink: 0, padding: "14px 28px" }} onClick={onBack}>← Back</BtnG>
      <BtnY onClick={onNext} extraStyle={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
        {submitting ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <span style={{ width: 18, height: 18, border: '2px solid #0A0B0D', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
            Creating account...
          </span>
        ) : 'Create account →'}
      </BtnY>
    </div>
    <div style={{ textAlign: "center", marginTop: 16, fontSize: 15, color: "var(--mv-dim)" }}>
      <span style={{ color: "#E8F400", cursor: "pointer" }} onClick={onSkip}>Skip for now →</span>
    </div>
  </div>
);

/* ─── Step Success ─── */
const StepSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="form-anim" style={{ textAlign: "center", padding: "40px 0" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#00D68A22", border: "2px solid #00D68A55", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 36, color: "#00D68A" }}>✓</div>
      <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>You're live!</div>
      <div style={{ fontSize: 18, color: "var(--mv-muted)", marginBottom: 32, lineHeight: 1.6 }}>Account created. First shipment is one click away.</div>
      <BtnY onClick={() => navigate('/dashboard')} extraStyle={{ marginBottom: 16, padding: "16px 24px", fontSize: "18px" }}>Go to dashboard →</BtnY>
      <div style={{ fontSize: 15, color: "var(--mv-dim)" }}>Check your email for a verification link</div>
    </div>
  );
};

/* ─── Register View ─── */
const RegisterView = ({ onGoogleLogin }) => {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const { setAuth } = useStore();

  const [step1Error, setStep1Error] = useState('');

  const collectStep1 = () => {
    const name     = document.getElementById('reg-name').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const phone    = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-pass').value;

    if (!name)                { setStep1Error('Name is required'); return; }
    if (!email)               { setStep1Error('Email is required'); return; }
    if (password.length < 8)  { setStep1Error('Password must be at least 8 characters'); return; }

    setStep1Error('');
    setFormData(prev => ({ ...prev, name, email, phone, password }));
    setStep(2);
  };

  const collectStep2 = () => {
    setFormData(prev => ({
      ...prev,
      businessName: document.getElementById('biz-name').value,
      city:         document.getElementById('biz-city').value,
      pincode:      document.getElementById('biz-pin').value,
    }));
    setStep(3);
  };

  const [submitting, setSubmitting] = useState(false);

  const handleFinalSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await api.post('/auth/register', formData);
      setAuth(res.data.user, res.data.accessToken);
      setSuccess(true);
    } catch (err) {
      console.error('Register failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const goStep = n => { setStep(n); setSuccess(false); };

  return (
    <div>
      {!success && <StepDots current={step} />}
      {success         ? <StepSuccess />
        : step === 1   ? <Step1 onNext={collectStep1} onGoogleLogin={onGoogleLogin} error={step1Error} />
        : step === 2   ? <Step2 onNext={collectStep2} onBack={() => goStep(1)} />
        : step === 3   ? <Step3 onNext={() => goStep(4)} onBack={() => goStep(2)} />
        : <Step4 onNext={handleFinalSubmit} onBack={() => goStep(3)} onSkip={handleFinalSubmit} submitting={submitting} />
      }
    </div>
  );
};

/* ─── Login View ─── */
const LoginView = ({ onShowReg, onGoogleLogin }) => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showError, setShowError] = useState(false);
  const { setAuth } = useStore();
  const [loading, setLoading] = useState(false);
  const tryLogin = async () => {
    try {
      setLoading(true);
      setShowError(false);
      const email = document.getElementById('log-email').value;
      const password = document.getElementById('log-pass').value;
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.user, res.data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="form-anim">
      <div className="auth-form-title" style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Welcome back</div>
      <div className="auth-form-subtitle" style={{ fontSize: 16, color: "var(--mv-dim)", marginBottom: 28 }}>Log in to your Movetto dashboard</div>
      {showError && (
        <div className="auth-error" style={{ marginBottom: 20 }}>
          <AlertIcon /> Invalid email or password. Please try again.
        </div>
      )}
      <div className="auth-form">
        <div>
          <Label>Email</Label>
          <Inp placeholder="you@yourbusiness.com" id="log-email" />
        </div>
        <div>
          <Label>Password</Label>
          <div style={{ position: "relative" }}>
            <Inp type={showPass ? "text" : "password"} placeholder="Your password" id="log-pass" extraStyle={{ paddingRight: 44 }} />
            <span className="password-toggle" onClick={() => setShowPass(v => !v)}>
              <EyeIcon />
            </span>
          </div>
          <div style={{ textAlign: "right", marginTop: 8 }}>
            <span style={{ fontSize: 14, color: "#E8F400", cursor: "pointer" }}>Forgot password?</span>
          </div>
        </div>
        <BtnY onClick={tryLogin} extraStyle={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ width: 18, height: 18, border: '2px solid #0A0B0D', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              Logging in...
            </span>
          ) : 'Log in to dashboard →'}
        </BtnY>
        <Divider />
        <BtnG onClick={onGoogleLogin}><GoogleIcon /> Continue with Google</BtnG>
      </div>
      <div style={{ textAlign: "center", marginTop: 24, fontSize: 15, color: "var(--mv-dim)" }}>
        No account? <span style={{ color: "#E8F400", cursor: "pointer" }} onClick={onShowReg}>Create one free →</span>
      </div>
    </div>
  );
};

/* ─── Ticker ─── */
const tickerItems = [
  { label: "New signup", val: "Mumbai" },
  { label: "Shipment booked", val: "BOM→DEL ₹847" },
  { label: "New signup", val: "Surat" },
  { label: "Invoice reconciled", val: "₹12,400 matched" },
  { label: "Carrier connected", val: "Delhivery" },
  { label: "New signup", val: "Delhi" },
  { label: "Shipment booked", val: "DEL→BLR ₹1,203" },
];
const Ticker = () => (
  <div className="ticker-wrap">
    <div className="ticker-inner">
      {[...tickerItems, ...tickerItems].map((item, i) => (
        <div key={i} className="tick-item">
          {item.label} <span style={{ color: "var(--mv-text)", fontFamily: "monospace" }}>{item.val}</span>
        </div>
      ))}
    </div>
  </div>
);

const MobileValueProps = () => (
  <div className="mobile-value-props">
    <span>Live in 10 minutes</span>
    <span>12+ carrier rates</span>
    <span>WhatsApp alerts</span>
  </div>
);

/* ─── Left Panel ─── */
const LeftPanel = () => (
  <div className="auth-left">
    <div style={{ fontSize: 14, letterSpacing: "0.12em", color: "#E8F400", textTransform: "uppercase", marginBottom: 24 }}>Why Movetto</div>
    <div className="auth-left-title">Your business ships<br />to 40 cities.</div>
    <div className="auth-left-subtitle">You're still managing<br />it on WhatsApp.</div>
    <div style={{ fontSize: 20, color: "var(--mv-muted)", lineHeight: 1.7, marginBottom: 40, maxWidth: 500 }}>
      Movetto gives you one screen to book, track, and optimise every shipment across every carrier in India.
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 48 }}>
      {[
        "Live in under 10 minutes — no sales call needed",
        "Compare rates from 12+ carriers instantly",
        "WhatsApp-native booking and customer alerts",
        "Auto invoice reconciliation — zero Excel work",
      ].map((text, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, fontSize: 16, color: "var(--mv-paper)", lineHeight: 1.4 }}>
          <div style={{ marginTop: 2 }}><CheckIcon /></div>
          <div>{text}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Main Auth Component ─── */
export default function Auth() {
  const [view, setView] = useState("reg");
  const [oauthError, setOauthError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userData = params.get("user");
    const error = params.get("error");

    if (error) {
      const messages = {
        google_not_configured: "Google login is not configured on the server yet.",
        google_failed: "Google login failed. Please try again.",
        server_error: "Google login finished, but the server could not create your session.",
      };
      setOauthError(messages[error] || "Google login failed. Please try again.");
      navigate("/auth", { replace: true });
      return;
    }

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        setAuth(user, token);
        navigate("/dashboard");
      } catch (err) {
        console.error("Google auth parse error:", err);
        setOauthError("Google login response was invalid. Please try again.");
        navigate("/auth", { replace: true });
      }
    }
  }, [location, navigate, setAuth]);

  const handleGoogleLogin = () => {
    window.location.assign(`${API_BASE_URL}/auth/google`);
  };

  return (
    <div style={{ background: "var(--mv-bg)", fontFamily: "'Inter', system-ui, sans-serif", color: "var(--mv-text)", width: "100%", minHeight: "100vh" }}>
      <GlobalStyles />

      {/* Header */}
      <div className="auth-header">
        <div className="auth-header-left">
          <div 
            onClick={() => navigate('/')}
            className="show-mobile-only"
            style={{ fontSize: 24, cursor: "pointer", color: "var(--mv-dim)", marginTop: "-2px" }}
          >
            ←
          </div>
          <div 
            onClick={() => navigate('/')}
            className="auth-header-logo"
            style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.06em", cursor: "pointer" }}
          >
            MOVE<span style={{ color: "#E8F400" }}>.</span>TTO
          </div>
          <div className="hide-mobile auth-header-divider" />
          <div 
            onClick={() => navigate('/')}
            className="hide-mobile auth-back-link"
          >
            ← Back to website
          </div>
        </div>
        <div className="auth-header-status">
          <span className="dot-live" style={{ width: 10, height: 10 }} /> 100+ businesses live
        </div>
        <div className="auth-header-actions">
          {view === "reg" ? (
            <><span className="auth-header-text">Already have an account? </span><span style={{ color: "#E8F400", cursor: "pointer", fontWeight: 600 }} onClick={() => setView("login")}>Log in →</span></>
          ) : (
            <><span className="auth-header-text">No account? </span><span style={{ color: "#E8F400", cursor: "pointer", fontWeight: 600 }} onClick={() => setView("reg")}>Create one →</span></>
          )}
        </div>
      </div>

      {/* Two-column grid */}
      <div className="auth-layout">
        <LeftPanel />

        {/* Right auth panel */}
        <div className="auth-right">
          <div className="auth-right-inner">
            <MobileValueProps />
            {oauthError && (
              <div className="auth-error" style={{ marginBottom: 20 }}>
                <AlertIcon /> {oauthError}
              </div>
            )}
            <Tabs
              active={view}
              onReg={() => setView("reg")}
              onLogin={() => setView("login")}
            />
            {view === "reg"
              ? <RegisterView onGoogleLogin={handleGoogleLogin} />
              : <LoginView onShowReg={() => setView("reg")} onGoogleLogin={handleGoogleLogin} />
            }
          </div>
        </div>
      </div>

      {/* Ticker */}
      <Ticker />
    </div>
  );
}
