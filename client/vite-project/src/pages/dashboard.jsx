import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import api from "../services/api";

import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";

/* ─── Global Styles ─── */
const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { min-height: 100%; }
    body { background: var(--mv-bg); font-family: 'Sora', sans-serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: var(--mv-bg); }
    ::-webkit-scrollbar-thumb { background: var(--mv-border-2); border-radius: 2px; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
    @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    .ticker-anim { display:flex; white-space:nowrap; animation: ticker 22s linear infinite; }
    .pulse-dot { animation: pulse 2s infinite; }
    .sb-item {
      display:flex; align-items:center; gap:14px; padding:14px 24px;
      font-size:15px; color:var(--mv-dim); cursor:pointer;
      border-left:3px solid transparent; transition:all 0.15s;
    }
    .sb-item:hover { color:var(--mv-text); background:var(--mv-card); }
  .sb-item.active { color:var(--mv-text); background:var(--mv-card); border-left-color:var(--mv-yellow); }
    .kpi-card {
      background:var(--mv-card); border:1px solid var(--mv-border); border-radius:12px;
      padding:24px; position:relative; overflow:hidden;
      cursor:pointer; transition:border-color 0.2s, transform 0.15s;
    }
    .kpi-card:hover { border-color:var(--mv-border-2); transform:translateY(-2px); }
    .kpi-label { font-size: 13px; color: var(--mv-dim); text-transform: uppercase; letter-spacing: 0.09em; margin-bottom: 12px; }
    .kpi-value { font-size: 34px; font-weight: 800; line-height: 1; margin-bottom: 12px; }
    .kpi-change { font-size: 13px; display: flex; align-items: center; gap: 6px; }
    .feat-card {
      background:var(--mv-card); border:1px solid var(--mv-border);
      border-radius:12px; padding:24px; transition:border-color 0.2s;
    }
    .feat-card:hover { border-color:var(--mv-border-2); }
    .tbl-row {
      display:grid; grid-template-columns:2fr 1.2fr 0.9fr 0.9fr 1fr;
      padding:16px 24px; font-size:15px; align-items:center;
      cursor:pointer; transition:background 0.15s;
      border-bottom:1px solid var(--mv-panel);
    }
    .tbl-row:hover { background:var(--mv-card-hover); }
    .quick-card {
      background:var(--mv-panel); border:1px solid var(--mv-border); border-radius:10px;
      padding:16px; cursor:pointer; transition:all 0.15s;
      display:flex; align-items:center; gap:14px;
    }
  .quick-card:hover { border-color:color-mix(in srgb, var(--mv-yellow) 30%, transparent); background:var(--mv-card-hover); }
    .period-btn {
      padding:9px 16px; border-radius:6px; font-size:14px; cursor:pointer;
      border:1px solid var(--mv-border); background:transparent; color:var(--mv-dim);
      font-family:'Sora',sans-serif; transition:all 0.15s;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .period-btn:hover { color:var(--mv-text); border-color:var(--mv-border-2); }
  .period-btn.active { background:color-mix(in srgb, var(--mv-yellow) 15%, transparent); border-color:color-mix(in srgb, var(--mv-yellow) 50%, transparent); color:var(--mv-yellow-text); }
    .logout-btn {
      margin:0 16px 16px; padding:12px 16px; border-radius:8px;
    border:1px solid color-mix(in srgb, var(--mv-red) 30%, transparent); background:color-mix(in srgb, var(--mv-red) 10%, transparent);
      display:flex; align-items:center; gap:10px; cursor:pointer; transition:border-color 0.2s;
    }
  .logout-btn:hover { border-color:color-mix(in srgb, var(--mv-red) 60%, transparent); }
    .filter-select {
      background:var(--mv-panel); border:1px solid var(--mv-border-2); border-radius:6px;
      padding:9px 14px; font-size:14px; color:var(--mv-muted);
      cursor:pointer; font-family:'Sora',sans-serif; outline:none;
    }
    .filter-select option { background:var(--mv-panel); }
    .export-btn {
      background:transparent; border:1px solid var(--mv-border-2); border-radius:6px;
      padding:9px 14px; font-size:14px; color:var(--mv-muted);
      cursor:pointer; font-family:'Sora',sans-serif;
    }
    .export-btn:hover { border-color:var(--mv-dim); color:var(--mv-text); }
    .search-inp { background:transparent; border:none; outline:none; color:var(--mv-text); font-size:14px; width:220px; font-family:'Sora',sans-serif; }
    .search-inp::placeholder { color:var(--mv-dim); }
    .dashboard-alert {
    background:color-mix(in srgb, var(--mv-red) 10%, transparent); border:1px solid color-mix(in srgb, var(--mv-red) 25%, transparent); border-left:3px solid var(--mv-red);
      border-radius:8px; padding:16px 20px; display:flex; align-items:center; gap:14px;
      margin-bottom:28px; font-size:15px;
    }
  .dashboard-alert-action { margin-left:auto; color:var(--mv-red); font-size:14px; font-weight:700; cursor:pointer; white-space:nowrap; }
    .card-header {
      padding:20px 24px; display:flex; justify-content:space-between; align-items:center;
      gap:16px; border-bottom:1px solid var(--mv-border);
    }
    .card-title { font-size:18px; font-weight:700; }
    .card-subtitle { font-size:13px; color:var(--mv-dim); margin-top:4px; line-height:1.45; }
    .table-actions { display:flex; gap:8px; align-items:center; flex-shrink:0; }
    .table-footer {
      padding:16px 24px; display:flex; justify-content:space-between; align-items:center;
      gap:14px; border-top:1px solid var(--mv-border);
    }
    .chart-body { height:180px; min-width:0; }
    .carrier-perf-row { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
    .carrier-perf-name { font-size:14px; color:var(--mv-paper); width:90px; flex-shrink:0; }
    .carrier-perf-rate { font-size:13px; width:40px; text-align:right; flex-shrink:0; font-family:'JetBrains Mono',monospace; }
    .insight-card {
      background:var(--mv-panel); border-radius:0 8px 8px 0; padding:14px 18px;
      margin-bottom:12px; font-size:14px; color:var(--mv-paper); line-height:1.6;
    }
    .placeholder-state {
      flex:1; display:flex; align-items:center; justify-content:center; flex-direction:column;
      gap:16px; color:var(--mv-dim); text-align:center; padding:32px;
    }
    
    /* Responsive Layout Classes */
    .layout-wrapper { display: flex; flex: 1; min-height: 0; position: relative; }
    .sidebar { width: 260px; flex-shrink: 0; transition: transform 0.3s ease; background: var(--mv-panel); border-right: 1px solid var(--mv-border); z-index: 50; display: flex; flex-direction: column; height: 100%; }
    .main-content { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 24px; }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
    .quick-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .tbl-container { overflow-x: auto; }
    .tbl-header { display: grid; grid-template-columns: 2fr 1.2fr 0.9fr 0.9fr 1fr; padding: 14px 24px; font-size: 12px; color: var(--mv-dim); text-transform: uppercase; letter-spacing: 0.09em; border-bottom: 1px solid var(--mv-border); min-width: 600px; }
    .tbl-row { display: grid; grid-template-columns: 2fr 1.2fr 0.9fr 0.9fr 1fr; padding: 16px 24px; font-size: 15px; align-items: center; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--mv-panel); min-width: 600px; }
    .invoice-header { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 14px 24px; font-size: 12px; color: var(--mv-dim); text-transform: uppercase; letter-spacing: 0.09em; border-bottom: 1px solid var(--mv-border); min-width: 500px; }
    .invoice-row { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; padding: 18px 24px; border-bottom: 1px solid var(--mv-border); font-size: 15px; align-items: center; min-width: 500px; }
    .topbar { padding: 0 28px; height: 58px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: var(--mv-panel); border-bottom: 1px solid var(--mv-border); }
    .hamburger { display: none; background: transparent; border: none; color: var(--mv-text); font-size: 24px; cursor: pointer; margin-right: 12px; padding: 4px; }
    .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 40; }
    .hide-mobile { display: flex; }
    .period-filters { display: flex; flex-wrap: nowrap; gap: 10px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
    .period-filters::-webkit-scrollbar { display: none; }
    .dashboard-content-pad { padding: 32px 36px; overflow-y: auto; flex: 1; width: 100%; min-width: 0; }

    @media (max-width: 1024px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
      .sidebar { position: fixed; top: 0; bottom: 0; left: 0; transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); }
      .hamburger { display: block; }
      .sidebar-overlay.open { display: block; }
    }

    @media (max-width: 768px) {
      .dashboard-grid { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; -ms-overflow-style: none; gap: 14px; padding-bottom: 8px; }
      .dashboard-grid::-webkit-scrollbar { display: none; }
      .dashboard-grid > .feat-card { min-width: 320px; scroll-snap-align: start; flex-shrink: 0; }
      .topbar { padding: 0 16px; height: 62px; position: sticky; top: 0; z-index: 30; }
      .hide-mobile { display: none !important; }
      .dashboard-content-pad { padding: 22px 16px 34px !important; display: flex; flex-direction: column; align-items: center; }
      .dashboard-content-pad > * { width: min(100%, 620px); margin-left: auto; margin-right: auto; }
      .pie-wrap { flex-direction: column; align-items: center !important; gap: 24px !important; }
      .pie-wrap > div:first-child { width: 180px !important; height: 180px !important; }
      .tbl-header, .tbl-row { padding: 12px 16px; }
      .invoice-header, .invoice-row { padding: 12px 16px; }
      .topbar-right { gap: 6px !important; }
      .book-btn { padding: 8px 12px !important; font-size: 12px !important; }
      .filter-select { font-size: 12px; padding: 7px 10px; }
      .export-btn { font-size: 12px; padding: 7px 10px; }
      .card-header { padding: 18px 18px; align-items: flex-start; }
      .dashboard-alert { align-items: flex-start; padding: 14px 16px; margin-bottom: 20px; line-height: 1.45; }
      .dashboard-alert svg { flex-shrink: 0; margin-top: 2px; }
      .chart-body { height: 210px; }
    }

    @media (max-width: 480px) {
      .dashboard-grid > .feat-card { min-width: 280px; }
      .kpi-grid { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; gap: 0 !important; background: var(--mv-card) !important; border: 1px solid var(--mv-border) !important; border-radius: 8px !important; overflow: hidden; margin-bottom: 20px !important; }
      .quick-actions-grid { grid-template-columns: 1fr; }
      .topbar { padding: 0 12px; }
      .hamburger { margin-right: 8px; font-size: 20px; }
      .topbar-greeting { font-size: 13px !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 112px; }
      .topbar-date { display: none; }
      .period-filters { gap: 8px; margin: 0 auto 18px !important; padding: 0 4px 2px; }
      .period-filters > span { display: none; }
      .period-btn { padding: 6px 10px; font-size: 12px; }
      .book-btn { padding: 6px 10px !important; font-size: 12px !important; }
      .hide-mobile-text { display: none; }
      .sidebar { width: 240px; }
      .dashboard-content-pad { padding: 20px 12px 32px !important; }
      .dashboard-content-pad > * { width: min(100%, 390px); }
      .kpi-card { padding: 10px 4px !important; background: transparent !important; border: none !important; border-right: 1px solid var(--mv-border) !important; border-radius: 0 !important; }
      .kpi-card:last-child { border-right: none !important; }
      .kpi-card > div:first-child { display: none !important; }
      .kpi-label { font-size: 8px !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px !important; letter-spacing: 0 !important; text-align: center; }
      .kpi-value { font-size: 14px !important; margin-bottom: 4px !important; text-align: center; }
      .kpi-change { font-size: 8px !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; justify-content: center; }
      .kpi-change svg { width: 8px; height: 8px; }
      .feat-card { padding: 18px; border-radius: 10px; }
      .card-header { flex-direction: column; padding: 16px 16px; gap: 12px; }
      .card-title { font-size: 16px; }
      .card-subtitle { font-size: 12px; }
      .table-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .filter-select, .export-btn { width: 100%; min-height: 36px; }
      .table-footer { flex-direction: column; align-items: flex-start; padding: 14px 16px; }
      .quick-card { padding: 12px; gap: 10px; }
      .quick-card > div:first-child { width: 40px !important; height: 40px !important; font-size: 20px !important; }
      .chart-body { height: 220px; }
      .pie-wrap { flex-direction: column; align-items: stretch !important; gap: 18px !important; }
      .pie-wrap > div:first-child { width: 100% !important; height: 180px !important; }
      .tbl-header, .tbl-row { padding: 10px 12px; font-size: 13px; min-width: auto; }
      .tbl-header { display: none; }
      .tbl-container { padding: 16px; }
      .tbl-row { 
        display: flex !important; 
        flex-direction: column !important;
        padding: 16px; 
        border: 1px solid var(--mv-border); 
        border-radius: 10px; 
        margin-bottom: 12px; 
        background: var(--mv-panel); 
        gap: 12px;
      }
      .tbl-row:last-child { margin-bottom: 0; border-bottom: 1px solid var(--mv-border); }
      .tbl-row > div { display: flex; flex-direction: column; gap: 4px; text-align: left !important; }
      .tbl-row > div::before { font-size: 11px; color: var(--mv-dim); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
      .tbl-row > div:nth-child(1)::before { content: "Tracking ID / Route"; }
      .tbl-row > div:nth-child(2)::before { content: "Carrier"; }
      .tbl-row > div:nth-child(3)::before { content: "Rate"; }
      .tbl-row > div:nth-child(4)::before { content: "Date"; }
      .tbl-row > div:nth-child(5)::before { content: "Status"; }
      .tbl-row > div:nth-child(5) { align-items: flex-start; }
      .invoice-header { display: none; }
      .invoice-row { 
        display: flex !important; 
        flex-direction: column !important;
        padding: 16px; 
        border: 1px solid var(--mv-border); 
        border-radius: 10px; 
        margin-bottom: 12px; 
        background: var(--mv-panel); 
        gap: 12px;
      }
      .invoice-row:last-child { margin-bottom: 0; border-bottom: 1px solid var(--mv-border); }
      .invoice-row > span { display: flex; flex-direction: column; gap: 4px; text-align: left !important; }
      .invoice-row > span::before { font-size: 11px; color: var(--mv-dim); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
      .invoice-row > span:nth-child(1)::before { content: "Carrier"; }
      .invoice-row > span:nth-child(2)::before { content: "Invoiced"; }
      .invoice-row > span:nth-child(3)::before { content: "Matched"; }
      .invoice-row > span:nth-child(4)::before { content: "Difference"; }
      .invoice-row > span:nth-child(4) { align-items: flex-start; }
      .logout-btn { margin: 0 12px 12px; padding: 10px 12px; border-radius: 8px; }
      .logout-btn span { font-size: 12px; }
      .search-inp { width: 140px; font-size: 13px; }
      .topbar-right { gap: 8px !important; }
      .notif-dropdown { width: min(100vw, 340px); right: 12px !important; }
      .ticker-anim div { padding: 0 18px; font-size: 13px; }
      .dashboard-alert { display: grid; grid-template-columns: auto 1fr; gap: 10px 12px; font-size: 13px; }
      .dashboard-alert-action { grid-column: 2; margin-left: 0; font-size: 13px; }
      .carrier-perf-row { display: grid; grid-template-columns: 1fr auto; gap: 8px 10px; margin-bottom: 18px; }
      .carrier-perf-name { width: auto; }
      .carrier-perf-row > div:nth-child(2) { grid-column: 1 / -1; grid-row: 2; }
      .carrier-perf-rate { width: auto; grid-column: 2; grid-row: 1; }
      .insight-card { padding: 12px 14px; font-size: 13px; }
      .placeholder-state { padding: 24px 16px; min-height: 360px; }
    }

    @media (max-width: 360px) {
      .dashboard-grid > .feat-card { min-width: 260px; }
      .sidebar { width: 220px; }
      .topbar { padding: 0 10px; }
      .topbar-greeting { font-size: 12px !important; }
      .period-btn { padding: 6px 8px; font-size: 11px; }
      .book-btn { padding: 6px 8px !important; font-size: 11px !important; }
      .dashboard-content-pad { padding: 16px 10px 28px !important; }
      .dashboard-content-pad > * { width: min(100%, 330px); }
      .kpi-card { padding: 8px 2px !important; }
      .kpi-value { font-size: 12px !important; }
      .feat-card { padding: 16px; }
      .quick-card { padding: 10px; gap: 8px; }
      .quick-card > div:first-child { width: 36px !important; height: 36px !important; font-size: 18px !important; }
      .pie-wrap { gap: 14px; }
      .pie-wrap > div:first-child { height: 150px !important; }
      .tbl-row { padding: 10px 12px; font-size: 12px; }
      .invoice-row { padding: 10px 12px; font-size: 12px; }
      .notif-dropdown { width: min(100vw, 300px); right: 10px !important; }
      .ticker-anim div { padding: 0 14px; font-size: 12px; }
      .period-filters { gap: 4px; }
      .export-btn, .filter-select { padding: 6px 10px; font-size: 12px; }
      .hide-mobile-text { display: none; }
      .card-header { padding: 14px; }
      .table-footer { padding: 12px 14px; font-size: 12px; }
    }
  `}</style>
);

/* ─── Constants ─── */
const C = {
    bg: "var(--mv-bg)", panel: "var(--mv-panel)", card: "var(--mv-card)",
    border: "var(--mv-border)", border2: "var(--mv-border-2)",
    text: "var(--mv-text)", muted: "var(--mv-muted)", dim: "var(--mv-dim)", dimmer: "var(--mv-dimmer)",
    yellow: "var(--mv-yellow)", green: "var(--mv-green)", red: "var(--mv-red)", amber: "var(--mv-amber)", blue: "var(--mv-blue)",
};

const CHART_COLORS = [C.yellow, C.blue, C.green, C.amber, C.red, C.muted];

const formatCurrencyCompact = (value = 0) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
};

const getCarrierColor = (index) => CHART_COLORS[index % CHART_COLORS.length];

const formatDailyChartData = (dailyShipments = [], period = '30d') => {
    const days = period === '7d' ? 7 : period === '3m' ? 90 : period === 'yr' ? 365 : 30;
    const result = [];
    const countMap = {};
    dailyShipments.forEach(item => { if (item._id) countMap[item._id] = item.count || 0; });

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toISOString().slice(0, 10);
        result.push({
            d: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            v: countMap[key] || 0,
        });
    }
    return result;
};

const formatCarrierSpendData = (carrierBreakdown = []) =>
    carrierBreakdown.map((item, index) => ({
        name: item._id || "Unknown",
        v: item.spend || 0,
        count: item.count || 0,
        color: getCarrierColor(index),
    }));

const formatCarrierShareData = (carrierBreakdown = []) => {
    const total = carrierBreakdown.reduce((sum, item) => sum + (item.count || 0), 0);
    return carrierBreakdown.map((item, index) => ({
        name: item._id || "Unknown",
        count: item.count || 0,
        value: total > 0 ? Math.round(((item.count || 0) / total) * 100) : 0,
        color: getCarrierColor(index),
    }));
};

const formatCarrierPerformanceData = (carrierStats = []) =>
    carrierStats.map((item) => {
        const rate = Math.round(item.onTimeRate || 0);
        return {
            name: item._id || "Unknown",
            rate,
            totalShipments: item.totalShipments || 0,
            delivered: item.delivered || 0,
            color: rate >= 90 ? C.green : rate >= 70 ? C.amber : C.red,
        };
    });

const buildCarrierInsights = (carrierStats = [], summary = null) => {
    const activeCarriers = carrierStats.filter((carrier) => carrier.totalShipments > 0);
    const totalShipments = summary?.totalShipments || 0;
    const rtoShipments = summary?.rtoShipments || 0;
    const rtoRate = totalShipments > 0 ? Math.round((rtoShipments / totalShipments) * 100) : 0;
    const bestCarrier = [...activeCarriers].sort((a, b) => (b.onTimeRate || 0) - (a.onTimeRate || 0))[0];
    const riskiestCarrier = [...activeCarriers].sort((a, b) => (a.onTimeRate || 0) - (b.onTimeRate || 0))[0];
    const insights = [];

    if (bestCarrier) {
        insights.push({
            tag: "Best carrier",
            tagColor: C.green,
            borderColor: C.green,
            borderBg: "color-mix(in srgb, var(--mv-green) 10%, transparent)",
            text: `${bestCarrier._id || "Unknown"} is leading with ${Math.round(bestCarrier.onTimeRate || 0)}% on-time delivery across ${bestCarrier.totalShipments || 0} shipments.`,
        });
    }

    if (riskiestCarrier && riskiestCarrier._id !== bestCarrier?._id && (riskiestCarrier.onTimeRate || 0) < 90) {
        insights.push({
            tag: "Needs attention",
            tagColor: C.amber,
            borderColor: C.amber,
            borderBg: "color-mix(in srgb, var(--mv-amber) 10%, transparent)",
            text: `${riskiestCarrier._id || "Unknown"} is at ${Math.round(riskiestCarrier.onTimeRate || 0)}% on-time delivery. Review delayed shipments before booking more volume there.`,
        });
    }

    if (totalShipments > 0) {
        insights.push({
            tag: rtoRate > 5 ? "RTO watch" : "Healthy flow",
            tagColor: rtoRate > 5 ? C.red : C.yellow,
            borderColor: rtoRate > 5 ? C.red : C.yellow,
            borderBg: rtoRate > 5 ? "color-mix(in srgb, var(--mv-red) 10%, transparent)" : "color-mix(in srgb, var(--mv-yellow) 10%, transparent)",
            text: `${rtoShipments} of ${totalShipments} shipments are RTO or failed in this period (${rtoRate}%).`,
        });
    }

    return insights.length ? insights : [{
        tag: "No live insights yet",
        tagColor: C.dim,
        borderColor: C.border2,
        borderBg: "var(--mv-border)",
        text: "Book shipments to generate carrier performance, spend, and delivery insights from your own data.",
    }];
};

const TICKER_ITEMS = [
    { l: "New signup", v: "Mumbai" },
    { l: "Shipment booked", v: "BOM→DEL ₹847" },
    { l: "New signup", v: "Surat" },
    { l: "Invoice reconciled", v: "₹12,400 matched" },
    { l: "Carrier connected", v: "Delhivery" },
    { l: "New signup", v: "Delhi" },
    { l: "Shipment booked", v: "DEL→BLR ₹1,203" },
];

const NOTIFICATIONS = [
    { id: 1, text: "RTO initiated on MV-2025-P9WQ44", type: "red", time: "2m ago" },
    { id: 2, text: "Delhivery delay on 2 BOM→DEL orders", type: "amber", time: "14m ago" },
    { id: 3, text: "Invoice ₹12,400 auto-reconciled", type: "green", time: "1h ago" },
    { id: 4, text: "MV-2025-T7MN33 delivered successfully", type: "green", time: "2h ago" },
];

const QUICK_ACTIONS = [
  { icon:"📦", label:"Book shipment",   sub:"Compare rates instantly", bg:"#1a1800", nav:"/book"      },
  { icon:"🔍", label:"Track shipment",  sub:"Enter tracking ID",       bg:"#080f20", nav:"/tracking"  },
  { icon:"📊", label:"View analytics",  sub:"See your performance",    bg:"#0d1f0d", nav:"/analytics" },
  { icon:"🚚", label:"Manage carriers", sub:"Connect integrations",    bg:"#1a0808", nav:"/carriers"  },
];

/* ─── Helpers ─── */
const TAG_STYLES = {
    green: { bg: "color-mix(in srgb, var(--mv-green) 10%, transparent)", color: C.green, border: "color-mix(in srgb, var(--mv-green) 15%, transparent)" },
    amber: { bg: "color-mix(in srgb, var(--mv-amber) 10%, transparent)", color: C.amber, border: "color-mix(in srgb, var(--mv-amber) 15%, transparent)" },
    red: { bg: "color-mix(in srgb, var(--mv-red) 10%, transparent)", color: C.red, border: "color-mix(in srgb, var(--mv-red) 15%, transparent)" },
    blue: { bg: "color-mix(in srgb, var(--mv-blue) 10%, transparent)", color: C.blue, border: "color-mix(in srgb, var(--mv-blue) 15%, transparent)" },
    yellow: { bg: "color-mix(in srgb, var(--mv-yellow) 10%, transparent)", color: "var(--mv-yellow-text)", border: "color-mix(in srgb, var(--mv-yellow) 15%, transparent)" },
};

const Tag = ({ type, label }) => {
    const s = TAG_STYLES[type] || TAG_STYLES.green;
    return (
        <span style={{
            display: "inline-block", padding: "6px 12px", borderRadius: 5,
            fontSize: 13, fontWeight: 700, letterSpacing: "0.03em",
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
        }}>{label}</span>
    );
};

const Mono = ({ children }) => (
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: C.muted }}>{children}</span>
);

const CustomTooltip = ({ active, payload, label, valueFormatter }) => {
    if (!active || !payload?.length) return null;
    const value = valueFormatter ? valueFormatter(payload[0].value) : payload[0].value;
    return (
        <div style={{ background: C.card, border: `1px solid ${C.border2}`, borderRadius: 6, padding: "10px 14px", fontSize: 14 }}>
            <div style={{ color: C.muted, marginBottom: 4 }}>{label}</div>
            <div style={{ color: C.text, fontWeight: 700 }}>{value}</div>
        </div>
    );
};

/* ─── Sidebar ─── */
const Sidebar = ({ active, setActive, onLogout, user, summary, isOpen }) => {
    const activeShipmentsCount = summary ? Math.max(0, (summary.totalShipments || 0) - (summary.deliveredShipments || 0) - (summary.rtoShipments || 0)) : 0;

    const mainNav = [
        {
            id: "dashboard", label: "Dashboard", badge: null,
                icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="var(--mv-yellow)" /><rect x="8.5" y="1" width="5.5" height="5.5" rx="1" fill="var(--mv-text)" opacity="0.4" /><rect x="1" y="8.5" width="5.5" height="5.5" rx="1" fill="var(--mv-text)" opacity="0.4" /><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" fill="var(--mv-text)" opacity="0.2" /></svg>
        },
        {
            id: "book", label: "Book shipment", badge: null,
            icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="3" width="13" height="9" rx="1.5" stroke="var(--mv-dim)" strokeWidth="1.2" fill="none" /><path d="M5 3V2M10 3V2" stroke="var(--mv-dim)" strokeWidth="1.2" strokeLinecap="round" /><path d="M1 6h13" stroke="var(--mv-dim)" strokeWidth="1.2" /></svg>
        },
        {
            id: "track", label: "Track shipments", badge: activeShipmentsCount > 0 ? activeShipmentsCount.toString() : null,
            icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6" stroke="var(--mv-dim)" strokeWidth="1.2" fill="none" /><path d="M7.5 4v3.5l2 2" stroke="var(--mv-dim)" strokeWidth="1.2" strokeLinecap="round" /></svg>
        },
        {
            id: "all", label: "All shipments", badge: null,
            icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 4h11M2 7.5h8M2 11h6" stroke="var(--mv-dim)" strokeWidth="1.2" strokeLinecap="round" /></svg>
        },
    ];
    const toolsNav = [
        {
            id: "analytics", label: "Analytics", badge: null,
            icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 12V8M5.5 12V5M9 12V7M12.5 12V3" stroke="var(--mv-dim)" strokeWidth="1.2" strokeLinecap="round" /></svg>
        },
        {
            id: "carriers", label: "Carriers", badge: null,
            icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="4" width="12" height="9" rx="1.5" stroke="var(--mv-dim)" strokeWidth="1.2" fill="none" /><path d="M5 4V2.5h5V4" stroke="var(--mv-dim)" strokeWidth="1.2" strokeLinecap="round" /></svg>
        },
        {
            id: "billing", label: "Billing", badge: null,
            icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="2" width="11" height="11" rx="2" stroke="var(--mv-dim)" strokeWidth="1.2" fill="none" /><path d="M5 7.5h5M7.5 5v5" stroke="var(--mv-dim)" strokeWidth="1.2" strokeLinecap="round" /></svg>
        },
        {
            id: "settings", label: "Settings", badge: null,
            icon: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="2.5" stroke="var(--mv-dim)" strokeWidth="1.2" fill="none" /><path d="M2.5 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="var(--mv-dim)" strokeWidth="1.2" strokeLinecap="round" fill="none" /></svg>
        },
    ];

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Logo */}
            <div style={{ padding: "26px 24px", borderBottom: `1px solid ${C.border}`, fontSize: 24, fontWeight: 800, letterSpacing: "0.08em" }}>
                MOVE<span style={{ color: C.yellow }}>.</span>TTO
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {/* Main nav */}
                <div style={{ padding: "18px 0 8px" }}>
                    <div style={{ fontSize: 12, color: C.dimmer, padding: "0 24px 10px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Main</div>
                    {mainNav.map(item => (
                        <div key={item.id} className={`sb-item${active === item.id ? " active" : ""}`} onClick={() => setActive(item.id)}>
                            {item.icon}
                            {item.label}
                            {item.badge && (
                            <span style={{ marginLeft: "auto", background: "color-mix(in srgb, var(--mv-red) 20%, transparent)", border: "1px solid color-mix(in srgb, var(--mv-red) 40%, transparent)", color: C.red, fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>
                                    {item.badge}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Tools nav */}
                <div style={{ padding: "18px 0 8px" }}>
                    <div style={{ fontSize: 12, color: C.dimmer, padding: "0 24px 10px", letterSpacing: "0.12em", textTransform: "uppercase" }}>Tools</div>
                    {toolsNav.map(item => (
                        <div key={item.id} className={`sb-item${active === item.id ? " active" : ""}`} onClick={() => setActive(item.id)}>
                            {item.icon}
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* User + Logout */}
            <div style={{ marginTop: "auto", borderTop: `1px solid ${C.border}`, flexShrink: 0, background: "var(--mv-panel)" }}>
                <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "color-mix(in srgb, var(--mv-green) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--mv-green) 25%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.green, flexShrink: 0 }}>
                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'KM'}
                    </div>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{user?.name || 'User'}</div>
                        <div style={{ fontSize: 13, color: C.dim, marginTop: 2 }}>{user?.business?.subscription?.plan || 'starter'} plan</div>
                    </div>
                </div>
                <div className="logout-btn" onClick={onLogout}>
                    <svg width="15" height="15" viewBox="0 0 13 13" fill="none">
                    <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h3M9 9l3-3-3-3M12 6.5H5" stroke="var(--mv-red)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 14, color: C.red, fontWeight: 600 }}>Log out</span>
                </div>
            </div>
        </div>
    );
};

/* ─── Topbar ─── */
const Topbar = ({ showNotifs, setShowNotifs, onBook, user, toggleSidebar }) => {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  return (
    <div className="topbar">
      <div style={{display:"flex", alignItems:"center", minWidth: 0}}>
        <button className="hamburger" onClick={toggleSidebar}>☰</button>
        <div style={{minWidth: 0}}>
          <div className="topbar-greeting" style={{fontSize:15, fontWeight:700}}>{greeting}, {firstName} 👋</div>
          <div className="topbar-date" style={{fontSize:12, color:C.dim, marginTop:2}}>{dateStr}</div>
        </div>
      </div>
      <div className="topbar-right" style={{display:"flex", alignItems:"center", gap:10}}>
        <div className="hide-mobile" style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 14px", fontSize:12, color:C.muted, display:"flex", alignItems:"center", gap:8, cursor:"pointer"}}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="var(--mv-dim)" strokeWidth="1.3" fill="none"/><path d="M10 10l2 2" stroke="var(--mv-dim)" strokeWidth="1.3" strokeLinecap="round"/></svg>
          Search shipments, carriers...
        </div>
        <div style={{position:"relative"}}>
          <div onClick={() => setShowNotifs(v => !v)} style={{width:36, height:36, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative"}}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5C5 1.5 3.5 3.5 3.5 5.5v3L2 10h11L11.5 8.5v-3C11.5 3.5 10 1.5 7.5 1.5Z" stroke="var(--mv-muted)" strokeWidth="1.2" fill="none"/><path d="M6 10.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5" stroke="var(--mv-muted)" strokeWidth="1.2" fill="none"/></svg>
            <div style={{position:"absolute", top:8, right:8, width:7, height:7, borderRadius:"50%", background:C.red}}/>
          </div>
          {showNotifs && <NotifDropdown onClose={() => setShowNotifs(false)}/>}
        </div>
        <button
          className="book-btn"
          onClick={onBook}
        style={{background:C.yellow, color:"var(--mv-yellow-contrast)", border:"none", padding:"9px 18px", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Sora',sans-serif"}}
        >
          + Book<span className="hide-mobile-text"> shipment</span>
        </button>
      </div>
    </div>
  );
};

/* ─── Notification Dropdown ─── */
const NotifDropdown = ({ onClose }) => (
    <div className="notif-dropdown" style={{ position: "absolute", right: 0, top: 48, width: 340, background: C.card, border: `1px solid ${C.border2}`, borderRadius: 10, zIndex: 100, overflow: "hidden", animation: "fadeIn 0.2s ease" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Notifications</span>
            <span style={{ fontSize: 13, color: C.yellow, cursor: "pointer" }} onClick={onClose}>Mark all read</span>
        </div>
        {NOTIFICATIONS.map(n => (
            <div key={n.id} style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", marginTop: 6, flexShrink: 0, background: n.type === "red" ? C.red : n.type === "amber" ? C.amber : C.green }} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: C.text, lineHeight: 1.5 }}>{n.text}</div>
                    <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{n.time}</div>
                </div>
            </div>
        ))}
        <div style={{ padding: "14px 20px", textAlign: "center" }}>
            <span style={{ fontSize: 14, color: C.yellow, cursor: "pointer" }}>View all notifications →</span>
        </div>
    </div>
);

/* ─── Live Ticker ─── */
const LiveTicker = () => (
    <div style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, overflow: "hidden", padding: "12px 0", flexShrink: 0 }}>
        <div className="ticker-anim">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "0 36px", fontSize: 14, color: C.dim, borderRight: `1px solid ${C.border}` }}>
                    <span className="pulse-dot" style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: C.green }} />
                    {item.l}{" "}<span style={{ color: C.text, fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{item.v}</span>
                </div>
            ))}
        </div>
    </div>
);

/* ─── KPI Grid ─── */
const KpiGrid = ({ summary, loading }) => {
    const kpis = [
        {
            label: "Total Shipments",
            val: loading ? "..." : (summary?.totalShipments || 0).toLocaleString(),
            color: C.blue,
            accent: C.blue,
            change: `${summary?.totalShipments || 0} shipments`,
            up: true,
        },
        {
            label: "Total Spend",
            val: loading ? "..." : `₹${((summary?.totalSpend || 0) / 100000).toFixed(1)}L`,
            color: C.yellow,
            accent: C.yellow,
            change: "Platform bookings",
            up: true,
        },
        {
            label: "On-Time Rate",
            val: loading ? "..." : `${summary?.onTimeRate || 0}%`,
            color: C.green,
            accent: C.green,
            change: `${summary?.deliveredShipments || 0} delivered`,
            up: true,
        },
        {
            label: "RTO / Failed",
            val: loading ? "..." : (summary?.rtoShipments || 0).toString(),
            color: C.red,
            accent: C.red,
            change: "Needs attention",
            up: false,
        },
    ];

    return (
        <div className="kpi-grid">
            {kpis.map((k, i) => (
                <div key={i} className="kpi-card">
                    <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: k.accent, borderRadius: "12px 0 0 12px" }} />
                    <div className="kpi-label">{k.label}</div>
                    <div className="kpi-value" style={{ color: k.color }}>{k.val}</div>
                    <div className="kpi-change" style={{ color: i === 3 ? C.red : C.green }}>
                        <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                            <path d={i === 3 ? "M5 2v6M2 5l3 3 3-3" : "M5 8V2M2 5l3-3 3 3"} stroke={i === 3 ? C.red : C.green} strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        {k.change}
                    </div>
                </div>
            ))}
        </div>
    );
};

/* ─── Charts Row ─── */
const ChartsRow = ({ dailyShipments, carrierBreakdown, summary, period }) => {
    const dailyData = formatDailyChartData(dailyShipments, period);
    const spendData = formatCarrierSpendData(carrierBreakdown);
    const periodLabel = period === "7d" ? "last 7 days" : period === "3m" ? "last 3 months" : period === "yr" ? "this year" : "last 30 days";

    return (
    <>
        <div className="feat-card">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Shipments over time</div>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 20 }}>Daily booking volume - {periodLabel}</div>
            <div className="chart-body">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={C.yellow} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={C.yellow} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis dataKey="d" tick={{ fill: C.dim, fontSize: 11 }} axisLine={false} tickLine={false} interval={Math.floor(dailyData.length / 6)} />
                        <YAxis tick={{ fill: C.dim, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="v" stroke={C.yellow} strokeWidth={2} fill="url(#areaGrad)" dot={false} activeDot={{ r: 4, fill: C.yellow }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className="feat-card">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Spend by carrier</div>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 20 }}>Total {formatCurrencyCompact(summary?.totalSpend || 0)} - {periodLabel}</div>
            <div className="chart-body">
                {spendData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: C.dim, fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: C.dim, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={formatCurrencyCompact} />
                            <Tooltip content={<CustomTooltip valueFormatter={formatCurrencyCompact} />} />
                            <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                                {spendData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: C.dim, fontSize: 14 }}>
                        No carrier spend data yet.
                    </div>
                )}
            </div>
        </div>
    </>
    );
};

/* ─── Carrier + Insights Row ─── */
const CarrierInsightsRow = ({ carrierStats, summary, period }) => {
    const performanceData = formatCarrierPerformanceData(carrierStats);
    const insights = buildCarrierInsights(carrierStats, summary);
    const periodLabel = period === "7d" ? "last 7 days" : period === "3m" ? "last 3 months" : period === "yr" ? "this year" : "last 30 days";

    return (
    <>
        <div className="feat-card">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Carrier performance</div>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 20 }}>On-time delivery rate - {periodLabel}</div>
            {performanceData.length ? (
                performanceData.map((c, i) => (
                    <div key={i} className="carrier-perf-row">
                        <div className="carrier-perf-name">{c.name}</div>
                        <div style={{ flex: 1, background: C.border, borderRadius: 4, height: 10, overflow: "hidden" }}>
                            <div style={{ width: `${c.rate}%`, height: "100%", background: c.color, borderRadius: 4, transition: "width 0.8s ease" }} />
                        </div>
                        <div className="carrier-perf-rate" style={{ color: c.color }}>{c.rate}%</div>
                    </div>
                ))
            ) : (
                <div style={{ height: 130, display: "flex", alignItems: "center", justifyContent: "center", color: C.dim, fontSize: 14 }}>
                    No carrier performance data yet.
                </div>
            )}
        </div>
        <div className="feat-card">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>AI route insights</div>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 20 }}>Smart recommendations for your routes</div>
            {insights.map((ins, i) => (
                <div key={i} className="insight-card" style={{ border: `1px solid ${ins.borderBg}`, borderLeft: `3px solid ${ins.borderColor}` }}>
                    <div style={{ fontSize: 12, color: ins.tagColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{ins.tag}</div>
                    {ins.text}
                </div>
            ))}
        </div>
    </>
    );
};

/* ─── Quick Actions + Pie Row ─── */
const QuickPieRow = ({ navigate, carrierBreakdown }) => {
    const pieData = formatCarrierShareData(carrierBreakdown);

    return (
    <>
        <div className="feat-card">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Quick actions</div>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 20 }}>Shortcuts for common tasks</div>
            <div className="quick-actions-grid">
                {QUICK_ACTIONS.map((a, i) => (
                    <div key={i} className="quick-card" onClick={() => navigate(a.nav)}>
                        <div style={{ width: 46, height: 46, borderRadius: 10, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{a.icon}</div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{a.label}</div>
                            <div style={{ fontSize: 13, color: C.dim }}>{a.sub}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="feat-card">
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Carrier share</div>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 20 }}>Shipment volume by carrier in selected period</div>
            <div className="pie-wrap" style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ width: 140, height: 140, flexShrink: 0 }}>
                    {pieData.length ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} dataKey="value" strokeWidth={0}>
                                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip valueFormatter={(value) => `${value}%`} />} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: C.dim, fontSize: 13, textAlign: "center" }}>
                            No carrier data yet.
                        </div>
                    )}
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    {pieData.map((p, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 14, color: C.muted, flex: 1 }}>{p.name}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: p.color, fontFamily: "'JetBrains Mono',monospace" }}>{p.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
    );
};

/* ─── Shipments Table ─── */
const ShipmentsTable = ({ recentShipments, loading }) => {
    const [filter, setFilter] = useState("all");

    const getStatusTag = (status) => {
        switch (status) {
            case 'DELIVERED': return { type: "green", label: "Delivered" };
            case 'IN_TRANSIT': return { type: "amber", label: "In transit" };
            case 'OUT_FOR_DELIVERY': return { type: "blue", label: "Out for del." };
            case 'RTO_INITIATED':
            case 'RTO_DELIVERED': return { type: "red", label: "RTO initiated" };
            case 'BOOKED': return { type: "yellow", label: "Booked" };
            case 'PICKED_UP': return { type: "blue", label: "Picked up" };
            case 'CANCELLED': return { type: "red", label: "Cancelled" };
            default: return { type: "yellow", label: status };
        }
    };

    const filtered = recentShipments.filter(s => {
        if (filter === "all") return true;
        if (filter === "delivered") return s.status === "DELIVERED";
        if (filter === "transit") return ["IN_TRANSIT", "OUT_FOR_DELIVERY", "PICKED_UP"].includes(s.status);
        if (filter === "rto") return ["RTO_INITIATED", "RTO_DELIVERED"].includes(s.status);
        return true;
    });

    return (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 14, overflow: "hidden" }}>
            <div className="card-header">
                <div>
                    <div className="card-title">Recent shipments</div>
                    <div className="card-subtitle">Click any row to view full tracking timeline</div>
                </div>
                <div className="table-actions">
                    <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="all">All status</option>
                        <option value="delivered">Delivered</option>
                        <option value="transit">In transit</option>
                        <option value="rto">RTO</option>
                    </select>
                    <button className="export-btn">Export CSV</button>
                </div>
            </div>
            <div className="tbl-container">
                <div className="tbl-header">
                    <span>Tracking ID / Route</span>
                    <span>Carrier</span>
                    <span>Rate</span>
                    <span>Date</span>
                    <span>Status</span>
                </div>

                {loading ? (
                    <div style={{ padding: "32px", textAlign: "center", color: C.dim, fontSize: 15 }}>
                        Loading shipments...
                    </div>
            ) : filtered.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: C.dim }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 6 }}>No shipments yet</div>
                    <div style={{ fontSize: 15 }}>Book your first shipment to see it here</div>
                </div>
            ) : (
                filtered.map((s, i) => {
                    const tag = getStatusTag(s.status);
                    return (
                            <div key={s._id || i} className="tbl-row">
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                                    {s.origin?.city || s.origin?.pincode || "—"} → {s.destination?.city || s.destination?.pincode || "—"}
                                </div>
                                <Mono>{s.trackingId}</Mono>
                            </div>
                            <div style={{ fontSize: 15 }}>{s.carrierName || "—"}</div>
                            <div style={{ fontSize: 15, fontWeight: 600 }}>
                                {s.pricing?.quoted ? `₹${s.pricing.quoted.toLocaleString()}` : "—"}
                            </div>
                            <div style={{ fontSize: 14, color: C.dim }}>
                                {s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                            </div>
                            <div><Tag type={tag.type} label={tag.label} /></div>
                        </div>
                    );
                })
                )}
            </div>

            <div className="table-footer">
                <span style={{ fontSize: 14, color: C.dim }}>Showing {filtered.length} shipments</span>
                <span style={{ fontSize: 14, color: C.yellow, cursor: "pointer" }}>View all shipments →</span>
            </div>
        </div>
    );
};

/* ─── Invoice Reconciliation ─── */
const InvoiceRecon = () => {
    const invoices = [
        { carrier: "Delhivery", invoiced: "₹3.2L", matched: "₹3.18L", diff: "-₹200", tag: "green" },
        { carrier: "Shiprocket", invoiced: "₹2.1L", matched: "₹2.08L", diff: "-₹200", tag: "green" },
        { carrier: "Bluedart", invoiced: "₹1.8L", matched: "₹1.74L", diff: "-₹600", tag: "amber" },
    ];
    return (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
            <div className="card-header">
                <div>
                    <div className="card-title">Invoice reconciliation</div>
                    <div className="card-subtitle">Auto-matched this month · ₹12,400 saved</div>
                </div>
                <span style={{ fontSize: 14, color: C.yellow, cursor: "pointer" }}>View full report →</span>
            </div>
            <div className="tbl-container">
                <div className="invoice-header">
                    <span>Carrier</span><span>Invoiced</span><span>Matched</span><span>Difference</span>
                </div>
                {invoices.map((inv, i) => (
                    <div key={i} className="invoice-row" style={{ borderBottom: i < invoices.length - 1 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontWeight: 600 }}>{inv.carrier}</span>
                        <span style={{ color: C.muted }}>{inv.invoiced}</span>
                        <span>{inv.matched}</span>
                        <span><Tag type={inv.tag} label={inv.diff} /></span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ─── Dashboard Content ─── */
const DashboardContent = ({ summary, loading, recentShipments, carrierStats, carrierBreakdown, dailyShipments, period, setPeriod, navigate }) => {
    const periods = [
        { key: "7d", label: "Last 7 days" },
        { key: "30d", label: "This month" },
        { key: "3m", label: "Last 3 months" },
        { key: "yr", label: "This year" },
    ];

    const rtoCount = summary?.rtoShipments || 0;

    return (
        <div className="dashboard-content-pad">

            {/* Alert — only show if there are RTOs */}
            {rtoCount > 0 && (
                <div className="dashboard-alert">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#FF5C38" strokeWidth="1.3" /><path d="M8 5v3.5M8 11v.5" stroke="#FF5C38" strokeWidth="1.3" strokeLinecap="round" /></svg>
                    <div>
                        <strong style={{ color: C.red }}>{rtoCount} shipment{rtoCount > 1 ? "s" : ""} need attention</strong>
                        <span style={{ color: "var(--mv-paper)" }}> — RTO initiated. Please review.</span>
                    </div>
                    <span className="dashboard-alert-action">View all →</span>
                </div>
            )}

            {/* Period filter */}
            <div className="period-filters" style={{ marginBottom: 24 }}>
                <span style={{ fontSize: 14, color: C.dim, marginRight: 6, alignSelf: "center", flexShrink: 0 }}>Period:</span>
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

            {/* Pass real data to KpiGrid */}
            <KpiGrid summary={summary} loading={loading} />

            <div className="dashboard-grid">
                <ChartsRow dailyShipments={dailyShipments} carrierBreakdown={carrierBreakdown} summary={summary} period={period} />
                <CarrierInsightsRow carrierStats={carrierStats} summary={summary} period={period} />
                <QuickPieRow navigate={navigate} carrierBreakdown={carrierBreakdown}/>
            </div>

            {/* Pass real data to ShipmentsTable */}
            <ShipmentsTable recentShipments={recentShipments} loading={loading} />

            <InvoiceRecon />
        </div>
    );
};

/* ─── Placeholder ─── */
const Placeholder = ({ title, sub }) => (
    <div className="placeholder-state">
        <div style={{ fontSize: 64 }}>🚧</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.text }}>{title}</div>
        <div style={{ fontSize: 16, color: C.dim }}>{sub}</div>
    </div>
);

/* ─── ROOT DASHBOARD ─── */
export default function Dashboard() {
    // Real data state
    const [summary, setSummary] = useState(null);
    const [recentShipments, setRecentShipments] = useState([]);
    const [carrierStats, setCarrierStats] = useState([]);
    const [carrierBreakdown, setCarrierBreakdown] = useState([]);
    const [dailyShipments, setDailyShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30d');
    const [activeNav, setActiveNav] = useState("dashboard");
    const [showNotifs, setShowNotifs] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useStore();
    const user = useStore((s) => s.user);

    const handleNavClick = (id) => {
        setSidebarOpen(false);
        if (id === "book") return navigate("/book");
        if (id === "track")  return navigate("/tracking");
        if (id === "analytics") return navigate("/analytics");
        if (id === "carriers") return navigate("/carriers");
        if (id === "billing") return navigate("/billing");
        if (id === "settings") return navigate("/settings");
        if (id === "all") return navigate("/shipments");
        setActiveNav(id);
    };

    // Fetch dashboard data
    useEffect(() => {
        let cancelled = false;

        const loadDashboardData = async () => {
            try {
                const [summaryRes, carrierRes] = await Promise.all([
                    api.get(`/analytics/summary?period=${period}`),
                    api.get(`/analytics/carriers?period=${period}`),
                ]);

                if (cancelled) return;
                setSummary(summaryRes.data.summary);
                setRecentShipments(summaryRes.data.recentShipments || []);
                setCarrierBreakdown(summaryRes.data.carrierBreakdown || []);
                setDailyShipments(summaryRes.data.dailyShipments || []);
                setCarrierStats(carrierRes.data.carrierStats || []);
            } catch (err) {
                if (!cancelled) console.error('Dashboard fetch error:', err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadDashboardData();

        return () => {
            cancelled = true;
        };
    }, [period]);

    const handleLogout = async () => {
        try { await api.post('/auth/logout'); } catch (err) { console.error('Logout error:', err.message); }
        logout();
        navigate('/auth');
    };

    const handlePeriodChange = (nextPeriod) => {
        if (nextPeriod === period) return;
        setLoading(true);
        setPeriod(nextPeriod);
    };

    const renderContent = () => {
        switch (activeNav) {
            case "dashboard":
  return (
    <DashboardContent
      summary={summary}
      loading={loading}
      recentShipments={recentShipments}
      carrierStats={carrierStats}
      carrierBreakdown={carrierBreakdown}
      dailyShipments={dailyShipments}
      period={period}
      setPeriod={handlePeriodChange}
      navigate={navigate}
    />
  );
            case "book": return navigate('/book');
            case "track": return <Placeholder title="Track Shipments" sub="Real-time tracking for all your orders" />;
            case "all": return <Placeholder title="All Shipments" sub="Full shipment history with filters" />;
            case "analytics": return <Placeholder title="Analytics" sub="Deep dive into your shipping data" />;
            case "carriers": return <Placeholder title="Carriers" sub="Manage your carrier integrations" />;
            case "billing": return <Placeholder title="Billing" sub="Plans, invoices & usage" />;
            case "settings": return <Placeholder title="Settings" sub="Account, team & preferences" />;
            default:
  return (
    <DashboardContent
      summary={summary}
      loading={loading}
      recentShipments={recentShipments}
      carrierStats={carrierStats}
      carrierBreakdown={carrierBreakdown}
      dailyShipments={dailyShipments}
      period={period}
      setPeriod={handlePeriodChange}
      navigate={navigate}
    />
  );
        }
    };

    return (
        <div style={{ background: C.bg, fontFamily: "'Sora',sans-serif", color: C.text, display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
            <GlobalStyles />
            <LiveTicker />
            <div className="layout-wrapper" onMouseDown={(e) => {
                if (showNotifs && !e.target.closest('.notif-dropdown')) {
                    setShowNotifs(false);
                }
            }}>
                {sidebarOpen && <div className="sidebar-overlay open" onClick={() => setSidebarOpen(false)} />}
                <Sidebar active={activeNav} setActive={handleNavClick} onLogout={handleLogout} user={user} summary={summary} isOpen={sidebarOpen} />
                <div className="main-content">
                    <Topbar showNotifs={showNotifs} setShowNotifs={setShowNotifs} onBook={() => navigate("/book")} user={user} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                    <div style={{ display: "flex", flex: 1, minHeight: 0, overflowY: "auto" }}>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
