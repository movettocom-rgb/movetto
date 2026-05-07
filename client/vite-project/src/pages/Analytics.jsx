import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell,
} from "recharts";

const C = {
  bg:"var(--mv-bg)", panel:"var(--mv-panel)", card:"var(--mv-card)",
  border:"var(--mv-border)", border2:"var(--mv-border-2)",
  text:"var(--mv-text)", muted:"var(--mv-muted)", dim:"var(--mv-dim)",
  yellow:"#E8F400", green:"#00D68A", red:"#FF5C38", amber:"#FFB020", blue:"#4da6ff",
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
    @keyframes spin { to{transform:rotate(360deg)} }
    .ana-card {
      background: var(--mv-card); border: 1px solid var(--mv-border);
      border-radius: 12px; padding: 20px;
      transition: border-color 0.2s;
    }
    .ana-card:hover { border-color: var(--mv-border-2); }
    .kpi-card {
      background: var(--mv-card); border: 1px solid var(--mv-border);
      border-radius: 12px; padding: 18px;
      position: relative; overflow: hidden;
    }
    .period-btn {
      padding: 7px 14px; border-radius: 6px; font-size: 12px;
      cursor: pointer; border: 1px solid var(--mv-border);
      background: transparent; color: var(--mv-dim);
      font-family: 'Sora', sans-serif; transition: all 0.15s;
    }
    .period-btn:hover { color: var(--mv-text); border-color: var(--mv-border-2); }
    .period-btn.active {
      background: #E8F40015; border-color: #E8F40050; color: #E8F400;
    }
    .spinner {
      width: 32px; height: 32px; border: 3px solid var(--mv-border-2);
      border-top-color: #E8F400; border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    .carrier-row {
      display: flex; align-items: center; gap: 12px;
      padding: 12px 0; border-bottom: 1px solid var(--mv-border);
    }
    .carrier-row:last-child { border-bottom: none; }
    .export-btn {
      background: transparent; border: 1px solid var(--mv-border-2);
      border-radius: 6px; padding: 7px 14px; font-size: 12px;
      color: var(--mv-muted); cursor: pointer; font-family: 'Sora', sans-serif;
      transition: all 0.15s;
    }
    .export-btn:hover { border-color: var(--mv-dim); color: var(--mv-text); }

    @media (max-width: 480px) {
      .header-container { padding: 0 12px !important; }
      .header-dash-text { display: none; }
      .header-title { font-size: 14px !important; }
      .export-btn { padding: 6px 10px !important; font-size: 12px !important; }
      .hide-mobile-text { display: none; }
      
      .main-content-pad { padding: 16px 12px !important; }
      .page-header { flex-direction: column; align-items: flex-start !important; gap: 12px; }
      .page-title { font-size: 16px !important; }
      .page-subtitle { font-size: 12px !important; }
      
      .period-filters { width: 100%; overflow-x: auto; justify-content: flex-start !important; padding-bottom: 4px; scrollbar-width: none; -ms-overflow-style: none; }
      .period-filters::-webkit-scrollbar { display: none; }
      .period-btn { white-space: nowrap; flex-shrink: 0; padding: 6px 12px !important; font-size: 11px !important; }
      
      .kpi-grid { grid-template-columns: 1fr !important; }
      .delivery-grid { grid-template-columns: 1fr !important; }
      .charts-grid { grid-template-columns: 1fr !important; }
      
      .pie-wrap { flex-direction: column !important; align-items: center !important; }
      .pie-wrap > div:first-child { width: 160px !important; height: 160px !important; }
    }
  `}</style>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"var(--mv-card)", border:"1px solid var(--mv-border-2)", borderRadius:8, padding:"10px 14px", fontSize:12}}>
      <div style={{color:"var(--mv-dim)", marginBottom:6}}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{color:p.color || "var(--mv-text)", fontWeight:700}}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

/* ─── Empty state ─── */
const EmptyState = ({ title, sub }) => (
  <div style={{textAlign:"center", padding:"40px 20px", color:C.dim}}>
    <div style={{fontSize:36, marginBottom:12}}>📊</div>
    <div style={{fontSize:14, fontWeight:700, color:C.muted, marginBottom:6}}>{title}</div>
    <div style={{fontSize:12, color:C.dim}}>{sub}</div>
  </div>
);

/* ─── MAIN COMPONENT ─── */
export default function Analytics() {
  const navigate = useNavigate();
  const [period,       setPeriod]       = useState("30d");
  const [summary,      setSummary]      = useState(null);
  const [carrierStats, setCarrierStats] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sumRes, carRes] = await Promise.all([
        api.get(`/analytics/summary?period=${period}`),
        api.get("/analytics/carriers"),
      ]);
      setSummary(sumRes.data.summary);
      setCarrierStats(carRes.data.carrierStats || []);
    } catch (err) {
      console.error("Analytics fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Build chart data from real stats ── */
  const carrierBarData = carrierStats.map(c => ({
    name:  c._id || "Unknown",
    count: c.totalShipments || 0,
    spend: Math.round((c.totalSpend || 0) / 100),
    rate:  Math.round(c.onTimeRate || 0),
  }));

  const statusData = summary ? [
    { name:"Delivered",  value: summary.deliveredShipments || 0, color: C.green  },
    { name:"In Transit", value: Math.max(0, (summary.totalShipments || 0) - (summary.deliveredShipments || 0) - (summary.rtoShipments || 0)), color: C.amber },
    { name:"RTO",        value: summary.rtoShipments || 0, color: C.red    },
  ].filter(d => d.value > 0) : [];

  const periods = [
    { key:"7d",  label:"7 days"  },
    { key:"30d", label:"30 days" },
    { key:"3m",  label:"3 months"},
    { key:"1y",  label:"1 year"  },
  ];

  const totalShipments  = summary?.totalShipments  || 0;
  const totalSpend      = summary?.totalSpend       || 0;
  const onTimeRate      = summary?.onTimeRate       || 0;
  const rtoShipments    = summary?.rtoShipments     || 0;
  const delivered       = summary?.deliveredShipments || 0;
  const avgShipmentCost = totalShipments > 0 ? Math.round(totalSpend / totalShipments) : 0;

  return (
    <div style={{background:C.bg, minHeight:"100vh", fontFamily:"'Sora',sans-serif", color:C.text}}>
      <GlobalStyles/>

      {/* Header */}
      <div className="header-container" style={{background:C.panel, borderBottom:`1px solid ${C.border}`, padding:"0 32px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:16}}>
          <div
            onClick={() => navigate("/dashboard")}
            style={{display:"flex", alignItems:"center", gap:8, color:C.dim, cursor:"pointer", fontSize:13}}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="var(--mv-dim)" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <span className="header-dash-text">Dashboard</span>
          </div>
          <div style={{width:1, height:16, background:C.border}}/>
          <div className="header-title" style={{fontSize:14, fontWeight:700}}>Analytics</div>
        </div>
        <div style={{display:"flex", gap:8}}>
          <button className="export-btn">Export <span className="hide-mobile-text">CSV</span></button>
          <button className="export-btn">Export <span className="hide-mobile-text">PDF</span></button>
        </div>
      </div>

      <div className="main-content-pad" style={{maxWidth:1000, margin:"0 auto", padding:"32px 24px"}}>

        {/* Period filter */}
        <div className="page-header" style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24}}>
          <div>
            <div className="page-title" style={{fontSize:20, fontWeight:800, marginBottom:4}}>
              Shipping analytics
            </div>
            <div className="page-subtitle" style={{fontSize:13, color:C.dim}}>
              Your complete logistics performance overview
            </div>
          </div>
          <div className="period-filters" style={{display:"flex", gap:6}}>
            {periods.map(p => (
              <button
                key={p.key}
                className={`period-btn${period === p.key ? " active" : ""}`}
                onClick={() => setPeriod(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:300, flexDirection:"column", gap:16}}>
            <div className="spinner"/>
            <div style={{fontSize:13, color:C.dim}}>Loading analytics...</div>
          </div>
        ) : (
          <>
            {/* KPI row */}
            <div className="kpi-grid" style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20}}>
              {[
                { label:"Total shipments", val: totalShipments.toLocaleString(),        color:C.blue,   accent:C.blue   },
                { label:"Total spend",     val: `₹${(totalSpend/100000).toFixed(1)}L`,  color:C.yellow, accent:C.yellow },
                { label:"On-time rate",    val: `${onTimeRate}%`,                        color:C.green,  accent:C.green  },
                { label:"Avg cost/shipment",val:`₹${avgShipmentCost.toLocaleString()}`,  color:C.muted,  accent:C.muted  },
              ].map((k, i) => (
                <div key={i} className="kpi-card">
                  <div style={{position:"absolute", top:0, left:0, width:4, height:"100%", background:k.accent, borderRadius:"12px 0 0 12px"}}/>
                  <div style={{fontSize:11, color:C.dim, textTransform:"uppercase", letterSpacing:"0.09em", marginBottom:8}}>
                    {k.label}
                  </div>
                  <div style={{fontSize:26, fontWeight:800, color:k.color}}>{k.val}</div>
                </div>
              ))}
            </div>

            {/* Delivery breakdown */}
            <div className="delivery-grid" style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20}}>
              {[
                { label:"Delivered",  val:delivered,    color:C.green,  bg:"#0d2414" },
                { label:"RTO",        val:rtoShipments, color:C.red,    bg:"#200808" },
                { label:"In transit", val:Math.max(0, totalShipments - delivered - rtoShipments), color:C.amber, bg:"#1f1500" },
              ].map((s, i) => (
                <div key={i} style={{background:s.bg, border:`1px solid ${s.color}22`, borderRadius:10, padding:16, display:"flex", alignItems:"center", gap:14}}>
                  <div style={{width:44, height:44, borderRadius:10, background:`${s.color}22`, border:`1px solid ${s.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0}}>
                    {i===0?"✓":i===1?"↩":"→"}
                  </div>
                  <div>
                    <div style={{fontSize:11, color:s.color, marginBottom:4, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.07em"}}>{s.label}</div>
                    <div style={{fontSize:26, fontWeight:800, color:s.color}}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="charts-grid" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14}}>

              {/* Carrier shipment count */}
              <div className="ana-card">
                <div style={{fontSize:14, fontWeight:700, marginBottom:2}}>Shipments by carrier</div>
                <div style={{fontSize:11, color:C.dim, marginBottom:16}}>Total shipments per carrier</div>
                {carrierBarData.length === 0 ? (
                  <EmptyState title="No carrier data yet" sub="Book shipments to see carrier breakdown"/>
                ) : (
                  <div style={{height:180}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={carrierBarData} margin={{top:4, right:4, left:-20, bottom:0}}>
                        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false}/>
                        <XAxis dataKey="name" tick={{fill:C.dim, fontSize:10}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fill:C.dim, fontSize:10}} axisLine={false} tickLine={false}/>
                        <Tooltip content={<CustomTooltip/>}/>
                        <Bar dataKey="count" name="Shipments" fill={C.yellow} radius={[4,4,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Delivery status pie */}
              <div className="ana-card">
                <div style={{fontSize:14, fontWeight:700, marginBottom:2}}>Delivery status</div>
                <div style={{fontSize:11, color:C.dim, marginBottom:16}}>Breakdown by outcome</div>
                {statusData.length === 0 ? (
                  <EmptyState title="No delivery data yet" sub="Complete shipments to see status breakdown"/>
                ) : (
                  <div className="pie-wrap" style={{display:"flex", alignItems:"center", gap:20}}>
                    <div style={{width:150, height:150, flexShrink:0}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={statusData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                            {statusData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                          </Pie>
                          <Tooltip content={<CustomTooltip/>}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={{flex:1}}>
                      {statusData.map((s, i) => (
                        <div key={i} style={{display:"flex", alignItems:"center", gap:10, marginBottom:10}}>
                          <div style={{width:10, height:10, borderRadius:"50%", background:s.color, flexShrink:0}}/>
                          <span style={{fontSize:13, color:C.muted, flex:1}}>{s.name}</span>
                          <span style={{fontSize:14, fontWeight:700, color:s.color, fontFamily:"'JetBrains Mono',monospace"}}>{s.value}</span>
                        </div>
                      ))}
                      {totalShipments > 0 && (
                        <div style={{marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}`, fontSize:12, color:C.dim}}>
                          Total: <strong style={{color:C.text}}>{totalShipments}</strong> shipments
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Carrier performance table */}
            <div className="ana-card" style={{marginBottom:14}}>
              <div style={{fontSize:14, fontWeight:700, marginBottom:2}}>Carrier performance</div>
              <div style={{fontSize:11, color:C.dim, marginBottom:16}}>On-time rate and spend breakdown per carrier</div>
              {carrierStats.length === 0 ? (
                <EmptyState title="No carrier data yet" sub="Book shipments across carriers to see performance comparison"/>
              ) : (
                <div style={{overflowX: "auto"}}>
                  <div style={{minWidth: 600}}>
                  <div style={{display:"flex", padding:"8px 0", fontSize:10, color:C.dim, textTransform:"uppercase", letterSpacing:"0.08em", borderBottom:`1px solid ${C.border}`, marginBottom:4}}>
                    <span style={{flex:1.5}}>Carrier</span>
                    <span style={{flex:1}}>Shipments</span>
                    <span style={{flex:1}}>Delivered</span>
                    <span style={{flex:1}}>Total spend</span>
                    <span style={{flex:1}}>On-time rate</span>
                  </div>
                  {carrierStats.map((c, i) => {
                    const rate      = Math.round(c.onTimeRate || 0);
                    const rateColor = rate >= 95 ? C.green : rate >= 85 ? C.amber : C.red;
                    return (
                      <div key={i} className="carrier-row">
                        <div style={{flex:1.5, display:"flex", alignItems:"center", gap:10}}>
                          <div style={{width:32, height:32, borderRadius:8, background:`${C.yellow}18`, border:`1px solid ${C.yellow}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:C.yellow, flexShrink:0}}>
                            {(c._id||"?").slice(0,2).toUpperCase()}
                          </div>
                          <span style={{fontSize:13, fontWeight:600}}>{c._id || "Unknown"}</span>
                        </div>
                        <span style={{flex:1, fontSize:13}}>{c.totalShipments || 0}</span>
                        <span style={{flex:1, fontSize:13, color:C.green}}>{c.delivered || 0}</span>
                        <span style={{flex:1, fontSize:13, fontFamily:"'JetBrains Mono',monospace"}}>
                          ₹{((c.totalSpend || 0)/100).toLocaleString()}
                        </span>
                        <div style={{flex:1, display:"flex", alignItems:"center", gap:8}}>
                          <div style={{flex:1, background:C.border, borderRadius:2, height:5, overflow:"hidden"}}>
                            <div style={{width:`${rate}%`, height:"100%", background:rateColor, borderRadius:2}}/>
                          </div>
                          <span style={{fontSize:12, fontWeight:700, color:rateColor, fontFamily:"'JetBrains Mono',monospace", flexShrink:0, width:34}}>
                            {rate}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              )}
            </div>

            {/* Spend efficiency */}
            <div className="ana-card">
              <div style={{fontSize:14, fontWeight:700, marginBottom:2}}>Spend efficiency</div>
              <div style={{fontSize:11, color:C.dim, marginBottom:16}}>Average cost per shipment by carrier</div>
              {carrierBarData.length === 0 ? (
                <EmptyState title="No spend data yet" sub="Book shipments to see cost efficiency analysis"/>
              ) : (
                <div style={{height:160}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={carrierBarData} margin={{top:4, right:4, left:-10, bottom:0}}>
                      <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false}/>
                      <XAxis dataKey="name" tick={{fill:C.dim, fontSize:10}} axisLine={false} tickLine={false}/>
                      <YAxis tick={{fill:C.dim, fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}`}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Bar dataKey="spend" name="Avg spend" fill={C.blue} radius={[4,4,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </>
        )}
      </div>
    </div>
  );
}