import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Global keyframes ─── */
const GlobalStyles = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0A0B0D; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    .movetto-input {
      width: 100%;
      background: #0D0F13;
      border: 1px solid #22272F;
      border-radius: 7px;
      padding: 11px 14px;
      font-size: 14px;
      color: #EEF2F6;
      outline: none;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    .movetto-input:focus { border-color: #E8F400; }
    .movetto-input::placeholder { color: #3D4655; }
    .movetto-select {
      width: 100%;
      background: #0D0F13;
      border: 1px solid #22272F;
      border-radius: 7px;
      padding: 11px 14px;
      font-size: 14px;
      color: #EEF2F6;
      outline: none;
      cursor: pointer;
      appearance: none;
      font-family: inherit;
    }
    .movetto-select:focus { border-color: #E8F400; }
    .movetto-select option { background: #0D0F13; }
    .btn-yellow {
      width: 100%;
      background: #E8F400;
      color: #0A0B0D;
      border: none;
      padding: 12px 20px;
      border-radius: 7px;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      letter-spacing: 0.01em;
      transition: opacity 0.2s;
      font-family: inherit;
    }
    .btn-yellow:hover { opacity: 0.88; }
    .btn-ghost {
      background: transparent;
      color: #EEF2F6;
      border: 1px solid #22272F;
      padding: 11px 20px;
      border-radius: 7px;
      font-size: 13px;
      cursor: pointer;
      transition: border-color 0.2s;
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-ghost:hover { border-color: #5A6478; }
    .btn-ghost-auto {
      width: auto;
      flex-shrink: 0;
    }
    .form-anim { animation: fadeIn 0.3s ease; }
    .ticker-wrap {
      overflow: hidden;
      padding: 8px 0;
      background: #0D0F13;
      border-top: 1px solid #181C22;
      border-bottom: 1px solid #181C22;
    }
    .ticker-inner {
      display: flex;
      white-space: nowrap;
      animation: ticker 20s linear infinite;
    }
    .tick-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0 24px;
      font-size: 11px;
      color: #5A6478;
      border-right: 1px solid #181C22;
    }
    .dot-live {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #00D68A;
      display: inline-block;
      animation: pulse 2s infinite;
    }
    .carrier-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #00D68A;
      flex-shrink: 0;
      animation: pulse 2s infinite;
    }
    .tab-btn {
      flex: 1;
      padding: 10px;
      font-size: 13px;
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
      padding: 14px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .carrier-card {
      border-radius: 8px;
      padding: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 10px;
    }
  `}</style>
);

/* ─── SVG Icons ─── */
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3C4.5 3 2 8 2 8s2.5 5 6 5 6-5 6-5-2.5-5-6-5z" stroke="#5A6478" strokeWidth="1.2" fill="none" />
    <circle cx="8" cy="8" r="2" stroke="#5A6478" strokeWidth="1.2" fill="none" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.5" stroke="#22272F" />
    <text x="8" y="12" textAnchor="middle" fontSize="10" fill="#8494A8" fontFamily="sans-serif">G</text>
  </svg>
);
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="#FF5C38" strokeWidth="1.2" />
    <path d="M7 4v3M7 9.5v.5" stroke="#FF5C38" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/* ─── Reusable primitives ─── */
const S = {
  label: { fontSize: 11, letterSpacing: "0.1em", color: "#5A6478", textTransform: "uppercase", marginBottom: 6 },
  dividerWrap: { display: "flex", alignItems: "center", gap: 12, margin: "16px 0" },
  dividerLine: { flex: 1, height: 1, background: "#181C22" },
  dividerText: { fontSize: 12, color: "#3D4655" },
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
    color: v.length === 0 ? "#5A6478" : colors[Math.max(0, score - 1)],
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
          : { background: "#181C22", color: "#5A6478", border: "1px solid #22272F" };
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", flex: n < steps.length ? 1 : "unset" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, ...dotStyle
              }}>
                {isDone ? "✓" : n}
              </div>
              <div style={{ fontSize: 10, color: isDone ? "#00D68A" : isActive ? "#E8F400" : "#5A6478" }}>
                {label}
              </div>
            </div>
            {n < steps.length && (
              <div style={{ flex: 1, height: 1, background: isDone ? "#00D68A44" : "#22272F", marginBottom: 14 }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ─── Tabs ─── */
const Tabs = ({ active, onReg, onLogin }) => (
  <div style={{ display: "flex", background: "#111318", border: "1px solid #181C22", borderRadius: 8, padding: 4, gap: 4, marginBottom: 28 }}>
    <button className="tab-btn" style={active === "reg" ? { background: "#E8F400", color: "#0A0B0D" } : { background: "transparent", color: "#5A6478" }} onClick={onReg}>
      Create account
    </button>
    <button className="tab-btn" style={active === "login" ? { background: "#E8F400", color: "#0A0B0D" } : { background: "transparent", color: "#5A6478" }} onClick={onLogin}>
      Log in
    </button>
  </div>
);

/* ─── Check circle ─── */
const CheckIcon = () => (
  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#00D68A22", border: "1px solid #00D68A44", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, color: "#00D68A" }}>✓</div>
);

/* ─── Plan card ─── */
const PlanCard = ({ id, name, price, desc, badge, selected, onSelect }) => (
  <div className="plan-card" style={{ background: selected ? "#0f1000" : "#0D0F13", border: `1px solid ${selected ? "#E8F400" : "#181C22"}` }} onClick={() => onSelect(id)}>
    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${selected ? "#E8F400" : "#22272F"}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {selected && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#E8F400" }} />}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{name}</span>
          {badge && <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: "#E8F40020", color: "#E8F400", border: "1px solid #E8F40044" }}>{badge}</span>}
        </div>
        <span style={{ fontSize: 15, fontWeight: 800 }}>{price}<span style={{ fontSize: 11, fontWeight: 400, color: "#5A6478" }}>/mo</span></span>
      </div>
      <div style={{ fontSize: 11, color: "#5A6478", marginTop: 2 }}>{desc}</div>
    </div>
  </div>
);

/* ─── Carrier card ─── */
const CarrierCard = ({ name, sub }) => {
  const [connected, setConnected] = useState(false);
  return (
    <div className="carrier-card"
      style={{ background: connected ? "#0d1f0d" : "#0D0F13", border: `1px solid ${connected ? "#00D68A44" : "#22272F"}` }}
      onClick={() => setConnected(v => !v)}>
      <div className="carrier-pulse" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 11, color: "#5A6478" }}>{sub}</div>
      </div>
      <div style={{ fontSize: 11, color: connected ? "#00D68A" : "#E8F400" }}>{connected ? "Connected ✓" : "Connect →"}</div>
    </div>
  );
};

/* ─── Step 1 ─── */
const Step1 = ({ onNext }) => {
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { score, color, label } = getStrength(pass);
  return (
    <div className="form-anim" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Create your account</div>
        <div style={{ fontSize: 13, color: "#5A6478", marginBottom: 24 }}>Takes under 2 minutes. No credit card.</div>
      </div>
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
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#5A6478", fontWeight: 600 }}>+91</span>
        </div>
      </div>
      <div>
        <Label>Password</Label>
        <div style={{ position: "relative" }}>
          <Inp type={showPass ? "text" : "password"} placeholder="Min 8 characters" id="reg-pass" extraStyle={{ paddingRight: 40 }} onInput={e => setPass(e.target.value)} />
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#5A6478" }} onClick={() => setShowPass(v => !v)}>
            <EyeIcon />
          </span>
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="strength-bar" style={{ background: i < score ? color : "#181C22" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color, marginTop: 4 }}>{label}</div>
      </div>
      <BtnY onClick={onNext}>Continue →</BtnY>
      <Divider />
      <BtnG><GoogleIcon /> Continue with Google</BtnG>
    </div>
  );
};

/* ─── Step 2 ─── */
const Step2 = ({ onNext, onBack }) => (
  <div className="form-anim" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Tell us about your business</div>
      <div style={{ fontSize: 13, color: "#5A6478", marginBottom: 24 }}>Helps us configure the right carriers for your routes.</div>
    </div>
    <div>
      <Label>Business name</Label>
      <Inp placeholder="Maity Textiles Pvt Ltd" id="biz-name" />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
    <div style={{ display: "flex", gap: 10 }}>
      <BtnG extraStyle={{ width: "auto", flexShrink: 0 }} onClick={onBack}>← Back</BtnG>
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
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Choose your plan</div>
      <div style={{ fontSize: 13, color: "#5A6478", marginBottom: 20 }}>14-day free trial on all plans. Cancel anytime.</div>
      {plans.map(p => <PlanCard key={p.id} {...p} selected={selected === p.id} onSelect={setSelected} />)}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <BtnG extraStyle={{ width: "auto", flexShrink: 0 }} onClick={onBack}>← Back</BtnG>
        <BtnY onClick={onNext}>Continue →</BtnY>
      </div>
    </div>
  );
};

/* ─── Step 4 ─── */
const Step4 = ({ onNext, onBack, onSkip }) => (
  <div className="form-anim">
    <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Connect your first carrier</div>
    <div style={{ fontSize: 13, color: "#5A6478", marginBottom: 20 }}>You can skip and add later from Settings.</div>
    <CarrierCard name="Delhivery" sub="Surface + Air · 94.2% on-time" />
    <CarrierCard name="Shiprocket" sub="Multi-carrier aggregator" />
    <CarrierCard name="Bluedart" sub="Premium express · D+1 in metros" />
    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
      <BtnG extraStyle={{ width: "auto", flexShrink: 0 }} onClick={onBack}>← Back</BtnG>
      <BtnY onClick={onNext}>Create account →</BtnY>
    </div>
    <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#5A6478" }}>
      <span style={{ color: "#E8F400", cursor: "pointer" }} onClick={onSkip}>Skip for now →</span>
    </div>
  </div>
);

/* ─── Step Success ─── */
const StepSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="form-anim" style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#00D68A22", border: "2px solid #00D68A55", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22, color: "#00D68A" }}>✓</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>You're live!</div>
      <div style={{ fontSize: 14, color: "#8494A8", marginBottom: 24, lineHeight: 1.6 }}>Account created. First shipment is one click away.</div>
      <BtnY onClick={() => navigate('/dashboard')} extraStyle={{ marginBottom: 12 }}>Go to dashboard →</BtnY>
      <div style={{ fontSize: 12, color: "#5A6478" }}>Check your email for a verification link</div>
    </div>
  );
};

/* ─── Register View ─── */
const RegisterView = () => {
  const [step, setStep] = useState(2);
  const [success, setSuccess] = useState(false);
  const goStep = n => { setStep(n); setSuccess(false); };
  return (
    <div>
      {!success && <StepDots current={step} />}
      {success ? <StepSuccess />
        : step === 1 ? <Step1 onNext={() => goStep(2)} />
        : step === 2 ? <Step2 onNext={() => goStep(3)} onBack={() => goStep(1)} />
        : step === 3 ? <Step3 onNext={() => goStep(4)} onBack={() => goStep(2)} />
        : <Step4 onNext={() => setSuccess(true)} onBack={() => goStep(3)} onSkip={() => setSuccess(true)} />
      }
    </div>
  );
};

/* ─── Login View ─── */
const LoginView = ({ onShowReg }) => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showError, setShowError] = useState(false);
  const tryLogin = () => { navigate('/dashboard'); };
  return (
    <div className="form-anim">
      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Welcome back</div>
      <div style={{ fontSize: 13, color: "#5A6478", marginBottom: 24 }}>Log in to your Movetto dashboard</div>
      {showError && (
        <div style={{ background: "#200808", border: "1px solid #FF5C3833", borderRadius: 6, padding: "10px 14px", fontSize: 13, color: "#FF5C38", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <AlertIcon /> Invalid email or password. Please try again.
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <Label>Email</Label>
          <Inp placeholder="you@yourbusiness.com" id="log-email" />
        </div>
        <div>
          <Label>Password</Label>
          <div style={{ position: "relative" }}>
            <Inp type={showPass ? "text" : "password"} placeholder="Your password" id="log-pass" extraStyle={{ paddingRight: 40 }} />
            <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#5A6478" }} onClick={() => setShowPass(v => !v)}>
              <EyeIcon />
            </span>
          </div>
          <div style={{ textAlign: "right", marginTop: 6 }}>
            <span style={{ fontSize: 12, color: "#E8F400", cursor: "pointer" }}>Forgot password?</span>
          </div>
        </div>
        <BtnY onClick={tryLogin}>Log in to dashboard →</BtnY>
        <Divider />
        <BtnG><GoogleIcon /> Continue with Google</BtnG>
      </div>
      <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#5A6478" }}>
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
          {item.label} <span style={{ color: "#EEF2F6", fontFamily: "monospace" }}>{item.val}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Left Panel ─── */
const LeftPanel = () => (
  <div style={{ background: "#0D0F13", borderRight: "1px solid #181C22", padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <div>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "#E8F400", textTransform: "uppercase", marginBottom: 16 }}>Why Movetto</div>
      <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>Your business ships<br />to 40 cities.</div>
      <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, color: "#5A6478" }}>You're still managing<br />it on WhatsApp.</div>
      <div style={{ fontSize: 14, color: "#8494A8", lineHeight: 1.7, marginBottom: 28 }}>
        Movetto gives you one screen to book, track, and optimise every shipment across every carrier in India.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {[
          "Live in under 10 minutes — no sales call needed",
          "Compare rates from 12+ carriers instantly",
          "WhatsApp-native booking and customer alerts",
          "Auto invoice reconciliation — zero Excel work",
        ].map((text, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#D8E0E8" }}>
            <CheckIcon />
            {text}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #181C22", paddingTop: 20 }}>
        <div style={{ fontSize: 11, color: "#5A6478", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>Live platform stats</div>
        {[
          { label: "Shipments booked today", val: "1,247", valColor: "#EEF2F6" },
          { label: "Avg savings vs direct booking", val: "₹203", valColor: "#E8F400" },
          { label: "On-time delivery rate", val: "94.2%", valColor: "#00D68A" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#111318", border: "1px solid #181C22", borderRadius: 8, padding: "12px 16px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "#8494A8" }}>{s.label}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: s.valColor }}>{s.val}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ background: "#111318", border: "1px solid #181C22", borderRadius: 8, padding: 14, marginTop: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a2e1a", border: "1px solid #00D68A33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#00D68A", flexShrink: 0 }}>SP</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Sneha Pillai</div>
          <div style={{ fontSize: 11, color: "#5A6478" }}>Founder · Bangalore pharma wholesaler</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#B0BCCC", lineHeight: 1.6, fontStyle: "italic" }}>
        "Rate comparison alone saves us ₹18,000 a month. Took 8 minutes to set up."
      </div>
    </div>
  </div>
);

/* ─── Main Auth Component ─── */
export default function Auth() {
  const [view, setView] = useState("reg");

  return (
    <div style={{ background: "#0A0B0D", fontFamily: "'Inter', system-ui, sans-serif", color: "#EEF2F6", width: "100%", minHeight: "100vh" }}>
      <GlobalStyles />

      {/* Header */}
      <div style={{ background: "#0A0B0D", borderBottom: "1px solid #181C22", padding: "0 28px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "0.06em" }}>
          MOVE<span style={{ color: "#E8F400" }}>.</span>TTO
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#5A6478" }}>
          <span className="dot-live" /> 100+ businesses live
        </div>
        <div style={{ fontSize: 12, color: "#5A6478" }}>
          Already have an account?{" "}
          <span style={{ color: "#E8F400", cursor: "pointer" }} onClick={() => setView("login")}>Log in →</span>
        </div>
      </div>

      {/* Two-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 600 }}>
        <LeftPanel />

        {/* Right auth panel */}
        <div style={{ padding: "32px 36px", background: "#0A0B0D" }}>
          <Tabs
            active={view}
            onReg={() => setView("reg")}
            onLogin={() => setView("login")}
          />
          {view === "reg"
            ? <RegisterView />
            : <LoginView onShowReg={() => setView("reg")} />
          }
        </div>
      </div>

      {/* Ticker */}
      <Ticker />
    </div>
  );
}