import { useState, useCallback, useMemo, useEffect } from "react";

const SUPA_URL = "https://rxhgthwulgbggubiewmi.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4aGd0aHd1bGdiZ2d1Ymlld21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTc0NDUsImV4cCI6MjA5MDEzMzQ0NX0.HDjjEKcz6yD8eUV0ma9_opOS9JOsWPgsH59lDeLQA8A";
const H = { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" };
const ADMIN_PASS = "123Cpatt123";

async function dbGet(table, query = "") { try { const r = await fetch(`${SUPA_URL}/rest/v1/${table}?select=*${query ? "&" + query : ""}`, { headers: H }); return r.ok ? await r.json() : []; } catch { return []; } }
async function dbInsert(table, data) { try { const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, { method: "POST", headers: H, body: JSON.stringify(data) }); return r.ok; } catch { return false; } }
async function dbUpdate(table, id, data) { try { const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, { method: "PATCH", headers: H, body: JSON.stringify(data) }); return r.ok; } catch { return false; } }
async function dbDelete(table, id) { try { const r = await fetch(`${SUPA_URL}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers: { ...H, Prefer: "" } }); return r.ok; } catch { return false; } }
async function uploadLogo(file) { try { const ext = file.name.split(".").pop(); const name = `${Date.now()}.${ext}`; const r = await fetch(`${SUPA_URL}/storage/v1/object/logos/${name}`, { method: "POST", headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}`, "Content-Type": file.type }, body: file }); if (r.ok) return `${SUPA_URL}/storage/v1/object/public/logos/${name}`; return null; } catch { return null; } }

const B = { black: "#0A0A0A", charcoal: "#404041", slate: "#404C56", lightBlue: "#9BC8DC", medBlue: "#7CA6E9", gold: "#CEB08E", white: "#FFFFFF", off: "#F7F6F3", dim: "#8A8A8A", brd: "rgba(0,0,0,0.06)", danger: "#E8593C", success: "#5CAA6E", purple: "#9B6ED4", brown: "#8B6F47", orange: "#E8A040" };
const PHONE = "(559) 317-1529"; const EMAIL = "Chrispattersonre@gmail.com"; const IG = "@Chrispattersonre";
const catC = { Festival: B.danger, Sports: B.medBlue, Market: B.gold, Outdoor: B.success, Arts: B.purple, Music: B.purple, Community: B.gold, Food: B.orange, Family: B.lightBlue, Dessert: B.danger, Restaurant: B.gold, Coffee: B.brown, Brunch: B.orange, Fitness: B.success, Shopping: B.purple, Nightlife: B.medBlue, Services: B.slate, Wellness: "#D4736E", Builder: B.charcoal, "Pest Control": B.success, "Home Inspector": B.medBlue, Roofing: B.brown, "Home Staging": B.gold, HVAC: B.slate, "Interior Design": B.purple, "Event Planning": B.orange, "Junk Removal": B.charcoal, Lighting: B.gold, "Massage Therapy": "#D4736E", Media: B.medBlue, Transportation: B.slate, Cleaning: B.lightBlue, Handyman: B.brown, Detailing: B.charcoal, "Home Warranty": B.success, "Escrow/Title": B.medBlue };
const catEmoji = { Dessert: "🍦", Restaurant: "🍽️", Coffee: "☕", Fitness: "💪", Brunch: "🥞", Shopping: "🛍️", Nightlife: "🍸", Wellness: "💆", Builder: "🏗️", "Pest Control": "🐛", "Home Inspector": "🔍", Roofing: "🏠", "Home Staging": "🎨", HVAC: "❄️", "Interior Design": "🖌️", "Event Planning": "🎉", "Junk Removal": "🚛", Lighting: "💡", "Massage Therapy": "💆", Media: "📸", Transportation: "🚐", Cleaning: "🧹", Handyman: "🔨", Detailing: "✨", "Home Warranty": "🛡️", "Escrow/Title": "📋", Services: "🔧" };

const HOODS = [
  { name: "Old Town Clovis", vibe: "Charming & Walkable", img: "🏘️", match: 94, desc: "Historic downtown with local shops, farmers market, and tree-lined streets.", schools: "A", commute: "12 min", median: "$485K", pop: "Family-friendly", highlights: ["Saturday Farmers Market", "Antique shops on Pollasky", "Walking distance to everything"] },
  { name: "Woodward Park", vibe: "Upscale & Active", img: "🌳", match: 88, desc: "Premier neighborhood with the region's best park, top-rated schools, and modern dining.", schools: "A+", commute: "15 min", median: "$520K", pop: "Young professionals", highlights: ["200-acre regional park", "Top Clovis Unified schools", "Trail running & cycling"] },
  { name: "Tower District", vibe: "Artsy & Eclectic", img: "🎭", match: 82, desc: "Fresno's cultural heart. Independent restaurants, live music, vintage shops.", schools: "B+", commute: "5 min", median: "$310K", pop: "Creatives & singles", highlights: ["Best restaurant scene", "Live music every weekend", "Monthly art hop"] },
  { name: "Loma Vista", vibe: "New & Growing", img: "🏗️", match: 79, desc: "Clovis' newest master-planned community. Brand new homes and modern amenities.", schools: "A", commute: "20 min", median: "$450K", pop: "New families", highlights: ["Brand new construction", "Modern parks & trails", "Growing retail"] },
  { name: "Fig Garden", vibe: "Established & Elegant", img: "🌿", match: 76, desc: "One of Fresno's most established neighborhoods. Mature trees and spacious lots.", schools: "A", commute: "8 min", median: "$410K", pop: "Established families", highlights: ["Fig Garden Village shopping", "Historic homes", "Central location"] },
  { name: "Northwest Fresno", vibe: "Suburban & Convenient", img: "🏡", match: 72, desc: "Great access to shopping, dining, and freeway. Solid schools and growing area.", schools: "B+", commute: "10 min", median: "$375K", pop: "Mixed families", highlights: ["River Park shopping", "Easy freeway access", "Diverse dining"] },
];

const QUIZ = [
  { q: "What matters most in your neighborhood?", opts: ["Walkability & local shops", "Top-rated schools", "Nightlife & dining", "New construction & modern amenities"] },
  { q: "Your ideal weekend looks like...", opts: ["Farmers market & coffee", "Park with the kids", "Live music & trying new restaurants", "Home projects & exploring"] },
  { q: "What's your budget range?", opts: ["Under $350K", "$350K – $450K", "$450K – $550K", "$550K+"] },
  { q: "How long of a commute are you okay with?", opts: ["Under 10 min", "10–15 min", "15–25 min", "Doesn't matter"] },
  { q: "Which vibe fits you best?", opts: ["Quiet & established", "Trendy & walkable", "Family & community", "Brand new everything"] },
];

const COL = { "San Francisco": { rent: 3200, groceries: 550, gas: 5.10, median: 1450000, dining: 85, utilities: 220 }, "Los Angeles": { rent: 2700, groceries: 500, gas: 4.90, median: 970000, dining: 70, utilities: 190 }, "San Jose": { rent: 3000, groceries: 530, gas: 5.00, median: 1380000, dining: 80, utilities: 210 }, "San Diego": { rent: 2500, groceries: 480, gas: 4.85, median: 900000, dining: 65, utilities: 185 }, "Sacramento": { rent: 1800, groceries: 420, gas: 4.60, median: 520000, dining: 55, utilities: 170 }, "Bakersfield": { rent: 1300, groceries: 380, gas: 4.40, median: 370000, dining: 40, utilities: 155 }, "Fresno/Clovis": { rent: 1400, groceries: 390, gas: 4.45, median: 400000, dining: 42, utilities: 160 } };

function Logo({ size = 36, light }) { return (<svg width={size} height={size} viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill={light ? "rgba(255,255,255,0.1)" : `${B.gold}18`} /><path d="M20 8c-4.4 0-8 3.4-8 7.6 0 5.7 8 16.4 8 16.4s8-10.7 8-16.4C28 11.4 24.4 8 20 8z" fill={B.gold} /><circle cx="20" cy="15.5" r="3" fill={light ? B.black : B.white} /></svg>); }
function BH({ light }) { return (<div style={{ display: "flex", alignItems: "center", gap: 10 }}><Logo size={36} light={light} /><div><div style={{ fontFamily: "var(--hf)", fontSize: 20, fontWeight: 700, color: light ? B.white : B.charcoal, lineHeight: 1 }}>The Spot</div><div style={{ fontSize: 10, color: B.gold, fontWeight: 600, letterSpacing: 1.5, marginTop: 1 }}>FRESNO · CLOVIS</div></div></div>); }
function CallBtn({ full, style: s }) { return (<a href={`tel:5593171529`} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: full ? "11px 14px" : "7px 11px", background: B.success, borderRadius: 10, fontSize: full ? 12 : 11, fontWeight: 600, color: B.white, textDecoration: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", ...s }}>📞 {full ? `Call ${PHONE}` : PHONE}</a>); }
function TextBtn({ style: s }) { return (<a href="sms:5593171529" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 11px", background: `${B.medBlue}15`, border: `1px solid ${B.medBlue}30`, borderRadius: 10, fontSize: 11, fontWeight: 600, color: B.medBlue, textDecoration: "none", cursor: "pointer", fontFamily: "inherit", ...s }}>💬 Text</a>); }
function EmailBtn({ style: s }) { return (<a href={`mailto:${EMAIL}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 11px", background: `${B.gold}15`, border: `1px solid ${B.gold}30`, borderRadius: 10, fontSize: 11, fontWeight: 600, color: B.gold, textDecoration: "none", cursor: "pointer", fontFamily: "inherit", ...s }}>✉️ Email</a>); }
function IgBtn({ style: s }) { return (<a href="https://instagram.com/Chrispattersonre" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 11px", background: `${B.purple}15`, border: `1px solid ${B.purple}30`, borderRadius: 10, fontSize: 11, fontWeight: 600, color: B.purple, textDecoration: "none", cursor: "pointer", fontFamily: "inherit", ...s }}>📷 {IG}</a>); }
function Bdg({ color, children }) { return <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 6, background: `${color}14`, color }}>{children}</span>; }
function SH({ label }) { return <div style={{ fontSize: 11, fontWeight: 700, color: B.dim, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, marginTop: 6 }}>{label}</div>; }
function Spin() { return <div style={{ textAlign: "center", padding: 40, color: B.dim, fontSize: 13 }}>Loading...</div>; }

function ReviewCards({ reviews, limit }) {
  const list = limit ? reviews.slice(0, limit) : reviews;
  if (!list.length) return null;
  return (<div>
    <SH label={`Client reviews · ${reviews.length} on Google`} />
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ color: "#FBBC04", fontSize: 16 }}>★</span>)}</div>
      <span style={{ fontSize: 14, fontWeight: 700, color: B.charcoal }}>5.0</span>
      <span style={{ fontSize: 12, color: B.dim }}>· {reviews.length} reviews on</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: "#4285F4" }}>Google</span>
    </div>
    <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none", margin: "0 -14px", padding: "0 14px 8px" }}>
      {list.map((r, i) => (
        <div key={i} style={{ minWidth: 260, maxWidth: 280, background: B.white, borderRadius: 14, padding: 16, border: `1px solid ${B.brd}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${B.gold}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: B.gold }}>{(r.client_name || "?").charAt(0)}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: B.charcoal }}>{r.client_name}</div>
                <div style={{ fontSize: 10, color: B.dim }}>{r.date_display}</div>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          </div>
          <div style={{ display: "flex", gap: 1, marginBottom: 8 }}>{[1,2,3,4,5].map(j => <span key={j} style={{ color: "#FBBC04", fontSize: 12 }}>★</span>)}</div>
          <div style={{ fontSize: 12, color: B.slate, lineHeight: 1.6 }}>{r.review_text?.length > 180 ? r.review_text.slice(0, 180) + "..." : r.review_text}</div>
        </div>
      ))}
    </div>
  </div>);
}

function Nav({ active, go }) {
  const items = [{ id: "home", l: "Home", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" }, { id: "explore", l: "Explore", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }, { id: "events", l: "Events", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }, { id: "quiz", l: "Match", d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" }, { id: "connect", l: "Connect", d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }];
  return (<div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", height: 56, background: B.white, borderTop: `1px solid ${B.brd}`, flexShrink: 0 }}>{items.map(it => (<button key={it.id} onClick={() => go(it.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", padding: "4px 6px" }}><svg width="19" height="19" fill="none" stroke={active === it.id ? B.gold : B.dim} strokeWidth={active === it.id ? 2.2 : 1.6} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d={it.d} /></svg><span style={{ fontSize: 9, fontWeight: active === it.id ? 700 : 400, color: active === it.id ? B.gold : B.dim, fontFamily: "inherit" }}>{it.l}</span></button>))}</div>);
}

function Splash({ go }) {
  return (<div style={{ height: "100%", background: `linear-gradient(168deg, ${B.black} 0%, #151725 55%, ${B.charcoal} 100%)`, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "50px 24px 32px", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: -80, right: -80, width: 220, height: 220, borderRadius: "50%", background: `radial-gradient(circle, ${B.gold}12, transparent)` }} />
    <div><BH light /><div style={{ fontSize: 15, color: B.gold, fontStyle: "italic", fontFamily: "var(--hf)", marginTop: 16, marginBottom: 10 }}>Your city. Your people. Your guide.</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 300 }}>Discover neighborhoods, find local businesses, explore events, and connect with everything Fresno & Clovis has to offer.</div></div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <button onClick={() => go("quiz")} style={{ width: "100%", padding: "15px", background: B.gold, border: "none", borderRadius: 14, fontSize: 15, fontWeight: 600, color: B.black, cursor: "pointer", fontFamily: "inherit" }}>I'm relocating — find my neighborhood</button>
      <button onClick={() => go("home")} style={{ width: "100%", padding: "15px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 14, fontSize: 15, fontWeight: 600, color: B.white, cursor: "pointer", fontFamily: "inherit" }}>I'm local — show me the spots</button>
      <button onClick={() => go("referral")} style={{ width: "100%", padding: "15px", background: "transparent", border: `1px solid ${B.gold}50`, borderRadius: 14, fontSize: 14, fontWeight: 600, color: B.gold, cursor: "pointer", fontFamily: "inherit" }}>I'm an agent — send a referral</button>
      <button onClick={() => go("partner")} style={{ width: "100%", padding: "14px", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>I'm a local business — become a Spot partner</button>
      <div style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, lineHeight: 1.8 }}><a href="https://instagram.com/Chrispattersonre" target="_blank" rel="noopener" style={{ color: B.purple, textDecoration: "none", fontWeight: 600 }}>{IG}</a> · <a href="tel:5593171529" style={{ color: B.gold, textDecoration: "none", fontWeight: 600 }}>{PHONE}</a> · <a href={`mailto:${EMAIL}`} style={{ color: B.gold, textDecoration: "none", fontWeight: 600 }}>{EMAIL}</a></div>
    </div>
  </div>);
}

function ReferralPortal({ go }) {
  const [form, setForm] = useState({ agent_name: "", brokerage: "", agent_phone: "", agent_email: "", client_name: "", client_phone: "", timeline: "1-3 months", notes: "" });
  const [sent, setSent] = useState(false); const [sending, setSending] = useState(false);
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = async () => { setSending(true); await dbInsert("referrals", { ...form, status: "new" }); setSent(true); setSending(false); };
  if (sent) return (<div style={{ height: "100%", background: `linear-gradient(168deg, ${B.black}, #151725)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}><div style={{ width: 64, height: 64, borderRadius: "50%", background: `${B.success}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, fontSize: 28 }}>✓</div><div style={{ fontFamily: "var(--hf)", fontSize: 22, fontWeight: 700, color: B.white, marginBottom: 8 }}>Referral submitted!</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Chris will reach out within 24 hours.</div><div style={{ fontSize: 14, color: B.gold, fontWeight: 600, marginBottom: 24 }}>25% referral fee on closed transactions</div><CallBtn full style={{ marginBottom: 12 }} /><button onClick={() => go("home")} style={{ padding: "12px 28px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 14, fontWeight: 500, color: B.white, cursor: "pointer", fontFamily: "inherit" }}>Explore The Spot →</button></div>);
  const inp = (l, k, ph, t = "text") => (<div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: B.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{l}</label><input value={form[k]} onChange={e => up(k, e.target.value)} placeholder={ph} type={t} style={{ width: "100%", padding: "11px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 13, color: B.white, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} /></div>);
  return (<div style={{ minHeight: "100%", background: `linear-gradient(168deg, ${B.black}, #151725, ${B.charcoal})`, padding: "16px 16px 40px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}><button onClick={() => go("splash")} style={{ background: "none", border: "none", color: B.gold, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button><Logo size={28} light /></div>
    <div style={{ fontFamily: "var(--hf)", fontSize: 20, fontWeight: 700, color: B.white, marginBottom: 4 }}>Agent referral</div>
    <div style={{ display: "inline-flex", padding: "5px 12px", borderRadius: 8, background: `${B.gold}15`, marginBottom: 16 }}><span style={{ fontSize: 12, fontWeight: 700, color: B.gold }}>25% referral fee on closed deals</span></div>
    {inp("Name", "agent_name", "Jane Smith")}{inp("Brokerage", "brokerage", "RE/MAX, KW, etc.")}{inp("Phone", "agent_phone", "(555) 555-5555", "tel")}{inp("Email", "agent_email", "jane@brokerage.com", "email")}
    <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 8, marginTop: 6, textTransform: "uppercase" }}>Client info</div>
    {inp("Client Name", "client_name", "John & Sarah Doe")}{inp("Client Phone", "client_phone", "(555) 555-5555", "tel")}
    <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: B.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Timeline</label><div style={{ display: "flex", gap: 6 }}>{["ASAP", "1-3 months", "3-6 months", "Exploring"].map(t => (<button key={t} onClick={() => up("timeline", t)} style={{ flex: 1, padding: "9px 4px", background: form.timeline === t ? `${B.gold}25` : "rgba(255,255,255,0.05)", border: `1px solid ${form.timeline === t ? B.gold : "rgba(255,255,255,0.1)"}`, borderRadius: 8, fontSize: 10, fontWeight: form.timeline === t ? 700 : 400, color: form.timeline === t ? B.gold : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>{t}</button>))}</div></div>
    <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: B.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Notes</label><textarea value={form.notes} onChange={e => up("notes", e.target.value)} placeholder="Budget, areas, needs..." rows={3} style={{ width: "100%", padding: "11px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 13, color: B.white, fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "none" }} /></div>
    <button onClick={submit} disabled={sending} style={{ width: "100%", padding: "15px", background: sending ? B.slate : B.gold, border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, color: B.black, cursor: "pointer", fontFamily: "inherit" }}>{sending ? "Submitting..." : "Submit referral"}</button>
  </div>);
}

function PartnerOnboard({ go }) {
  const [tier, setTier] = useState(null);
  const [form, setForm] = useState({ business_name: "", contact_name: "", phone: "", email: "", website: "", category: "", description: "", brand_color: "#CEB08E", logo_initials: "", deal: "" });
  const [logoFile, setLogoFile] = useState(null); const [logoPreview, setLogoPreview] = useState(null);
  const [sent, setSent] = useState(false); const [sending, setSending] = useState(false);
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const tiers = [
    { id: "spotlight", name: "Spotlight", price: "$99/mo", color: B.lightBlue, features: ["Business listing in the app", "Category placement", "Contact info & link", "Monthly analytics report", "Logo & brand display"] },
    { id: "featured", name: "Featured", price: "$199/mo", color: B.gold, features: ["Everything in Spotlight", "Create deals & promos in-app", "Priority in search results", "Highlighted in Explore page", "Featured badge on listing"], pop: true },
    { id: "founding", name: "Founding Partner", price: "$299/mo", color: B.medBlue, features: ["Everything in Featured", "Unlimited deals & promos", "Event co-promotion", "Input on app features", "Locked-in rate for life", "Exclusive partner directory"], limited: true },
  ];
  const submit = async () => {
    setSending(true);
    let logo_url = null;
    if (logoFile) logo_url = await uploadLogo(logoFile);
    await dbInsert("partner_applications", { ...form, tier, logo_url, status: "pending" });
    setSent(true); setSending(false);
  };
  if (sent) return (<div style={{ height: "100%", background: `linear-gradient(168deg, ${B.black}, #151725)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}><div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div><div style={{ fontFamily: "var(--hf)", fontSize: 22, fontWeight: 700, color: B.white, marginBottom: 8 }}>Application submitted!</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 20 }}>Chris will review and reach out within 48 hours.</div><CallBtn full style={{ marginBottom: 12 }} /><button onClick={() => go("home")} style={{ padding: "12px 28px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 14, fontWeight: 500, color: B.white, cursor: "pointer", fontFamily: "inherit" }}>Explore The Spot →</button></div>);
  const inp = (l, k, ph, t = "text") => (<div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: B.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{l}</label><input value={form[k]} onChange={e => up(k, e.target.value)} placeholder={ph} type={t} style={{ width: "100%", padding: "11px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 13, color: B.white, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} /></div>);
  return (<div style={{ minHeight: "100%", background: `linear-gradient(168deg, ${B.black}, #151725, ${B.charcoal})`, padding: "16px 16px 40px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}><button onClick={() => go("splash")} style={{ background: "none", border: "none", color: B.gold, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button><Logo size={28} light /></div>
    <div style={{ fontFamily: "var(--hf)", fontSize: 20, fontWeight: 700, color: B.white, marginBottom: 16 }}>Become a Spot partner</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>{tiers.map(t => (<button key={t.id} onClick={() => setTier(t.id)} style={{ width: "100%", padding: "14px", background: tier === t.id ? `${t.color}15` : "rgba(255,255,255,0.04)", border: `1.5px solid ${tier === t.id ? t.color : "rgba(255,255,255,0.1)"}`, borderRadius: 14, cursor: "pointer", fontFamily: "inherit", textAlign: "left", position: "relative" }}>{t.pop && <div style={{ position: "absolute", top: -8, right: 12, padding: "2px 10px", background: B.gold, borderRadius: 6, fontSize: 8, fontWeight: 700, color: B.black }}>MOST POPULAR</div>}{t.limited && <div style={{ position: "absolute", top: -8, right: 12, padding: "2px 10px", background: B.danger, borderRadius: 6, fontSize: 8, fontWeight: 700, color: B.white }}>LIMITED</div>}<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><div style={{ fontSize: 15, fontWeight: 700, color: t.color }}>{t.name}</div><div style={{ fontSize: 16, fontWeight: 700, color: B.white }}>{t.price}</div></div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{t.features.map((f, i) => <span key={i} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>{f}</span>)}</div></button>))}</div>
    {tier && <>
      {inp("Business Name", "business_name", "Ampersand Ice Cream")}{inp("Contact", "contact_name", "Jane Smith")}{inp("Phone", "phone", "(559) 555-5555", "tel")}{inp("Email", "email", "hello@yourbiz.com", "email")}{inp("Website", "website", "www.yourbiz.com")}
      <div style={{ marginBottom: 12 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: B.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Category</label><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{["Restaurant", "Coffee", "Fitness", "Shopping", "Wellness", "Services", "Nightlife", "Other"].map(c => (<button key={c} onClick={() => up("category", c)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${form.category === c ? B.gold : "rgba(255,255,255,0.1)"}`, background: form.category === c ? `${B.gold}20` : "transparent", fontSize: 11, color: form.category === c ? B.gold : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>{c}</button>))}</div></div>
      <div style={{ marginBottom: 14 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: B.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Logo</label><div style={{ display: "flex", gap: 12, alignItems: "center" }}><div style={{ width: 64, height: 64, borderRadius: 14, background: form.brand_color || B.gold, border: "2px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>{logoPreview ? <img src={logoPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 20, fontWeight: 800, color: B.white }}>{form.logo_initials || "?"}</span>}</div><div><label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 12, fontWeight: 600, color: B.white, cursor: "pointer" }}>Upload logo<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setLogoFile(f); const r = new FileReader(); r.onload = ev => setLogoPreview(ev.target.result); r.readAsDataURL(f); }}} /></label></div></div></div>
      {inp("Logo Initials (fallback)", "logo_initials", "e.g. A&, KJ")}{inp("Brand Color (hex)", "brand_color", "#CEB08E")}
      <div style={{ marginBottom: 14, padding: 14, borderRadius: 14, background: `linear-gradient(135deg, ${form.brand_color || B.gold}, ${form.brand_color || B.gold}CC)` }}><div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>Card preview</div><div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: B.white, overflow: "hidden" }}>{logoPreview ? <img src={logoPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (form.logo_initials || "?")}</div><div style={{ fontSize: 16, fontWeight: 800, color: B.white }}>★ 5.0</div></div><div style={{ fontSize: 13, fontWeight: 700, color: B.white, marginTop: 8 }}>{form.business_name || "Your Business"}</div></div>
      {(tier === "featured" || tier === "founding") && <div style={{ marginBottom: 14, padding: "10px 14px", background: `${B.success}08`, borderRadius: 12, border: `1px dashed ${B.success}30` }}><div style={{ fontSize: 10, color: B.success, fontWeight: 700, marginBottom: 6 }}>Create a deal for Spot users</div><input value={form.deal} onChange={e => up("deal", e.target.value)} placeholder='e.g. "10% off first visit"' style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 13, color: B.white, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} /></div>}
      <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: B.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>About your business</label><textarea value={form.description} onChange={e => up("description", e.target.value)} placeholder="What makes you unique..." rows={3} style={{ width: "100%", padding: "11px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 13, color: B.white, fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "none" }} /></div>
      <button onClick={submit} disabled={sending} style={{ width: "100%", padding: "15px", background: sending ? B.slate : B.gold, border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, color: B.black, cursor: "pointer", fontFamily: "inherit" }}>{sending ? "Submitting..." : "Submit application"}</button>
    </>}
  </div>);
}

function Home({ go, businesses, events, vendors, reviews }) {
  const [tab, setTab] = useState("foryou");
  const tabs = [{ id: "foryou", l: "For you" }, { id: "biz", l: "Businesses" }, { id: "vendors", l: "Vendors" }, { id: "new", l: "New here?" }];
  return (<div style={{ background: B.off, minHeight: "100%" }}>
    <div style={{ background: B.black, padding: "14px 14px 12px", borderRadius: "0 0 22px 22px" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><BH light /><CallBtn /></div><div style={{ display: "flex", gap: 5, overflowX: "auto", scrollbarWidth: "none" }}>{tabs.map(t => (<button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "6px 13px", borderRadius: 18, border: "none", fontSize: 11, fontWeight: tab === t.id ? 700 : 400, background: tab === t.id ? B.gold : "rgba(255,255,255,0.07)", color: tab === t.id ? B.black : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{t.l}</button>))}</div></div>
    <div style={{ padding: "12px 14px 90px" }}>
      {tab === "foryou" && <FYTab go={go} businesses={businesses} events={events} />}
      {tab === "biz" && <BizTab businesses={businesses} />}
      {tab === "vendors" && <VendorTab vendors={vendors} />}
      {tab === "new" && <NewTab go={go} reviews={reviews} />}
    </div>
  </div>);
}

function FYTab({ go, businesses, events }) {
  const featured = businesses.filter(b => b.featured);
  const hotEvents = events.filter(e => e.is_hot).slice(0, 3);
  return (<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {hotEvents[0] && <div style={{ background: `linear-gradient(135deg, ${B.danger}10, ${B.gold}10)`, borderRadius: 14, padding: 14, border: `1px solid ${B.danger}18` }}><Bdg color={B.danger}>TRENDING</Bdg><div style={{ fontSize: 14, fontWeight: 700, color: B.charcoal, marginTop: 5 }}>{hotEvents[0].name}</div><div style={{ fontSize: 11, color: B.slate, marginTop: 2 }}>{hotEvents[0].date_display} · {hotEvents[0].area}</div></div>}
    {featured.length > 0 && <><SH label="Featured spots" /><div style={{ display: "flex", gap: 10, overflowX: "auto", margin: "0 -14px", padding: "0 14px 4px", scrollbarWidth: "none" }}>{featured.map((b, i) => (<div key={i} style={{ minWidth: 190, background: B.white, borderRadius: 14, overflow: "hidden", border: `1px solid ${B.brd}` }}><div style={{ height: 70, background: `linear-gradient(135deg, ${b.brand_color || B.gold}, ${b.brand_color || B.gold}CC)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}><div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: B.white, overflow: "hidden" }}>{b.logo_url ? <img src={b.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (b.logo_initials || b.name?.charAt(0))}</div><div style={{ fontSize: 14, fontWeight: 800, color: B.white }}>★ {b.rating}</div></div><div style={{ padding: "10px 12px" }}><div style={{ fontSize: 13, fontWeight: 700, color: B.charcoal }}>{b.name}</div><div style={{ fontSize: 10, color: B.dim }}>{b.area}</div>{b.deal && <div style={{ marginTop: 5, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: `${B.success}12`, color: B.success, display: "inline-block" }}>{b.deal}</div>}</div></div>))}</div></>}
    <SH label="Upcoming" />
    {events.slice(0, 4).map((e, i) => (<div key={i} style={{ display: "flex", gap: 10, background: B.white, borderRadius: 12, padding: 11, border: `1px solid ${B.brd}`, alignItems: "center" }}><div style={{ width: 40, height: 40, borderRadius: 10, background: `${catC[e.category] || B.gold}10`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><div style={{ fontSize: 9, fontWeight: 700, color: catC[e.category] || B.gold }}>{e.date_display?.split(" ")[0]}</div><div style={{ fontSize: 7, color: B.dim }}>{e.date_display?.split(" ")[1]}</div></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 700, color: B.charcoal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.name}</div><div style={{ fontSize: 10, color: B.dim }}>{e.area}</div></div>{e.is_free && <Bdg color={B.success}>FREE</Bdg>}</div>))}
    <button onClick={() => go("calc")} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${B.medBlue}12, ${B.gold}10)`, border: `1px solid ${B.medBlue}20`, borderRadius: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ textAlign: "left" }}><div style={{ fontSize: 13, fontWeight: 700, color: B.charcoal }}>Cost of living calculator</div><div style={{ fontSize: 11, color: B.medBlue }}>Compare your city to Fresno →</div></div><span style={{ fontSize: 24 }}>💰</span></button>
    <button onClick={() => go("quiz")} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${B.charcoal}, ${B.black})`, border: "none", borderRadius: 14, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between" }}><div style={{ textAlign: "left" }}><div style={{ fontSize: 13, fontWeight: 700, color: B.white }}>Moving to the area?</div><div style={{ fontSize: 11, color: B.gold }}>Neighborhood match quiz →</div></div><span style={{ fontSize: 24 }}>🏠</span></button>
    <div style={{ background: B.white, borderRadius: 14, padding: 14, border: `1px solid ${B.brd}`, display: "flex", alignItems: "center", gap: 12 }}><Logo size={40} /><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: B.charcoal }}>Chris Patterson</div><a href="https://instagram.com/Chrispattersonre" target="_blank" rel="noopener" style={{ fontSize: 10, color: B.purple, textDecoration: "none", fontWeight: 600 }}>{IG}</a></div><CallBtn /></div>
  </div>);
}

function BizTab({ businesses }) {
  const [f, setF] = useState("All");
  const cats = ["All", ...new Set(businesses.map(b => b.category).filter(Boolean))];
  const list = f === "All" ? businesses : businesses.filter(b => b.category === f);
  const isLight = (hex) => { if (!hex || hex.length < 7) return false; const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), bb = parseInt(hex.slice(5,7),16); return (r*299+g*587+bb*114)/1000 > 150; };
  return (<div><div style={{ display: "flex", gap: 5, overflowX: "auto", marginBottom: 12, scrollbarWidth: "none" }}>{cats.map(c => (<button key={c} onClick={() => setF(c)} style={{ padding: "6px 12px", borderRadius: 18, border: `1px solid ${f === c ? B.gold : B.brd}`, fontSize: 10, fontWeight: f === c ? 700 : 400, background: f === c ? `${B.gold}15` : B.white, color: f === c ? B.gold : B.slate, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{c}</button>))}</div>
    {list.map((b, i) => (<div key={i} style={{ background: B.white, borderRadius: 16, marginBottom: 12, border: `1px solid ${B.brd}`, overflow: "hidden" }}><div style={{ height: 80, background: `linear-gradient(135deg, ${b.brand_color || B.gold}, ${b.brand_color || B.gold}CC)`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", position: "relative" }}><div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: isLight(b.brand_color) ? b.brand_color : B.white, overflow: "hidden" }}>{b.logo_url ? <img src={b.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (b.logo_initials || b.name?.charAt(0))}</div><div style={{ textAlign: "right" }}><div style={{ fontSize: 20, fontWeight: 800, color: isLight(b.brand_color) ? "#1a1a1a" : B.white }}>★ {b.rating}</div><div style={{ fontSize: 10, color: isLight(b.brand_color) ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.7)" }}>{b.reviews} reviews</div></div>{b.featured && <div style={{ position: "absolute", top: 8, left: 8, padding: "2px 8px", borderRadius: 6, background: "rgba(0,0,0,0.3)", fontSize: 8, fontWeight: 700, color: B.white }}>SPOT PARTNER</div>}</div><div style={{ padding: "12px 16px 14px" }}><div style={{ fontSize: 16, fontWeight: 700, color: B.charcoal }}>{b.name}</div><div style={{ fontSize: 11, color: B.dim, marginTop: 2 }}>{b.area} · {b.category}</div><div style={{ fontSize: 12, color: B.slate, lineHeight: 1.6, marginTop: 6 }}>{b.description}</div><div style={{ display: "flex", gap: 6, marginTop: 8 }}><Bdg color={catC[b.category] || B.gold}>{b.tag || b.category}</Bdg>{b.deal && <div style={{ padding: "4px 10px", borderRadius: 8, background: `${B.success}08`, border: `1px dashed ${B.success}35`, fontSize: 10, fontWeight: 700, color: B.success }}>{b.deal}</div>}</div></div></div>))}
    {list.length === 0 && <div style={{ textAlign: "center", padding: 30, color: B.dim }}>No businesses yet. Be the first partner!</div>}
  </div>);
}

function VendorTab({ vendors }) {
  const [f, setF] = useState("All");
  const cats = ["All", ...new Set(vendors.map(v => v.category).filter(Boolean))];
  const list = f === "All" ? vendors : vendors.filter(v => v.category === f);
  return (<div>
    <div style={{ fontSize: 12, color: B.slate, marginBottom: 10 }}>Chris' trusted vendor network. Vetted professionals.</div>
    <div style={{ display: "flex", gap: 5, overflowX: "auto", marginBottom: 12, scrollbarWidth: "none" }}>{cats.map(c => (<button key={c} onClick={() => setF(c)} style={{ padding: "6px 12px", borderRadius: 18, border: `1px solid ${f === c ? B.gold : B.brd}`, fontSize: 10, fontWeight: f === c ? 700 : 400, background: f === c ? `${B.gold}15` : B.white, color: f === c ? B.gold : B.slate, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{c}</button>))}</div>
    {list.map((v, i) => (<div key={i} style={{ background: B.white, borderRadius: 12, padding: 13, marginBottom: 8, border: `1px solid ${B.brd}` }}><div style={{ display: "flex", gap: 10, alignItems: "center" }}><div style={{ width: 38, height: 38, borderRadius: 10, background: `${catC[v.category] || B.slate}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{catEmoji[v.category] || "📍"}</div><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: B.charcoal }}>{v.name}</div><div style={{ fontSize: 10, color: B.dim }}>{v.category}{v.contact_name ? ` · ${v.contact_name}` : ""}</div><div style={{ fontSize: 10, color: B.slate, marginTop: 2 }}>{v.description}</div></div></div><div style={{ display: "flex", gap: 6, marginTop: 8 }}><a href={`tel:${v.phone?.replace(/\D/g,"")}`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "7px", background: `${B.success}10`, borderRadius: 8, fontSize: 11, fontWeight: 600, color: B.success, textDecoration: "none" }}>📞 {v.phone}</a>{v.email && <a href={`mailto:${v.email}`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "7px", background: `${B.gold}10`, borderRadius: 8, fontSize: 11, fontWeight: 600, color: B.gold, textDecoration: "none" }}>✉️ Email</a>}</div></div>))}
  </div>);
}

function NewTab({ go, reviews }) {
  return (<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{ background: `linear-gradient(145deg, ${B.black}, #1a1c2e)`, borderRadius: 18, padding: 20, color: B.white }}><div style={{ fontSize: 10, color: B.gold, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>WELCOME</div><div style={{ fontFamily: "var(--hf)", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Moving to Fresno or Clovis?</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 12 }}>Find your neighborhood, connect with vendors, feel at home before you move.</div><div style={{ display: "flex", gap: 8 }}><button onClick={() => go("quiz")} style={{ padding: "10px 18px", background: B.gold, border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700, color: B.black, cursor: "pointer", fontFamily: "inherit" }}>Find my hood →</button><button onClick={() => go("calc")} style={{ padding: "10px 18px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 12, fontWeight: 600, color: B.white, cursor: "pointer", fontFamily: "inherit" }}>Cost calculator</button></div></div>
    <SH label="Quick facts" />
    {[{ l: "Median Price", v: "$400K", s: "vs $905K statewide", e: "🏠" },{ l: "Days on Market", v: "59", s: "Balanced market", e: "📊" },{ l: "Top Schools", v: "Clovis Unified", s: "A-rated", e: "🎓" },{ l: "Price Growth", v: "2.6% YoY", s: "Steady", e: "📈" },{ l: "To Yosemite", v: "~90 min", s: "Weekend trips", e: "⛰️" }].map((f, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: B.white, borderRadius: 12, padding: "11px 13px", border: `1px solid ${B.brd}` }}><span style={{ fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 }}>{f.e}</span><div style={{ flex: 1 }}><div style={{ fontSize: 10, color: B.dim }}>{f.l}</div><div style={{ fontSize: 16, fontWeight: 700, color: B.charcoal }}>{f.v}</div></div><div style={{ fontSize: 10, color: B.slate }}>{f.s}</div></div>))}
    {reviews.length > 0 && <ReviewCards reviews={reviews} limit={6} />}
    <div style={{ background: B.white, borderRadius: 14, padding: 14, border: `1px solid ${B.brd}` }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><Logo size={40} /><div><div style={{ fontSize: 13, fontWeight: 700, color: B.charcoal }}>Chris Patterson</div><a href="https://instagram.com/Chrispattersonre" target="_blank" rel="noopener" style={{ fontSize: 10, color: B.purple, textDecoration: "none", fontWeight: 600 }}>{IG}</a></div></div><div style={{ fontSize: 11, color: B.slate, lineHeight: 1.6, fontStyle: "italic", marginBottom: 10 }}>"I connect people to homes, community, and opportunities."</div><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><CallBtn full style={{ flex: 1, justifyContent: "center" }} /><TextBtn style={{ flex: 1, justifyContent: "center" }} /><IgBtn style={{ flex: "1 1 48%", justifyContent: "center" }} /><EmailBtn style={{ flex: "1 1 48%", justifyContent: "center" }} /></div></div>
  </div>);
}

function EventsScreen({ events }) {
  const [f, setF] = useState("All");
  const cats = ["All", ...new Set(events.map(e => e.category).filter(Boolean))];
  const list = f === "All" ? events : events.filter(e => e.category === f);
  return (<div style={{ background: B.off, minHeight: "100%", paddingBottom: 90 }}><div style={{ padding: "16px 14px 10px" }}><div style={{ fontFamily: "var(--hf)", fontSize: 20, fontWeight: 700, color: B.charcoal }}>Events</div><div style={{ fontSize: 11, color: B.dim, marginTop: 2 }}>Fresno & Clovis · {events.length} upcoming</div><div style={{ display: "flex", gap: 5, overflowX: "auto", marginTop: 10, scrollbarWidth: "none" }}>{cats.map(c => (<button key={c} onClick={() => setF(c)} style={{ padding: "6px 12px", borderRadius: 18, border: `1px solid ${f === c ? B.gold : B.brd}`, fontSize: 10, fontWeight: f === c ? 700 : 400, background: f === c ? `${B.gold}15` : B.white, color: f === c ? B.gold : B.slate, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{c}</button>))}</div></div><div style={{ padding: "0 14px" }}>{list.map((e, i) => (<div key={i} style={{ background: B.white, borderRadius: 14, padding: 14, marginBottom: 8, border: `1px solid ${B.brd}`, position: "relative", overflow: "hidden" }}>{e.is_hot && <div style={{ position: "absolute", top: 0, right: 0, padding: "3px 10px 3px 14px", background: B.danger, borderRadius: "0 0 0 10px", fontSize: 7, fontWeight: 700, color: B.white, letterSpacing: 1 }}>TRENDING</div>}<div style={{ display: "flex", gap: 12 }}><div style={{ width: 46, height: 46, borderRadius: 12, background: `${catC[e.category] || B.gold}10`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><div style={{ fontSize: 12, fontWeight: 700, color: catC[e.category] || B.gold }}>{e.date_display?.split(" ")[0]}</div><div style={{ fontSize: 8, color: B.dim }}>{e.date_display?.split(" ")[1]}</div></div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: B.charcoal }}>{e.name}</div><div style={{ fontSize: 10, color: B.dim, marginTop: 1 }}>{e.area}</div><div style={{ fontSize: 11, color: B.slate, lineHeight: 1.5, marginTop: 4 }}>{e.description}</div><div style={{ display: "flex", gap: 5, marginTop: 6 }}><Bdg color={catC[e.category] || B.gold}>{e.category}</Bdg>{e.is_free && <Bdg color={B.success}>FREE</Bdg>}</div></div></div></div>))}{list.length === 0 && <div style={{ textAlign: "center", padding: 30, color: B.dim }}>No events in this category.</div>}</div></div>);
}

function ExploreScreen({ businesses, vendors }) {
  const [q, setQ] = useState(""); const [mode, setMode] = useState("spots");
  const spotR = useMemo(() => { if (!q) return businesses; const lc = q.toLowerCase(); return businesses.filter(b => (b.name||"").toLowerCase().includes(lc) || (b.area||"").toLowerCase().includes(lc) || (b.category||"").toLowerCase().includes(lc)); }, [q, businesses]);
  const vendR = useMemo(() => { if (!q) return vendors; const lc = q.toLowerCase(); return vendors.filter(v => (v.name||"").toLowerCase().includes(lc) || (v.category||"").toLowerCase().includes(lc) || (v.description||"").toLowerCase().includes(lc)); }, [q, vendors]);
  const results = mode === "spots" ? spotR : vendR;
  const sCats = [{ em: "🍽️", l: "Restaurant" }, { em: "☕", l: "Coffee" }, { em: "🍦", l: "Dessert" }, { em: "💪", l: "Fitness" }, { em: "🥞", l: "Brunch" }, { em: "🛍️", l: "Shopping" }, { em: "🍸", l: "Nightlife" }, { em: "💆", l: "Wellness" }];
  const vCats = [{ em: "🏗️", l: "Builder" }, { em: "🔍", l: "Home Inspector" }, { em: "🏠", l: "Roofing" }, { em: "❄️", l: "HVAC" }, { em: "🧹", l: "Cleaning" }, { em: "🔨", l: "Handyman" }, { em: "🎨", l: "Home Staging" }, { em: "📋", l: "Escrow/Title" }];
  const qc = mode === "spots" ? sCats : vCats;
  return (<div style={{ background: B.off, minHeight: "100%", paddingBottom: 90 }}>
    <div style={{ padding: "16px 14px 8px" }}><div style={{ fontFamily: "var(--hf)", fontSize: 20, fontWeight: 700, color: B.charcoal, marginBottom: 10 }}>Explore</div><div style={{ position: "relative", marginBottom: 10 }}><input value={q} onChange={e => setQ(e.target.value)} placeholder={mode === "spots" ? "Search spots..." : "Search vendors..."} style={{ width: "100%", padding: "11px 14px 11px 36px", borderRadius: 12, border: `1px solid ${B.brd}`, fontSize: 13, fontFamily: "inherit", background: B.white, outline: "none", boxSizing: "border-box", color: B.charcoal }} /><span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14 }}>🔍</span>{q && <button onClick={() => setQ("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: B.dim, fontSize: 16, cursor: "pointer" }}>×</button>}</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>{["spots", "vendors"].map(m => (<button key={m} onClick={() => { setMode(m); setQ(""); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: `1px solid ${mode === m ? B.gold : B.brd}`, fontSize: 12, fontWeight: mode === m ? 700 : 400, background: mode === m ? `${B.gold}15` : B.white, color: mode === m ? B.gold : B.slate, cursor: "pointer", fontFamily: "inherit" }}>{m === "spots" ? `Spots (${businesses.length})` : `Vendors (${vendors.length})`}</button>))}</div></div>
    {!q && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, padding: "0 14px", marginBottom: 12 }}>{qc.map((c, i) => (<button key={i} onClick={() => setQ(c.l)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 2px", background: B.white, borderRadius: 10, border: `1px solid ${B.brd}`, cursor: "pointer", fontFamily: "inherit" }}><span style={{ fontSize: 18 }}>{c.em}</span><span style={{ fontSize: 8, fontWeight: 600, color: B.slate }}>{c.l}</span></button>))}</div>}
    <div style={{ padding: "0 14px" }}><div style={{ fontSize: 10, fontWeight: 700, color: B.dim, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>{q ? `${results.length} results` : `All ${mode}`}</div>
      {mode === "spots" && spotR.map((b, i) => (<div key={i} style={{ display: "flex", gap: 10, background: B.white, borderRadius: 12, padding: 11, marginBottom: 6, border: `1px solid ${B.brd}`, alignItems: "center" }}><div style={{ width: 38, height: 38, borderRadius: 10, background: `${catC[b.category] || B.gold}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{catEmoji[b.category] || "📍"}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12, fontWeight: 700, color: B.charcoal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</div><div style={{ fontSize: 10, color: B.dim }}>{b.area} · ★ {b.rating}</div></div><Bdg color={catC[b.category] || B.gold}>{b.tag || b.category}</Bdg></div>))}
      {mode === "vendors" && vendR.map((v, i) => (<div key={i} style={{ display: "flex", gap: 10, background: B.white, borderRadius: 12, padding: 11, marginBottom: 6, border: `1px solid ${B.brd}`, alignItems: "center" }}><div style={{ width: 38, height: 38, borderRadius: 10, background: `${catC[v.category] || B.slate}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{catEmoji[v.category] || "📍"}</div><div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: B.charcoal }}>{v.name}</div><div style={{ fontSize: 10, color: B.dim }}>{v.category}</div></div><a href={`tel:${v.phone?.replace(/\D/g,"")}`} style={{ fontSize: 10, fontWeight: 600, color: B.success, textDecoration: "none" }}>Call</a></div>))}
      {results.length === 0 && <div style={{ textAlign: "center", padding: 30, color: B.dim }}>No results for "{q}"</div>}
    </div>
  </div>);
}

function Quiz({ go }) {
  const [step, setStep] = useState(0); const [answers, setAnswers] = useState([]); const [others, setOthers] = useState({}); const [done, setDone] = useState(false);
  const pick = useCallback(async (idx) => { const next = [...answers, idx]; setAnswers(next); if (step < QUIZ.length - 1) setStep(s => s + 1); else { setDone(true); await dbInsert("quiz_responses", { answers: next, other_answers: others, top_match: HOODS[0].name }); } }, [answers, step, others]);
  if (done) return (<div style={{ background: B.off, minHeight: "100%", paddingBottom: 90 }}><div style={{ background: `linear-gradient(160deg, ${B.black}, #151725)`, padding: "18px 14px 22px", borderRadius: "0 0 22px 22px" }}><div style={{ fontSize: 10, color: B.gold, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>YOUR RESULTS</div><div style={{ fontFamily: "var(--hf)", fontSize: 20, fontWeight: 700, color: B.white }}>Neighborhood matches</div></div><div style={{ padding: "12px 14px" }}>{HOODS.map((n, i) => (<div key={i} style={{ background: B.white, borderRadius: 16, padding: 14, marginBottom: 10, border: `1px solid ${B.brd}` }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 24 }}>{n.img}</span><div><div style={{ fontSize: 14, fontWeight: 700, color: B.charcoal }}>{n.name}</div><div style={{ fontSize: 11, color: B.gold }}>{n.vibe}</div></div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 18, fontWeight: 700, color: n.match >= 90 ? B.success : n.match >= 80 ? B.medBlue : B.slate }}>{n.match}%</div><div style={{ fontSize: 7, fontWeight: 700, color: B.dim }}>MATCH</div></div></div><div style={{ fontSize: 11, color: B.slate, lineHeight: 1.5, marginBottom: 8 }}>{n.desc}</div><div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}><Bdg color={B.medBlue}>Schools: {n.schools}</Bdg><Bdg color={B.slate}>{n.commute} commute</Bdg><Bdg color={B.gold}>Median: {n.median}</Bdg></div>{n.highlights && <div style={{ padding: "7px 10px", background: `${B.gold}08`, borderRadius: 8, marginBottom: 8 }}>{n.highlights.map((h, j) => <div key={j} style={{ fontSize: 10, color: B.slate, lineHeight: 1.6 }}>· {h}</div>)}</div>}{i === 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}><CallBtn full style={{ flex: 1, justifyContent: "center" }} /><TextBtn style={{ flex: 1, justifyContent: "center" }} /><IgBtn style={{ flex: "1 1 48%", justifyContent: "center" }} /><EmailBtn style={{ flex: "1 1 48%", justifyContent: "center" }} /></div>}</div>))}<button onClick={() => { setDone(false); setStep(0); setAnswers([]); setOthers({}); }} style={{ width: "100%", padding: "11px", background: "transparent", border: `1px solid ${B.brd}`, borderRadius: 12, fontSize: 12, fontWeight: 600, color: B.slate, cursor: "pointer", fontFamily: "inherit", marginBottom: 6 }}>Retake quiz</button><button onClick={() => go("home")} style={{ width: "100%", padding: "11px", background: B.charcoal, border: "none", borderRadius: 12, fontSize: 12, fontWeight: 600, color: B.white, cursor: "pointer", fontFamily: "inherit" }}>← Home</button></div></div>);
  const qd = QUIZ[step];
  return (<div style={{ background: `linear-gradient(170deg, ${B.black}, #151725, ${B.charcoal})`, minHeight: "100%", display: "flex", flexDirection: "column", padding: "22px 16px 34px" }}><div style={{ display: "flex", gap: 3, marginBottom: 24 }}>{QUIZ.map((_, i) => <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? B.gold : "rgba(255,255,255,0.1)" }} />)}</div><div style={{ fontSize: 10, color: B.gold, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Question {step + 1} of {QUIZ.length}</div><div style={{ fontFamily: "var(--hf)", fontSize: 20, fontWeight: 600, color: B.white, lineHeight: 1.3, marginBottom: 24 }}>{qd.q}</div><div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{qd.opts.map((opt, i) => (<button key={i} onClick={() => pick(i)} style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 13, color: B.white, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>{opt}</button>))}<div style={{ position: "relative" }}><input value={others[step] || ""} onChange={e => setOthers(o => ({ ...o, [step]: e.target.value }))} placeholder="Other — type your answer..." style={{ width: "100%", padding: "14px 80px 14px 16px", background: "rgba(255,255,255,0.05)", border: `1px solid ${others[step] ? B.gold : "rgba(255,255,255,0.1)"}`, borderRadius: 12, fontSize: 13, color: B.white, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />{others[step] && <button onClick={() => pick(-1)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", padding: "6px 14px", background: B.gold, border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, color: B.black, cursor: "pointer" }}>Submit</button>}</div></div>{step > 0 && <button onClick={() => { setStep(s => s - 1); setAnswers(a => a.slice(0, -1)); }} style={{ marginTop: 14, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>}</div>);
}

function CostCalc({ go }) {
  const [city, setCity] = useState("San Francisco"); const fr = COL["Fresno/Clovis"]; const co = COL[city];
  const pct = (a, b) => Math.round(((b - a) / b) * 100); const sv = (a, b) => `$${(b - a).toLocaleString()}`;
  return (<div style={{ background: B.off, minHeight: "100%", paddingBottom: 90 }}><div style={{ background: B.black, padding: "16px 16px 20px", borderRadius: "0 0 22px 22px" }}><button onClick={() => go("home")} style={{ background: "none", border: "none", color: B.gold, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: 0, marginBottom: 10 }}>← Back</button><div style={{ fontFamily: "var(--hf)", fontSize: 20, fontWeight: 700, color: B.white }}>Cost of living calculator</div><div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>{Object.keys(COL).filter(c => c !== "Fresno/Clovis").map(c => (<button key={c} onClick={() => setCity(c)} style={{ padding: "7px 12px", borderRadius: 18, border: `1px solid ${city === c ? B.gold : "rgba(255,255,255,0.1)"}`, fontSize: 11, fontWeight: city === c ? 700 : 400, background: city === c ? `${B.gold}20` : "transparent", color: city === c ? B.gold : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>{c}</button>))}</div></div><div style={{ padding: "14px 14px" }}><div style={{ background: `linear-gradient(135deg, ${B.success}10, ${B.gold}08)`, borderRadius: 16, padding: 18, marginBottom: 14, textAlign: "center" }}><div style={{ fontSize: 12, color: B.success, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>You could save</div><div style={{ fontSize: 32, fontWeight: 700, color: B.success, marginTop: 4 }}>{sv(fr.median, co.median)}</div><div style={{ fontSize: 12, color: B.slate }}>on a home purchase alone</div></div>{[{ l: "Median Home", a: `$${co.median.toLocaleString()}`, b: `$${fr.median.toLocaleString()}`, d: pct(fr.median, co.median) },{ l: "Rent (1BR)", a: `$${co.rent}/mo`, b: `$${fr.rent}/mo`, d: pct(fr.rent, co.rent) },{ l: "Groceries", a: `$${co.groceries}`, b: `$${fr.groceries}`, d: pct(fr.groceries, co.groceries) },{ l: "Gas/gal", a: `$${co.gas.toFixed(2)}`, b: `$${fr.gas.toFixed(2)}`, d: pct(fr.gas, co.gas) },{ l: "Dinner out", a: `$${co.dining}`, b: `$${fr.dining}`, d: pct(fr.dining, co.dining) },{ l: "Utilities", a: `$${co.utilities}`, b: `$${fr.utilities}`, d: pct(fr.utilities, co.utilities) }].map((r, i) => (<div key={i} style={{ background: B.white, borderRadius: 12, padding: 12, marginBottom: 8, border: `1px solid ${B.brd}` }}><div style={{ fontSize: 11, color: B.dim, fontWeight: 600, marginBottom: 6 }}>{r.l}</div><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 10, color: B.dim }}>{city}</div><div style={{ fontSize: 15, fontWeight: 700, color: B.charcoal }}>{r.a}</div></div><div style={{ padding: "4px 10px", borderRadius: 8, background: r.d > 0 ? `${B.success}15` : `${B.danger}15`, fontSize: 12, fontWeight: 700, color: r.d > 0 ? B.success : B.danger }}>{r.d > 0 ? `${r.d}% less` : `${Math.abs(r.d)}% more`}</div><div style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 10, color: B.dim }}>Fresno</div><div style={{ fontSize: 15, fontWeight: 700, color: B.success }}>{r.b}</div></div></div></div>))}<button onClick={() => go("quiz")} style={{ width: "100%", padding: "14px", background: B.gold, border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, color: B.black, cursor: "pointer", fontFamily: "inherit", marginTop: 6 }}>Find my neighborhood →</button></div></div>);
}

function Connect({ go, reviews }) {
  return (<div style={{ background: B.off, minHeight: "100%", paddingBottom: 90 }}><div style={{ background: `linear-gradient(160deg, ${B.black}, #151725)`, padding: "18px 14px 26px", borderRadius: "0 0 22px 22px", textAlign: "center" }}><Logo size={48} light /><div style={{ fontSize: 17, fontWeight: 700, color: B.white, marginTop: 10 }}>Chris Patterson</div><div style={{ fontSize: 11, color: B.gold, marginTop: 3 }}>Fresno · Clovis · Madera · Mariposa</div><a href="https://instagram.com/Chrispattersonre" target="_blank" rel="noopener" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: B.purple, textDecoration: "none", fontWeight: 600, marginTop: 6 }}>📷 {IG}</a><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Real Broker — Trafton Home Team · DRE #02097979</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{EMAIL}</div><div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}><CallBtn full /><TextBtn /><EmailBtn /><IgBtn /></div></div><div style={{ padding: "14px 14px" }}><SH label="I can help with" />{[{ em: "🏠", t: "Buy a home", d: "First-time or move-up" },{ em: "📋", t: "Sell your home", d: "Market analysis & listing" },{ em: "💰", t: "Investment", d: "Rental analysis, ADUs" },{ em: "🔑", t: "Relocation", d: "Full support" },{ em: "🤝", t: "Agent referral", d: "25% on closed deals" }].map((s, i) => (<div key={i} style={{ display: "flex", gap: 10, background: B.white, borderRadius: 12, padding: 12, marginBottom: 6, border: `1px solid ${B.brd}`, alignItems: "center" }}><span style={{ fontSize: 22, width: 36, textAlign: "center", flexShrink: 0 }}>{s.em}</span><div><div style={{ fontSize: 12, fontWeight: 700, color: B.charcoal }}>{s.t}</div><div style={{ fontSize: 10, color: B.dim }}>{s.d}</div></div></div>))}<div style={{ display: "flex", gap: 8, marginTop: 10 }}><button onClick={() => go("referral")} style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg, ${B.charcoal}, ${B.black})`, border: "none", borderRadius: 12, fontSize: 11, fontWeight: 700, color: B.gold, cursor: "pointer", fontFamily: "inherit" }}>Submit referral</button><button onClick={() => go("partner")} style={{ flex: 1, padding: "12px", background: `${B.gold}15`, border: `1px solid ${B.gold}30`, borderRadius: 12, fontSize: 11, fontWeight: 700, color: B.gold, cursor: "pointer", fontFamily: "inherit" }}>Become a partner</button></div>{reviews.length > 0 && <div style={{ marginTop: 16 }}><ReviewCards reviews={reviews} /></div>}</div></div>);
}

function Admin({ onExit }) {
  const [pw, setPw] = useState(""); const [auth, setAuth] = useState(false);
  const [tab, setTab] = useState("referrals");
  const [data, setData] = useState({ referrals: [], partners: [], events: [], businesses: [], vendors: [], reviews: [], quiz: [] });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(null);
  const [form, setForm] = useState({});
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const load = async () => {
    setLoading(true);
    const [referrals, partners, events, businesses, vendors, reviews, quiz] = await Promise.all([
      dbGet("referrals", "order=created_at.desc"),
      dbGet("partner_applications", "order=created_at.desc"),
      dbGet("events", "order=date_sort.asc"),
      dbGet("businesses", "order=created_at.desc"),
      dbGet("vendors", "order=name.asc"),
      dbGet("reviews", "order=created_at.desc"),
      dbGet("quiz_responses", "order=created_at.desc"),
    ]);
    setData({ referrals, partners, events, businesses, vendors, reviews, quiz });
    setLoading(false);
  };

  useEffect(() => { if (auth) load(); }, [auth]);

  if (!auth) return (
    <div style={{ minHeight: "100vh", background: B.black, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <Logo size={48} light />
      <div style={{ fontFamily: "var(--hf)", fontSize: 22, fontWeight: 700, color: B.white, marginTop: 16, marginBottom: 4 }}>Admin dashboard</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>Enter your password</div>
      <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && pw === ADMIN_PASS) setAuth(true); }} placeholder="Password" style={{ width: "100%", maxWidth: 280, padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, fontSize: 15, color: B.white, fontFamily: "inherit", outline: "none", textAlign: "center", boxSizing: "border-box", marginBottom: 12 }} />
      <button onClick={() => { if (pw === ADMIN_PASS) setAuth(true); else alert("Wrong password"); }} style={{ width: "100%", maxWidth: 280, padding: "12px", background: B.gold, border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: B.black, cursor: "pointer", fontFamily: "inherit" }}>Log in</button>
      <button onClick={onExit} style={{ marginTop: 16, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>← Back to app</button>
    </div>
  );

  const tabs = [
    { id: "referrals", l: "Referrals", count: data.referrals.length },
    { id: "partners", l: "Partners", count: data.partners.length },
    { id: "events", l: "Events", count: data.events.length },
    { id: "businesses", l: "Businesses", count: data.businesses.length },
    { id: "vendors", l: "Vendors", count: data.vendors.length },
    { id: "reviews", l: "Reviews", count: data.reviews.length },
    { id: "quiz", l: "Quiz", count: data.quiz.length },
  ];

  const card = (children, extra = {}) => <div style={{ background: B.white, borderRadius: 12, padding: 14, marginBottom: 8, border: `1px solid ${B.brd}`, ...extra }}>{children}</div>;
  const label = (t) => <div style={{ fontSize: 10, color: B.dim, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{t}</div>;
  const val = (t) => <div style={{ fontSize: 13, fontWeight: 600, color: B.charcoal, marginBottom: 6 }}>{t || "—"}</div>;
  const statusBadge = (s) => {
    const colors = { new: B.medBlue, pending: B.orange, contacted: B.gold, approved: B.success, declined: B.danger, closed: B.success };
    return <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: `${colors[s] || B.dim}18`, color: colors[s] || B.dim, textTransform: "uppercase" }}>{s}</span>;
  };

  const statusBtn = async (table, id, newStatus) => {
    await dbUpdate(table, id, { status: newStatus });
    load();
  };

  const deleteRow = async (table, id) => {
    if (confirm("Delete this permanently?")) { await dbDelete(table, id); load(); }
  };

  const addEvent = async () => {
    await dbInsert("events", { ...form, is_hot: form.is_hot === "true", is_free: form.is_free === "true", active: true });
    setShowForm(null); setForm({}); load();
  };

  const addBiz = async () => {
    await dbInsert("businesses", { ...form, rating: parseFloat(form.rating) || 0, reviews: parseInt(form.reviews_count) || 0, featured: form.featured === "true", approved: true });
    setShowForm(null); setForm({}); load();
  };

  const addReview = async () => {
    await dbInsert("reviews", { ...form, rating: parseInt(form.rating) || 5, featured: true });
    setShowForm(null); setForm({}); load();
  };

  const inp = (l, k, ph) => <div style={{ marginBottom: 10 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: B.slate, marginBottom: 3 }}>{l}</label><input value={form[k] || ""} onChange={e => up(k, e.target.value)} placeholder={ph} style={{ width: "100%", padding: "9px 10px", border: `1px solid ${B.brd}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} /></div>;

  return (
    <div style={{ minHeight: "100vh", background: B.off, fontFamily: "'DM Sans', sans-serif", "--hf": "'Playfair Display', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ background: B.black, padding: "14px 16px 12px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Logo size={28} light /><div style={{ fontSize: 16, fontWeight: 700, color: B.white }}>Admin</div></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={load} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 11, fontWeight: 600, color: B.white, cursor: "pointer", fontFamily: "inherit" }}>Refresh</button>
            <button onClick={onExit} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, fontSize: 11, fontWeight: 600, color: B.gold, cursor: "pointer", fontFamily: "inherit" }}>Exit</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4, overflowX: "auto", scrollbarWidth: "none" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "5px 10px", borderRadius: 16, border: "none", fontSize: 10, fontWeight: tab === t.id ? 700 : 400, background: tab === t.id ? B.gold : "rgba(255,255,255,0.07)", color: tab === t.id ? B.black : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{t.l} ({t.count})</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 14px 40px" }}>
        {loading && <Spin />}

        {tab === "referrals" && !loading && <>
          <SH label="Agent referrals" />
          {data.referrals.map((r, i) => card(<div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}><div><div style={{ fontSize: 14, fontWeight: 700, color: B.charcoal }}>{r.agent_name || "Unknown"}</div><div style={{ fontSize: 11, color: B.dim }}>{r.brokerage}</div></div>{statusBadge(r.status)}</div>
            {label("Agent contact")}{val(`${r.agent_phone || ""} · ${r.agent_email || ""}`)}{label("Client")}{val(`${r.client_name || ""} · ${r.client_phone || ""}`)}{label("Timeline")}{val(r.timeline)}{label("Notes")}{val(r.notes)}
            <div style={{ fontSize: 10, color: B.dim, marginBottom: 8 }}>{new Date(r.created_at).toLocaleDateString()}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => statusBtn("referrals", r.id, "contacted")} style={{ flex: 1, padding: "7px", background: `${B.gold}15`, border: `1px solid ${B.gold}30`, borderRadius: 8, fontSize: 10, fontWeight: 700, color: B.gold, cursor: "pointer", fontFamily: "inherit" }}>Contacted</button>
              <button onClick={() => statusBtn("referrals", r.id, "closed")} style={{ flex: 1, padding: "7px", background: `${B.success}15`, border: `1px solid ${B.success}30`, borderRadius: 8, fontSize: 10, fontWeight: 700, color: B.success, cursor: "pointer", fontFamily: "inherit" }}>Closed</button>
              <button onClick={() => deleteRow("referrals", r.id)} style={{ padding: "7px 10px", background: `${B.danger}10`, border: "none", borderRadius: 8, fontSize: 10, fontWeight: 700, color: B.danger, cursor: "pointer", fontFamily: "inherit" }}>Del</button>
            </div>
          </div>))}
          {data.referrals.length === 0 && <div style={{ textAlign: "center", padding: 30, color: B.dim }}>No referrals yet</div>}
        </>}

        {tab === "partners" && !loading && <>
          <SH label="Partner applications" />
          {data.partners.map((p, i) => card(<div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}><div><div style={{ fontSize: 14, fontWeight: 700, color: B.charcoal }}>{p.business_name}</div><div style={{ fontSize: 11, color: B.dim }}>{p.tier} tier · {p.category}</div></div>{statusBadge(p.status)}</div>
            {label("Contact")}{val(`${p.contact_name} · ${p.phone} · ${p.email}`)}{label("Website")}{val(p.website)}{label("Description")}{val(p.description)}{label("Brand color")}{val(p.brand_color)}{label("Logo initials")}{val(p.logo_initials)}
            {p.deal && <>{label("Deal")}{val(p.deal)}</>}
            {p.logo_url && <div style={{ marginBottom: 8 }}>{label("Logo")}<img src={p.logo_url} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover" }} /></div>}
            <div style={{ fontSize: 10, color: B.dim, marginBottom: 8 }}>{new Date(p.created_at).toLocaleDateString()}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => statusBtn("partner_applications", p.id, "approved")} style={{ flex: 1, padding: "7px", background: `${B.success}15`, border: `1px solid ${B.success}30`, borderRadius: 8, fontSize: 10, fontWeight: 700, color: B.success, cursor: "pointer", fontFamily: "inherit" }}>Approve</button>
              <button onClick={() => statusBtn("partner_applications", p.id, "declined")} style={{ flex: 1, padding: "7px", background: `${B.danger}10`, border: `1px solid ${B.danger}30`, borderRadius: 8, fontSize: 10, fontWeight: 700, color: B.danger, cursor: "pointer", fontFamily: "inherit" }}>Decline</button>
              <button onClick={() => deleteRow("partner_applications", p.id)} style={{ padding: "7px 10px", background: `${B.danger}10`, border: "none", borderRadius: 8, fontSize: 10, fontWeight: 700, color: B.danger, cursor: "pointer", fontFamily: "inherit" }}>Del</button>
            </div>
          </div>))}
          {data.partners.length === 0 && <div style={{ textAlign: "center", padding: 30, color: B.dim }}>No applications yet</div>}
        </>}

        {tab === "events" && !loading && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><SH label="Events" /><button onClick={() => { setShowForm("event"); setForm({ is_hot: "false", is_free: "false" }); }} style={{ padding: "6px 14px", background: B.gold, border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, color: B.black, cursor: "pointer", fontFamily: "inherit" }}>+ Add event</button></div>
          {showForm === "event" && card(<div>
            {inp("Event name", "name", "Big Hat Days")}{inp("Date display", "date_display", "Apr 25-27")}{inp("Sort date (YYYY-MM-DD)", "date_sort", "2026-04-25")}{inp("Area", "area", "Old Town Clovis")}{inp("Category", "category", "Festival")}{inp("Description", "description", "...")}
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: B.slate }}><input type="checkbox" checked={form.is_hot === "true"} onChange={e => up("is_hot", e.target.checked ? "true" : "false")} /> Trending</label>
              <label style={{ fontSize: 11, color: B.slate }}><input type="checkbox" checked={form.is_free === "true"} onChange={e => up("is_free", e.target.checked ? "true" : "false")} /> Free</label>
            </div>
            <div style={{ display: "flex", gap: 6 }}><button onClick={addEvent} style={{ flex: 1, padding: "9px", background: B.gold, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: B.black, cursor: "pointer", fontFamily: "inherit" }}>Save event</button><button onClick={() => setShowForm(null)} style={{ padding: "9px 14px", background: B.off, border: `1px solid ${B.brd}`, borderRadius: 8, fontSize: 12, color: B.slate, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button></div>
          </div>, { border: `2px solid ${B.gold}` })}
          {data.events.map((e, i) => card(<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: B.charcoal }}>{e.name}</div><div style={{ fontSize: 10, color: B.dim }}>{e.date_display} · {e.area} · {e.category}</div></div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {e.is_hot && <Bdg color={B.danger}>HOT</Bdg>}
              {e.is_free && <Bdg color={B.success}>FREE</Bdg>}
              <button onClick={() => dbUpdate("events", e.id, { active: !e.active }).then(load)} style={{ padding: "4px 8px", background: e.active ? `${B.success}15` : `${B.dim}15`, border: "none", borderRadius: 6, fontSize: 9, fontWeight: 700, color: e.active ? B.success : B.dim, cursor: "pointer", fontFamily: "inherit" }}>{e.active ? "ON" : "OFF"}</button>
              <button onClick={() => deleteRow("events", e.id)} style={{ padding: "4px 8px", background: `${B.danger}10`, border: "none", borderRadius: 6, fontSize: 9, fontWeight: 700, color: B.danger, cursor: "pointer", fontFamily: "inherit" }}>×</button>
            </div>
          </div>))}
        </>}

        {tab === "businesses" && !loading && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><SH label="Businesses" /><button onClick={() => { setShowForm("biz"); setForm({ brand_color: "#CEB08E", featured: "false" }); }} style={{ padding: "6px 14px", background: B.gold, border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, color: B.black, cursor: "pointer", fontFamily: "inherit" }}>+ Add business</button></div>
          {showForm === "biz" && card(<div>
            {inp("Name", "name", "Ampersand Ice Cream")}{inp("Category", "category", "Dessert")}{inp("Area", "area", "Old Town Clovis")}{inp("Description", "description", "...")}{inp("Rating", "rating", "4.9")}{inp("Reviews count", "reviews_count", "312")}{inp("Tag", "tag", "Hidden Gem")}{inp("Brand color", "brand_color", "#CEB08E")}{inp("Logo initials", "logo_initials", "A&")}{inp("Deal (optional)", "deal", "10% off")}
            <label style={{ fontSize: 11, color: B.slate, marginBottom: 10, display: "block" }}><input type="checkbox" checked={form.featured === "true"} onChange={e => up("featured", e.target.checked ? "true" : "false")} /> Featured partner</label>
            <div style={{ display: "flex", gap: 6 }}><button onClick={addBiz} style={{ flex: 1, padding: "9px", background: B.gold, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: B.black, cursor: "pointer", fontFamily: "inherit" }}>Save business</button><button onClick={() => setShowForm(null)} style={{ padding: "9px 14px", background: B.off, border: `1px solid ${B.brd}`, borderRadius: 8, fontSize: 12, color: B.slate, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button></div>
          </div>, { border: `2px solid ${B.gold}` })}
          {data.businesses.map((b, i) => card(<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: B.charcoal }}>{b.name}</div><div style={{ fontSize: 10, color: B.dim }}>{b.area} · {b.category} · ★{b.rating}</div></div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {b.featured && <Bdg color={B.gold}>FEATURED</Bdg>}
              <button onClick={() => dbUpdate("businesses", b.id, { approved: !b.approved }).then(load)} style={{ padding: "4px 8px", background: b.approved ? `${B.success}15` : `${B.dim}15`, border: "none", borderRadius: 6, fontSize: 9, fontWeight: 700, color: b.approved ? B.success : B.dim, cursor: "pointer", fontFamily: "inherit" }}>{b.approved ? "LIVE" : "HIDDEN"}</button>
              <button onClick={() => deleteRow("businesses", b.id)} style={{ padding: "4px 8px", background: `${B.danger}10`, border: "none", borderRadius: 6, fontSize: 9, fontWeight: 700, color: B.danger, cursor: "pointer", fontFamily: "inherit" }}>×</button>
            </div>
          </div>))}
          {data.businesses.length === 0 && <div style={{ textAlign: "center", padding: 30, color: B.dim }}>No businesses yet</div>}
        </>}

        {tab === "vendors" && !loading && <>
          <SH label="Vendors" />
          {data.vendors.map((v, i) => card(<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: B.charcoal }}>{v.name}</div><div style={{ fontSize: 10, color: B.dim }}>{v.category} · {v.contact_name} · {v.phone}</div></div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button onClick={() => dbUpdate("vendors", v.id, { active: !v.active }).then(load)} style={{ padding: "4px 8px", background: v.active ? `${B.success}15` : `${B.dim}15`, border: "none", borderRadius: 6, fontSize: 9, fontWeight: 700, color: v.active ? B.success : B.dim, cursor: "pointer", fontFamily: "inherit" }}>{v.active ? "ON" : "OFF"}</button>
              <button onClick={() => deleteRow("vendors", v.id)} style={{ padding: "4px 8px", background: `${B.danger}10`, border: "none", borderRadius: 6, fontSize: 9, fontWeight: 700, color: B.danger, cursor: "pointer", fontFamily: "inherit" }}>×</button>
            </div>
          </div>))}
        </>}

        {tab === "reviews" && !loading && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><SH label="Reviews" /><button onClick={() => { setShowForm("review"); setForm({ rating: "5", platform: "Google" }); }} style={{ padding: "6px 14px", background: B.gold, border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, color: B.black, cursor: "pointer", fontFamily: "inherit" }}>+ Add review</button></div>
          {showForm === "review" && card(<div>
            {inp("Client name", "client_name", "Jane Smith")}{inp("Rating (1-5)", "rating", "5")}{inp("Platform", "platform", "Google")}{inp("Date display", "date_display", "2 days ago")}
            <div style={{ marginBottom: 10 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: B.slate, marginBottom: 3 }}>Review text</label><textarea value={form.review_text || ""} onChange={e => up("review_text", e.target.value)} placeholder="What they said..." rows={4} style={{ width: "100%", padding: "9px 10px", border: `1px solid ${B.brd}`, borderRadius: 8, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "none" }} /></div>
            <div style={{ display: "flex", gap: 6 }}><button onClick={addReview} style={{ flex: 1, padding: "9px", background: B.gold, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: B.black, cursor: "pointer", fontFamily: "inherit" }}>Save review</button><button onClick={() => setShowForm(null)} style={{ padding: "9px 14px", background: B.off, border: `1px solid ${B.brd}`, borderRadius: 8, fontSize: 12, color: B.slate, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button></div>
          </div>, { border: `2px solid ${B.gold}` })}
          {data.reviews.map((r, i) => card(<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: B.charcoal }}>{r.client_name}</div><div style={{ fontSize: 10, color: B.dim }}>{r.date_display} · {r.platform} · {"★".repeat(r.rating)}</div><div style={{ fontSize: 11, color: B.slate, marginTop: 4, lineHeight: 1.5 }}>{r.review_text?.slice(0, 120)}{r.review_text?.length > 120 ? "..." : ""}</div></div>
            <button onClick={() => deleteRow("reviews", r.id)} style={{ padding: "4px 8px", background: `${B.danger}10`, border: "none", borderRadius: 6, fontSize: 9, fontWeight: 700, color: B.danger, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 8 }}>×</button>
          </div>))}
        </>}

        {tab === "quiz" && !loading && <>
          <SH label="Quiz responses" />
          {data.quiz.map((q, i) => card(<div key={i}>
            <div style={{ fontSize: 10, color: B.dim, marginBottom: 4 }}>{new Date(q.created_at).toLocaleDateString()} {new Date(q.created_at).toLocaleTimeString()}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: B.charcoal, marginBottom: 4 }}>Top match: {q.top_match || "—"}</div>
            <div style={{ fontSize: 11, color: B.slate }}>Answers: {JSON.stringify(q.answers)}</div>
            {q.other_answers && Object.keys(q.other_answers).length > 0 && <div style={{ fontSize: 11, color: B.gold, marginTop: 4 }}>Custom answers: {JSON.stringify(q.other_answers)}</div>}
          </div>))}
          {data.quiz.length === 0 && <div style={{ textAlign: "center", padding: 30, color: B.dim }}>No quiz responses yet</div>}
        </>}
      </div>
    </div>
  );
}

export default function App() {
  const [scr, setScr] = useState(() => { if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "1") return "admin"; return "splash"; });
  const [nav, setNav] = useState("home");
  const [businesses, setBiz] = useState([]); const [events, setEv] = useState([]); const [vendors, setVen] = useState([]); const [reviews, setRev] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const [b, e, v, r] = await Promise.all([
        dbGet("businesses", "approved=eq.true&order=featured.desc,rating.desc"),
        dbGet("events", "active=eq.true&order=date_sort.asc"),
        dbGet("vendors", "active=eq.true&order=name.asc"),
        dbGet("reviews", "featured=eq.true&order=created_at.desc"),
      ]);
      setBiz(b); setEv(e); setVen(v); setRev(r); setLoaded(true);
    })();
  }, []);

  const go = useCallback((id) => { if (["home", "explore", "events", "quiz", "connect"].includes(id)) setNav(id); setScr(id); }, []);
  const showNav = !["splash", "referral", "partner", "admin"].includes(scr);

  return (
    <div style={{ minHeight: "100vh", maxWidth: 480, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", "--hf": "'Playfair Display', serif", background: B.off, display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: "100vh" }}>
        <div style={{ flex: 1, overflow: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}>
          {scr === "admin" && <Admin onExit={() => { setScr("splash"); window.history.replaceState({}, "", "/"); }} />}
          {scr === "splash" && <Splash go={go} />}
          {scr === "referral" && <ReferralPortal go={go} />}
          {scr === "partner" && <PartnerOnboard go={go} />}
          {scr === "home" && <Home go={go} businesses={businesses} events={events} vendors={vendors} reviews={reviews} />}
          {scr === "explore" && <ExploreScreen businesses={businesses} vendors={vendors} />}
          {scr === "events" && <EventsScreen events={events} />}
          {scr === "quiz" && <Quiz go={go} />}
          {scr === "connect" && <Connect go={go} reviews={reviews} />}
          {scr === "calc" && <CostCalc go={go} />}
        </div>
        {showNav && <div style={{ position: "sticky", bottom: 0 }}><Nav active={nav} go={go} /></div>}
      </div>
    </div>
  );
}
