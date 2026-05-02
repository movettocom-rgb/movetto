import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import api from '../services/api';
import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell
} from "recharts";

/* ════════════════════════════════════════
   GLOBAL STYLES
════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0A0B0D; font-family: 'DM Sans', system-ui, sans-serif; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #0A0B0D; }
    ::-webkit-scrollbar-thumb { background: #22272F; border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: #3D4655; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
    @keyframes barGrow { from{width:0} to{width:var(--w)} }
    .anim-fade { animation: fadeIn 0.3s ease forwards; }
    .anim-slide { animation: slideIn 0.25s ease forwards; }
    .pulse-dot { animation: pulse 2s infinite; }
    .ticker-anim { display:flex; white-space:nowrap; animation: ticker 22s linear infinite; }
    .sb-item { display:flex;align-items:center;gap:10px;padding:9px 18px;font-size:13px;color:#5A6478;cursor:pointer;transition:all 0.15s;border-left:3px solid transparent; }
    .sb-item:hover { color:#EEF2F6;background:#111318; }
    .sb-item.active { color:#EEF2F6;background:#111318;border-left-color:#E8F400; }
    .df-btn { padding:5px 12px;border-radius:5px;font-size:12px;cursor:pointer;border:1px solid #181C22;background:transparent;color:#5A6478;font-family:inherit;transition:all 0.15s; }
    .df-btn:hover { color:#EEF2F6;border-color:#22272F; }
    .df-btn.active { background:#E8F40018;border-color:#E8F40055;color:#E8F400; }
    .tbl-row { display:grid;grid-template-columns:2fr 1.2fr 0.9fr 0.9fr 1.1fr;gap:0;padding:10px 12px;border-bottom:1px solid #0D0F13;font-size:12px;align-items:center;cursor:pointer;transition:background 0.15s; }
    .tbl-row:hover { background:#131620; }
    .kpi-card { background:#111318;border:1px solid #181C22;border-radius:10px;padding:14px 16px;cursor:pointer;transition:border-color 0.2s,transform 0.15s;position:relative;overflow:hidden; }
    .kpi-card:hover { border-color:#22272F;transform:translateY(-1px); }
    .feat-card { background:#111318;border:1px solid #181C22;border-radius:10px;padding:16px;transition:border-color 0.2s; }
    .feat-card:hover { border-color:#22272F; }
    .nav-link { cursor:pointer;transition:color 0.2s;font-size:13px;color:#5A6478; }
    .nav-link:hover { color:#EEF2F6; }
    .btn-y { background:#E8F400;color:#0A0B0D;border:none;padding:8px 16px;border-radius:6px;font-size:12px;font-weight:800;cursor:pointer;font-family:inherit;transition:opacity 0.2s; }
    .btn-y:hover { opacity:0.88; }
    .btn-g { background:transparent;color:#EEF2F6;border:1px solid #22272F;padding:8px 16px;border-radius:6px;font-size:12px;cursor:pointer;font-family:inherit;transition:border-color 0.2s; }
    .btn-g:hover { border-color:#5A6478; }
    .insight-card { background:#0D0F13;border:1px solid #E8F40022;border-left:3px solid #E8F400;border-radius:0 8px 8px 0;padding:10px 14px;margin-bottom:8px;font-size:12px;color:#D8E0E8;line-height:1.5; }
    .quick-action { background:#111318;border:1px solid #181C22;border-radius:8px;padding:12px 14px;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:10px;font-size:13px;color:#D8E0E8; }
    .quick-action:hover { border-color:#E8F40044;background:#131700; }
    select { background:#0D0F13;border:1px solid #22272F;border-radius:5px;padding:5px 10px;font-size:11px;color:#8494A8;cursor:pointer;font-family:inherit;outline:none; }
    select option { background:#0D0F13; }
  `}</style>
);

/* ════════════════════════════════════════
   CONSTANTS / DATA
════════════════════════════════════════ */
const COLORS = {
  bg: "#0A0B0D", panel: "#0D0F13", card: "#111318",
  border: "#181C22", border2: "#22272F",
  text: "#EEF2F6", muted: "#8494A8", dim: "#5A6478", dimmer: "#3D4655",
  yellow: "#E8F400", green: "#00D68A", red: "#FF5C38", amber: "#FFB020", blue: "#4da6ff",
};

const PERIOD_DATA = {
  "7d":  { v1: "312",    v2: "₹2.1L",  v3: "97.1%", v4: "1",  c1: "+6% vs prev week",    c2: "Saved ₹11k",    c3: "↑ 1.2%",       c4: "stable" },
  "30d": { v1: "1,247",  v2: "₹8.4L",  v3: "96.2%", v4: "7",  c1: "+18% vs last month",  c2: "Saved ₹42k",    c3: "↑ 2.1%",       c4: "+2 new today" },
  "3m":  { v1: "3,841",  v2: "₹24.8L", v3: "95.4%", v4: "19", c1: "+22% vs Q1",          c2: "Saved ₹1.1L",   c3: "↑ 3.4%",       c4: "+5 vs prev" },
  "yr":  { v1: "14,203", v2: "₹91.2L", v3: "94.8%", v4: "67", c1: "+41% YoY",            c2: "Saved ₹4.2L",   c3: "Best year",    c4: "2.1% rate" },
};

const LINE_DATA = [
  { d: "May 1", v: 38 }, { d: "May 2", v: 45 }, { d: "May 3", v: 52 }, { d: "May 4", v: 41 },
  { d: "May 5", v: 67 }, { d: "May 6", v: 58 }, { d: "May 7", v: 72 }, { d: "May 8", v: 49 },
  { d: "May 9", v: 81 }, { d: "May 10", v: 63 }, { d: "May 11", v: 74 }, { d: "May 12", v: 68 }, { d: "May 13", v: 77 },
];

const BAR_DATA = [
  { name: "Delhivery", v: 3.2, color: COLORS.yellow },
  { name: "Shiprocket", v: 2.1, color: COLORS.blue },
  { name: "Bluedart", v: 1.8, color: COLORS.green },
  { name: "XpressBees", v: 0.9, color: COLORS.amber },
  { name: "DTDC", v: 0.4, color: COLORS.red },
];

const PIE_DATA = [
  { name: "Delhivery", value: 38, color: COLORS.yellow },
  { name: "Shiprocket", value: 25, color: COLORS.blue },
  { name: "Bluedart", value: 20, color: COLORS.green },
  { name: "XpressBees", value: 11, color: COLORS.amber },
  { name: "DTDC", value: 6, color: COLORS.red },
];

const CARRIERS = [
  { name: "Delhivery",  rate: 96, color: COLORS.green },
  { name: "XpressBees", rate: 93, color: COLORS.green },
  { name: "Bluedart",   rate: 91, color: COLORS.green },
  { name: "Shiprocket", rate: 87, color: COLORS.amber },
  { name: "DTDC",       rate: 78, color: COLORS.red },
];

const SHIPMENTS = [
  { id: "MV-2025-K8XP91", route: "BOM → DEL", carrier: "Delhivery",  weight: "2.5 kg", rate: "₹847",   status: "delivered", statusLabel: "Delivered",     tagType: "green" },
  { id: "MV-2025-R3YT22", route: "DEL → BLR", carrier: "Shiprocket", weight: "1.8 kg", rate: "₹1,203", status: "transit",   statusLabel: "In transit",    tagType: "amber" },
  { id: "MV-2025-W1QZ09", route: "MUM → HYD", carrier: "XpressBees", weight: "4.2 kg", rate: "₹654",   status: "transit",   statusLabel: "Out for del.", tagType: "blue" },
  { id: "MV-2025-P9WQ44", route: "CHE → PUN", carrier: "Bluedart",   weight: "3.1 kg", rate: "₹2,100", status: "rto",       statusLabel: "RTO initiated", tagType: "red" },
  { id: "MV-2025-T7MN33", route: "BLR → MUM", carrier: "DTDC",       weight: "0.9 kg", rate: "₹312",   status: "delivered", statusLabel: "Delivered",     tagType: "green" },
  { id: "MV-2025-N2KP81", route: "DEL → MUM", carrier: "Delhivery",  weight: "6.0 kg", rate: "₹1,540", status: "transit",   statusLabel: "Booked",        tagType: "yellow" },
];

const TICKER_ITEMS = [
  { label: "New signup", val: "Mumbai" },
  { label: "Shipment booked", val: "BOM→DEL ₹847" },
  { label: "New signup", val: "Surat" },
  { label: "Invoice reconciled", val: "₹12,400 matched" },
  { label: "Carrier connected", val: "Delhivery" },
  { label: "New signup", val: "Delhi" },
  { label: "Shipment booked", val: "DEL→BLR ₹1,203" },
];

const NOTIFICATIONS = [
  { id: 1, text: "RTO initiated on MV-2025-P9WQ44", type: "red",   time: "2m ago" },
  { id: 2, text: "Delhivery delay on 2 BOM→DEL orders", type: "amber", time: "14m ago" },
  { id: 3, text: "Invoice ₹12,400 auto-reconciled", type: "green", time: "1h ago" },
  { id: 4, text: "MV-2025-T7MN33 delivered successfully", type: "green", time: "2h ago" },
];

const QUICK_ACTIONS = [
  { icon: "📦", label: "Book new shipment", sub: "Compare rates instantly" },
  { icon: "🔍", label: "Track shipment", sub: "Enter tracking ID" },
  { icon: "📊", label: "Download report", sub: "Export CSV or PDF" },
  { icon: "⚡", label: "Rate calculator", sub: "Estimate shipping cost" },
];

/* ════════════════════════════════════════
   SMALL HELPERS
════════════════════════════════════════ */
const tag = (type, label) => {
  const map = {
    green:  { bg: "#0d2414", color: "#00D68A", border: "#00D68A33" },
    amber:  { bg: "#1f1500", color: "#FFB020", border: "#FFB02033" },
    red:    { bg: "#200808", color: "#FF5C38", border: "#FF5C3833" },
    blue:   { bg: "#080f20", color: "#4da6ff", border: "#4da6ff33" },
    yellow: { bg: "#1a1800", color: "#E8F400", border: "#E8F40033" },
  };
  const s = map[type] || map.green;
  return (
    <span style={{ display: "inline-block", padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.03em", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {label}
    </span>
  );
};

const Mono = ({ children }) => (
  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.muted }}>{children}</span>
);

const UpArrow = ({ color = COLORS.green }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M5 8V2M2 5l3-3 3 3" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const DownArrow = ({ color = COLORS.red }) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M5 2v6M2 5l3 3 3-3" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border2}`, borderRadius: 6, padding: "8px 12px", fontSize: 12 }}>
        <div style={{ color: COLORS.muted, marginBottom: 4 }}>{label}</div>
        <div style={{ color: COLORS.text, fontWeight: 700 }}>{payload[0].value}{payload[0].unit || ""}</div>
      </div>
    );
  }
  return null;
};

/* ════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════ */
const Sidebar = ({ active, setActive, onLogout }) => {
  const mainNav = [
    { id: "dashboard", label: "Dashboard",      badge: null,
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="#E8F400"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill="#EEF2F6" opacity="0.4"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill="#EEF2F6" opacity="0.4"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="#EEF2F6" opacity="0.2"/></svg> },
    { id: "book", label: "Book shipment",   badge: null,
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="3" width="13" height="9" rx="1.5" stroke="#5A6478" strokeWidth="1.2" fill="none"/><path d="M5 3V2M10 3V2" stroke="#5A6478" strokeWidth="1.2" strokeLinecap="round"/><path d="M1 6h13" stroke="#5A6478" strokeWidth="1.2"/></svg> },
    { id: "track", label: "Track shipments", badge: "3",
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6" stroke="#5A6478" strokeWidth="1.2" fill="none"/><path d="M7.5 4v3.5l2 2" stroke="#5A6478" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { id: "all", label: "All shipments",    badge: null,
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 4h11M2 7.5h8M2 11h6" stroke="#5A6478" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  ];
  const toolsNav = [
    { id: "analytics", label: "Analytics",  badge: null,
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2L9.5 6.5H14L10.5 9.5L12 14L7.5 11L3 14L4.5 9.5L1 6.5H5.5L7.5 2Z" stroke="#5A6478" strokeWidth="1.2" fill="none"/></svg> },
    { id: "carriers", label: "Carriers",    badge: null,
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="4" width="12" height="9" rx="1.5" stroke="#5A6478" strokeWidth="1.2" fill="none"/><path d="M5 4V2.5h5V4" stroke="#5A6478" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { id: "billing",  label: "Billing",     badge: null,
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="2" width="11" height="11" rx="2" stroke="#5A6478" strokeWidth="1.2" fill="none"/><path d="M5 7.5h5M7.5 5v5" stroke="#5A6478" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { id: "settings", label: "Settings",    badge: null,
      icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="2.5" stroke="#5A6478" strokeWidth="1.2" fill="none"/><path d="M2.5 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#5A6478" strokeWidth="1.2" strokeLinecap="round" fill="none"/></svg> },
  ];
  return (
    <div style={{ width: 200, background: COLORS.panel, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", flexShrink: 0, minHeight: "100vh" }}>
      {/* Logo */}
      <div style={{ padding: "16px 18px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 17, fontWeight: 900, letterSpacing: "0.06em" }}>
        MOVE<span style={{ color: COLORS.yellow }}>.</span>TTO
      </div>
      {/* Main nav */}
      <div style={{ padding: "10px 0" }}>
        <div style={{ fontSize: 10, color: COLORS.dimmer, padding: "6px 18px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Main</div>
        {mainNav.map(item => (
          <div key={item.id} className={`sb-item${active === item.id ? " active" : ""}`} onClick={() => setActive(item.id)}>
            {item.icon}
            {item.label}
            {item.badge && (
              <span style={{ marginLeft: "auto", background: "#FF5C3822", border: "1px solid #FF5C3844", color: COLORS.red, fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 10 }}>{item.badge}</span>
            )}
          </div>
        ))}
      </div>
      {/* Tools nav */}
      <div style={{ padding: "10px 0" }}>
        <div style={{ fontSize: 10, color: COLORS.dimmer, padding: "6px 18px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Tools</div>
        {toolsNav.map(item => (
          <div key={item.id} className={`sb-item${active === item.id ? " active" : ""}`} onClick={() => setActive(item.id)}>
            {item.icon}
            {item.label}
          </div>
        ))}
      </div>
      {/* User */}
<div style={{ marginTop: "auto", borderTop: `1px solid ${COLORS.border}` }}>
  <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1a2e1a", border: "1px solid #00D68A44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: COLORS.green, flexShrink: 0 }}>KM</div>
    <div>
      <div style={{ fontSize: 12, fontWeight: 600 }}>Kousik Maity</div>
      <div style={{ fontSize: 10, color: COLORS.dim }}>Growth plan</div>
    </div>
  </div>
  <div
    onClick={onLogout}
    style={{ margin: "0 12px 12px", padding: "8px 12px", borderRadius: 6, border: "1px solid #FF5C3833", background: "#200808", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", transition: "border-color 0.2s" }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "#FF5C3866"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "#FF5C3833"}
  >
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h3M9 9l3-3-3-3M12 6.5H5" stroke="#FF5C38" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span style={{ fontSize: 12, color: "#FF5C38", fontWeight: 600 }}>Log out</span>
  </div>
</div>
    </div>
  );
};

/* ════════════════════════════════════════
   TOPBAR
════════════════════════════════════════ */
const Topbar = ({ showNotifs, setShowNotifs }) => (
  <div style={{ background: COLORS.panel, borderBottom: `1px solid ${COLORS.border}`, padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 700 }}>
        Good morning, Kousik{" "}
        <span style={{ color: COLORS.muted, fontWeight: 400 }}>— Tuesday, 13 May 2025</span>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* Search */}
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 12px", fontSize: 12, color: COLORS.muted, display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="#5A6478" strokeWidth="1.2" fill="none"/><path d="M9 9l2 2" stroke="#5A6478" strokeWidth="1.2" strokeLinecap="round"/></svg>
        Search anything...
      </div>
      {/* Notifs */}
      <div style={{ position: "relative" }}>
        <div onClick={() => setShowNotifs(v => !v)}
          style={{ width: 32, height: 32, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5C4.5 1.5 3 3.5 3 5.5v3L1.5 10h11L11 8.5v-3C11 3.5 9.5 1.5 7 1.5Z" stroke="#8494A8" strokeWidth="1.2" fill="none"/><path d="M5.5 10c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" stroke="#8494A8" strokeWidth="1.2" fill="none"/></svg>
          <div style={{ position: "absolute", top: 6, right: 7, width: 6, height: 6, borderRadius: "50%", background: COLORS.red }} />
        </div>
        {showNotifs && <NotifDropdown onClose={() => setShowNotifs(false)} />}
      </div>
      <button className="btn-y">+ Book shipment</button>
    </div>
  </div>
);

/* ════════════════════════════════════════
   NOTIFICATION DROPDOWN
════════════════════════════════════════ */
const NotifDropdown = ({ onClose }) => (
  <div className="anim-fade" style={{ position: "absolute", right: 0, top: 38, width: 300, background: COLORS.card, border: `1px solid ${COLORS.border2}`, borderRadius: 10, zIndex: 100, overflow: "hidden" }}>
    <div style={{ padding: "12px 14px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, fontWeight: 700 }}>Notifications</span>
      <span style={{ fontSize: 11, color: COLORS.yellow, cursor: "pointer" }} onClick={onClose}>Mark all read</span>
    </div>
    {NOTIFICATIONS.map(n => (
      <div key={n.id} style={{ padding: "10px 14px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: n.type === "red" ? COLORS.red : n.type === "amber" ? COLORS.amber : COLORS.green, marginTop: 5, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.4 }}>{n.text}</div>
          <div style={{ fontSize: 10, color: COLORS.dim, marginTop: 3 }}>{n.time}</div>
        </div>
      </div>
    ))}
    <div style={{ padding: "10px 14px", textAlign: "center" }}>
      <span style={{ fontSize: 12, color: COLORS.yellow, cursor: "pointer" }}>View all notifications →</span>
    </div>
  </div>
);


/* ════════════════════════════════════════
   KPI GRID
════════════════════════════════════════ */
const KpiGrid = ({ period }) => {
  const d = PERIOD_DATA[period];
  const kpis = [
    { label: "Total shipments", val: d.v1, valColor: COLORS.text,   change: d.c1, trend: "up",   accent: COLORS.blue },
    { label: "Total spend",     val: d.v2, valColor: COLORS.yellow, change: d.c2, trend: "down", accent: COLORS.yellow },
    { label: "On-time delivery",val: d.v3, valColor: COLORS.green,  change: d.c3, trend: "up",   accent: COLORS.green },
    { label: "RTO / Failed",    val: d.v4, valColor: COLORS.red,    change: d.c4, trend: "down", accent: COLORS.red },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 14 }}>
      {kpis.map((k, i) => (
        <div key={i} className="kpi-card">
          <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: k.accent, borderRadius: "10px 0 0 10px" }} />
          <div style={{ fontSize: 11, color: COLORS.dim, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>{k.label}</div>
          <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1, marginBottom: 6, color: k.valColor }}>{k.val}</div>
          <div style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4, color: k.trend === "up" ? (i === 3 ? COLORS.red : COLORS.green) : COLORS.green }}>
            {k.trend === "up" ? <UpArrow color={i === 3 ? COLORS.red : COLORS.green} /> : <DownArrow color={COLORS.green} />}
            {k.change}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════
   CHARTS ROW
════════════════════════════════════════ */
const ChartsRow = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
    {/* Line chart */}
    <div className="feat-card">
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Shipments this month</div>
      <div style={{ fontSize: 11, color: COLORS.dim, marginBottom: 14 }}>Daily booking volume — May 2025</div>
      <div style={{ height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={LINE_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.yellow} stopOpacity={0.15} />
                <stop offset="95%" stopColor={COLORS.yellow} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="d" tick={{ fill: COLORS.dim, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: COLORS.dim, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="v" stroke={COLORS.yellow} strokeWidth={2} fill="url(#lineGrad)" dot={{ fill: COLORS.yellow, r: 2 }} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
    {/* Bar chart */}
    <div className="feat-card">
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Spend by carrier</div>
      <div style={{ fontSize: 11, color: COLORS.dim, marginBottom: 14 }}>Total ₹8.4L this month</div>
      <div style={{ height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={BAR_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: COLORS.dim, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: COLORS.dim, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}L`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="v" radius={[4, 4, 0, 0]}>
              {BAR_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════
   CARRIER + INSIGHTS ROW
════════════════════════════════════════ */
const CarrierInsightsRow = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
    {/* Carrier performance */}
    <div className="feat-card">
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Carrier performance</div>
      <div style={{ fontSize: 11, color: COLORS.dim, marginBottom: 14 }}>On-time rate this month</div>
      {CARRIERS.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: "#D8E0E8", width: 80, flexShrink: 0 }}>{c.name}</div>
          <div style={{ flex: 1, background: COLORS.border, borderRadius: 2, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${c.rate}%`, height: "100%", background: c.color, borderRadius: 2, transition: "width 0.8s ease" }} />
          </div>
          <div style={{ fontSize: 11, color: c.color, width: 36, textAlign: "right", flexShrink: 0 }}>{c.rate}%</div>
        </div>
      ))}
    </div>
    {/* AI insights */}
    <div className="feat-card">
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>AI route insights</div>
      <div style={{ fontSize: 11, color: COLORS.dim, marginBottom: 14 }}>Movetto recommendations for you</div>
      <div className="insight-card">
        <div style={{ fontSize: 10, color: COLORS.yellow, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Save money</div>
        Your BOM→DEL route costs ₹18,000 extra/month. Switch to Delhivery Surface — 22% cheaper, 94% on-time.
      </div>
      <div className="insight-card" style={{ borderLeftColor: COLORS.amber, borderColor: "#FFB02022" }}>
        <div style={{ fontSize: 10, color: COLORS.amber, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Watch out</div>
        Shiprocket has 3 delays on your CHE→PUN route this week. Consider Bluedart for this lane.
      </div>
      <div className="insight-card" style={{ borderLeftColor: COLORS.green, borderColor: "#00D68A22" }}>
        <div style={{ fontSize: 10, color: COLORS.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Good news</div>
        Your on-time rate is up 2.1% — best month in 6 months. Delhivery is performing well.
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════
   NEW: QUICK ACTIONS + PIE CHART ROW
════════════════════════════════════════ */
const QuickActionsRow = () => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
    {/* Quick actions */}
    <div className="feat-card">
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Quick actions</div>
      <div style={{ fontSize: 11, color: COLORS.dim, marginBottom: 14 }}>Shortcuts for common tasks</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {QUICK_ACTIONS.map((a, i) => (
          <div key={i} className="quick-action">
            <span style={{ fontSize: 18 }}>{a.icon}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{a.label}</div>
              <div style={{ fontSize: 10, color: COLORS.dim }}>{a.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    {/* Carrier share pie */}
    <div className="feat-card">
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Carrier share</div>
      <div style={{ fontSize: 11, color: COLORS.dim, marginBottom: 10 }}>Shipment volume by carrier this month</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 120, height: 120, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value" strokeWidth={0}>
                {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
          {PIE_DATA.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: COLORS.muted, flex: 1 }}>{p.name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.text }}>{p.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════
   SHIPMENTS TABLE
════════════════════════════════════════ */
const ShipmentsTable = () => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? SHIPMENTS : SHIPMENTS.filter(s => s.status === filter);
  return (
    <div className="feat-card" style={{ marginBottom: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Recent shipments</div>
          <div style={{ fontSize: 11, color: COLORS.dim }}>Click any row to see full tracking timeline</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="delivered">Delivered</option>
            <option value="transit">In transit</option>
            <option value="rto">RTO</option>
          </select>
          <button className="btn-g" style={{ fontSize: 11, padding: "5px 10px" }}>Export CSV</button>
        </div>
      </div>
      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.9fr 0.9fr 1.1fr", padding: "8px 12px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 10, color: COLORS.dim, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        <span>Tracking ID / Route</span><span>Carrier</span><span>Weight</span><span>Rate</span><span>Status</span>
      </div>
      {/* Rows */}
      {filtered.map((s, i) => (
        <div key={i} className="tbl-row">
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>{s.route}</div>
            <Mono>{s.id}</Mono>
          </div>
          <div style={{ fontSize: 12 }}>{s.carrier}</div>
          <div style={{ fontSize: 12 }}>{s.weight}</div>
          <div style={{ fontSize: 12, color: COLORS.text }}>{s.rate}</div>
          <div>{tag(s.tagType, s.statusLabel)}</div>
        </div>
      ))}
      <div style={{ padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${COLORS.border}` }}>
        <span style={{ fontSize: 12, color: COLORS.dim }}>Showing {filtered.length} of 1,247 shipments</span>
        <span style={{ fontSize: 12, color: COLORS.yellow, cursor: "pointer" }}>View all shipments →</span>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   NEW: INVOICE RECONCILIATION CARD
════════════════════════════════════════ */
const InvoiceReconciliation = () => {
  const invoices = [
    { carrier: "Delhivery", invoiced: "₹3.2L", matched: "₹3.18L", diff: "-₹200",  status: "green" },
    { carrier: "Shiprocket", invoiced: "₹2.1L", matched: "₹2.08L", diff: "-₹200", status: "green" },
    { carrier: "Bluedart",   invoiced: "₹1.8L", matched: "₹1.74L", diff: "-₹600", status: "amber" },
  ];
  return (
    <div className="feat-card" style={{ marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Invoice reconciliation</div>
          <div style={{ fontSize: 11, color: COLORS.dim }}>Auto-matched this month · ₹12,400 saved</div>
        </div>
        <span style={{ fontSize: 11, color: COLORS.yellow, cursor: "pointer" }}>View full report →</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "6px 12px", fontSize: 10, color: COLORS.dim, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${COLORS.border}` }}>
        <span>Carrier</span><span>Invoiced</span><span>Matched</span><span>Difference</span>
      </div>
      {invoices.map((inv, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "9px 12px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 12, alignItems: "center" }}>
          <span style={{ fontWeight: 600 }}>{inv.carrier}</span>
          <span style={{ color: COLORS.muted }}>{inv.invoiced}</span>
          <span style={{ color: COLORS.text }}>{inv.matched}</span>
          <span>{tag(inv.status, inv.diff)}</span>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════
   LIVE TICKER
════════════════════════════════════════ */
const LiveTicker = () => (
  <div style={{ background: COLORS.panel, borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, overflow: "hidden", padding: "8px 0", flexShrink: 0 }}>
    <div className="ticker-anim">
      {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
        <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 32px", fontSize: 12, color: COLORS.dim, borderRight: `1px solid ${COLORS.border}` }}>
          <span className="pulse-dot" style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: COLORS.green }} />
          {item.label}{" "}
          <span style={{ color: COLORS.text, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{item.val}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ════════════════════════════════════════
   MAIN DASHBOARD CONTENT
════════════════════════════════════════ */
const DashboardContent = () => {
  const [period, setPeriod] = useState("30d");
  const periods = [
    { key: "7d", label: "Last 7 days" },
    { key: "30d", label: "This month" },
    { key: "3m", label: "Last 3 months" },
    { key: "yr", label: "This year" },
  ];
  return (
    <div style={{ padding: "18px 20px", overflowY: "auto", flex: 1 }}>
      {/* Alert strip */}
      <div style={{ background: "#200808", border: "1px solid #FF5C3833", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 14, fontSize: 12, color: COLORS.red }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#FF5C38" strokeWidth="1.2"/><path d="M7 4v3M7 9.5v.5" stroke="#FF5C38" strokeWidth="1.2" strokeLinecap="round"/></svg>
        <strong>3 shipments need attention</strong> — RTO initiated on MV-2025-P9WQ44. Delhivery reported delay on 2 orders.
        <span style={{ marginLeft: "auto", color: COLORS.red, cursor: "pointer", fontWeight: 700, whiteSpace: "nowrap" }}>View all →</span>
      </div>
      {/* Period filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: COLORS.dim, marginRight: 4 }}>Period:</span>
        {periods.map(p => (
          <button key={p.key} className={`df-btn${period === p.key ? " active" : ""}`} onClick={() => setPeriod(p.key)}>{p.label}</button>
        ))}
      </div>
      {/* KPIs */}
      <KpiGrid period={period} />
      {/* Charts */}
      <ChartsRow />
      {/* Carrier perf + AI insights */}
      <CarrierInsightsRow />
      {/* Quick actions + Pie */}
      <QuickActionsRow />
      {/* Shipments table */}
      <ShipmentsTable />
      {/* Invoice reconciliation */}
      <InvoiceReconciliation />
    </div>
  );
};

/* ════════════════════════════════════════
   PLACEHOLDER PAGES
════════════════════════════════════════ */
const PlaceholderPage = ({ title, sub }) => (
  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: COLORS.dim }}>
    <div style={{ fontSize: 40 }}>🚧</div>
    <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>{title}</div>
    <div style={{ fontSize: 13, color: COLORS.dim }}>{sub}</div>
  </div>
);

/* ════════════════════════════════════════
   ROOT DASHBOARD
════════════════════════════════════════ */
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [showNotifs, setShowNotifs] = useState(false);


  const navigate = useNavigate();
const { logout } = useStore();

const handleLogout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    // ignore error
  } finally {
    logout();
    navigate('/auth');
  }
};

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard": return <DashboardContent />;
      case "book":      return <PlaceholderPage title="Book Shipment" sub="Compare rates across 12+ carriers" />;
      case "track":     return <PlaceholderPage title="Track Shipments" sub="Real-time tracking for all your orders" />;
      case "all":       return <PlaceholderPage title="All Shipments" sub="Full shipment history with filters" />;
      case "analytics": return <PlaceholderPage title="Analytics" sub="Deep dive into your shipping data" />;
      case "carriers":  return <PlaceholderPage title="Carriers" sub="Manage your carrier integrations" />;
      case "billing":   return <PlaceholderPage title="Billing" sub="Plans, invoices & usage" />;
      case "settings":  return <PlaceholderPage title="Settings" sub="Account, team & preferences" />;
      default:          return <DashboardContent />;
    }
  };

  return (
    <div style={{ background: COLORS.bg, fontFamily: "'DM Sans', system-ui, sans-serif", color: COLORS.text, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <GlobalStyles />
      <LiveTicker />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }} onClick={() => showNotifs && setShowNotifs(false)}>
        <Sidebar active={activeNav} setActive={setActiveNav} onLogout={handleLogout} />
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <Topbar showNotifs={showNotifs} setShowNotifs={setShowNotifs} />
          <div style={{ display: "flex", flex: 1, minHeight: 0, overflowY: "auto" }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}