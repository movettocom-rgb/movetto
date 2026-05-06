import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
    .inp {
      width: 100%; background: var(--mv-panel); border: 1px solid var(--mv-border);
      border-radius: 8px; padding: 14px 16px; font-size: 15px;
      color: var(--mv-text); outline: none; font-family: 'Sora', sans-serif;
      transition: border-color 0.2s;
    }
    .inp:focus { border-color: #E8F400; }
    .inp::placeholder { color: var(--mv-dimmer); }
    .inp-label {
      font-size: 13px; color: var(--mv-dim); text-transform: uppercase;
      letter-spacing: 0.09em; margin-bottom: 8px; display: block;
    }
    .rate-card {
      background: var(--mv-card); border: 1px solid var(--mv-border); border-radius: 12px;
      padding: 24px; cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; gap: 18px;
    }
    .rate-card:hover { border-color: #E8F40033; }
    .rate-card.selected { border-color: #E8F400; background: #0f1200; }
    .step-dot {
      width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; flex-shrink: 0;
      transition: all 0.3s;
    }
    .step-dot.done { background: #00D68A22; border: 1px solid #00D68A55; color: #00D68A; }
    .step-dot.active { background: #E8F400; color: #0A0B0D; }
    .step-dot.inactive { background: var(--mv-card); border: 1px solid var(--mv-border-2); color: var(--mv-dim); }
    .submit-btn {
      background: #E8F400; color: #0A0B0D; border: none;
      padding: 16px 32px; border-radius: 8px; font-size: 16px;
      font-weight: 700; cursor: pointer; font-family: 'Sora', sans-serif;
      transition: opacity 0.2s; width: 100%;
    }
    .submit-btn:hover { opacity: 0.88; }
    .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .back-btn {
      background: transparent; color: var(--mv-muted); border: 1px solid var(--mv-border-2);
      padding: 16px 32px; border-radius: 8px; font-size: 15px;
      cursor: pointer; font-family: 'Sora', sans-serif; transition: all 0.2s;
    }
    .back-btn:hover { border-color: var(--mv-dim); color: var(--mv-text); }
    .select-inp {
      width: 100%; background: var(--mv-panel); border: 1px solid var(--mv-border);
      border-radius: 8px; padding: 14px 16px; font-size: 15px;
      color: var(--mv-text); outline: none; font-family: 'Sora', sans-serif;
      cursor: pointer; appearance: none;
    }
    .select-inp:focus { border-color: #E8F400; }
    .select-inp option { background: var(--mv-panel); }
    .success-wrap {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 60px 40px; text-align: center;
      animation: fadeIn 0.4s ease;
    }
    @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner {
      width: 20px; height: 20px; border: 2px solid var(--mv-border-2);
      border-top-color: #E8F400; border-radius: 50%;
      animation: spin 0.7s linear infinite; display: inline-block;
    }
  `}</style>
);

/* ─── Step Indicator ─── */
const StepBar = ({ step }) => {
  const steps = ["Shipment details", "Compare rates", "Confirm & book"];
  return (
    <div style={{display:"flex", alignItems:"center", gap:0, marginBottom:32}}>
      {steps.map((s, i) => (
        <div key={i} style={{display:"flex", alignItems:"center", flex: i < steps.length - 1 ? 1 : "none"}}>
          <div style={{display:"flex", alignItems:"center", gap:10}}>
            <div className={`step-dot ${i + 1 < step ? "done" : i + 1 === step ? "active" : "inactive"}`}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span style={{fontSize:14, color: i + 1 === step ? C.text : C.dim, fontWeight: i + 1 === step ? 600 : 400, whiteSpace:"nowrap"}}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{flex:1, height:1, background: i + 1 < step ? C.green : C.border, margin:"0 16px"}}/>
          )}
        </div>
      ))}
    </div>
  );
};

/* ─── Input Field ─── */
const Field = ({ label, id, placeholder, type="text", value, onChange, required, half }) => (
  <div style={{flex: half ? "0 0 calc(50% - 6px)" : "1 1 100%"}}>
    <label className="inp-label" htmlFor={id}>
      {label}{required && <span style={{color:C.red}}> *</span>}
    </label>
    <input
      id={id} type={type} className="inp"
      placeholder={placeholder} value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

/* ─── Section Header ─── */
const SectionHead = ({ icon, title, sub }) => (
  <div style={{display:"flex", alignItems:"center", gap:14, marginBottom:24, paddingBottom:16, borderBottom:`1px solid ${C.border}`}}>
    <div style={{width:44, height:44, borderRadius:8, background:"#131700", border:`1px solid ${C.yellow}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20}}>
      {icon}
    </div>
    <div>
      <div style={{fontSize:18, fontWeight:700}}>{title}</div>
      <div style={{fontSize:14, color:C.dim, marginTop:4}}>{sub}</div>
    </div>
  </div>
);

/* ─── Step 1 — Shipment Details ─── */
const Step1 = ({ form, setForm, onNext }) => {
  const update = (key) => (val) => setForm(prev => ({ ...prev, [key]: val }));

  const canProceed = form.originPincode && form.destPincode &&
    form.receiverName && form.receiverPhone && form.destAddress && form.weight;

  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      {/* Origin */}
      <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24, marginBottom:16}}>
        <SectionHead icon="📍" title="Pickup details" sub="Where are you shipping from?"/>
        <div style={{display:"flex", flexWrap:"wrap", gap:12}}>
          <Field label="Origin pincode" id="originPincode" placeholder="400001" value={form.originPincode} onChange={update("originPincode")} required half/>
          <Field label="City" id="originCity" placeholder="Mumbai" value={form.originCity} onChange={update("originCity")} half/>
          <Field label="State" id="originState" placeholder="Maharashtra" value={form.originState} onChange={update("originState")} half/>
          <Field label="Pickup address" id="originAddress" placeholder="Shop 12, Dharavi Market" value={form.originAddress} onChange={update("originAddress")}/>
          <Field label="Contact name" id="originContactName" placeholder="Your name" value={form.originContactName} onChange={update("originContactName")} half/>
          <Field label="Contact phone" id="originContactPhone" placeholder="9876543210" value={form.originContactPhone} onChange={update("originContactPhone")} half/>
        </div>
      </div>

      {/* Destination */}
      <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24, marginBottom:16}}>
        <SectionHead icon="🎯" title="Delivery details" sub="Where is this going?"/>
        <div style={{display:"flex", flexWrap:"wrap", gap:12}}>
          <Field label="Destination pincode" id="destPincode" placeholder="110001" value={form.destPincode} onChange={update("destPincode")} required half/>
          <Field label="City" id="destCity" placeholder="Delhi" value={form.destCity} onChange={update("destCity")} half/>
          <Field label="State" id="destState" placeholder="Delhi" value={form.destState} onChange={update("destState")} half/>
          <Field label="Delivery address" id="destAddress" placeholder="45 Karol Bagh, New Delhi" value={form.destAddress} onChange={update("destAddress")} required/>
          <Field label="Receiver name" id="receiverName" placeholder="Rahul Sharma" value={form.receiverName} onChange={update("receiverName")} required half/>
          <Field label="Receiver phone" id="receiverPhone" placeholder="9123456780" value={form.receiverPhone} onChange={update("receiverPhone")} required half/>
        </div>
      </div>

      {/* Package */}
      <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24, marginBottom:24}}>
        <SectionHead icon="📦" title="Package details" sub="Weight and dimensions for accurate rates"/>
        <div style={{display:"flex", flexWrap:"wrap", gap:12}}>
          <Field label="Weight (kg)" id="weight" placeholder="2.5" type="number" value={form.weight} onChange={update("weight")} required half/>
          <div style={{flex:"0 0 calc(50% - 6px)"}}>
            <label className="inp-label">Category</label>
            <select className="select-inp" value={form.category} onChange={e => update("category")(e.target.value)}>
              <option value="general">General</option>
              <option value="textile">Textile / Garments</option>
              <option value="electronics">Electronics</option>
              <option value="pharma">Pharma / Healthcare</option>
              <option value="perishable">Perishable</option>
            </select>
          </div>
          <Field label="Length (cm)" id="length" placeholder="30" type="number" value={form.length} onChange={update("length")} half/>
          <Field label="Width (cm)" id="width" placeholder="20" type="number" value={form.width} onChange={update("width")} half/>
          <Field label="Height (cm)" id="height" placeholder="15" type="number" value={form.height} onChange={update("height")} half/>
          <Field label="Declared value (₹)" id="declaredValue" placeholder="2000" type="number" value={form.declaredValue} onChange={update("declaredValue")} half/>
        </div>

        {/* COD Toggle */}
        <div style={{marginTop:16, padding:14, background:C.panel, borderRadius:8, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:15, fontWeight:600}}>Cash on delivery (COD)</div>
            <div style={{fontSize:13, color:C.dim, marginTop:4}}>Customer pays on delivery</div>
          </div>
          <div
            onClick={() => update("codEnabled")(!form.codEnabled)}
            style={{
              width:42, height:24, borderRadius:12, cursor:"pointer", transition:"background 0.2s",
              background: form.codEnabled ? C.green : C.border2,
              display:"flex", alignItems:"center", padding:"0 3px",
            }}
          >
            <div style={{
              width:18, height:18, borderRadius:"50%", background:C.text,
              transition:"transform 0.2s",
              transform: form.codEnabled ? "translateX(18px)" : "translateX(0)",
            }}/>
          </div>
        </div>
        {form.codEnabled && (
          <div style={{marginTop:12}}>
            <Field label="COD amount (₹)" id="codAmount" placeholder="Amount to collect" type="number" value={form.codAmount} onChange={update("codAmount")}/>
          </div>
        )}
      </div>

      <button
        className="submit-btn"
        onClick={onNext}
        disabled={!canProceed}
      >
        Compare carrier rates →
      </button>
    </div>
  );
};

/* ─── Step 2 — Compare Rates ─── */
const Step2 = ({ form, rates, loadingRates, selectedRate, setSelectedRate, onNext, onBack }) => (
  <div style={{animation:"fadeIn 0.3s ease"}}>
    {/* Route summary */}
    <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:20, display:"flex", alignItems:"center", gap:16}}>
      <div style={{flex:1}}>
        <div style={{fontSize:13, color:C.dim, marginBottom:6}}>From</div>
        <div style={{fontSize:18, fontWeight:700}}>{form.originCity || form.originPincode}</div>
        <div style={{fontSize:13, color:C.dim, marginTop:2}}>{form.originPincode}</div>
      </div>
      <div style={{fontSize:24}}>→</div>
      <div style={{flex:1}}>
        <div style={{fontSize:13, color:C.dim, marginBottom:6}}>To</div>
        <div style={{fontSize:18, fontWeight:700}}>{form.destCity || form.destPincode}</div>
        <div style={{fontSize:13, color:C.dim, marginTop:2}}>{form.destPincode}</div>
      </div>
      <div style={{width:1, height:40, background:C.border}}/>
      <div>
        <div style={{fontSize:13, color:C.dim, marginBottom:6}}>Weight</div>
        <div style={{fontSize:18, fontWeight:700}}>{form.weight} kg</div>
      </div>
    </div>

    {/* Rates */}
    <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24, marginBottom:20}}>
      <div style={{fontSize:18, fontWeight:700, marginBottom:6}}>Available carriers</div>
      <div style={{fontSize:14, color:C.dim, marginBottom:24}}>
        {loadingRates ? "Fetching live rates..." : `${rates.length} carriers found — sorted by price`}
      </div>

      {loadingRates ? (
        <div style={{display:"flex", flexDirection:"column", gap:12}}>
          {[1,2,3].map(i => (
            <div key={i} style={{background:C.panel, borderRadius:12, padding:18, height:72, opacity:0.4}}/>
          ))}
        </div>
      ) : (
        <div style={{display:"flex", flexDirection:"column", gap:10}}>
          {rates.map((r, i) => (
            <div
              key={i}
              className={`rate-card${selectedRate?.carrier === r.carrier ? " selected" : ""}`}
              onClick={() => setSelectedRate(r)}
            >
              {/* Radio */}
              <div style={{
                width:22, height:22, borderRadius:"50%", flexShrink:0,
                border:`2px solid ${selectedRate?.carrier === r.carrier ? C.yellow : C.border2}`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                {selectedRate?.carrier === r.carrier && (
                  <div style={{width:10, height:10, borderRadius:"50%", background:C.yellow}}/>
                )}
              </div>

              {/* Carrier name */}
              <div style={{flex:1}}>
                <div style={{display:"flex", alignItems:"center", gap:10}}>
                  <div style={{fontSize:16, fontWeight:700}}>{r.carrier}</div>
                  {i === 0 && (
                    <span style={{fontSize:11, background:"#E8F40015", border:"1px solid #E8F40040", color:C.yellow, padding:"3px 8px", borderRadius:4, fontWeight:700}}>
                      CHEAPEST
                    </span>
                  )}
                  {r.onTimeRate >= 95 && (
                    <span style={{fontSize:11, background:"#00D68A15", border:"1px solid #00D68A40", color:C.green, padding:"3px 8px", borderRadius:4, fontWeight:700}}>
                      BEST RATED
                    </span>
                  )}
                </div>
                <div style={{fontSize:13, color:C.dim, marginTop:6}}>
                  ETA: {r.eta} · On-time: {r.onTimeRate}%
                </div>
              </div>

              {/* Rate */}
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:28, fontWeight:800, color: selectedRate?.carrier === r.carrier ? C.yellow : C.text}}>
                  ₹{r.rate.toLocaleString()}
                </div>
                <div style={{fontSize:13, color:C.dim, marginTop:4}}>estimated</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <div style={{display:"flex", gap:12}}>
      <button className="back-btn" onClick={onBack} style={{width:"auto", padding:"16px 28px"}}>← Back</button>
      <button className="submit-btn" onClick={onNext} disabled={!selectedRate}>
        Book with {selectedRate?.carrier || "selected carrier"} — ₹{selectedRate?.rate?.toLocaleString() || "—"} →
      </button>
    </div>
  </div>
);

/* ─── Step 3 — Confirm ─── */
const Step3 = ({ form, selectedRate, onBack, onBook, booking }) => (
  <div style={{animation:"fadeIn 0.3s ease"}}>
    <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24, marginBottom:16}}>
      <div style={{fontSize:18, fontWeight:700, marginBottom:24, paddingBottom:16, borderBottom:`1px solid ${C.border}`}}>
        Order summary
      </div>

      {/* Route */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20}}>
        <div>
          <div style={{fontSize:13, color:C.dim, marginBottom:8}}>FROM</div>
          <div style={{fontSize:18, fontWeight:700}}>{form.originCity || form.originPincode}</div>
          <div style={{fontSize:14, color:C.muted, marginTop:4}}>{form.originAddress || form.originPincode}</div>
          <div style={{fontSize:14, color:C.dim, marginTop:4}}>{form.originContactName} · {form.originContactPhone}</div>
        </div>
        <div>
          <div style={{fontSize:13, color:C.dim, marginBottom:8}}>TO</div>
          <div style={{fontSize:18, fontWeight:700}}>{form.destCity || form.destPincode}</div>
          <div style={{fontSize:14, color:C.muted, marginTop:4}}>{form.destAddress}</div>
          <div style={{fontSize:14, color:C.dim, marginTop:4}}>{form.receiverName} · {form.receiverPhone}</div>
        </div>
      </div>

      <div style={{height:1, background:C.border, marginBottom:20}}/>

      {/* Package + Carrier */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:20}}>
        <div>
          <div style={{fontSize:13, color:C.dim, marginBottom:6}}>Weight</div>
          <div style={{fontSize:16, fontWeight:700}}>{form.weight} kg</div>
        </div>
        <div>
          <div style={{fontSize:13, color:C.dim, marginBottom:6}}>Category</div>
          <div style={{fontSize:16, fontWeight:700, textTransform:"capitalize"}}>{form.category || "General"}</div>
        </div>
        <div>
          <div style={{fontSize:13, color:C.dim, marginBottom:6}}>COD</div>
          <div style={{fontSize:16, fontWeight:700}}>{form.codEnabled ? `₹${form.codAmount}` : "No"}</div>
        </div>
      </div>

      <div style={{height:1, background:C.border, marginBottom:20}}/>

      {/* Carrier + Price */}
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", background:C.panel, borderRadius:10, padding:16}}>
        <div>
          <div style={{fontSize:13, color:C.dim, marginBottom:6}}>Selected carrier</div>
          <div style={{fontSize:20, fontWeight:800}}>{selectedRate?.carrier}</div>
          <div style={{fontSize:14, color:C.dim, marginTop:4}}>ETA: {selectedRate?.eta}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:13, color:C.dim, marginBottom:6}}>You pay</div>
          <div style={{fontSize:36, fontWeight:800, color:C.yellow}}>₹{selectedRate?.rate?.toLocaleString()}</div>
        </div>
      </div>
    </div>

    <div style={{display:"flex", gap:12}}>
      <button className="back-btn" onClick={onBack} style={{width:"auto", padding:"16px 28px"}} disabled={booking}>← Back</button>
      <button className="submit-btn" onClick={onBook} disabled={booking}>
        {booking ? (
          <span style={{display:"flex", alignItems:"center", justifyContent:"center", gap:10}}>
            <span className="spinner"/> Booking shipment...
          </span>
        ) : (
          "Confirm & book shipment →"
        )}
      </button>
    </div>
  </div>
);

/* ─── Success Screen ─── */
const SuccessScreen = ({ trackingId, carrierName, rate, onNew }) => {
  const navigate = useNavigate();
  return (
    <div className="success-wrap">
      <div style={{width:84, height:84, borderRadius:"50%", background:"#00D68A22", border:"2px solid #00D68A55", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:28}}>
        ✓
      </div>
      <div style={{fontSize:32, fontWeight:800, marginBottom:10}}>Shipment booked!</div>
      <div style={{fontSize:18, color:C.muted, marginBottom:40, lineHeight:1.6}}>
        Your shipment has been confirmed with {carrierName}
      </div>
      <div style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24, width:"100%", maxWidth:400, marginBottom:28}}>
        <div style={{fontSize:14, color:C.dim, marginBottom:10}}>Tracking ID</div>
        <div style={{fontSize:28, fontWeight:800, fontFamily:"'JetBrains Mono',monospace", color:C.yellow, marginBottom:20}}>
          {trackingId}
        </div>
        <div style={{display:"flex", justifyContent:"space-between", fontSize:16, color:C.muted}}>
          <span>Carrier: <strong style={{color:C.text}}>{carrierName}</strong></span>
          <span>Rate: <strong style={{color:C.text}}>₹{rate?.toLocaleString()}</strong></span>
        </div>
      </div>
      <div style={{display:"flex", gap:12}}>
        <button
          onClick={onNew}
          style={{background:C.yellow, color:"#0A0B0D", border:"none", padding:"16px 32px", borderRadius:8, fontSize:16, fontWeight:700, cursor:"pointer"}}
        >
          Book another shipment
        </button>
        <button
          onClick={() => navigate(`/tracking?id=${trackingId}`)}
          style={{background:"transparent", color:C.muted, border:`1px solid ${C.border2}`, padding:"16px 32px", borderRadius:8, fontSize:16, cursor:"pointer"}}
        >
          Track this shipment →
        </button>
      </div>
    </div>
  );
};

/* ─── MAIN COMPONENT ─── */
export default function BookShipment() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    originPincode:"", originCity:"", originState:"", originAddress:"",
    originContactName:"", originContactPhone:"",
    destPincode:"", destCity:"", destState:"", destAddress:"",
    receiverName:"", receiverPhone:"",
    weight:"", length:"", width:"", height:"",
    category:"general", declaredValue:"",
    codEnabled:false, codAmount:"",
  });

  const [rates, setRates]               = useState([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [selectedRate, setSelectedRate] = useState(null);
  const [booking, setBooking]           = useState(false);
  const [success, setSuccess]           = useState(null);
  const [error, setError]               = useState("");

  /* ── Step 1 → 2: fetch rates ── */
  const handleStep1Next = async () => {
    setError("");
    setLoadingRates(true);
    setStep(2);
    try {
      const res = await api.get("/carriers/rates", {
        params: {
          originPin: form.originPincode,
          destPin:   form.destPincode,
          weight:    form.weight,
          category:  form.category,
        },
      });
      setRates(res.data.rates || []);
      if (res.data.rates?.length > 0) {
        setSelectedRate(res.data.rates[0]);
      }
    } catch (err) {
      setError("Failed to fetch rates. Please try again.");
      setStep(1);
    } finally {
      setLoadingRates(false);
    }
  };

  /* ── Step 3: book shipment ── */
  const handleBook = async () => {
    setBooking(true);
    setError("");
    try {
      const res = await api.post("/shipments", {
        originPincode:      form.originPincode,
        originCity:         form.originCity,
        originState:        form.originState,
        originAddress:      form.originAddress,
        originContactName:  form.originContactName,
        originContactPhone: form.originContactPhone,
        destPincode:        form.destPincode,
        destCity:           form.destCity,
        destState:          form.destState,
        destAddress:        form.destAddress,
        receiverName:       form.receiverName,
        receiverPhone:      form.receiverPhone,
        weight:             parseFloat(form.weight),
        length:             parseFloat(form.length) || 0,
        width:              parseFloat(form.width)  || 0,
        height:             parseFloat(form.height) || 0,
        category:           form.category,
        declaredValue:      parseFloat(form.declaredValue) || 0,
        codEnabled:         form.codEnabled,
        codAmount:          parseFloat(form.codAmount) || 0,
        carrierName:        selectedRate.carrier,
        quotedPrice:        selectedRate.rate,
      });

      setSuccess({
        trackingId:  res.data.shipment.trackingId,
        carrierName: selectedRate.carrier,
        rate:        selectedRate.rate,
      });

    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  /* ── Reset form ── */
  const handleNew = () => {
    setStep(1);
    setForm({
      originPincode:"", originCity:"", originState:"", originAddress:"",
      originContactName:"", originContactPhone:"",
      destPincode:"", destCity:"", destState:"", destAddress:"",
      receiverName:"", receiverPhone:"",
      weight:"", length:"", width:"", height:"",
      category:"general", declaredValue:"",
      codEnabled:false, codAmount:"",
    });
    setRates([]);
    setSelectedRate(null);
    setSuccess(null);
    setError("");
  };

  return (
    <div style={{background:C.bg, minHeight:"100vh", fontFamily:"'Sora',sans-serif", color:C.text}}>
      <GlobalStyles/>

      {/* Header */}
      <div style={{background:C.panel, borderBottom:`1px solid ${C.border}`, padding:"0 32px", height:76, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:16}}>
          <div
            onClick={() => navigate("/dashboard")}
            style={{display:"flex", alignItems:"center", gap:10, color:C.dim, cursor:"pointer", fontSize:15, transition:"color 0.2s"}}
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="var(--mv-dim)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Dashboard
          </div>
          <div style={{width:1, height:20, background:C.border}}/>
          <div style={{fontSize:18, fontWeight:700}}>Book shipment</div>
        </div>
        <div style={{fontSize:14, color:C.dim}}>
          <span className="pulse-dot" style={{display:"inline-block", width:8, height:8, borderRadius:"50%", background:C.green, marginRight:8, animation:"pulse 2s infinite"}}/>
          Rates updated live
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:860, margin:"0 auto", padding:"32px 24px"}}>
        {success ? (
          <SuccessScreen
            trackingId={success.trackingId}
            carrierName={success.carrierName}
            rate={success.rate}
            onNew={handleNew}
          />
        ) : (
          <>
            <StepBar step={step}/>

            {error && (
              <div style={{background:"#200808", border:"1px solid #FF5C3833", borderRadius:8, padding:"12px 16px", fontSize:13, color:C.red, marginBottom:20, display:"flex", alignItems:"center", gap:10}}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#FF5C38" strokeWidth="1.2"/><path d="M7 4v3.5M7 9.5v.5" stroke="#FF5C38" strokeWidth="1.2" strokeLinecap="round"/></svg>
                {error}
              </div>
            )}

            {step === 1 && (
              <Step1 form={form} setForm={setForm} onNext={handleStep1Next}/>
            )}
            {step === 2 && (
              <Step2
                form={form} rates={rates} loadingRates={loadingRates}
                selectedRate={selectedRate} setSelectedRate={setSelectedRate}
                onNext={() => setStep(3)} onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3
                form={form} selectedRate={selectedRate}
                onBack={() => setStep(2)} onBook={handleBook} booking={booking}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}