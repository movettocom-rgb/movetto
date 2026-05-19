import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .carrier-card {
      background: var(--mv-card); border: 1px solid var(--mv-border); border-radius: 12px;
      padding: 28px; transition: border-color 0.2s; animation: fadeIn 0.3s ease;
    }
    .carrier-card:hover { border-color: var(--mv-border-2); }
  .carrier-card.connected { border-color: color-mix(in srgb, var(--mv-green) 30%, transparent); }
    .connect-btn {
    background: var(--mv-yellow); color: var(--mv-yellow-contrast); border: none;
      padding: 12px 24px; border-radius: 7px; font-size: 15px;
      font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif;
      transition: opacity 0.2s; white-space: nowrap;
    }
    .connect-btn:hover { opacity: 0.88; }
    .connect-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .disconnect-btn {
    background: transparent; color: var(--mv-red); border: 1px solid color-mix(in srgb, var(--mv-red) 30%, transparent);
      padding: 12px 24px; border-radius: 7px; font-size: 15px;
      font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif;
      transition: all 0.2s;
    }
  .disconnect-btn:hover { border-color: color-mix(in srgb, var(--mv-red) 60%, transparent); background: color-mix(in srgb, var(--mv-red) 10%, transparent); }
    .inp {
      width: 100%; background: var(--mv-panel); border: 1px solid var(--mv-border);
      border-radius: 7px; padding: 14px 16px; font-size: 15px;
      color: var(--mv-text); outline: none; font-family: 'Sora', sans-serif;
      transition: border-color 0.2s;
    }
  .inp:focus { border-color: var(--mv-yellow); }
    .inp::placeholder { color: var(--mv-dimmer); }
    .inp-label {
      font-size: 13px; color: var(--mv-dim); text-transform: uppercase;
      letter-spacing: 0.09em; margin-bottom: 8px; display: block;
    }
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7); display: flex; align-items: center;
      justify-content: center; z-index: 1000; animation: fadeIn 0.2s ease;
    }
    .modal {
      background: var(--mv-card); border: 1px solid var(--mv-border-2); border-radius: 14px;
      padding: 32px; width: 100%; max-width: 500px; animation: fadeIn 0.2s ease;
    }
    .stat-box {
      background: var(--mv-panel); border-radius: 8px; padding: 16px 20px; flex: 1;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner {
      width: 20px; height: 20px; border: 2px solid var(--mv-border-2);
      border-top-color: #E8F400; border-radius: 50%;
      animation: spin 0.7s linear infinite; display: inline-block;
    }

    @media (max-width: 480px) {
      .header-container { padding: 0 12px !important; }
      .header-dash-text { display: none; }
      .header-title { font-size: 14px !important; }
      .header-status { font-size: 12px !important; }
      .hide-mobile-text { display: none; }
      
      .main-content-pad { padding: 16px 12px !important; }
      .summary-grid { grid-template-columns: 1fr !important; gap: 12px !important; margin-bottom: 20px !important; }
      .summary-card { padding: 16px !important; }
      
      .filter-tabs { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; scrollbar-width: none; -ms-overflow-style: none; margin-bottom: 20px !important; }
      .filter-tabs::-webkit-scrollbar { display: none; }
      .filter-btn { white-space: nowrap; flex-shrink: 0; padding: 8px 14px !important; font-size: 13px !important; }
      
      .carrier-grid { grid-template-columns: 1fr !important; }
      .carrier-card { padding: 16px !important; }
      .stat-row { flex-direction: column !important; gap: 8px !important; }
      .stat-box { padding: 12px 16px !important; }
      
      .modal { padding: 20px !important; width: calc(100% - 24px) !important; margin: 12px; }
      .modal-header { flex-direction: column; align-items: flex-start !important; gap: 12px !important; }
      .modal-actions { flex-direction: column; gap: 10px; }
      .modal-actions button { width: 100%; }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .header-container { padding: 0 16px !important; height: 68px !important; }
      .main-content-pad { padding: 24px 16px !important; }
      .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 14px !important; margin-bottom: 24px !important; }
      .filter-tabs { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 4px; scrollbar-width: none; -ms-overflow-style: none; }
      .filter-tabs::-webkit-scrollbar { display: none; }
      .filter-btn { white-space: nowrap; flex-shrink: 0; }
      .carrier-grid { grid-template-columns: 1fr !important; }
      .carrier-card { padding: 20px !important; }
      .stat-row { flex-direction: column !important; gap: 10px !important; }
      .stat-box { width: 100%; }
      .modal { width: calc(100% - 32px) !important; }
    }

    @media (min-width: 481px) and (max-width: 640px) {
      .summary-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

/* ─── Carrier data ─── */
const CARRIERS = [
  {
    slug: "delhivery", name: "Delhivery",
    desc: "India's largest logistics company. Best for pan-India surface and express delivery.",
    onTimeRate: 96, coverage: "Pan India", maxWeight: "50 kg",
    services: ["Surface Express", "Air Express", "Heavy Goods"],
    color: C.green, initials: "DL",
    apiLabel: "Partner Token",
    apiPlaceholder: "Enter your Delhivery partner token",
    apiHelp: "Get your token from partners.delhivery.com",
  },
  {
    slug: "shiprocket", name: "Shiprocket",
    desc: "Multi-carrier aggregator. Access Bluedart, Ekart, Xpressbees through one integration.",
    onTimeRate: 91, coverage: "Pan India", maxWeight: "30 kg",
    services: ["Multi-carrier", "D2C Focused", "COD Available"],
    color: C.amber, initials: "SR",
    apiLabel: "API Email",
    apiPlaceholder: "your@email.com",
    apiHelp: "Use your Shiprocket account email",
  },
  {
    slug: "bluedart", name: "Bluedart",
    desc: "Premium express courier. Best for high-value shipments and metro-to-metro delivery.",
    onTimeRate: 98, coverage: "Metro + Tier 1", maxWeight: "75 kg",
    services: ["Same Day", "Next Day", "Premium Express"],
    color: C.blue, initials: "BD",
    apiLabel: "API Key",
    apiPlaceholder: "Enter your Bluedart API key",
    apiHelp: "Get from Bluedart developer portal",
  },
  {
    slug: "xpressbees", name: "XpressBees",
    desc: "Fast growing carrier. Strong regional presence in South and West India.",
    onTimeRate: 93, coverage: "Pan India", maxWeight: "25 kg",
    services: ["Express Delivery", "B2B Bulk", "Regional Fast"],
    color: C.yellow, initials: "XB",
    apiLabel: "API Key",
    apiPlaceholder: "Enter your XpressBees API key",
    apiHelp: "Get from XpressBees partner dashboard",
  },
  {
    slug: "dtdc", name: "DTDC",
    desc: "Most affordable carrier. Best for budget shipments and tier-2/3 city coverage.",
    onTimeRate: 85, coverage: "Pan India + Remote", maxWeight: "20 kg",
    services: ["Economy", "Standard", "Remote Area"],
    color: C.red, initials: "DC",
    apiLabel: "API Key",
    apiPlaceholder: "Enter your DTDC API key",
    apiHelp: "Get from DTDC business portal",
  },
  {
    slug: "ecomexpress", name: "Ecom Express",
    desc: "Specialist in D2C and ecommerce returns. Strong COD and RTO management.",
    onTimeRate: 89, coverage: "Pan India", maxWeight: "20 kg",
    services: ["D2C Delivery", "COD Specialist", "Returns"],
    color: C.muted, initials: "EC",
    apiLabel: "API Key",
    apiPlaceholder: "Enter your Ecom Express API key",
    apiHelp: "Get from Ecom Express partner portal",
  },
];

/* ─── Connect Modal ─── */
const ConnectModal = ({ carrier, onClose, onSuccess }) => {
  const [apiKey,    setApiKey]    = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      setError(`${carrier.apiLabel} is required`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/carriers/connect", {
        carrierSlug: carrier.slug,
        apiKey:      apiKey.trim(),
        apiSecret:   apiSecret.trim(),
      });
      onSuccess(carrier.slug);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">

        {/* Header */}
        <div className="modal-header" style={{display:"flex", alignItems:"center", gap:16, marginBottom:28}}>
          <div style={{
            width:52, height:52, borderRadius:10,
          background:`color-mix(in srgb, ${carrier.color} 10%, transparent)`, border:`1px solid color-mix(in srgb, ${carrier.color} 25%, transparent)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, fontWeight:800, color:carrier.color, flexShrink:0,
          }}>
            {carrier.initials}
          </div>
          <div>
            <div style={{fontSize:20, fontWeight:700}}>Connect {carrier.name}</div>
            <div style={{fontSize:14, color:C.dim, marginTop:4}}>{carrier.desc}</div>
          </div>
          <div
            onClick={onClose}
            style={{marginLeft:"auto", width:32, height:32, borderRadius:6, background:C.panel, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:20, color:C.dim, flexShrink:0}}
          >
            ×
          </div>
        </div>

        {/* Form */}
        <div style={{display:"flex", flexDirection:"column", gap:16, marginBottom:24}}>
          <div>
            <label className="inp-label">{carrier.apiLabel} *</label>
            <input
              className="inp"
              placeholder={carrier.apiPlaceholder}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
            <div style={{fontSize:13, color:C.dim, marginTop:6}}>
              💡 {carrier.apiHelp}
            </div>
          </div>

          {carrier.slug !== "shiprocket" && (
            <div>
              <label className="inp-label">API Secret (optional)</label>
              <input
                className="inp"
                placeholder="Enter API secret if required"
                type="password"
                value={apiSecret}
                onChange={e => setApiSecret(e.target.value)}
              />
            </div>
          )}

          {carrier.slug === "shiprocket" && (
            <div>
              <label className="inp-label">Password</label>
              <input
                className="inp"
                placeholder="Your Shiprocket password"
                type="password"
                value={apiSecret}
                onChange={e => setApiSecret(e.target.value)}
              />
            </div>
          )}
        </div>

        {error && (
          <div style={{background:"color-mix(in srgb, var(--mv-red) 10%, transparent)", border:"1px solid color-mix(in srgb, var(--mv-red) 30%, transparent)", borderRadius:7, padding:"12px 16px", fontSize:14, color:C.red, marginBottom:20}}>
            {error}
          </div>
        )}

        {/* Info box */}
        <div style={{background:C.panel, border:`1px solid ${C.border}`, borderRadius:8, padding:"16px 20px", marginBottom:24, fontSize:14, color:C.muted, lineHeight:1.6}}>
          <strong style={{color:C.text}}>What happens after connecting:</strong><br/>
          Your credentials are encrypted and stored securely. Movetto will use them to fetch live rates, book shipments, and sync tracking updates automatically.
        </div>

        {/* Buttons */}
        <div className="modal-actions" style={{display:"flex", gap:12}}>
          <button
            onClick={onClose}
            style={{background:"transparent", color:C.muted, border:`1px solid ${C.border2}`, padding:"12px 24px", borderRadius:7, fontSize:15, cursor:"pointer", fontFamily:"'Sora',sans-serif"}}
          >
            Cancel
          </button>
          <button
            className="connect-btn"
            style={{flex:1}}
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? (
              <span style={{display:"flex", alignItems:"center", justifyContent:"center", gap:8}}>
                <span className="spinner"/> Connecting...
              </span>
            ) : (
              `Connect ${carrier.name} →`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Carrier Card ─── */
const CarrierCard = ({ carrier, isConnected, onConnect, onDisconnect }) => {
  const rateColor = carrier.onTimeRate >= 95 ? C.green : carrier.onTimeRate >= 90 ? C.amber : C.red;

  return (
    <div className={`carrier-card${isConnected ? " connected" : ""}`}>

      {/* Top row */}
      <div style={{display:"flex", alignItems:"flex-start", gap:12, marginBottom:20}}>
        <div style={{
          width:48, height:48, borderRadius:10, flexShrink:0,
        background:`color-mix(in srgb, ${carrier.color} 10%, transparent)`, border:`1px solid color-mix(in srgb, ${carrier.color} 25%, transparent)`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:18, fontWeight:800, color:carrier.color,
        }}>
          {carrier.initials}
        </div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:6}}>
            <div style={{fontSize:18, fontWeight:700}}>{carrier.name}</div>
            {isConnected && (
            <span style={{fontSize:12, background:"color-mix(in srgb, var(--mv-green) 15%, transparent)", border:"1px solid color-mix(in srgb, var(--mv-green) 30%, transparent)", color:C.green, padding:"3px 10px", borderRadius:4, fontWeight:700}}>
                CONNECTED
              </span>
            )}
          </div>
          <div style={{fontSize:14, color:C.dim, lineHeight:1.5}}>{carrier.desc}</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="stat-row" style={{display:"flex", gap:12, marginBottom:20}}>
        <div className="stat-box">
          <div style={{fontSize:13, color:C.dim, marginBottom:4}}>On-time rate</div>
          <div style={{fontSize:20, fontWeight:700, color:rateColor}}>{carrier.onTimeRate}%</div>
        </div>
        <div className="stat-box">
          <div style={{fontSize:13, color:C.dim, marginBottom:4}}>Coverage</div>
          <div style={{fontSize:16, fontWeight:600, color:C.text}}>{carrier.coverage}</div>
        </div>
        <div className="stat-box">
          <div style={{fontSize:13, color:C.dim, marginBottom:4}}>Max weight</div>
          <div style={{fontSize:16, fontWeight:600, color:C.text}}>{carrier.maxWeight}</div>
        </div>
      </div>

      {/* Services */}
      <div style={{display:"flex", gap:8, flexWrap:"wrap", marginBottom:24}}>
        {carrier.services.map((s, i) => (
          <span key={i} style={{
            fontSize:13, padding:"4px 12px", borderRadius:4,
          background:`color-mix(in srgb, ${carrier.color} 12%, transparent)`, color:carrier.color,
          border:`1px solid color-mix(in srgb, ${carrier.color} 25%, transparent)`,
          }}>
            {s}
          </span>
        ))}
      </div>

      {/* Action button */}
      <div style={{display:"flex", gap:12, alignItems:"center"}}>
        {isConnected ? (
          <>
            <div style={{flex:1, display:"flex", alignItems:"center", gap:10}}>
              <div style={{width:10, height:10, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:14, color:C.green}}>Active — fetching live rates</span>
            </div>
            <button className="disconnect-btn" onClick={() => onDisconnect(carrier.slug)}>
              Disconnect
            </button>
          </>
        ) : (
          <button className="connect-btn" style={{width:"100%"}} onClick={() => onConnect(carrier)}>
            Connect {carrier.name} →
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─── */
export default function Carriers() {
  const navigate = useNavigate();
  const [connected,     setConnected]     = useState(() => JSON.parse(localStorage.getItem("connectedCarriers") || "[]"));
  const [modalCarrier,  setModalCarrier]  = useState(null);
  const [successMsg,    setSuccessMsg]    = useState("");
  const [filter,        setFilter]        = useState("all");

  const handleConnect = (carrier) => {
    setModalCarrier(carrier);
  };

  const handleSuccess = (slug) => {
    const updated = [...new Set([...connected, slug])];
    setConnected(updated);
    localStorage.setItem("connectedCarriers", JSON.stringify(updated));
    setSuccessMsg(`${CARRIERS.find(c => c.slug === slug)?.name} connected successfully!`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDisconnect = (slug) => {
    const updated = connected.filter(s => s !== slug);
    setConnected(updated);
    localStorage.setItem("connectedCarriers", JSON.stringify(updated));
  };

  const filtered = filter === "connected"
    ? CARRIERS.filter(c => connected.includes(c.slug))
    : filter === "available"
    ? CARRIERS.filter(c => !connected.includes(c.slug))
    : CARRIERS;

  return (
    <div style={{background:C.bg, minHeight:"100vh", fontFamily:"'Sora',sans-serif", color:C.text}}>
      <GlobalStyles/>

      {/* Header */}
      <div className="header-container" style={{background:C.panel, borderBottom:`1px solid ${C.border}`, padding:"0 32px", height:76, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:16}}>
          <div
            onClick={() => navigate("/dashboard")}
            style={{display:"flex", alignItems:"center", gap:10, color:C.dim, cursor:"pointer", fontSize:15}}
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="var(--mv-dim)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span className="header-dash-text">Dashboard</span>
          </div>
          <div style={{width:1, height:20, background:C.border}}/>
          <div className="header-title" style={{fontSize:18, fontWeight:700}}>Carrier integrations</div>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div className="header-status" style={{fontSize:15, color:C.dim}}>
            <span style={{color:C.green, fontWeight:700}}>{connected.length}</span> of {CARRIERS.length} <span className="hide-mobile-text">connected</span>
          </div>
        </div>
      </div>

      <div className="main-content-pad" style={{maxWidth:960, margin:"0 auto", padding:"32px 24px"}}>

        {/* Success message */}
        {successMsg && (
          <div style={{background:"color-mix(in srgb, var(--mv-green) 15%, transparent)", border:"1px solid color-mix(in srgb, var(--mv-green) 30%, transparent)", borderRadius:8, padding:"16px 20px", fontSize:15, color:C.green, marginBottom:24, display:"flex", alignItems:"center", gap:12, animation:"fadeIn 0.3s ease"}}>
            <span style={{fontSize:20}}>✓</span> {successMsg}
          </div>
        )}

        {/* Summary cards */}
        <div className="summary-grid" style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:32}}>
          {[
            { label:"Connected carriers",  val:connected.length,              color:C.green  },
            { label:"Available carriers",  val:CARRIERS.length - connected.length, color:C.yellow },
            { label:"Total carriers",      val:CARRIERS.length,               color:C.blue   },
          ].map((s, i) => (
            <div key={i} className="summary-card" style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:24}}>
              <div style={{fontSize:14, color:C.dim, marginBottom:8}}>{s.label}</div>
              <div style={{fontSize:36, fontWeight:800, color:s.color}}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs" style={{display:"flex", gap:10, marginBottom:28}}>
          {[
            {key:"all",       label:`All carriers (${CARRIERS.length})`},
            {key:"connected", label:`Connected (${connected.length})`},
            {key:"available", label:`Available (${CARRIERS.length - connected.length})`},
          ].map(f => (
            <button
              key={f.key}
              className="filter-btn"
              onClick={() => setFilter(f.key)}
              style={{
                padding:"10px 20px", borderRadius:6, fontSize:15, cursor:"pointer",
                border:`1px solid ${filter === f.key ? C.yellow : C.border}`,
                background: filter === f.key ? "color-mix(in srgb, var(--mv-yellow) 15%, transparent)" : "transparent",
                color: filter === f.key ? "var(--mv-yellow-text)" : C.dim,
                fontFamily:"'Sora',sans-serif", transition:"all 0.15s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Info banner */}
        <div style={{background:C.panel, border:`1px solid ${C.border}`, borderLeft:`3px solid ${C.yellow}`, borderRadius:"0 8px 8px 0", padding:"16px 24px", marginBottom:32, fontSize:15, color:C.muted, lineHeight:1.6}}>
          <strong style={{color:C.yellow}}>Phase 5 note:</strong> Real API credentials are needed for live rate fetching. For now, connecting a carrier saves your credentials and enables it for rate comparison using our pricing engine. Full real-time integration comes in Phase 5.
        </div>

        {/* Carrier grid */}
        {filtered.length === 0 ? (
          <div style={{textAlign:"center", padding:"80px", color:C.dim}}>
            <div style={{fontSize:56, marginBottom:16}}>🔌</div>
            <div style={{fontSize:20, fontWeight:700, color:C.text, marginBottom:8}}>No carriers here</div>
            <div style={{fontSize:15}}>Switch to "All carriers" to connect one</div>
          </div>
        ) : (
          <div className="carrier-grid" style={{display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16}}>
            {filtered.map(carrier => (
              <CarrierCard
                key={carrier.slug}
                carrier={carrier}
                isConnected={connected.includes(carrier.slug)}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            ))}
          </div>
        )}

      </div>

      {/* Connect Modal */}
      {modalCarrier && (
        <ConnectModal
          carrier={modalCarrier}
          onClose={() => setModalCarrier(null)}
          onSuccess={handleSuccess}
        />
      )}

    </div>
  );
}
