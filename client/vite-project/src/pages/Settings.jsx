import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useStore from "../store/useStore";

const C = {
  bg:"var(--mv-bg)", panel:"var(--mv-panel)", card:"var(--mv-card)",
  border:"var(--mv-border)", border2:"var(--mv-border-2)",
  text:"var(--mv-text)", muted:"var(--mv-muted)", dim:"var(--mv-dim)",
  yellow:"var(--mv-yellow)", green:"var(--mv-green)", red:"var(--mv-red)", amber:"var(--mv-amber)", blue:"var(--mv-blue)",
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--mv-bg); font-family: 'Sora', sans-serif; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--mv-bg); }
    ::-webkit-scrollbar-thumb { background: var(--mv-border-2); border-radius: 2px; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin { to{transform:rotate(360deg)} }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .inp {
      width: 100%; background: var(--mv-panel); border: 1px solid var(--mv-border);
      border-radius: 8px; padding: 14px 16px; font-size: 15px;
      color: var(--mv-text); outline: none; font-family: 'Sora', sans-serif;
      transition: border-color 0.2s;
    }
    .inp:focus { border-color: var(--mv-yellow); }
    .inp::placeholder { color: var(--mv-dimmer); }
    .inp:disabled { opacity: 0.5; cursor: not-allowed; }
    .inp-label {
      font-size: 13px; color: var(--mv-dim); text-transform: uppercase;
      letter-spacing: 0.09em; margin-bottom: 8px; display: block;
    }
    .save-btn {
      background: var(--mv-yellow); color: var(--mv-yellow-contrast); border: none;
      padding: 14px 28px; border-radius: 8px; font-size: 15px;
      font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif;
      transition: opacity 0.2s;
    }
    .save-btn:hover { opacity: 0.88; }
    .save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .ghost-btn {
      background: transparent; color: var(--mv-muted);
      border: 1px solid var(--mv-border-2); padding: 14px 28px;
      border-radius: 8px; font-size: 15px; cursor: pointer;
      font-family: 'Sora', sans-serif; transition: all 0.2s;
    }
    .ghost-btn:hover { border-color: var(--mv-dim); color: var(--mv-text); }
    .danger-btn {
      background: transparent; color: var(--mv-red);
      border: 1px solid color-mix(in srgb, var(--mv-red) 20%, transparent); padding: 14px 28px;
      border-radius: 8px; font-size: 15px; cursor: pointer;
      font-family: 'Sora', sans-serif; transition: all 0.2s;
    }
    .danger-btn:hover { border-color: color-mix(in srgb, var(--mv-red) 40%, transparent); background: color-mix(in srgb, var(--mv-red) 10%, transparent); }
    .tab-btn {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 20px; border-radius: 8px; font-size: 15px;
      cursor: pointer; border: none; background: transparent;
      color: var(--mv-dim); font-family: 'Sora', sans-serif;
      transition: all 0.15s; text-align: left; width: 100%;
    }
    .tab-btn:hover { color: var(--mv-text); background: var(--mv-card); }
    .tab-btn.active { color: var(--mv-text); background: var(--mv-card); border-left: 3px solid var(--mv-yellow); }
    .setting-card {
      background: var(--mv-card); border: 1px solid var(--mv-border);
      border-radius: 12px; padding: 32px; margin-bottom: 24px;
      animation: fadeIn 0.3s ease;
    }
    .toggle-wrap {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 0; border-bottom: 1px solid #1A1F2833;
    }
    .toggle-wrap:last-child { border-bottom: none; padding-bottom: 0; }
    .toggle {
      width: 48px; height: 28px; border-radius: 14px;
      cursor: pointer; transition: background 0.2s;
      display: flex; align-items: center; padding: 0 3px;
      flex-shrink: 0;
    }
    .toggle-knob {
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--mv-text); transition: transform 0.2s;
    }
    .spinner {
      width: 20px; height: 20px; border: 2px solid var(--mv-border-2);
      border-top-color: var(--mv-yellow); border-radius: 50%;
      animation: spin 0.7s linear infinite; display: inline-block;
    }
    .select-inp {
      width: 100%; background: var(--mv-panel); border: 1px solid var(--mv-border);
      border-radius: 8px; padding: 14px 16px; font-size: 15px;
      color: var(--mv-text); outline: none; font-family: 'Sora', sans-serif;
      cursor: pointer; appearance: none;
    }
    .select-inp:focus { border-color: var(--mv-yellow); }
    .select-inp option { background: var(--mv-panel); }
    .success-toast {
      background: color-mix(in srgb, var(--mv-green) 15%, transparent); border: 1px solid color-mix(in srgb, var(--mv-green) 20%, transparent);
      border-radius: 8px; padding: 16px 20px; font-size: 15px;
      color: var(--mv-green); margin-bottom: 20px;
      display: flex; align-items: center; gap: 10px;
      animation: fadeIn 0.3s ease;
    }
    .error-toast {
      background: color-mix(in srgb, var(--mv-red) 15%, transparent); border: 1px solid color-mix(in srgb, var(--mv-red) 20%, transparent);
      border-radius: 8px; padding: 16px 20px; font-size: 15px;
      color: var(--mv-red); margin-bottom: 20px;
      display: flex; align-items: center; gap: 10px;
      animation: fadeIn 0.3s ease;
    }

    @media (max-width: 768px) {
      .header-container { padding: 0 16px !important; height: 68px !important; }
      .main-content-pad {
        padding: 24px 16px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 24px !important;
      }
      .settings-sidebar {
        display: flex;
        flex-direction: row !important;
        overflow-x: auto;
        gap: 8px;
        padding-bottom: 4px;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .settings-sidebar::-webkit-scrollbar { display: none; }
      .settings-sidebar > button {
        white-space: nowrap;
        flex-shrink: 0;
        width: auto !important;
      }
      .settings-sidebar > button.active {
        border-left: none !important;
        border-bottom: 3px solid var(--mv-yellow) !important;
      }
      .setting-card { padding: 24px 20px !important; }
      .form-grid {
        display: flex !important;
        flex-direction: column !important;
      }
      .form-grid > div { flex: 1 1 100% !important; }
      .danger-row {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 16px !important;
      }
      .danger-row button { width: 100%; }
    }

    @media (max-width: 480px) {
      .header-container { padding: 0 12px !important; }
      .header-dash-text { display: none; }
      .header-title { font-size: 14px !important; }
      
      .main-content-pad { padding: 16px 12px !important; display: flex !important; flex-direction: column !important; gap: 20px !important; }
      
      .settings-sidebar { display: flex; flex-direction: row !important; overflow-x: auto; gap: 8px; padding-bottom: 4px; scrollbar-width: none; -ms-overflow-style: none; }
      .settings-sidebar::-webkit-scrollbar { display: none; }
      .settings-sidebar > button { white-space: nowrap; flex-shrink: 0; padding: 10px 14px !important; width: auto !important; font-size: 13px !important; }
      .settings-sidebar > button.active { border-left: none !important; border-bottom: 3px solid var(--mv-yellow) !important; }
      
      .setting-card { padding: 20px 16px !important; }
      .form-grid { flex-direction: column !important; display: flex !important; }
      .form-grid > div { flex: 1 1 100% !important; }
      
      .danger-row { flex-direction: column; align-items: flex-start !important; gap: 16px !important; padding: 16px 0 !important; }
      .danger-row button { width: 100%; }
    }
  `}</style>
);

/* ─── Toggle Switch ─── */
const Toggle = ({ value, onChange }) => (
  <div
    className="toggle"
    style={{background: value ? C.green : C.border2}}
    onClick={() => onChange(!value)}
  >
    <div
      className="toggle-knob"
      style={{transform: value ? "translateX(20px)" : "translateX(0)"}}
    />
  </div>
);

/* ─── Section Header ─── */
const SectionHead = ({ title, sub }) => (
  <div style={{marginBottom:24, paddingBottom:16, borderBottom:`1px solid ${C.border}`}}>
    <div style={{fontSize:18, fontWeight:700}}>{title}</div>
    {sub && <div style={{fontSize:14, color:C.dim, marginTop:4}}>{sub}</div>}
  </div>
);

/* ─── Field ─── */
const Field = ({ label, id, placeholder, value, onChange, disabled, type="text", half }) => (
  <div style={{flex: half ? "0 0 calc(50% - 6px)" : "1 1 100%"}}>
    <label className="inp-label" htmlFor={id}>{label}</label>
    <input
      id={id} type={type} className="inp"
      placeholder={placeholder} value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    />
  </div>
);

/* ─── MAIN COMPONENT ─── */
export default function Settings() {
  const navigate       = useNavigate();
  const user           = useStore((s) => s.user);

  const [tab,          setTab]          = useState("profile");
  const [saving,       setSaving]       = useState(false);
  const [successMsg,   setSuccessMsg]   = useState("");
  const [errorMsg,     setErrorMsg]     = useState("");

  /* ── Profile form ── */
  const [profile, setProfile] = useState({
    name:  "", email: "", phone: "",
  });

  /* ── Business form ── */
  const [business, setBusiness] = useState({
    name: "", city: "", pincode: "", gstin: "",
    businessType: "other", monthlyVolume: "50-200",
    whatsappNumber: "",
  });

  /* ── Notification toggles ── */
  const [notifs, setNotifs] = useState({
    shipmentBooked:   true,
    statusUpdates:    true,
    deliveryAlert:    true,
    rtoAlert:         true,
    invoiceReady:     true,
    weeklyReport:     false,
    marketingEmails:  false,
  });

  /* ── Password form ── */
  const [passwords, setPasswords] = useState({
    current: "", newPass: "", confirm: "",
  });

  /* ── Load user data ── */
  useEffect(() => {
    if (user) {
      setProfile({
        name:  user.name  || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      if (user.business) {
        setBusiness({
          name:           user.business.name           || "",
          city:           user.business.address?.city  || "",
          pincode:        user.business.address?.pincode || "",
          gstin:          user.business.gstin          || "",
          businessType:   user.business.businessType   || "other",
          monthlyVolume:  user.business.monthlyVolume  || "50-200",
          whatsappNumber: user.business.whatsappNumber || "",
        });
      }
    }
  }, [user]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setErrorMsg("");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const showError = (msg) => {
    setErrorMsg(msg);
    setSuccessMsg("");
    setTimeout(() => setErrorMsg(""), 4000);
  };

  /* ── Save profile ── */
  const saveProfile = async () => {
  if (!profile.name.trim()) { showError("Name is required"); return; }
  setSaving(true);
  try {
    await api.put("/auth/profile", {
      name:  profile.name,
      phone: profile.phone,
    });
    showSuccess("Profile updated successfully!");
  } catch (err) {
    showError(err.response?.data?.message || "Failed to save profile.");
  } finally {
    setSaving(false);
  }
};

  /* ── Save business ── */
  const saveBusiness = async () => {
    if (!business.name.trim()) { showError("Business name is required"); return; }
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      showSuccess("Business details updated!");
    } catch {
      showError("Failed to save business details.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Change password ── */
  const changePassword = async () => {
  if (!passwords.current)                      { showError("Current password is required"); return; }
  if (passwords.newPass.length < 8)            { showError("New password must be 8+ characters"); return; }
  if (passwords.newPass !== passwords.confirm) { showError("Passwords do not match"); return; }
  setSaving(true);
  try {
    await api.put("/auth/password", {
      currentPassword: passwords.current,
      newPassword:     passwords.newPass,
    });
    setPasswords({ current:"", newPass:"", confirm:"" });
    showSuccess("Password changed successfully!");
  } catch (err) {
    showError(err.response?.data?.message || "Failed to change password. Check current password.");
  } finally {
    setSaving(false);
  }
};

  /* ── Save notifications ── */
  const saveNotifs = async () => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      showSuccess("Notification preferences saved!");
    } catch {
      showError("Failed to save notification preferences.");
    }
    finally { setSaving(false); }
  };

  const tabs = [
    { key:"profile",       label:"Profile",            icon:"👤" },
    { key:"business",      label:"Business details",   icon:"🏢" },
    { key:"notifications", label:"Notifications",      icon:"🔔" },
    { key:"security",      label:"Security",           icon:"🔒" },
    { key:"danger",        label:"Danger zone",        icon:"⚠️" },
  ];

  const updateProfile  = (k) => (v) => setProfile(prev  => ({...prev,  [k]:v}));
  const updateBusiness = (k) => (v) => setBusiness(prev => ({...prev,  [k]:v}));
  const updatePasswords = (k) => (v) => setPasswords(prev => ({...prev, [k]:v}));

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "KM";

  return (
    <div style={{background:C.bg, minHeight:"100vh", fontFamily:"'Sora',sans-serif", color:C.text}}>
      <GlobalStyles/>

      {/* Header */}
      <div className="header-container" style={{
        background:C.panel, borderBottom:`1px solid ${C.border}`,
        padding:"0 32px", height:76,
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{display:"flex", alignItems:"center", gap:16}}>
          <div
            onClick={() => navigate("/dashboard")}
            style={{display:"flex", alignItems:"center", gap:10, color:C.dim, cursor:"pointer", fontSize:15}}
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="var(--mv-dim)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="header-dash-text">Dashboard</span>
          </div>
          <div style={{width:1, height:20, background:C.border}}/>
          <div className="header-title" style={{fontSize:18, fontWeight:700}}>Settings</div>
        </div>
      </div>

      <div className="main-content-pad" style={{maxWidth:1024, margin:"0 auto", padding:"32px 24px", display:"grid", gridTemplateColumns:"240px 1fr", gap:32}}>

        {/* Sidebar nav */}
        <div>
          {/* Avatar */}
          <div style={{
            background:C.card, border:`1px solid ${C.border}`,
            borderRadius:12, padding:20, marginBottom:16, textAlign:"center",
          }}>
            <div style={{
              width:80, height:80, borderRadius:"50%",
              background:"color-mix(in srgb, var(--mv-green) 15%, transparent)", border:"2px solid color-mix(in srgb, var(--mv-green) 25%, transparent)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:24, fontWeight:700, color:"var(--mv-green)",
              margin:"0 auto 12px",
            }}>
              {initials}
            </div>
            <div style={{fontSize:16, fontWeight:700}}>{user?.name || "User"}</div>
            <div style={{fontSize:14, color:C.dim, marginTop:4}}>{user?.email || ""}</div>
            <div style={{
              marginTop:12, fontSize:13,
              background:"color-mix(in srgb, var(--mv-yellow) 10%, transparent)", border:"1px solid color-mix(in srgb, var(--mv-yellow) 20%, transparent)",
              color:"var(--mv-yellow-text)", padding:"4px 12px", borderRadius:4,
              display:"inline-block", fontWeight:700,
            }}>
              {(user?.business?.subscription?.plan || "starter").toUpperCase()}
            </div>
          </div>

          {/* Nav */}
          <div className="settings-sidebar" style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:8, display:"flex", flexDirection:"column"}}>
            {tabs.map(t => (
              <button
                key={t.key}
                className={`tab-btn${tab === t.key ? " active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                <span style={{fontSize:18}}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {/* Toasts */}
          {successMsg && (
            <div className="success-toast">
              <span style={{fontSize:20}}>✓</span> {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="error-toast">
              <span style={{fontSize:20}}>✕</span> {errorMsg}
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {tab === "profile" && (
            <div className="setting-card">
              <SectionHead title="Profile information" sub="Your personal account details"/>
              <div className="form-grid" style={{display:"flex", flexWrap:"wrap", gap:12, marginBottom:20}}>
                <Field label="Full name"    id="name"  placeholder="Kousik Maity"          value={profile.name}  onChange={updateProfile("name")}  half/>
                <Field label="Email"        id="email" placeholder="you@business.com"       value={profile.email} onChange={updateProfile("email")} half disabled/>
                <Field label="Phone number" id="phone" placeholder="+91 98765 43210"        value={profile.phone} onChange={updateProfile("phone")}/>
              </div>
              <div style={{fontSize:14, color:C.dim, marginBottom:20, padding:16, background:C.panel, borderRadius:8}}>
                📧 Email cannot be changed. Contact support if you need to update your email address.
              </div>
              <button className="save-btn" onClick={saveProfile} disabled={saving}>
                {saving ? <span style={{display:"flex", alignItems:"center", gap:8}}><span className="spinner"/> Saving...</span> : "Save profile"}
              </button>
            </div>
          )}

          {/* ── BUSINESS TAB ── */}
          {tab === "business" && (
            <div className="setting-card">
              <SectionHead title="Business details" sub="Your company information used for shipments and invoices"/>
              <div className="form-grid" style={{display:"flex", flexWrap:"wrap", gap:12, marginBottom:20}}>
                <Field label="Business name"    id="bname"   placeholder="Maity Textiles Pvt Ltd"  value={business.name}    onChange={updateBusiness("name")}/>
                <Field label="City"             id="bcity"   placeholder="Mumbai"                   value={business.city}    onChange={updateBusiness("city")}   half/>
                <Field label="Pincode"          id="bpin"    placeholder="400001"                   value={business.pincode} onChange={updateBusiness("pincode")} half/>
                <Field label="GSTIN (optional)" id="bgst"    placeholder="22AAAAA0000A1Z5"          value={business.gstin}   onChange={updateBusiness("gstin")}/>
                <div style={{flex:"0 0 calc(50% - 6px)"}}>
                  <label className="inp-label">Business type</label>
                  <select className="select-inp" value={business.businessType} onChange={e => updateBusiness("businessType")(e.target.value)}>
                    <option value="textile">Textile / Garments</option>
                    <option value="electronics">Electronics</option>
                    <option value="pharma">Pharma / Healthcare</option>
                    <option value="fmcg">FMCG / Food</option>
                    <option value="auto">Auto Parts</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div style={{flex:"0 0 calc(50% - 6px)"}}>
                  <label className="inp-label">Monthly shipments</label>
                  <select className="select-inp" value={business.monthlyVolume} onChange={e => updateBusiness("monthlyVolume")(e.target.value)}>
                    <option value="<50">Less than 50</option>
                    <option value="50-200">50 – 200</option>
                    <option value="200-1000">200 – 1,000</option>
                    <option value="1000-5000">1,000 – 5,000</option>
                    <option value="5000+">5,000+</option>
                  </select>
                </div>
              </div>

              {/* WhatsApp */}
              <div style={{
                background:C.panel, border:`1px solid ${C.border}`,
                borderLeft:`3px solid ${C.green}`,
                borderRadius:"0 8px 8px 0", padding:16, marginBottom:20,
              }}>
                <div style={{fontSize:16, fontWeight:700, marginBottom:6}}>
                  📱 WhatsApp number
                </div>
                <div style={{fontSize:14, color:C.dim, marginBottom:16}}>
                  Used for booking notifications and customer alerts
                </div>
                <Field
                  label="WhatsApp number"
                  id="whatsapp"
                  placeholder="+91 98765 43210"
                  value={business.whatsappNumber}
                  onChange={updateBusiness("whatsappNumber")}
                />
              </div>

              <button className="save-btn" onClick={saveBusiness} disabled={saving}>
                {saving ? <span style={{display:"flex", alignItems:"center", gap:8}}><span className="spinner"/> Saving...</span> : "Save business details"}
              </button>
            </div>
          )}

          {/* ── NOTIFICATIONS TAB ── */}
          {tab === "notifications" && (
            <div className="setting-card">
              <SectionHead title="Notification preferences" sub="Control what alerts you receive and how"/>

              <div style={{marginBottom:20}}>
                <div style={{fontSize:14, color:C.dim, marginBottom:16, textTransform:"uppercase", letterSpacing:"0.08em"}}>
                  Shipment alerts
                </div>
                {[
                  { key:"shipmentBooked",  label:"Shipment booked",      sub:"When a new shipment is confirmed" },
                  { key:"statusUpdates",   label:"Status updates",       sub:"When carrier updates shipment status" },
                  { key:"deliveryAlert",   label:"Delivery confirmation", sub:"When shipment is delivered" },
                  { key:"rtoAlert",        label:"RTO alerts",           sub:"When a shipment is returned" },
                ].map(item => (
                  <div key={item.key} className="toggle-wrap">
                    <div>
                      <div style={{fontSize:16, fontWeight:600}}>{item.label}</div>
                      <div style={{fontSize:14, color:C.dim, marginTop:4}}>{item.sub}</div>
                    </div>
                    <Toggle value={notifs[item.key]} onChange={v => setNotifs(p => ({...p, [item.key]:v}))}/>
                  </div>
                ))}
              </div>

              <div style={{marginBottom:20}}>
                <div style={{fontSize:14, color:C.dim, marginBottom:16, textTransform:"uppercase", letterSpacing:"0.08em"}}>
                  Business alerts
                </div>
                {[
                  { key:"invoiceReady",    label:"Invoice ready",        sub:"When monthly invoice is generated" },
                  { key:"weeklyReport",    label:"Weekly report",        sub:"Summary of the week's shipments" },
                  { key:"marketingEmails", label:"Product updates",      sub:"New features and improvements" },
                ].map(item => (
                  <div key={item.key} className="toggle-wrap">
                    <div>
                      <div style={{fontSize:16, fontWeight:600}}>{item.label}</div>
                      <div style={{fontSize:14, color:C.dim, marginTop:4}}>{item.sub}</div>
                    </div>
                    <Toggle value={notifs[item.key]} onChange={v => setNotifs(p => ({...p, [item.key]:v}))}/>
                  </div>
                ))}
              </div>

              <button className="save-btn" onClick={saveNotifs} disabled={saving}>
                {saving ? <span style={{display:"flex", alignItems:"center", gap:8}}><span className="spinner"/> Saving...</span> : "Save preferences"}
              </button>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {tab === "security" && (
            <div className="setting-card">
              <SectionHead title="Security" sub="Manage your password and account security"/>

              <div className="form-grid" style={{display:"flex", flexDirection:"column", gap:12, marginBottom:20}}>
                <div>
                  <label className="inp-label">Current password</label>
                  <input
                    type="password" className="inp"
                    placeholder="Enter current password"
                    value={passwords.current}
                    onChange={e => updatePasswords("current")(e.target.value)}
                  />
                </div>
                <div>
                  <label className="inp-label">New password</label>
                  <input
                    type="password" className="inp"
                    placeholder="Min 8 characters"
                    value={passwords.newPass}
                    onChange={e => updatePasswords("newPass")(e.target.value)}
                  />
                </div>
                <div>
                  <label className="inp-label">Confirm new password</label>
                  <input
                    type="password" className="inp"
                    placeholder="Repeat new password"
                    value={passwords.confirm}
                    onChange={e => updatePasswords("confirm")(e.target.value)}
                  />
                </div>
              </div>

              <button className="save-btn" onClick={changePassword} disabled={saving}>
                {saving ? <span style={{display:"flex", alignItems:"center", gap:8}}><span className="spinner"/> Updating...</span> : "Change password"}
              </button>

              {/* Sessions */}
              <div style={{
                marginTop:28, paddingTop:20,
                borderTop:`1px solid ${C.border}`,
              }}>
                <div style={{fontSize:18, fontWeight:700, marginBottom:6}}>Active sessions</div>
                <div style={{fontSize:14, color:C.dim, marginBottom:20}}>
                  Devices currently logged in to your account
                </div>
                <div style={{
                  background:C.panel, border:`1px solid ${C.border}`,
                  borderRadius:8, padding:20,
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                }}>
                  <div style={{display:"flex", alignItems:"center", gap:12}}>
                    <div style={{
                      width:48, height:48, borderRadius:10,
                  background:"color-mix(in srgb, var(--mv-yellow) 10%, transparent)", border:"1px solid color-mix(in srgb, var(--mv-yellow) 20%, transparent)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:24,
                    }}>💻</div>
                    <div>
                      <div style={{fontSize:16, fontWeight:600}}>Current session</div>
                      <div style={{fontSize:14, color:C.dim, marginTop:4}}>
                        Chrome · Windows · Active now
                      </div>
                    </div>
                  </div>
                  <div style={{
                fontSize:13, background:"color-mix(in srgb, var(--mv-green) 10%, transparent)",
                border:"1px solid color-mix(in srgb, var(--mv-green) 20%, transparent)", color:C.green,
                    padding:"4px 12px", borderRadius:4, fontWeight:700,
                  }}>
                    CURRENT
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── DANGER ZONE TAB ── */}
          {tab === "danger" && (
            <div className="setting-card" style={{border:`1px solid color-mix(in srgb, var(--mv-red) 20%, transparent)`}}>
              <SectionHead title="Danger zone" sub="Irreversible actions — proceed with caution"/>

              {[
                {
                  title:  "Export all data",
                  sub:    "Download all your shipments, analytics and business data as CSV",
                  btn:    "Export data",
                  type:   "ghost",
                  action: () => showSuccess("Export started — you will receive an email shortly"),
                },
                {
                  title:  "Clear shipment history",
                  sub:    "Permanently delete all shipment records older than 90 days",
                  btn:    "Clear history",
                  type:   "danger",
                  action: () => showError("This feature requires confirmation — contact support"),
                },
                {
                  title:  "Delete account",
                  sub:    "Permanently delete your Movetto account and all associated data. This cannot be undone.",
                  btn:    "Delete account",
                  type:   "danger",
                  action: () => showError("To delete your account, please contact support@movetto.com"),
                },
              ].map((item, i) => (
                <div key={i} className="danger-row" style={{
                  display:"flex", alignItems:"center",
                  justifyContent:"space-between", gap:20,
                  padding:"24px 0",
                  borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
                }}>
                  <div>
                    <div style={{fontSize:16, fontWeight:700}}>{item.title}</div>
                    <div style={{fontSize:14, color:C.dim, marginTop:4, lineHeight:1.5}}>
                      {item.sub}
                    </div>
                  </div>
                  <button
                    className={item.type === "danger" ? "danger-btn" : "ghost-btn"}
                    onClick={item.action}
                    style={{whiteSpace:"nowrap"}}
                  >
                    {item.btn}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
