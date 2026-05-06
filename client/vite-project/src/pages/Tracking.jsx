
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import useStore from "../store/useStore";

/* ─── Constants ─── */
const C = {
  bg:"var(--mv-bg)", panel:"var(--mv-panel)", card:"var(--mv-card)",
  border:"var(--mv-border)", border2:"var(--mv-border-2)",
  text:"var(--mv-text)", muted:"var(--mv-muted)", dim:"var(--mv-dim)",
  yellow:"#E8F400", green:"#00D68A", red:"#FF5C38", amber:"#FFB020", blue:"#4da6ff",
};

/* ─── Global Styles ─── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--mv-bg); font-family: 'Sora', sans-serif; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--mv-bg); }
    ::-webkit-scrollbar-thumb { background: var(--mv-border-2); border-radius: 2px; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .track-inp {
      flex: 1; background: var(--mv-panel); border: 1px solid var(--mv-border);
      border-radius: 10px 0 0 10px; padding: 14px 18px;
      font-size: 15px; color: var(--mv-text); outline: none;
      font-family: 'JetBrains Mono', monospace; letter-spacing: 0.05em;
      transition: border-color 0.2s;
    }
    .track-inp:focus { border-color: #E8F400; }
    .track-inp::placeholder { color: var(--mv-dimmer); font-family: 'Sora', sans-serif; letter-spacing: 0; }
    .track-btn {
      background: #E8F400; color: #0A0B0D; border: none;
      padding: 14px 28px; border-radius: 0 10px 10px 0;
      font-size: 14px; font-weight: 700; cursor: pointer;
      font-family: 'Sora', sans-serif; transition: opacity 0.2s;
      white-space: nowrap;
    }
    .track-btn:hover { opacity: 0.88; }
    .track-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .spinner {
      width: 18px; height: 18px; border: 2px solid var(--mv-border-2);
      border-top-color: #E8F400; border-radius: 50%;
      animation: spin 0.7s linear infinite; display: inline-block;
    }
    .timeline-dot {
      width: 14px; height: 14px; border-radius: 50%;
      flex-shrink: 0; margin-top: 3px;
      display: flex; align-items: center; justify-content: center;
    }
    .copy-btn {
      background: transparent; border: 1px solid var(--mv-border-2);
      border-radius: 5px; padding: 4px 10px; font-size: 11px;
      color: var(--mv-dim); cursor: pointer; font-family: 'Sora', sans-serif;
      transition: all 0.2s;
    }
    .copy-btn:hover { border-color: #E8F400; color: #E8F400; }
    .recent-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 14px; border-radius: 8px; cursor: pointer;
      transition: background 0.15s; border: 1px solid var(--mv-border);
      background: var(--mv-card); margin-bottom: 8px;
    }
    .recent-item:hover { border-color: var(--mv-border-2); background: var(--mv-card-hover); }
  `}</style>
);

/* ─── Status config ─── */
const STATUS_CONFIG = {
  DRAFT:            { color:"var(--mv-dim)", bg:"#1a1a1a", label:"Draft",            icon:"○" },
  BOOKED:           { color:"#4da6ff", bg:"#080f20", label:"Booked",           icon:"◎" },
  LABEL_GENERATED:  { color:"#4da6ff", bg:"#080f20", label:"Label Generated",  icon:"◎" },
  PICKED_UP:        { color:"#FFB020", bg:"#1f1500", label:"Picked Up",        icon:"◉" },
  IN_TRANSIT:       { color:"#FFB020", bg:"#1f1500", label:"In Transit",       icon:"◉" },
  OUT_FOR_DELIVERY: { color:"#E8F400", bg:"#1a1800", label:"Out for Delivery", icon:"◈" },
  DELIVERED:        { color:"#00D68A", bg:"#0d2414", label:"Delivered",        icon:"◉" },
  DELIVERY_FAILED:  { color:"#FF5C38", bg:"#200808", label:"Delivery Failed",  icon:"✕" },
  RTO_INITIATED:    { color:"#FF5C38", bg:"#200808", label:"RTO Initiated",    icon:"↩" },
  RTO_DELIVERED:    { color:"#FF5C38", bg:"#200808", label:"RTO Delivered",    icon:"↩" },
  CANCELLED:        { color:"var(--mv-dim)", bg:"#1a1a1a", label:"Cancelled",        icon:"✕" },
};

const getStatus = (s) => STATUS_CONFIG[s] || STATUS_CONFIG.DRAFT;

/* ─── Progress Bar ─── */
const ProgressBar = ({ status }) => {
  const stages = ["BOOKED", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED"];
  const isRTO = ["RTO_INITIATED","RTO_DELIVERED","DELIVERY_FAILED","CANCELLED"].includes(status);
  const currentIdx = isRTO ? -1 : stages.indexOf(status);

  return (
    <div style={{marginBottom:28}}>
      <div style={{display:"flex", alignItems:"center", gap:0}}>
        {stages.map((stage, i) => {
          const done    = currentIdx > i;
          const active  = currentIdx === i;
          const cfg     = getStatus(stage);
          return (
            <div key={stage} style={{display:"flex", alignItems:"center", flex: i < stages.length - 1 ? 1 : "none"}}>
              <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:6}}>
                <div style={{
                  width:32, height:32, borderRadius:"50%",
                  background: done ? C.green : active ? cfg.color : C.border,
                  border: `2px solid ${done ? C.green : active ? cfg.color : C.border2}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:12, color: done || active ? "#0A0B0D" : C.dim,
                  fontWeight:700, flexShrink:0,
                  boxShadow: active ? `0 0 12px ${cfg.color}44` : "none",
                  transition:"all 0.3s",
                }}>
                  {done ? "✓" : i + 1}
                </div>
                <div style={{fontSize:10, color: done ? C.green : active ? cfg.color : C.dim, textAlign:"center", whiteSpace:"nowrap", fontWeight: active ? 700 : 400}}>
                  {cfg.label}
                </div>
              </div>
              {i < stages.length - 1 && (
                <div style={{flex:1, height:2, background: done ? C.green : C.border, marginBottom:20, transition:"background 0.3s"}}/>
              )}
            </div>
          );
        })}
      </div>
      {isRTO && (
        <div style={{marginTop:16, background:"#200808", border:`1px solid #FF5C3833`, borderRadius:8, padding:"10px 14px", fontSize:13, color:C.red, display:"flex", alignItems:"center", gap:10}}>
          <span style={{fontSize:16}}>↩</span>
          This shipment has been returned to origin (RTO)
        </div>
      )}
    </div>
  );
};

/* ─── Timeline ─── */
const Timeline = ({ events }) => (
  <div style={{display:"flex", flexDirection:"column", gap:0}}>
    {events.map((event, i) => {
      const cfg = getStatus(event.status);
      const isFirst = i === 0;
      return (
        <div key={i} style={{display:"flex", gap:16, position:"relative"}}>
          <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <div className="timeline-dot" style={{
              background: isFirst ? cfg.color : C.border,
              border: `2px solid ${isFirst ? cfg.color : C.border2}`,
              boxShadow: isFirst ? `0 0 8px ${cfg.color}55` : "none",
            }}>
              {isFirst && <div style={{width:5, height:5, borderRadius:"50%", background:"var(--mv-bg)"}}/>}
            </div>
            {i < events.length - 1 && (
              <div style={{width:2, flex:1, background:C.border, minHeight:28, margin:"4px 0"}}/>
            )}
          </div>
          <div style={{flex:1, paddingBottom: i < events.length - 1 ? 20 : 0}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4}}>
              <div style={{fontSize:13, fontWeight: isFirst ? 700 : 500, color: isFirst ? C.text : C.muted}}>
                {cfg.label}
              </div>
              <div style={{fontSize:11, color:C.dim, fontFamily:"'JetBrains Mono',monospace"}}>
                {event.timestamp ? new Date(event.timestamp).toLocaleString("en-IN", {
                  day:"numeric", month:"short", hour:"2-digit", minute:"2-digit"
                }) : "—"}
              </div>
            </div>
            {event.location && (
              <div style={{fontSize:12, color:C.dim, marginBottom:2}}>
                📍 {event.location}
              </div>
            )}
            {event.note && (
              <div style={{fontSize:12, color:C.muted, lineHeight:1.5}}>
                {event.note}
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

/* ─── Empty State ─── */
const EmptyState = () => (
  <div style={{textAlign:"center", padding:"60px 40px", color:C.dim}}>
    <div style={{fontSize:56, marginBottom:20}}>🔍</div>
    <div style={{fontSize:20, fontWeight:800, color:C.text, marginBottom:8}}>
      Track your shipment
    </div>
    <div style={{fontSize:14, color:C.dim, lineHeight:1.7, maxWidth:360, margin:"0 auto"}}>
      Enter your Movetto tracking ID above to see real-time status and delivery timeline
    </div>
    <div style={{marginTop:28, padding:16, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, display:"inline-block"}}>
      <div style={{fontSize:11, color:C.dim, marginBottom:6}}>Example tracking ID</div>
      <div style={{fontSize:16, fontFamily:"'JetBrains Mono',monospace", color:C.yellow, fontWeight:700}}>
        MV-2025-K8XP91
      </div>
    </div>
  </div>
);

/* ─── Not Found State ─── */
const NotFound = ({ trackingId }) => (
  <div style={{textAlign:"center", padding:"60px 40px"}}>
    <div style={{fontSize:56, marginBottom:20}}>❌</div>
    <div style={{fontSize:20, fontWeight:800, color:C.text, marginBottom:8}}>
      Tracking ID not found
    </div>
    <div style={{fontSize:14, color:C.dim, lineHeight:1.7}}>
      <strong style={{color:C.text, fontFamily:"'JetBrains Mono',monospace"}}>{trackingId}</strong> does not exist in our system.
    </div>
    <div style={{fontSize:13, color:C.dim, marginTop:8}}>
      Please check the ID and try again.
    </div>
  </div>
);

/* ─── Unauthorized State ─── */
const Unauthorized = ({ trackingId }) => (
  <div style={{textAlign:"center", padding:"60px 40px"}}>
    <div style={{fontSize:56, marginBottom:20}}>🔒</div>
    <div style={{fontSize:20, fontWeight:800, color:C.text, marginBottom:8}}>
      Not authorized
    </div>
    <div style={{fontSize:14, color:C.dim, lineHeight:1.7, maxWidth:420, margin:"0 auto"}}>
      <strong style={{color:C.text, fontFamily:"'JetBrains Mono',monospace"}}>{trackingId}</strong> belongs to another account.
      You are not authorized to see another business shipment.
    </div>
    <div style={{fontSize:13, color:C.dim, marginTop:8}}>
      Please log in with the account that created this shipment.
    </div>
  </div>
);

/* ─── Shipment Result Card ─── */
const ShipmentCard = ({ shipment }) => {
  const [copied, setCopied] = useState(false);
  const cfg = getStatus(shipment.status);

  const copyTrackingId = () => {
    navigator.clipboard.writeText(shipment.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const estimatedDelivery = shipment.estimatedDelivery
    ? new Date(shipment.estimatedDelivery).toLocaleDateString("en-IN", {weekday:"long", day:"numeric", month:"long"})
    : "Not available";

  const bookedOn = shipment.createdAt
    ? new Date(shipment.createdAt).toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"})
    : "—";

  return (
    <div style={{animation:"fadeIn 0.4s ease"}}>

      {/* Header card */}
      <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24, marginBottom:16}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20}}>
          <div>
            <div style={{fontSize:11, color:C.dim, marginBottom:6}}>Tracking ID</div>
            <div style={{display:"flex", alignItems:"center", gap:10}}>
              <div style={{fontSize:22, fontWeight:800, fontFamily:"'JetBrains Mono',monospace", color:C.yellow}}>
                {shipment.trackingId}
              </div>
              <button className="copy-btn" onClick={copyTrackingId}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <span style={{
              display:"inline-block", padding:"6px 14px", borderRadius:6,
              fontSize:12, fontWeight:700, letterSpacing:"0.04em",
              background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.color}33`,
            }}>
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar status={shipment.status}/>

        {/* Route details */}
        <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:16, alignItems:"center", marginBottom:20}}>
          <div style={{background:C.panel, borderRadius:10, padding:14}}>
            <div style={{fontSize:10, color:C.dim, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em"}}>From</div>
            <div style={{fontSize:15, fontWeight:700}}>{shipment.origin?.city || "—"}</div>
            <div style={{fontSize:12, color:C.dim, fontFamily:"'JetBrains Mono',monospace", marginTop:2}}>
              {shipment.origin?.pincode}
            </div>
          </div>
          <div style={{fontSize:24, color:C.dim, textAlign:"center"}}>→</div>
          <div style={{background:C.panel, borderRadius:10, padding:14, textAlign:"right"}}>
            <div style={{fontSize:10, color:C.dim, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em"}}>To</div>
            <div style={{fontSize:15, fontWeight:700}}>{shipment.destination?.city || "—"}</div>
            <div style={{fontSize:12, color:C.dim, fontFamily:"'JetBrains Mono',monospace", marginTop:2}}>
              {shipment.destination?.pincode}
            </div>
          </div>
        </div>

        {/* Meta info */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12}}>
          {[
            { label:"Carrier",   value:shipment.carrierName || "—" },
            { label:"Weight",    value:shipment.package?.weight ? `${shipment.package.weight} kg` : "—" },
            { label:"Booked on", value:bookedOn },
            { label:"ETA",       value:estimatedDelivery },
          ].map((item, i) => (
            <div key={i} style={{background:C.panel, borderRadius:8, padding:12}}>
              <div style={{fontSize:10, color:C.dim, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em"}}>
                {item.label}
              </div>
              <div style={{fontSize:13, fontWeight:600, color:C.text}}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline card */}
      <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24}}>
        <div style={{fontSize:14, fontWeight:700, marginBottom:4}}>Delivery timeline</div>
        <div style={{fontSize:11, color:C.dim, marginBottom:20}}>
          {shipment.timeline?.length || 0} events recorded
        </div>

        {shipment.timeline && shipment.timeline.length > 0 ? (
          <Timeline events={[...shipment.timeline].reverse()}/>
        ) : (
          <div style={{textAlign:"center", padding:"20px", color:C.dim, fontSize:13}}>
            No timeline events yet
          </div>
        )}
      </div>

    </div>
  );
};

/* ─── MAIN COMPONENT ─── */
export default function Tracking() {
const navigate  = useNavigate();
const [search]  = useSearchParams();
const [query, setQuery] = useState(search.get("id") || "");
  const user = useStore((s) => s.user);
  const recentKey = user?._id
    ? `recentTracks:${user._id}`
    : user?.email
    ? `recentTracks:${user.email}`
    : null;
  const [loading, setLoading]     = useState(false);
  const [shipment, setShipment]   = useState(null);
  const [notFound, setNotFound]   = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [searched, setSearched]   = useState("");

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    if (!recentKey) {
      setRecent([]);
      return;
    }

    setRecent(JSON.parse(localStorage.getItem(recentKey) || "[]"));
  }, [recentKey]);

  const saveRecent = (id) => {
    if (!recentKey) return;
    const updated = [id, ...recent.filter(r => r !== id)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem(recentKey, JSON.stringify(updated));
  };

  const handleTrack = async (id) => {
    const trackId = (id || query).trim().toUpperCase();
    if (!trackId) return;

    setLoading(true);
    setShipment(null);
    setNotFound(false);
    setUnauthorized(false);
    setSearched(trackId);

    try {
      const res = await api.get(`/track/${trackId}`);
      setShipment(res.data.shipment);
      saveRecent(trackId);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else if (err.response?.status === 403) {
        setUnauthorized(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleTrack();
  };

  useEffect(() => {
  const id = search.get("id");
  if (id) {
    setQuery(id);
    handleTrack(id);
  }
}, []);

  return (
    <div style={{background:C.bg, minHeight:"100vh", fontFamily:"'Sora',sans-serif", color:C.text}}>
      <GlobalStyles/>

      {/* Header */}
      <div style={{background:C.panel, borderBottom:`1px solid ${C.border}`, padding:"0 32px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:16}}>
          <div
            onClick={() => navigate("/dashboard")}
            style={{display:"flex", alignItems:"center", gap:8, color:C.dim, cursor:"pointer", fontSize:13}}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="var(--mv-dim)" strokeWidth="1.4" strokeLinecap="round"/></svg>
            Dashboard
          </div>
          <div style={{width:1, height:16, background:C.border}}/>
          <div style={{fontSize:14, fontWeight:700}}>Track shipment</div>
        </div>
        <button
          onClick={() => navigate("/book")}
          style={{background:C.yellow, color:"#0A0B0D", border:"none", padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer"}}
        >
          + Book shipment
        </button>
      </div>

      <div style={{maxWidth:760, margin:"0 auto", padding:"32px 24px"}}>

        {/* Search bar */}
        <div style={{marginBottom:32}}>
          <div style={{fontSize:24, fontWeight:800, marginBottom:6}}>
            Track your shipment
          </div>
          <div style={{fontSize:14, color:C.dim, marginBottom:20}}>
            Enter your Movetto tracking ID to get real-time updates
          </div>
          <div style={{display:"flex"}}>
            <input
              className="track-inp"
              placeholder="Enter tracking ID — e.g. MV-2025-K8XP91"
              value={query}
              onChange={e => setQuery(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
            />
            <button
              className="track-btn"
              onClick={() => handleTrack()}
              disabled={loading || !query.trim()}
            >
              {loading ? <span className="spinner"/> : "Track →"}
            </button>
          </div>
        </div>

        {/* Recent searches */}
        {!shipment && !notFound && !unauthorized && !loading && recent.length > 0 && (
          <div style={{marginBottom:28}}>
            <div style={{fontSize:12, color:C.dim, marginBottom:12, textTransform:"uppercase", letterSpacing:"0.08em"}}>
              Recent searches
            </div>
            {recent.map((id, i) => (
              <div key={i} className="recent-item" onClick={() => { setQuery(id); handleTrack(id); }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="var(--mv-dim)" strokeWidth="1.2" fill="none"/><path d="M7 4.5v2.5l1.5 1.5" stroke="var(--mv-dim)" strokeWidth="1.2" strokeLinecap="round"/></svg>
                <span style={{fontSize:13, fontFamily:"'JetBrains Mono',monospace", color:C.muted}}>{id}</span>
                <svg style={{marginLeft:"auto"}} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="var(--mv-dim)" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </div>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{textAlign:"center", padding:"60px 40px"}}>
            <div className="spinner" style={{width:32, height:32, borderWidth:3, margin:"0 auto 16px"}}/>
            <div style={{fontSize:14, color:C.dim}}>Fetching shipment details...</div>
          </div>
        )}

        {/* Results */}
        {!loading && shipment  && <ShipmentCard shipment={shipment}/>}
        {!loading && notFound  && <NotFound trackingId={searched}/>}
        {!loading && unauthorized && <Unauthorized trackingId={searched}/>}
        {!loading && !shipment && !notFound && !unauthorized && <EmptyState/>}

      </div>
    </div>
  );
}
