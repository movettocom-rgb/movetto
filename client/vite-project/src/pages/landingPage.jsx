import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

export default function LandingPage() {
  const [activePlan, setActivePlan] = useState("Growth");
  const themeMode = useStore((s) => s.themeMode);
  const toggleThemeMode = useStore((s) => s.toggleThemeMode);
  const navigate = useNavigate();

  const isDark = themeMode === 'dark';

  const c = {
    bg:            isDark ? "#0A0B0D" : "#FFFFFF",
    bg2:           isDark ? "var(--mv-panel)" : "#F8FAFC",
    bg3:           isDark ? "var(--mv-card)" : "#F1F5F9",
    border:        isDark ? "var(--mv-border)" : "#E2E8F0",
    border2:       isDark ? "var(--mv-border-2)" : "#CBD5E1",
    text:          isDark ? "var(--mv-text)" : "#0F172A",
    muted:         isDark ? "var(--mv-muted)" : "#475569",
    dim:           isDark ? "var(--mv-dim)" : "#64748B",
    yellow:        isDark ? "#E8F400" : "#9CA300",
    yellowBtn:     isDark ? "#E8F400" : "#CADD00",
    green:         isDark ? "#00D68A" : "#059669",
    red:           isDark ? "#FF5C38" : "#DC2626",
    amber:         isDark ? "#FFB020" : "#D97706",
    blue:          isDark ? "#4da6ff" : "#2563EB",
    waBg1:         isDark ? "#1a2e1a" : "#D1FAE5",
    waBg2:         isDark ? "#1a2414" : "#ECFDF5",
    waText:        isDark ? "var(--mv-paper)" : "#064E3B",
    waBorder1:     isDark ? "1px solid rgba(0,214,138,0.27)" : "1px solid rgba(5,150,105,0.3)",
    waBorder2:     isDark ? "1px solid rgba(0,214,138,0.13)" : "1px solid rgba(5,150,105,0.2)",
    avatar1:       isDark ? "#1a1a2e" : "#DBEAFE",
    avatar2:       isDark ? "#1a2e1a" : "#D1FAE5",
    featBg:        isDark ? "#131700" : "#FEF9C3",
    navBg:         isDark ? "rgba(10,11,13,0.87)" : "rgba(255,255,255,0.87)",
    yellowLightBg: isDark ? "rgba(232,244,0,0.09)" : "rgba(178,188,0,0.15)",
    yellowBorder:  isDark ? "1px solid rgba(232,244,0,0.27)" : "1px solid rgba(178,188,0,0.3)",
    greenLightBg:  isDark ? "rgba(0, 214, 138, 0.08)" : "rgba(5, 150, 105, 0.1)",
    greenBorder:   isDark ? "1px solid rgba(0, 214, 138, 0.25)" : "1px solid rgba(5, 150, 105, 0.25)",
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { margin: 0; background: ${c.bg}; overflow-x: hidden; }
    @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes pulse  { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    .ticker-anim      { animation: ticker 22s linear infinite; }
    .pulse-anim       { animation: pulse 2s infinite; display: inline-block; }
    .pulse-anim-slow  { animation: pulse 2.5s infinite; display: inline-block; }
    .nav-link:hover   { color: ${isDark ? "var(--mv-text)" : "#0F172A"} !important; }
    .feat-card:hover  { border-color: ${isDark ? "rgba(232,244,0,0.27)" : "rgba(178,188,0,0.4)"} !important; }
    .btn-ghost:hover  { background: ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} !important; }
    
    /* Responsive Classes */
    .nav-container { padding: 0 32px; height: 80px; }
    .nav-links { display: flex; gap: 36px; }
    .nav-actions { display: flex; gap: 8px; }
    
    .hero-section { padding: 72px 32px 0; }
    .hero-title { font-size: 64px; }
    .stat-strip { flex-direction: row; margin: 0 -32px; }
    .stat-item { border-right: 1px solid ${c.border}; border-bottom: none; }
    .stat-item:last-child { border-right: none; border-bottom: none; }
    
    .section-padding { padding: 72px 32px; }
    .section-padding-bottom-only { padding: 0 32px 72px; }
    .section-title { font-size: 48px; }
    
    .kpi-grid { grid-template-columns: repeat(4, 1fr); }
    .table-container { overflow-x: auto; }
    .table-header { min-width: 600px; }
    .table-row { min-width: 600px; }
    
    .steps-grid { grid-template-columns: repeat(3, 1fr); }
    .feats-grid { grid-template-columns: repeat(2, 1fr); }
    .wa-grid { grid-template-columns: 1fr 1fr; }
    .pricing-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .testi-grid { grid-template-columns: repeat(2, 1fr); }
    
    .footer-container { flex-direction: row; padding: 64px 32px; }
    .footer-links { flex-wrap: wrap; justify-content: center; }
    .cta-title { font-size: 56px; }
    .cta-buttons { flex-direction: row; }

    @media (max-width: 1024px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
      .steps-grid { grid-template-columns: 1fr; }
      .pricing-grid { grid-template-columns: 1fr; gap: 24px; }
      .wa-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .nav-container { padding: 0 16px; height: 70px; }
      .nav-links { display: none; }
      .nav-actions .btn-ghost { display: none; }
      
      .hero-section { padding: 40px 16px 0; }
      .hero-title { font-size: 40px; }
      .stat-strip { flex-direction: column; margin: 0 -16px; }
      .stat-item { border-right: none; border-bottom: 1px solid ${c.border}; padding: 20px 0; }
      
      .section-padding { padding: 48px 16px; }
      .section-padding-bottom-only { padding: 0 16px 48px; }
      .section-title { font-size: 32px; }
      
      .feats-grid { grid-template-columns: 1fr; }
      .testi-grid { grid-template-columns: 1fr; }
      
      .footer-container { flex-direction: column; gap: 24px; text-align: center; padding: 40px 16px; }
      
      .cta-title { font-size: 36px; }
      .cta-buttons { flex-direction: column; }
    }
    
    @media (max-width: 480px) {
      .kpi-grid { grid-template-columns: 1fr; }
      .nav-actions button { padding: 8px 16px; font-size: 14px; }
      .cta-buttons { flex-direction: column; width: 100%; }
      .cta-buttons button { width: 100%; }
      .hero-section .cta-buttons button { width: 100%; }
    }
  `;

  /* ── tiny helpers ── */
  const Y = ({ children }) => <span style={{ color: c.yellow }}>{children}</span>;

  const BtnY = ({ children, style = {}, onClick }) => (
    <button onClick={onClick} style={{
      background: c.yellowBtn, color: "#0A0B0D", border: "none",
      padding: "9px 20px", borderRadius: 6, fontSize: 13, fontWeight: 800,
      cursor: "pointer", letterSpacing: "0.02em", ...style,
    }}>{children}</button>
  );

  const BtnG = ({ children, style = {}, onClick }) => (
    <button onClick={onClick} className="btn-ghost" style={{
      background: "transparent", color: c.text, border: `1px solid ${c.border2}`,
      padding: "9px 20px", borderRadius: 6, fontSize: 13, cursor: "pointer",
      transition: "background 0.2s", ...style,
    }}>{children}</button>
  );

  const Eyebrow = ({ children }) => (
    <div style={{ fontSize: 14, letterSpacing: "0.14em", color: c.yellow, textTransform: "uppercase", marginBottom: 12 }}>{children}</div>
  );

  const SectionH = ({ children, center }) => (
    <div className="section-title" style={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 16, color: c.text, textAlign: center ? "center" : "left" }}>{children}</div>
  );

  const Tag = ({ variant, children }) => {
    const vs = {
      green: { background: isDark ? "#0d2414" : "#ECFDF5", color: c.green, border: `1px solid ${isDark ? 'rgba(0,214,138,0.2)' : '#A7F3D0'}` },
      amber: { background: isDark ? "#1f1500" : "#FFFBEB", color: c.amber, border: `1px solid ${isDark ? 'rgba(255,176,32,0.2)' : '#FDE68A'}` },
      red:   { background: isDark ? "#200808" : "#FEF2F2", color: c.red,   border: `1px solid ${isDark ? 'rgba(255,92,56,0.2)' : '#FECACA'}` },
      blue:  { background: isDark ? "#080f20" : "#EFF6FF", color: c.blue,  border: `1px solid ${isDark ? 'rgba(77,166,255,0.2)' : '#BFDBFE'}` },
    };
    return (
      <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 4, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em", ...vs[variant] }}>{children}</span>
    );
  };

  /* ── data ── */
  const tickItems = [
    { label: "Delhivery",  val: "+0.8% on-time",    col: c.green },
    { label: "BOM→DEL",   val: "₹847 best rate",    col: c.text  },
    { label: "Shiprocket", val: "94.2% SLA",         col: c.green },
    { label: "XpressBees", val: "2h ahead of ETA",   col: c.green },
    { label: "Bluedart",   val: "3 delays flagged",  col: c.red   },
    { label: "DEL→BLR",   val: "₹1,203 best rate",  col: c.text  },
    { label: "MUM→HYD",   val: "saved ₹312 avg",    col: c.green },
    { label: "DTDC",       val: "99.1% pickup rate", col: c.green },
  ];
  const allTicks = [...tickItems, ...tickItems];

  const kpis = [
    { n: "1,247", l: "Total shipments", ch: "↑ 18% vs last month", up: true,  col: c.text  },
    { n: "₹8.4L", l: "Total spend",     ch: "↓ ₹42k saved",       up: true,  col: c.yellow},
    { n: "96.2%", l: "On-time rate",    ch: "↑ 2.1% this month",  up: true,  col: c.green },
    { n: "7",     l: "Pending RTO",     ch: "↑ 2 new today",      up: false, col: c.amber },
  ];

  const shipments = [
    { id: "MV-2025-K8XP91", route: "BOM → DEL", carrier: "Delhivery",  rate: "₹847",   status: "Delivered",     v: "green" },
    { id: "MV-2025-R3YT22", route: "DEL → BLR", carrier: "Shiprocket", rate: "₹1,203", status: "In transit",    v: "amber" },
    { id: "MV-2025-W1QZ09", route: "MUM → HYD", carrier: "XpressBees", rate: "₹654",   status: "Out for del.",  v: "blue"  },
    { id: "MV-2025-P9WQ44", route: "CHE → PUN", carrier: "Bluedart",   rate: "₹2,100", status: "RTO initiated", v: "red"   },
  ];

  const steps = [
    { n: "01", title: "Enter shipment details", desc: "Origin pincode, destination, weight, dimensions. Our system auto-fills city and state. Takes 30 seconds flat." },
    { n: "02", title: "Compare live rates",      desc: "Real-time rates from 12+ carriers — Delhivery, Shiprocket, Bluedart, XpressBees, DTDC. Sorted by price and ETA." },
    { n: "03", title: "Book, label, notify",     desc: "One click books the shipment. PDF label generated instantly. Customer gets WhatsApp notification automatically." },
  ];

  const feats = [
    {
      title: "Multi-carrier dashboard",
      desc: "All shipments from Delhivery, Shiprocket, Bluedart — unified in one screen. Filter by carrier, status, date, route, or value.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1.5" fill={c.yellowBtn}/>
          <rect x="11" y="2" width="7" height="7" rx="1.5" fill={c.yellowBtn} opacity="0.4"/>
          <rect x="2" y="11" width="7" height="7" rx="1.5" fill={c.yellowBtn} opacity="0.4"/>
          <rect x="11" y="11" width="7" height="7" rx="1.5" fill={c.yellowBtn} opacity="0.2"/>
        </svg>
      ),
    },
    {
      title: "Auto invoice reconciliation",
      desc: "System auto-matches every carrier invoice to every booking. Weight disputes flagged automatically. Zero manual Excel work.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10l4 4 8-8" stroke={c.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "AI route intelligence",
      desc: "Learns from every shipment which carrier performs best on your specific routes. Recommendations get smarter every month.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke={c.blue} strokeWidth="1.5" fill="none"/>
          <path d="M7 10h6M10 7v6" stroke={c.blue} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: "WhatsApp native booking",
      desc: "Book shipments, get status updates, send customer alerts — all through WhatsApp. India doesn't live in dashboards.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="4" width="14" height="12" rx="2" stroke={c.green} strokeWidth="1.5" fill="none"/>
          <path d="M7 9h6M7 12h4" stroke={c.green} strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  const carriers = [
    { name: "Delhivery",    sub: "94.2% on-time",  dot: c.green },
    { name: "Shiprocket",   sub: "Multi-carrier",   dot: c.green },
    { name: "Bluedart",     sub: "Premium express", dot: c.green },
    { name: "XpressBees",   sub: "Fast regional",   dot: c.green },
    { name: "Ecom Express", sub: "D2C specialist",  dot: c.amber },
    { name: "DTDC",         sub: "Pan India",       dot: c.green },
  ];

  const plans = [
    {
      name: "Starter", price: "₹1,999", cycle: "/month",
      target: "Small traders · 1–2 staff", featured: false,
      features: ["200 shipments/month","3 carrier integrations","WhatsApp status alerts","30-day shipment history","1 user seat","Email support"],
      btnLabel: "Get started", btnType: "ghost",
    },
    {
      name: "Growth", price: "₹4,999", cycle: "/month",
      target: "Growing SME · 5–20 staff ops", featured: true, badge: "RECOMMENDED",
      features: ["1,000 shipments/month","All carriers — unlimited","AI route recommendations","Auto invoice reconciliation","WhatsApp booking + tracking","5 user seats"],
      btnLabel: "Start free trial", btnType: "yellow",
    },
    {
      name: "Enterprise", price: "₹9,999", cycle: "/month",
      target: "Distributors · 50+ staff", featured: false,
      features: ["Unlimited shipments","API + ERP integration","Custom carrier rate cards","Dedicated account manager","SLA uptime guarantee","Unlimited user seats"],
      btnLabel: "Contact us", btnType: "ghost",
    },
  ];

  const testimonials = [
    {
      quote: "We were spending 6 hours a month reconciling Delhivery invoices in Excel. Movetto does it automatically the moment each shipment delivers. That's 6 hours back every month.",
      name: "Rajesh Kumar", role: "Ops Manager · Mumbai textile distributor",
      initials: "RK", avatarBg: c.avatar1, avatarCol: c.blue,
    },
    {
      quote: "I ship 400 orders a month to 30 cities. Before Movetto I was on 4 different carrier dashboards. Now it's one screen. Rate comparison alone saves us ₹18,000 a month.",
      name: "Sneha Pillai", role: "Founder · Bangalore pharma wholesaler",
      initials: "SP", avatarBg: c.avatar2, avatarCol: c.green,
    },
  ];

  /* ── render ── */
  return (
    <div style={{ background: c.bg, color: c.text, fontFamily: "'Inter', system-ui, sans-serif", width: "100%", overflowX: "hidden" }}>
      <style>{globalStyles}</style>

      {/* ─── NAVBAR ─── */}
      <nav className="nav-container" style={{ background: c.navBg, borderBottom: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.06em" }}>MOVE<Y>TTO</Y></div>
        <div className="nav-links" style={{ fontSize: 16, color: c.dim }}>
          {["Product","Carriers","Pricing","Docs"].map(l => (
            <span key={l} className="nav-link" style={{ cursor: "pointer", transition: "color 0.2s", color: c.dim }}>{l}</span>
          ))}
        </div>
        <div className="nav-actions" style={{ alignItems: "center" }}>
          <button
            onClick={toggleThemeMode}
            style={{
              background: "transparent",
              border: `1px solid ${c.border2}`,
              color: c.text,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              marginRight: "8px",
              transition: "background 0.2s"
            }}
            className="btn-ghost"
            title="Toggle theme"
          >
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <BtnG onClick={() => navigate('/auth')} style={{ fontSize: 16, padding: "10px 24px" }}>Log in</BtnG>
          <BtnY onClick={() => navigate('/auth')} style={{ fontSize: 16, padding: "10px 24px" }}>Start free →</BtnY>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <div className="hero-section" style={{ textAlign: "center", position: "relative" }}>
        {/* grid bg */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", overflow: "hidden" }}>
          <svg width="100%" height="100%" style={{ opacity: isDark ? 0.06 : 0.15 }} xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={c.yellow} strokeWidth="0.5"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#g)"/>
          </svg>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* live badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: c.greenLightBg, border: c.greenBorder, padding: "8px 20px", borderRadius: 30, fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 32, letterSpacing: "0.02em" }}>
            <span className="pulse-anim" style={{ width: 8, height: 8, borderRadius: "50%", background: c.green, boxShadow: `0 0 10px ${c.green}` }}/>
            <span><span style={{ color: c.green }}> Live on </span> 100+ businesses across India</span>
          </div>

          {/* H1 */}
          <div className="hero-title" style={{ fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.03em", marginBottom: 24 }}>
            SHIP SMARTER.<br/><Y>EVERY ROUTE.</Y><br/>EVERY CARRIER.
          </div>

          <p style={{ fontSize: 16, color: c.muted, maxWidth: 440, margin: "0 auto 36px", lineHeight: 1.7 }}>
            India's only booking intelligence platform. Compare rates from 12+ carriers, book in 60 seconds, track everything from one screen.
          </p>

          <div className="cta-buttons" style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 56 }}>
            <BtnY onClick={() => navigate('/auth')} style={{ fontSize: 15, padding: "13px 28px" }}>Start free — 5 minutes</BtnY>
            <BtnG onClick={() => navigate('/auth')} style={{ fontSize: 15, padding: "13px 28px" }}>Watch demo →</BtnG>
          </div>
        </div>

        {/* stat strip */}
        <div className="stat-strip" style={{ display: "flex", borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
          {[
            { n: <span>₹15L<span style={{ fontSize: 24, color: c.yellow }}>Cr</span></span>, l: "India logistics TAM" },
            { n: <span>63<span style={{ fontSize: 24, color: c.yellow }}>M</span></span>,   l: "MSMEs underserved" },
            { n: <Y>0</Y>,                                                                   l: "Unified tools exist" },
            { n: <span>85<span style={{ fontSize: 24, color: c.yellow }}>%</span></span>,   l: "Target gross margin" },
          ].map((s, i, arr) => (
            <div key={i} className="stat-item" style={{ flex: 1, padding: "28px 0", textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 14, color: c.dim, marginTop: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TICKER ─── */}
      <div style={{ background: c.bg2, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}`, overflow: "hidden", padding: "18px 0" }}>
        <div className="ticker-anim" style={{ display: "flex", whiteSpace: "nowrap" }}>
          {allTicks.map((t, i) => (
            <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "0 40px", fontSize: 16, color: c.dim, borderRight: `1px solid ${c.border}` }}>
              {t.label} <span style={{ color: t.col, fontFamily: "monospace" }}>{t.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── DASHBOARD PREVIEW ─── */}
      <div className="section-padding" style={{ background: c.bg, paddingBottom: 0 }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto", border: `1px solid ${c.border}`, borderBottom: "none", borderRadius: "12px 12px 0 0", background: c.bg2, overflow: "hidden" }}>
          {/* browser chrome */}
          <div style={{ background: c.bg3, borderBottom: `1px solid ${c.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            {[c.red, c.amber, c.green].map(col => <div key={col} style={{ width: 10, height: 10, borderRadius: "50%", background: col }}/>)}
            <div style={{ background: c.bg, border: `1px solid ${c.border2}`, borderRadius: 4, padding: "3px 12px", fontSize: 11, color: c.dim, fontFamily: "monospace", flex: 1, textAlign: "center" }}>
              app.movetto.com/dashboard
            </div>
            <span style={{ fontSize: 11, color: c.dim }}>Live</span>
            <span className="pulse-anim" style={{ width: 6, height: 6, borderRadius: "50%", background: c.green }}/>
          </div>

          <div style={{ padding: "28px 24px" }}>
            {/* header row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Shipment overview — May 2025</div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 14, background: c.border, border: `1px solid ${c.border2}`, padding: "6px 12px", borderRadius: 4, color: c.muted, cursor: "pointer" }}>This month</span>
                <span style={{ fontSize: 14, background: c.yellowLightBg, border: c.yellowBorder, padding: "6px 12px", borderRadius: 4, color: c.yellow, cursor: "pointer" }}>Export CSV</span>
              </div>
            </div>

            {/* KPI row */}
            <div className="kpi-grid" style={{ display: "grid", gap: 14, marginBottom: 20 }}>
              {kpis.map(k => (
                <div key={k.l} style={{ background: c.bg3, border: `1px solid ${c.border}`, borderRadius: 8, padding: "20px 18px" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1, color: k.col }}>{k.n}</div>
                  <div style={{ fontSize: 14, color: c.dim, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.07em" }}>{k.l}</div>
                  <div style={{ fontSize: 14, marginTop: 10, color: k.up ? c.green : c.red }}>{k.ch}</div>
                </div>
              ))}
            </div>

            {/* table */}
            <div className="table-container" style={{ background: c.bg3, border: `1px solid ${c.border}`, borderRadius: 8 }}>
              <div className="table-header" style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr", background: c.border, padding: "14px 16px", fontSize: 14, color: c.dim, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {["Tracking ID","Route","Carrier","Rate","Status"].map(h => <span key={h}>{h}</span>)}
              </div>
              {shipments.map(r => (
                <div key={r.id} className="table-row" style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr", padding: "18px 16px", borderTop: `1px solid ${c.border}`, fontSize: 14, alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 15, color: c.muted }}>{r.id}</span>
                  <span style={{ fontSize: 15, color: c.muted }}>{r.route}</span>
                  <span style={{ fontSize: 15, color: c.text }}>{r.carrier}</span>
                  <span style={{ fontSize: 15, color: c.text }}>{r.rate}</span>
                  <span><Tag variant={r.v}>{r.status}</Tag></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <div className="section-padding">
        <div style={{ textAlign: "center" }}>
          <Eyebrow>How it works</Eyebrow>
          <SectionH center>Book a shipment<br/>in <Y>3 steps</Y></SectionH>
        </div>
        <div className="steps-grid" style={{ display: "grid", gap: 1, background: c.border, border: `1px solid ${c.border}`, borderRadius: 12, overflow: "hidden", marginTop: 16 }}>
          {steps.map(s => (
            <div key={s.n} style={{ background: c.bg2, padding: "40px 32px", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: c.yellow }}/>
              <div style={{ fontSize: 64, fontWeight: 900, color: c.border, lineHeight: 1, marginBottom: 20, letterSpacing: "-0.04em" }}>{s.n}</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{s.title}</div>
              <div style={{ fontSize: 16, color: c.muted, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* divider */}
      <div style={{ height: 1, background: c.border, margin: "0 32px" }}/>

      {/* ─── FEATURES ─── */}
      <div className="section-padding">
        <Eyebrow>Features</Eyebrow>
        <SectionH>Built for Indian<br/>ops teams</SectionH>
        <p style={{ fontSize: 18, color: c.muted, maxWidth: 600, lineHeight: 1.7, marginBottom: 40 }}>
          Every feature was designed around how Indian B2B businesses actually work — not how Silicon Valley thinks they work.
        </p>
        <div className="feats-grid" style={{ display: "grid", gap: 20 }}>
          {feats.map(f => (
            <div key={f.title} className="feat-card" style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 10, padding: 32, position: "relative", overflow: "hidden", transition: "border-color 0.2s" }}>
              <div style={{ width: 48, height: 48, background: c.featBg, border: `1px solid ${isDark ? 'rgba(232,244,0,0.2)' : 'rgba(178,188,0,0.3)'}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>{f.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</div>
              <div style={{ fontSize: 16, color: c.muted, lineHeight: 1.6 }}>{f.desc}</div>
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 80, height: 80, borderTop: `1px solid ${c.border2}`, borderLeft: `1px solid ${c.border2}`, borderRadius: "60px 0 0 0", opacity: 0.5 }}/>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CARRIERS ─── */}
      <div className="section-padding" style={{ background: c.bg2, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}>
        <Eyebrow>Carrier network</Eyebrow>
        <SectionH>We integrate everyone.<br/><Y>We prefer nobody.</Y></SectionH>
        <div style={{ fontSize: 18, color: c.muted }}>Pure data. No kickbacks. No exclusives.</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 32 }}>
          {carriers.map(cr => (
            <div key={cr.name} style={{ background: c.bg3, border: `1px solid ${c.border}`, borderRadius: 10, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 180 }}>
              <span className="pulse-anim-slow" style={{ width: 12, height: 12, borderRadius: "50%", background: cr.dot }}/>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{cr.name}</div>
                <div style={{ fontSize: 14, color: c.dim, marginTop: 4 }}>{cr.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── WHATSAPP ─── */}
      <div className="section-padding">
        <Eyebrow>WhatsApp native</Eyebrow>
        <div className="wa-grid" style={{ display: "grid", gap: 32, alignItems: "center" }}>
          <div>
            <SectionH>India lives on<br/><Y>WhatsApp.</Y><br/>So does Movetto.</SectionH>
            <p style={{ fontSize: 18, color: c.muted, lineHeight: 1.7, marginBottom: 28 }}>
              Every business owner in India manages operations on WhatsApp. Movetto integrates directly — book, track, and alert customers without opening a dashboard.
            </p>
            {["Send shipment requests via WhatsApp","Auto-notify customers on delivery","Share invoices directly in chat"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: isDark ? "var(--mv-paper)" : c.text, marginBottom: 12 }}>
                <span style={{ color: c.green, fontSize: 20 }}>✓</span> {item}
              </div>
            ))}
          </div>

          {/* WA preview */}
          <div style={{ background: c.bg3, border: `1px solid ${c.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${c.border}` }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: c.waBg1, border: c.waBorder1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: c.green }}>M</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Movetto</div>
                <div style={{ fontSize: 13, color: c.green, marginTop: 4 }}>● Online</div>
              </div>
            </div>
            <div style={{ background: c.waBg2, border: c.waBorder2, borderRadius: "0 12px 12px 12px", padding: "14px 20px", fontSize: 16, color: c.waText, lineHeight: 1.6, marginBottom: 8, maxWidth: "90%" }}>
              Book shipment: BOM to DEL, 2.5kg electronics, COD ₹4,500
            </div>
            <div style={{ fontSize: 12, color: c.dim, marginBottom: 12 }}>10:42 AM</div>
            <div style={{ background: c.waBg2, border: c.waBorder2, borderRadius: "0 12px 12px 12px", padding: "14px 20px", fontSize: 16, color: c.waText, lineHeight: 1.6, marginBottom: 8, maxWidth: "90%" }}>
              ✓ Shipment booked!<br/>ID: MV-2025-K8XP91<br/>Carrier: Delhivery Surface Express<br/>Rate: ₹847 (saved ₹203 vs avg)<br/>ETA: 16 Jun — 2 days ahead of SLA<br/>Label: [Download PDF]
            </div>
            <div style={{ fontSize: 12, color: c.dim, textAlign: "right" }}>10:42 AM ✓✓</div>
          </div>
        </div>
      </div>

      {/* divider */}
      <div style={{ height: 1, background: c.border, margin: "0 32px" }}/>

      {/* ─── PRICING ─── */}
      <div className="section-padding">
        <div style={{ textAlign: "center" }}>
          <Eyebrow>Pricing</Eyebrow>
          <SectionH center>Three tiers.<br/><Y>Real numbers.</Y></SectionH>
          <p style={{ fontSize: 18, color: c.muted, marginBottom: 0 }}>No sales calls. No 6-month procurement. Live in 10 minutes.</p>
        </div>
        <div 
          className="pricing-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 48 }}
          onMouseLeave={() => setActivePlan("Growth")}
        >
          {plans.map(p => {
            const isFeatured = activePlan === p.name;
            return (
            <div 
              key={p.name} 
              onMouseEnter={() => setActivePlan(p.name)}
              style={{ background: c.bg2, border: isFeatured ? `2px solid ${c.yellow}` : `1px solid ${c.border}`, borderRadius: 12, padding: 32, transition: "all 0.3s ease", transform: isFeatured ? "scale(1.02)" : "scale(1)" }}
            >
              {p.badge && <div style={{ background: c.yellow, color: c.bg, fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 4, letterSpacing: "0.06em", display: "inline-block", marginBottom: 16, opacity: isFeatured ? 1 : 0.5, transition: "opacity 0.3s ease" }}>{p.badge}</div>}
              <div style={{ fontSize: 16, fontWeight: 700, color: isFeatured ? c.yellow : c.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12, transition: "color 0.3s ease" }}>{p.name}</div>
              <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 8, color: isFeatured ? c.yellow : c.text, transition: "color 0.3s ease" }}>{p.price}</div>
              <div style={{ fontSize: 16, color: c.dim }}>{p.cycle}</div>
              <div style={{ fontSize: 15, color: c.dim, marginTop: 10, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${c.border}` }}>{p.target}</div>
              {p.features.map(f => (
                <div key={f} style={{ fontSize: 15, color: "var(--mv-muted)", padding: "8px 0", borderBottom: `1px solid ${c.bg2}`, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: c.green, fontSize: 16, flexShrink: 0 }}>✓</span>{f}
                </div>
              ))}
              {isFeatured
                ? <BtnY onClick={() => navigate('/auth')} style={{ width: "100%", marginTop: 24, padding: 14, fontSize: 16, fontWeight: 700, borderRadius: 6 }}>{p.btnLabel}</BtnY>
                : <BtnG onClick={() => navigate('/auth')} style={{ width: "100%", marginTop: 24, padding: 14, fontSize: 16, fontWeight: 700, borderRadius: 6 }}>{p.btnLabel}</BtnG>
              }
            </div>
          )})}
        </div>
      </div>

      {/* ─── TESTIMONIALS ─── */}
      <div className="section-padding-bottom-only">
        <Eyebrow>Social proof</Eyebrow>
        <SectionH>What operators say</SectionH>
        <div className="testi-grid" style={{ display: "grid", gap: 20, marginTop: 24 }}>
          {testimonials.map(t => (
            <div key={t.name} style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 12, padding: 32 }}>
              <p style={{ fontSize: 18, color: isDark ? "var(--mv-paper)" : c.text, lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>"{t.quote}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: t.avatarBg, color: t.avatarCol, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{t.initials}</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 14, color: c.dim, marginTop: 4 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="section-padding" style={{ background: c.bg2, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}`, textAlign: "center" }}>
        <div className="cta-title" style={{ fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em", marginBottom: 24 }}>
          Stop shipping on<br/><Y>WhatsApp and prayers.</Y>
        </div>
        <p style={{ fontSize: 18, color: c.muted, marginBottom: 40 }}>Join 100+ Indian businesses. No credit card needed. Live in 5 minutes.</p>
        <div className="cta-buttons" style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <BtnY onClick={() => navigate('/auth')} style={{ fontSize: 18, padding: "16px 36px" }}>Create free account →</BtnY>
          <BtnG onClick={() => navigate('/auth')} style={{ fontSize: 18, padding: "16px 36px" }}>Talk to us</BtnG>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="footer-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${c.border}` }}>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.06em" }}>MOVE<Y>.</Y>TTO</div>
        <div style={{ fontSize: 14, color: "var(--mv-dimmer)" }}>© 2025 Movetto Technologies Pvt Ltd</div>
        <div className="footer-links" style={{ display: "flex", gap: 24, fontSize: 16, color: c.dim }}>
          {["Privacy","Terms","Carriers","API Docs","Support"].map(l => <span key={l} style={{ cursor: "pointer" }}>{l}</span>)}
        </div>
      </footer>
    </div>
  );
}
