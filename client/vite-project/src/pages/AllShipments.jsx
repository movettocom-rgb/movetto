import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const C = {
  bg:"var(--mv-bg)", panel:"var(--mv-panel)", card:"var(--mv-card)",
  border:"var(--mv-border)", border2:"var(--mv-border-2)",
  text:"var(--mv-text)", muted:"var(--mv-muted)", dim:"var(--mv-dim)",
  yellow:"#E8F400", green:"#00D68A", red:"#FF5C38", amber:"#FFB020", blue:"#4da6ff",
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:var(--mv-bg);font-family:'Sora',sans-serif}
    ::-webkit-scrollbar{width:4px}
    ::-webkit-scrollbar-track{background:var(--mv-bg)}
    ::-webkit-scrollbar-thumb{background:var(--mv-border-2);border-radius:2px}
    @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    .tbl-container { overflow-x: auto; }
    .tbl-header {
      display: grid; grid-template-columns: 2fr 1.2fr 0.9fr 0.9fr 0.9fr 1fr;
      padding: 10px 20px; font-size: 10px; color: var(--mv-dim);
      text-transform: uppercase; letter-spacing: 0.09em; border-bottom: 1px solid var(--mv-border);
      min-width: 760px;
    }
    .tbl-row{
      display:grid; grid-template-columns:2fr 1.2fr 0.9fr 0.9fr 0.9fr 1fr;
      padding:13px 20px; font-size:13px; align-items:center;
      cursor:pointer; transition:background 0.15s;
      border-bottom:1px solid var(--mv-panel);
      min-width: 760px;
    }
    .tbl-row:hover{background:var(--mv-card-hover)}
    .filter-btn{
      padding:7px 14px; border-radius:6px; font-size:12px; cursor:pointer;
      border:1px solid var(--mv-border); background:transparent; color:var(--mv-dim);
      font-family:'Sora',sans-serif; transition:all 0.15s;
    }
    .filter-btn:hover{color:var(--mv-text);border-color:var(--mv-border-2)}
    .filter-btn.active{background:#E8F40015;border-color:#E8F40050;color:#E8F400}
    .search-inp{
      background:var(--mv-panel); border:1px solid var(--mv-border); border-radius:8px;
      padding:9px 14px; font-size:13px; color:var(--mv-text); outline:none;
      font-family:'Sora',sans-serif; transition:border-color 0.2s; width:260px;
    }
    .search-inp:focus{border-color:#E8F400}
    .search-inp::placeholder{color:var(--mv-dimmer)}
    .spinner{
      width:28px;height:28px;border:3px solid var(--mv-border-2);
      border-top-color:#E8F400;border-radius:50%;
      animation:spin 0.7s linear infinite;
    }
    .page-btn{
      width:32px;height:32px;border-radius:6px;font-size:12px;cursor:pointer;
      border:1px solid var(--mv-border);background:transparent;color:var(--mv-dim);
      font-family:'Sora',sans-serif;transition:all 0.15s;
      display:flex;align-items:center;justify-content:center;
    }
    .page-btn:hover{color:var(--mv-text);border-color:var(--mv-border-2)}
    .page-btn.active{background:#E8F40015;border-color:#E8F40050;color:#E8F400}
    .page-btn:disabled{opacity:0.3;cursor:not-allowed}

    @media (max-width: 768px) {
      .header-container { padding: 0 16px !important; }
      .main-content-pad { padding: 20px 16px !important; }
      .filters-container { flex-direction: column; align-items: stretch !important; gap: 12px !important; }
      .search-inp { width: 100% !important; }
      .status-filters { overflow-x: auto; flex-wrap: nowrap !important; padding-bottom: 4px; scrollbar-width: none; -ms-overflow-style: none; }
      .status-filters::-webkit-scrollbar { display: none; }
      .filter-btn { white-space: nowrap; flex-shrink: 0; }
      .tbl-header { display: none; }
      .tbl-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        min-width: auto;
        padding: 14px 16px;
        border-bottom: 1px solid var(--mv-border);
      }
      .tbl-row > div { display: grid; gap: 4px; }
      .tbl-row > div:nth-child(1)::before { content: "Tracking ID / Route"; display: block; font-size: 11px; color: var(--mv-dim); text-transform: uppercase; letter-spacing: 0.08em; }
      .tbl-row > div:nth-child(2)::before { content: "Carrier"; display: block; font-size: 11px; color: var(--mv-dim); text-transform: uppercase; letter-spacing: 0.08em; }
      .tbl-row > div:nth-child(3)::before { content: "Weight"; display: block; font-size: 11px; color: var(--mv-dim); text-transform: uppercase; letter-spacing: 0.08em; }
      .tbl-row > div:nth-child(4)::before { content: "Rate"; display: block; font-size: 11px; color: var(--mv-dim); text-transform: uppercase; letter-spacing: 0.08em; }
      .tbl-row > div:nth-child(5)::before { content: "Date"; display: block; font-size: 11px; color: var(--mv-dim); text-transform: uppercase; letter-spacing: 0.08em; }
      .tbl-row > div:nth-child(6)::before { content: "Status"; display: block; font-size: 11px; color: var(--mv-dim); text-transform: uppercase; letter-spacing: 0.08em; }
      .pagination-row {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 12px;
      }
      .header-actions { gap: 6px !important; }
    }

    @media (max-width: 480px) {
      .header-container { padding: 0 12px !important; }
      .header-dash-text { display: none; }
      .header-title { font-size: 14px !important; }
      .header-badge { display: none; }
      .book-btn { padding: 6px 10px !important; font-size: 12px !important; }
      .export-btn { padding: 6px 10px !important; font-size: 12px !important; }
      .hide-mobile-text { display: none; }
      .main-content-pad { padding: 16px 12px !important; }
      .search-inp { width: 100% !important; }
    }
  `}</style>
);

const TAG_STYLES = {
  DELIVERED:        {bg:"#0d2414", color:"#00D68A", border:"#00D68A25", label:"Delivered"},
  IN_TRANSIT:       {bg:"#1f1500", color:"#FFB020", border:"#FFB02025", label:"In transit"},
  OUT_FOR_DELIVERY: {bg:"#080f20", color:"#4da6ff", border:"#4da6ff25", label:"Out for delivery"},
  PICKED_UP:        {bg:"#080f20", color:"#4da6ff", border:"#4da6ff25", label:"Picked up"},
  BOOKED:           {bg:"#1a1800", color:"#E8F400", border:"#E8F40025", label:"Booked"},
  LABEL_GENERATED:  {bg:"#1a1800", color:"#E8F400", border:"#E8F40025", label:"Label generated"},
  RTO_INITIATED:    {bg:"#200808", color:"#FF5C38", border:"#FF5C3825", label:"RTO initiated"},
  RTO_DELIVERED:    {bg:"#200808", color:"#FF5C38", border:"#FF5C3825", label:"RTO delivered"},
  DELIVERY_FAILED:  {bg:"#200808", color:"#FF5C38", border:"#FF5C3825", label:"Failed"},
  CANCELLED:        {bg:"#1a1a1a", color:"var(--mv-dim)", border:"#5A647825", label:"Cancelled"},
  DRAFT:            {bg:"#1a1a1a", color:"var(--mv-dim)", border:"#5A647825", label:"Draft"},
};

const StatusTag = ({ status }) => {
  const s = TAG_STYLES[status] || TAG_STYLES.DRAFT;
  return (
    <span style={{display:"inline-block", padding:"3px 9px", borderRadius:5, fontSize:11, fontWeight:700, background:s.bg, color:s.color, border:`1px solid ${s.border}`}}>
      {s.label}
    </span>
  );
};

const Mono = ({ children }) => (
  <span style={{fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:C.muted}}>{children}</span>
);

export default function AllShipments() {
  const navigate = useNavigate();

  const [shipments,  setShipments]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [pages,      setPages]      = useState(1);
  const [search,     setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [carrierFilter, setCarrierFilter] = useState("all");

  const LIMIT = 15;

  const STATUS_FILTERS = [
    {key:"all",       label:"All"},
    {key:"BOOKED",    label:"Booked"},
    {key:"IN_TRANSIT",label:"In transit"},
    {key:"DELIVERED", label:"Delivered"},
    {key:"RTO_INITIATED", label:"RTO"},
    {key:"CANCELLED", label:"Cancelled"},
  ];

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const params = { page, limit: LIMIT };
      if (statusFilter !== "all") params.status = statusFilter;
      if (carrierFilter !== "all") params.carrier = carrierFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get("/shipments", { params });
      setShipments(res.data.shipments || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("Fetch shipments error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [page, statusFilter, carrierFilter, search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const exportCSV = () => {
    const headers = ["Tracking ID","Route","Carrier","Weight","Rate","Status","Date"];
    const rows = shipments.map(s => [
      s.trackingId,
      `${s.origin?.city || s.origin?.pincode} → ${s.destination?.city || s.destination?.pincode}`,
      s.carrierName || "—",
      s.package?.weight ? `${s.package.weight} kg` : "—",
      s.pricing?.quoted ? `Rs.${s.pricing.quoted}` : "—",
      s.status,
      s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN") : "—",
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type:"text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `movetto-shipments-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const goToTracking = (trackingId) => {
    navigate(`/tracking?id=${trackingId}`);
  };

  return (
    <div style={{background:C.bg, minHeight:"100vh", fontFamily:"'Sora',sans-serif", color:C.text}}>
      <GlobalStyles/>

      {/* Header */}
      <div className="header-container" style={{background:C.panel, borderBottom:`1px solid ${C.border}`, padding:"0 28px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:16}}>
          <div onClick={() => navigate("/dashboard")} style={{display:"flex", alignItems:"center", gap:8, color:C.dim, cursor:"pointer", fontSize:13}}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="var(--mv-dim)" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <span className="header-dash-text">Dashboard</span>
          </div>
          <div style={{width:1, height:16, background:C.border}}/>
          <div className="header-title" style={{fontSize:14, fontWeight:700}}>All shipments</div>
          <div className="header-badge" style={{fontSize:12, background:C.card, border:`1px solid ${C.border}`, borderRadius:4, padding:"2px 10px", color:C.muted}}>
            {total.toLocaleString()} total
          </div>
        </div>
        <div className="header-actions" style={{display:"flex", gap:8}}>
          <button
            onClick={exportCSV}
            className="export-btn"
            style={{background:"transparent", border:`1px solid ${C.border2}`, borderRadius:6, padding:"7px 14px", fontSize:12, color:C.muted, cursor:"pointer"}}
          >
            Export <span className="hide-mobile-text">CSV</span>
          </button>
          <button
            onClick={() => navigate("/book")}
            className="book-btn"
            style={{background:C.yellow, color:"#0A0B0D", border:"none", padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer"}}
          >
            + Book<span className="hide-mobile-text"> shipment</span>
          </button>
        </div>
      </div>

      <div className="main-content-pad" style={{padding:"24px 28px"}}>

        {/* Filters */}
        <div className="filters-container" style={{display:"flex", alignItems:"center", gap:10, marginBottom:20, flexWrap:"wrap"}}>
          <input
            className="search-inp"
            placeholder="Search by carrier, route..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="status-filters" style={{display:"flex", gap:6}}>
            {STATUS_FILTERS.map(f => (
              <button
                key={f.key}
                className={`filter-btn${statusFilter === f.key ? " active" : ""}`}
                onClick={() => { setStatusFilter(f.key); setPage(1); }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={carrierFilter}
            onChange={e => { setCarrierFilter(e.target.value); setPage(1); }}
            style={{background:C.panel, border:`1px solid ${C.border}`, borderRadius:6, padding:"7px 12px", fontSize:12, color:C.muted, cursor:"pointer", fontFamily:"'Sora',sans-serif", outline:"none"}}
          >
            <option value="all">All carriers</option>
            <option value="Delhivery">Delhivery</option>
            <option value="Shiprocket">Shiprocket</option>
            <option value="Bluedart">Bluedart</option>
            <option value="XpressBees">XpressBees</option>
            <option value="DTDC">DTDC</option>
          </select>
        </div>

        {/* Table */}
        <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden"}}>
          <div className="tbl-container">
            <div className="tbl-header">
            <span>Tracking ID / Route</span>
            <span>Carrier</span>
            <span>Weight</span>
            <span>Rate</span>
            <span>Date</span>
            <span>Status</span>
          </div>

          {loading ? (
            <div style={{display:"flex", alignItems:"center", justifyContent:"center", padding:"60px", flexDirection:"column", gap:16}}>
              <div className="spinner"/>
              <div style={{fontSize:13, color:C.dim}}>Loading shipments...</div>
            </div>
          ) : shipments.length === 0 ? (
            <div style={{padding:"60px", textAlign:"center", color:C.dim}}>
              <div style={{fontSize:40, marginBottom:12}}>📦</div>
              <div style={{fontSize:16, fontWeight:700, color:C.text, marginBottom:6}}>No shipments found</div>
              <div style={{fontSize:13, marginBottom:20}}>
                {statusFilter !== "all" ? "Try changing the status filter" : "Book your first shipment to see it here"}
              </div>
              <button
                onClick={() => navigate("/book")}
                style={{background:C.yellow, color:"#0A0B0D", border:"none", padding:"10px 24px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer"}}
              >
                Book first shipment →
              </button>
            </div>
          ) : (
            shipments.map((s, i) => (
              <div key={s._id || i} className="tbl-row" onClick={() => goToTracking(s.trackingId)}>
                <div>
                  <div style={{fontSize:13, fontWeight:600, marginBottom:3}}>
                    {s.origin?.city || s.origin?.pincode || "—"} → {s.destination?.city || s.destination?.pincode || "—"}
                  </div>
                  <Mono>{s.trackingId}</Mono>
                </div>
                <div style={{fontSize:13}}>{s.carrierName || "—"}</div>
                <div style={{fontSize:13}}>{s.package?.weight ? `${s.package.weight} kg` : "—"}</div>
                <div style={{fontSize:13, fontWeight:600}}>{s.pricing?.quoted ? `₹${s.pricing.quoted.toLocaleString()}` : "—"}</div>
                <div style={{fontSize:12, color:C.dim}}>
                  {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN", {day:"numeric", month:"short"}) : "—"}
                </div>
                <div><StatusTag status={s.status}/></div>
              </div>
            ))
          )}
          </div>

          {/* Pagination */}
          {!loading && shipments.length > 0 && (
            <div className="pagination-row" style={{padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:`1px solid ${C.border}`}}>
              <span style={{fontSize:12, color:C.dim}}>
                Showing {((page-1)*LIMIT)+1}–{Math.min(page*LIMIT, total)} of {total.toLocaleString()} shipments
              </span>
              <div style={{display:"flex", gap:6, alignItems:"center"}}>
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>←</button>
                {Array.from({length:Math.min(5, pages)}, (_, i) => {
                  const p = page <= 3 ? i+1 : page - 2 + i;
                  if (p < 1 || p > pages) return null;
                  return (
                    <button key={p} className={`page-btn${page === p ? " active" : ""}`} onClick={() => setPage(p)}>
                      {p}
                    </button>
                  );
                })}
                <button className="page-btn" onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page === pages}>→</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
