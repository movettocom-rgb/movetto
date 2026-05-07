import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store/useStore";
import api from "../services/api";
import { jsPDF } from "jspdf";

const C = {
    bg: "var(--mv-bg)", panel: "var(--mv-panel)", card: "var(--mv-card)",
    border: "var(--mv-border)", border2: "var(--mv-border-2)",
    text: "var(--mv-text)", muted: "var(--mv-muted)", dim: "var(--mv-dim)",
    yellow: "#E8F400", green: "#00D68A", red: "#FF5C38", amber: "#FFB020", blue: "#4da6ff",
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
    .plan-card {
      background: var(--mv-card); border: 1px solid var(--mv-border);
      border-radius: 14px; padding: 28px;
      transition: border-color 0.2s; position: relative;
      animation: fadeIn 0.3s ease;
    }
    .plan-card:hover { border-color: var(--mv-border-2); }
    .plan-card.current { border-color: #00D68A44; }
    .plan-card.featured { border: 2px solid #E8F400; }
    .plan-btn {
      width: 100%; padding: 12px; border-radius: 8px;
      font-size: 13px; font-weight: 700; cursor: pointer;
      font-family: 'Sora', sans-serif; transition: all 0.2s;
      margin-top: 20px;
    }
    .plan-btn.primary {
      background: #E8F400; color: #0A0B0D; border: none;
    }
    .plan-btn.primary:hover { opacity: 0.88; }
    .plan-btn.secondary {
      background: transparent; color: var(--mv-muted);
      border: 1px solid var(--mv-border-2);
    }
    .plan-btn.secondary:hover { border-color: var(--mv-dim); color: var(--mv-text); }
    .plan-btn.current-btn {
      background: #00D68A18; color: #00D68A;
      border: 1px solid #00D68A33; cursor: default;
    }
    .feature-row {
      display: flex; align-items: center; gap: 10px;
      padding: 7px 0; font-size: 13px; color: var(--mv-muted);
      border-bottom: 1px solid #1A1F2844;
    }
    .feature-row:last-child { border-bottom: none; }
    .check { color: #00D68A; font-size: 13px; flex-shrink: 0; }
    .cross { color: var(--mv-dimmer); font-size: 13px; flex-shrink: 0; }
    .invoice-row {
      display: grid; grid-template-columns: 1fr 1fr 1fr 1fr;
      padding: 12px 16px; font-size: 13px; align-items: center;
      border-bottom: 1px solid var(--mv-border); transition: background 0.15s;
    }
    .invoice-row:hover { background: var(--mv-card-hover); }
    .invoice-row:last-child { border-bottom: none; }
    .usage-bar {
      height: 6px; border-radius: 3px; background: var(--mv-border);
      overflow: hidden; margin-top: 6px;
    }
    .usage-fill {
      height: 100%; border-radius: 3px; transition: width 0.6s ease;
    }
    @keyframes spin { to{transform:rotate(360deg)} }
    .spinner {
      width: 16px; height: 16px; border: 2px solid var(--mv-border-2);
      border-top-color: #E8F400; border-radius: 50%;
      animation: spin 0.7s linear infinite; display: inline-block;
    }

    @media (max-width: 480px) {
      .header-container { padding: 0 12px !important; }
      .header-dash-text { display: none; }
      .header-title { font-size: 14px !important; }
      
      .main-content-pad { padding: 16px 12px !important; }
      .usage-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
      .plans-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
      .plan-card { padding: 24px 16px !important; }
      
      .tbl-container { overflow-x: auto; }
      .invoice-header { min-width: 500px; }
      .invoice-row { min-width: 500px; }
    }
  `}</style>
);

/* ─── Plan data ─── */
const PLANS = [
    {
        key: "starter",
        name: "Starter",
        price: 1999,
        cycle: "/month",
        target: "Small traders · 1–2 staff",
        color: C.muted,
        shipments: 200,
        features: [
            { text: "200 shipments/month", included: true },
            { text: "3 carrier integrations", included: true },
            { text: "Basic rate comparison", included: true },
            { text: "WhatsApp status alerts", included: true },
            { text: "30-day shipment history", included: true },
            { text: "1 user seat", included: true },
            { text: "Email support", included: true },
            { text: "AI route recommendations", included: false },
            { text: "Auto invoice reconciliation", included: false },
            { text: "Analytics dashboard", included: false },
            { text: "API access", included: false },
        ],
    },
    {
        key: "growth",
        name: "Growth",
        price: 4999,
        cycle: "/month",
        target: "Growing SME · 5–20 staff ops",
        color: C.yellow,
        featured: true,
        shipments: 1000,
        features: [
            { text: "1,000 shipments/month", included: true },
            { text: "All carriers — unlimited", included: true },
            { text: "AI route recommendations", included: true },
            { text: "Auto invoice reconciliation", included: true },
            { text: "WhatsApp booking + tracking", included: true },
            { text: "Analytics dashboard", included: true },
            { text: "1-year shipment history", included: true },
            { text: "5 user seats", included: true },
            { text: "Priority support + WhatsApp", included: true },
            { text: "API access", included: false },
            { text: "Dedicated account manager", included: false },
        ],
    },
    {
        key: "enterprise",
        name: "Enterprise",
        price: 9999,
        cycle: "/month",
        target: "Distributors · 50+ staff",
        color: C.blue,
        shipments: 999999,
        features: [
            { text: "Unlimited shipments", included: true },
            { text: "All carriers — unlimited", included: true },
            { text: "API + ERP integration", included: true },
            { text: "Custom carrier rate cards", included: true },
            { text: "Dedicated account manager", included: true },
            { text: "Custom reporting + exports", included: true },
            { text: "Multi-branch support", included: true },
            { text: "Unlimited user seats", included: true },
            { text: "SLA uptime guarantee", included: true },
            { text: "Onboarding + training", included: true },
            { text: "AI route recommendations", included: true },
        ],
    },
];

const MOCK_INVOICES = [
    { id: "INV-2025-001", date: "1 May 2025", plan: "Starter", amount: "₹1,999", status: "paid" },
    { id: "INV-2025-002", date: "1 Apr 2025", plan: "Starter", amount: "₹1,999", status: "paid" },
    { id: "INV-2025-003", date: "1 Mar 2025", plan: "Starter", amount: "₹1,999", status: "paid" },
    { id: "INV-2025-004", date: "1 Feb 2025", plan: "Starter", amount: "₹1,999", status: "paid" },
];

/* ─── MAIN COMPONENT ─── */
export default function Billing() {
    const navigate = useNavigate();
    const user = useStore((s) => s.user);
    const [upgrading, setUpgrading] = useState(null);
    const [showConfirm, setShowConfirm] = useState(null);

    const currentPlan = user?.business?.subscription?.plan || "starter";
    const trialEnds = user?.business?.subscription?.trialEnds;
    const isOnTrial = user?.business?.subscription?.status === "trial";

    const shipmentCount = user?.business?.shipmentCount || 0;
    const currentPlanData = PLANS.find(p => p.key === currentPlan);
    const usagePct = currentPlanData
        ? Math.min(100, Math.round((shipmentCount / currentPlanData.shipments) * 100))
        : 0;

    const handleUpgrade = async (planKey) => {
        if (planKey === currentPlan) return;
        setShowConfirm(planKey);
    };

    const confirmUpgrade = async (planKey) => {
        setUpgrading(planKey);
        setShowConfirm(null);
        try {
            // In production this calls Razorpay
            // For now simulate upgrade
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert(`Plan upgrade to ${planKey} initiated! Razorpay integration comes in Phase 5.`);
        } catch (err) {
            console.error("Upgrade error:", err);
        } finally {
            setUpgrading(null);
        }
    };

    const downloadInvoicePDF = (inv) => {
  const doc = new jsPDF();

  // White background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, "F");

  // Yellow header bar
  doc.setFillColor(232, 244, 0);
  doc.rect(0, 0, 210, 36, "F");

  // Logo
  doc.setTextColor(10, 11, 13);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("MOVETTO", 20, 22);

  // Tagline
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("B2B Logistics Booking Platform", 20, 30);

  // TAX INVOICE label
  doc.setTextColor(10, 11, 13);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", 148, 18);

  // Invoice details top right
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(inv.id, 148, 26);
  doc.text(inv.date, 148, 32);

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(20, 46, 190, 46);

  // Bill To
  doc.setTextColor(120, 120, 120);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 20, 56);

  doc.setTextColor(20, 20, 20);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(user?.name || "Business Owner", 20, 65);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(user?.email || "—", 20, 72);
  doc.text(user?.business?.name || "—", 20, 78);

  // Invoice status top right
  doc.setFillColor(13, 36, 20);
  doc.roundedRect(148, 52, 42, 16, 2, 2, "F");
  doc.setTextColor(0, 214, 138);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PAID", 161, 62);

  // Table header
  doc.setFillColor(245, 245, 245);
  doc.rect(20, 92, 170, 10, "F");
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("DESCRIPTION", 24, 99);
  doc.text("PLAN", 110, 99);
  doc.text("PERIOD", 138, 99);
  doc.text("AMOUNT", 172, 99);

  // Table row
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(230, 230, 230);
  doc.rect(20, 102, 170, 14, "FD");
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Movetto Platform Subscription", 24, 111);
  doc.text(inv.plan, 110, 111);
  doc.text("1 month", 138, 111);

  // Amount — use Rs. instead of rupee symbol to avoid encoding issue
  const rawAmt = parseInt(inv.amount.replace(/[^0-9]/g, ""));
  doc.text(`Rs. ${rawAmt.toLocaleString()}`, 165, 111);

  // Totals section
  doc.setDrawColor(230, 230, 230);
  doc.line(20, 126, 190, 126);

  const gstAmt   = Math.round(rawAmt * 0.18);
  const totalAmt = rawAmt + gstAmt;

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.text("Subtotal", 138, 135);
  doc.setTextColor(30, 30, 30);
  doc.text(`Rs. ${rawAmt.toLocaleString()}`, 168, 135);

  doc.setTextColor(100, 100, 100);
  doc.text("GST @ 18%", 138, 143);
  doc.setTextColor(30, 30, 30);
  doc.text(`Rs. ${gstAmt.toLocaleString()}`, 168, 143);

  doc.setDrawColor(230, 230, 230);
  doc.line(130, 148, 190, 148);

  doc.setTextColor(10, 11, 13);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Total", 138, 157);
  doc.setTextColor(10, 11, 13);
  doc.text(`Rs. ${totalAmt.toLocaleString()}`, 163, 157);

  // Payment confirmed box
  doc.setFillColor(240, 255, 248);
  doc.setDrawColor(0, 214, 138);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, 168, 170, 14, 2, 2, "FD");
  doc.setTextColor(0, 150, 100);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Payment received. Thank you for your business.", 30, 177);

  // Notes
  doc.setDrawColor(230, 230, 230);
  doc.line(20, 192, 190, 192);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("For billing queries: billing@movetto.com", 20, 200);
  doc.text("This is a system generated invoice. No signature required.", 20, 207);
  doc.text("GSTIN: 22AAAAA0000A1Z5", 20, 214);

  // Footer bar
  doc.setFillColor(10, 11, 13);
  doc.rect(0, 282, 210, 15, "F");
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(7);
  doc.text("movetto.com  |  billing@movetto.com  |  (c) 2025 Movetto Technologies Pvt Ltd", 20, 291);

  doc.save(`${inv.id}.pdf`);
};

    const downloadAllInvoices = () => {
        MOCK_INVOICES.forEach((inv, i) => {
            setTimeout(() => downloadInvoicePDF(inv), i * 300);
        });
    };

    const trialDaysLeft = trialEnds
        ? Math.max(0, Math.ceil((new Date(trialEnds) - new Date()) / (1000 * 60 * 60 * 24)))
        : 0;

    return (
        <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Sora',sans-serif", color: C.text }}>
            <GlobalStyles />

            {/* Header */}
            <div className="header-container" style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, padding: "0 32px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                        onClick={() => navigate("/dashboard")}
                        style={{ display: "flex", alignItems: "center", gap: 8, color: C.dim, cursor: "pointer", fontSize: 13 }}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="var(--mv-dim)" strokeWidth="1.4" strokeLinecap="round" /></svg>
                        <span className="header-dash-text">Dashboard</span>
                    </div>
                    <div style={{ width: 1, height: 16, background: C.border }} />
                    <div className="header-title" style={{ fontSize: 14, fontWeight: 700 }}>Billing & plans</div>
                </div>
            </div>

            <div className="main-content-pad" style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>

                {/* Trial banner */}
                {isOnTrial && trialDaysLeft > 0 && (
                    <div style={{ background: "#1a1800", border: "1px solid #E8F40033", borderRadius: 10, padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14, animation: "fadeIn 0.3s ease" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#E8F40018", border: "1px solid #E8F40033", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                            ⏳
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.yellow, marginBottom: 2 }}>
                                {trialDaysLeft} days left in your free trial
                            </div>
                            <div style={{ fontSize: 12, color: C.dim }}>
                                Your trial ends on {trialEnds ? new Date(trialEnds).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}. Upgrade to keep your data and features.
                            </div>
                        </div>
                        <button
                            style={{ background: C.yellow, color: "#0A0B0D", border: "none", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                            onClick={() => handleUpgrade("growth")}
                        >
                            Upgrade now →
                        </button>
                    </div>
                )}

                {/* Current plan + usage */}
            <div className="usage-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                    <div style={{ background: C.card, border: `1px solid ${C.green}33`, borderRadius: 12, padding: 20 }}>
                        <div style={{ fontSize: 11, color: C.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.09em" }}>Current plan</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: C.green, textTransform: "capitalize" }}>{currentPlan}</div>
                            <span style={{ fontSize: 10, background: "#00D68A18", border: "1px solid #00D68A33", color: C.green, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                                {isOnTrial ? "TRIAL" : "ACTIVE"}
                            </span>
                        </div>
                        <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>
                            ₹{PLANS.find(p => p.key === currentPlan)?.price?.toLocaleString() || "—"}/month
                        </div>
                        <div style={{ fontSize: 12, color: C.dim }}>
                            Next billing: {isOnTrial ? "After trial ends" : "1 Jun 2025"}
                        </div>
                    </div>

                    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
                        <div style={{ fontSize: 11, color: C.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.09em" }}>Shipment usage</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                            <div style={{ fontSize: 22, fontWeight: 800 }}>
                                {shipmentCount.toLocaleString()}
                                <span style={{ fontSize: 13, color: C.dim, fontWeight: 400 }}>
                                    {" "}/ {currentPlanData?.shipments === 999999 ? "∞" : currentPlanData?.shipments?.toLocaleString()}
                                </span>
                            </div>
                            <div style={{ fontSize: 12, color: usagePct > 80 ? C.red : usagePct > 60 ? C.amber : C.green, fontWeight: 700 }}>
                                {usagePct}%
                            </div>
                        </div>
                        <div className="usage-bar">
                            <div
                                className="usage-fill"
                                style={{
                                    width: `${usagePct}%`,
                                    background: usagePct > 80 ? C.red : usagePct > 60 ? C.amber : C.green,
                                }}
                            />
                        </div>
                        <div style={{ fontSize: 11, color: C.dim, marginTop: 6 }}>
                            {currentPlanData?.shipments === 999999
                                ? "Unlimited shipments"
                                : `${Math.max(0, (currentPlanData?.shipments || 0) - shipmentCount).toLocaleString()} shipments remaining`}
                        </div>
                    </div>
                </div>

                {/* Plans */}
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Choose your plan</div>
                <div style={{ fontSize: 13, color: C.dim, marginBottom: 20 }}>
                    Upgrade or downgrade anytime. Changes take effect immediately.
                </div>

            <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
                    {PLANS.map(plan => (
                        <div
                            key={plan.key}
                            className={`plan-card${plan.key === currentPlan ? " current" : ""}${plan.featured ? " featured" : ""}`}
                        >
                            {/* Featured badge */}
                            {plan.featured && (
                                <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: C.yellow, color: "#0A0B0D", fontSize: 10, fontWeight: 800, padding: "3px 14px", borderRadius: "0 0 8px 8px", letterSpacing: "0.06em" }}>
                                    RECOMMENDED
                                </div>
                            )}

                            {/* Current badge */}
                            {plan.key === currentPlan && (
                                <div style={{ position: "absolute", top: 12, right: 12, background: "#00D68A18", border: "1px solid #00D68A33", color: C.green, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>
                                    CURRENT
                                </div>
                            )}

                            <div style={{ marginTop: plan.featured ? 12 : 0 }}>
                                <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
                                    {plan.name}
                                </div>
                                <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, marginBottom: 4, color: plan.key === currentPlan ? C.green : plan.color }}>
                                    ₹{plan.price.toLocaleString()}
                                </div>
                                <div style={{ fontSize: 12, color: C.dim, marginBottom: 4 }}>{plan.cycle}</div>
                                <div style={{ fontSize: 12, color: C.muted, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                                    {plan.target}
                                </div>

                                {/* Features */}
                                <div style={{ marginBottom: 4 }}>
                                    {plan.features.map((f, i) => (
                                        <div key={i} className="feature-row">
                                            <span className={f.included ? "check" : "cross"}>
                                                {f.included ? "✓" : "—"}
                                            </span>
                                            <span style={{ color: f.included ? C.muted : C.dim }}>{f.text}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Button */}
                                {plan.key === currentPlan ? (
                                    <button className="plan-btn current-btn">
                                        ✓ Current plan
                                    </button>
                                ) : upgrading === plan.key ? (
                                    <button className="plan-btn secondary" disabled style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                        <span className="spinner" /> Processing...
                                    </button>
                                ) : (
                                    <button
                                        className={`plan-btn ${plan.featured ? "primary" : "secondary"}`}
                                        onClick={() => handleUpgrade(plan.key)}
                                    >
                                        {PLANS.findIndex(p => p.key === plan.key) > PLANS.findIndex(p => p.key === currentPlan)
                                            ? `Upgrade to ${plan.name} →`
                                            : `Downgrade to ${plan.name}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Invoice history */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
                    <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700 }}>Invoice history</div>
                            <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>All your past billing invoices</div>
                        </div>
                        <button
                            onClick={downloadAllInvoices}
                            style={{ background: "transparent", border: `1px solid ${C.border2}`, borderRadius: 6, padding: "6px 14px", fontSize: 12, color: C.muted, cursor: "pointer" }}
                        >
                            Download all
                        </button>
                    </div>
                <div className="tbl-container">
                    <div className="invoice-header" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "10px 16px", fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: `1px solid ${C.border}` }}>
                        <span>Invoice ID</span><span>Date</span><span>Plan</span><span>Amount</span>
                    </div>
                    {MOCK_INVOICES.map((inv, i) => (
                        <div key={i} className="invoice-row">
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.yellow }}>{inv.id}</span>
                            <span style={{ fontSize: 13, color: C.muted }}>{inv.date}</span>
                            <span style={{ fontSize: 13, textTransform: "capitalize" }}>{inv.plan}</span>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 13, fontWeight: 700 }}>{inv.amount}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 10, background: "#0d2414", border: "1px solid #00D68A33", color: C.green, padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                                        {inv.status.toUpperCase()}
                                    </span>
                                    <span
                                        onClick={() => downloadInvoicePDF(inv)}
                                        style={{ fontSize: 12, color: C.yellow, cursor: "pointer", textDecoration: "underline" }}
                                    >
                                        PDF
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </div>

                {/* Razorpay note */}
                <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.blue}`, borderRadius: "0 8px 8px 0", padding: "14px 16px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                    <strong style={{ color: C.blue }}>Payment integration note:</strong> Razorpay payment gateway integration comes in Phase 5. Clicking upgrade will process real payments once integrated. Your current plan and usage data are live from MongoDB.
                </div>

            </div>

            {/* Confirm upgrade modal */}
            {showConfirm && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, animation: "fadeIn 0.2s ease" }}>
                    <div style={{ background: C.card, border: `1px solid ${C.border2}`, borderRadius: 14, padding: 28, width: "100%", maxWidth: 420 }}>
                        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
                            Confirm plan change
                        </div>
                        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
                            You are switching to the <strong style={{ color: C.text, textTransform: "capitalize" }}>{showConfirm}</strong> plan at <strong style={{ color: C.yellow }}>₹{PLANS.find(p => p.key === showConfirm)?.price?.toLocaleString()}/month</strong>. This will be processed via Razorpay in Phase 5.
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                onClick={() => setShowConfirm(null)}
                                style={{ flex: 1, padding: "11px", borderRadius: 8, background: "transparent", color: C.muted, border: `1px solid ${C.border2}`, fontSize: 13, cursor: "pointer" }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmUpgrade(showConfirm)}
                                style={{ flex: 1, padding: "11px", borderRadius: 8, background: C.yellow, color: "#0A0B0D", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                            >
                                Confirm upgrade →
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}