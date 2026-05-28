import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

/* ═══════════════════════════════════════════════════════════════
   shōrAI ConsultingProduction Build
   SHOURAI CONSULTING OÜTallinn · Paris 8 · Bordeaux

   EmailJS : remplissez les 3 clés ci-dessous pour activer
   l'envoi direct des formulaires de contact.
   ═══════════════════════════════════════════════════════════════ */

const CONFIG = {
  brand: "shōrAI",
  kanji: "将来",
  entity: "SHOURAI CONSULTING OÜ",
  tagline: "Conseil IA opérationnel pour PME & ETI",
  addresses: [
    { city: "Tallinn", detail: "Harju maakond, Kesklinna linnaosa, Ahtri tn 12, 15551" },
    { city: "Paris 8e", detail: "Paris, France" },
    { city: "Bordeaux", detail: "Bordeaux, France" },
  ],
  /* ─── Contact unifié shōrAI ─── */
  contact: {
    name: "shōrAI",
    email: "contact@shorai-group.com",
    calendar: "https://calendar.app.google/Mib5EFdjDi21g46s8",
  },
  emailjs: {
    serviceId: "YOUR_SERVICE_ID",
    templateId: "YOUR_TEMPLATE_ID",
    publicKey: "YOUR_PUBLIC_KEY",
  },
};

const C = {
  blue: "#3B5BDB", blueDark: "#2B4BC8", blueLight: "#EDF2FF",
  orange: "#E8790C", red: "#E03131", purple: "#7048C6",
  grad: "linear-gradient(135deg, #E8790C 0%, #E03131 35%, #7048C6 70%, #3B5BDB 100%)",
  ink: "#1a1a2e", body: "#4a4a5a", muted: "#8b8b9a",
  border: "#e9ecef", bg: "#ffffff", bgAlt: "#f8f9fa", bgDiag: "#f1f3f5",
};

const FONTS = "https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;0,8..60,900;1,8..60,400;1,8..60,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap";

const globalCSS = `
@import url('${FONTS}');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'DM Sans',system-ui,sans-serif;color:${C.ink};background:${C.bg};overflow-x:hidden;-webkit-font-smoothing:antialiased}
::selection{background:${C.blue};color:#fff}
a{color:inherit;text-decoration:none}
.serif{font-family:'Source Serif 4',Georgia,serif}
.grad-text{background:${C.grad};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.rv{opacity:0;transform:translateY(28px);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1)}
.rv.vis{opacity:1;transform:translateY(0)}
@media(max-width:860px){.desk{display:none!important}}
@media(min-width:861px){.mob{display:none!important}}
.sec{padding:96px 24px}
@media(max-width:640px){.sec{padding:64px 16px}}
.ctn{max-width:1120px;margin:0 auto;width:100%}
`;

/* ─── HOOKS ─── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("vis"); obs.unobserve(el); } }, { threshold: 0.12 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ children, style = {}, className = "" }) {
  const r = useReveal();
  return <div ref={r} className={`rv ${className}`} style={style}>{children}</div>;
}

/* ─── LOGO (vrai PNG) ─── */
function Logo() {
  return (
    <a href="#" style={{ display: "inline-flex", alignItems: "center" }}>
      <img
        src="/logo_shorai.png"
        alt="shōrAI 将来"
        style={{ height: 140, width: "auto", objectFit: "contain", display: "block" }}
      />
    </a>
  );
}

/* ─── ICONS ─── */
const I = {
  Menu: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>,
  X: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Cal: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  Arrow: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>,
  XMark: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Warn: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/></svg>,
  Chart: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  Zap: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.8"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  Target: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Shield: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  BarChart: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8"><rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="17" y="3" width="4" height="18"/></svg>,
  Map: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Clock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  Grid: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  File: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Users: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  ChevDown: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>,
  Rocket: () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="1.8"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
};

/* ─── EMAILJS ─── */
async function sendEmail(formData, toContact) {
  if (CONFIG.emailjs.serviceId === "YOUR_SERVICE_ID") {
    // Fallback mailto
    const subj = encodeURIComponent(`[shōrAI] Message de ${formData.name}`);
    const body = encodeURIComponent(`Nom : ${formData.name}\nEmail : ${formData.email}\n\n${formData.message}`);
    window.open(`mailto:${toContact.email}?subject=${subj}&body=${body}`, "_self");
    return { ok: true, fallback: true };
  }
  try {
    await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
      from_name: formData.name,
      from_email: formData.email,
      to_email: toContact.email,
      to_name: toContact.name,
      message: formData.message,
    }, CONFIG.emailjs.publicKey);
    return { ok: true };
  } catch (err) {
    console.error("EmailJS error:", err);
    return { ok: false, error: err };
  }
}

/* ═══════════════ NAV ═══════════════ */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 30); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  const links = [
    { label: "Méthode", href: "#methode" },
    { label: "Offres", href: "#offres" },
    { label: "Pré-diagnostic", href: "#diagnostic" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 172, background: scrolled ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.8)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, transition: "all .3s" }}>
        <div className="ctn" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", padding: "0 24px" }}>
          <Logo />
          <div className="desk" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {links.map(l => <a key={l.href} href={l.href} style={{ padding: "8px 16px", fontSize: 14, fontWeight: 500, color: C.ink, borderRadius: 6, transition: "background .2s" }} onMouseEnter={e => e.currentTarget.style.background = C.bgAlt} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>{l.label}</a>)}
            <a href="#contact" style={{ marginLeft: 12, padding: "10px 20px", background: C.blue, color: "#fff", borderRadius: 8, fontSize: 14, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6, transition: "background .2s" }} onMouseEnter={e => e.currentTarget.style.background = C.blueDark} onMouseLeave={e => e.currentTarget.style.background = C.blue}><I.Cal /> Réserver</a>
          </div>
          <button className="mob" onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: C.ink }}><I.Menu /></button>
        </div>
      </nav>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 198, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .3s" }} onClick={() => setOpen(false)} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(320px, 85vw)", background: "#fff", zIndex: 199, padding: "80px 28px 28px", transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .35s cubic-bezier(.22,1,.36,1)", boxShadow: open ? "-4px 0 24px rgba(0,0,0,.08)" : "none", display: "flex", flexDirection: "column", gap: 4 }}>
        <button onClick={() => setOpen(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer" }}><I.X /></button>
        {links.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ padding: "16px 0", fontSize: 17, fontWeight: 500, borderBottom: `1px solid ${C.border}` }}>{l.label}</a>)}
        <a href="#contact" onClick={() => setOpen(false)} style={{ marginTop: 20, padding: "14px", background: C.blue, color: "#fff", borderRadius: 10, textAlign: "center", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><I.Cal /> Réserver 30 min gratuit</a>
      </div>
    </>
  );
}

/* ═══════════════ HERO ═══════════════ */
function Hero() {
  return (
    <section style={{ paddingTop: 220, paddingBottom: 100, textAlign: "center", background: `linear-gradient(180deg, ${C.bgAlt} 0%, ${C.bg} 100%)` }}>
      <RevealDiv className="ctn" style={{ padding: "0 24px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 100, border: `1px solid ${C.border}`, background: "#fff", fontSize: 13, fontWeight: 500, color: C.body, marginBottom: 36 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.blue }} />
          Consulting IA · Opérationnel · Sur-mesure
        </div>
        <h1 className="serif" style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)", lineHeight: 1.1, fontWeight: 900, color: C.ink, maxWidth: 780, margin: "0 auto 28px", letterSpacing: "-0.02em" }}>
          L'IA ne remplace pas votre métier.{" "}
          <span className="grad-text serif" style={{ fontStyle: "italic" }}>Elle l'amplifie.</span>
        </h1>
        <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", lineHeight: 1.75, color: C.body, maxWidth: 620, margin: "0 auto 40px" }}>
          shōrAI identifie en 72 h les cas d'usage IA à fort ROI dans votre organisation, avec une méthode structurée, un Go/NoGo clair, et zéro zone grise.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
          <a href="#contact" style={{ padding: "14px 28px", background: C.blue, color: "#fff", borderRadius: 10, fontWeight: 600, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8, transition: "background .2s, transform .15s", boxShadow: "0 2px 12px rgba(59,91,219,.25)" }} onMouseEnter={e => { e.currentTarget.style.background = C.blueDark; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.transform = "none"; }}><I.Cal /> Réserver 30 min gratuit</a>
          <a href="#diagnostic" style={{ padding: "14px 28px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontWeight: 500, fontSize: 15, color: C.ink, display: "inline-flex", alignItems: "center", gap: 8, transition: "border-color .2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = C.blue} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>Pré-diagnostic gratuit <I.Arrow /></a>
        </div>
        <p style={{ fontSize: 13, color: C.muted }}>Sans engagement · Résultat immédiat · Confidentialité assurée</p>
      </RevealDiv>
    </section>
  );
}

/* ═══════════════ POURQUOI 90% ÉCHOUENT ═══════════════ */
const painPoints = [
  { icon: <I.Warn />, title: "Vous avez une Ferrari… sans chaîne.", desc: "Les outils IA existent, mais vos process internes ne sont pas prêts à les exploiter. Résultat : investissement sans retour." },
  { icon: <I.Chart />, title: "L'IA amplifie l'existant, le bon comme le mauvais.", desc: "Sans diagnostic, automatiser un process bancal ne fait qu'accélérer le chaos. Il faut d'abord comprendre, puis outiller." },
  { icon: <I.Zap />, title: "Le marché n'attend pas.", desc: "Vos concurrents structurent déjà leurs cas d'usage IA. Chaque trimestre perdu creuse un écart difficile à rattraper." },
];

function PainSection() {
  return (
    <section className="sec" style={{ background: C.bg }}>
      <div className="ctn">
        <RevealDiv style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, color: C.ink, marginBottom: 16 }}>
            Pourquoi <span className="grad-text">90 %</span> des projets IA échouent
          </h2>
          <p style={{ fontSize: 16, color: C.body, maxWidth: 580, margin: "0 auto" }}>Ce n'est pas un problème de technologie. C'est un problème de méthode.</p>
        </RevealDiv>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 20 }}>
          {painPoints.map((p, i) => (
            <RevealDiv key={i} style={{ padding: 32, borderRadius: 16, border: `1px solid ${C.border}`, background: "#fff", transition: "box-shadow .3s, transform .3s" }}>
              <div style={{ marginBottom: 18 }}>{p.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, lineHeight: 1.35, color: C.ink }}>{p.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.body }}>{p.desc}</p>
            </RevealDiv>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ MÉTHODE ═══════════════ */
const methodeCards = [
  { icon: <I.Target />, title: "Cadrage stratégique", desc: "Identification des cas d'usage à plus fort ROI, alignés sur vos priorités business." },
  { icon: <I.Shield />, title: "Go / NoGo factuel", desc: "Chaque cas d'usage est évalué sur faisabilité, données, risques et gain attendu. Pas d'ambiguïté." },
  { icon: <I.BarChart />, title: "Livrables actionnables", desc: "Roadmap priorisée, RACI, hypothèses documentées, KPIs de mesure, plan de conduite du changement." },
];
const engagements = [
  "Méthodologie éprouvée sur +30 missions PME / ETI",
  "Hypothèses et owners côté client toujours explicités",
  "Aucune promesse de conformité garantie, rigueur réelle",
  "Livrables actionnables, pas de slides qui dorment dans un tiroir",
];

function Methode() {
  return (
    <section id="methode" className="sec" style={{ background: C.bgAlt }}>
      <div className="ctn">
        <RevealDiv style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900 }}>La méthode <span className="grad-text serif" style={{ fontStyle: "italic" }}>shōrAI</span></h2>
          <p style={{ fontSize: 16, color: C.body, maxWidth: 560, margin: "16px auto 0" }}>Structurée, transparente, orientée résultat. Pas de slides PowerPoint qui dorment dans un tiroir.</p>
        </RevealDiv>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 20, marginBottom: 48 }}>
          {methodeCards.map((c, i) => (
            <div key={i} style={{ padding: 32, borderRadius: 16, border: `1px solid ${C.border}`, background: "#fff", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>{c.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{c.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.body }}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: "40px 36px", borderRadius: 16, border: `1px solid ${C.border}`, background: "#fff" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>Nos engagements</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "16px 40px" }}>
            {engagements.map((e, i) => <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><span style={{ flexShrink: 0, marginTop: 2 }}><I.Check /></span><span style={{ fontSize: 14, lineHeight: 1.6, color: C.body }}>{e}</span></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ OFFRES ═══════════════ */
const livrables = [
  { icon: <I.Grid />, label: "Cartographie des cas d'usage IA prioritaires" },
  { icon: <I.BarChart />, label: "Scoring ROI / faisabilité par cas d'usage" },
  { icon: <I.File />, label: "Go / NoGo documenté + hypothèses explicites" },
  { icon: <I.Users />, label: "RACI : qui fait quoi, côté client et côté shōrAI" },
  { icon: <I.Clock />, label: "Roadmap 90 jours avec KPIs de mesure" },
];
const offres = [
  { title: "Workshop Cadrage", icon: <I.Target />, accent: C.blue, duration: "2 à 3 jours · Pour les organisations prêtes à agir", items: ["Cadrage stratégique complet", "Immersion métier sur site ou distanciel", "Livrables actionnables", "Owner côté client identifié"] },
  { title: "Diagnostic IA PME", icon: <I.Shield />, accent: C.blue, duration: "Audit complet · Pour structurer vos fondations", items: ["Analyse process & données", "Quick wins identifiés", "Plan de remédiation pré-IA", "Hypothèses & méthode de mesure"] },
  { title: "Solutions IA sur Mesure", icon: <I.Rocket />, accent: C.purple, duration: "Accompagnement continu · Pour passer à l'échelle", items: ["Sélection et intégration d'outils IA adaptés", "Automatisation de processus métier ciblés", "Pilotage de la conduite du changement", "Suivi de performance et itérations"] },
];

function Offres() {
  return (
    <section id="offres" className="sec" style={{ background: C.bg }}>
      <div className="ctn">
        <RevealDiv style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900 }}>Ce que vous obtenez <span className="grad-text serif" style={{ fontStyle: "italic" }}>concrètement</span></h2>
          <p style={{ fontSize: 16, color: C.body, maxWidth: 520, margin: "16px auto 0" }}>Pas de théorie. Des livrables exploitables dès le lendemain du workshop.</p>
        </RevealDiv>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 56 }}>
          {livrables.map((l, i) => <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 12, border: `1px solid ${C.border}`, background: "#fff", fontSize: 14, fontWeight: 500, color: C.ink }}>{l.icon}{l.label}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 24 }}>
          {offres.map((o, i) => (
            <div key={i} style={{ padding: 36, borderRadius: 16, border: `1px solid ${C.border}`, background: "#fff", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ color: o.accent }}>{o.icon}</div>
                <h3 className="serif" style={{ fontSize: 20, fontWeight: 700, color: o.accent }}>{o.title}</h3>
              </div>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>{o.duration}</p>
              <div style={{ flex: 1 }}>
                {o.items.map((item, j) => <div key={j} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}><I.Check /><span style={{ fontSize: 14, color: C.body }}>{item}</span></div>)}
              </div>
              <a href="#contact" style={{ marginTop: 20, padding: "12px 20px", borderRadius: 10, border: `1.5px solid ${o.accent}`, color: o.accent, fontSize: 14, fontWeight: 600, textAlign: "center", transition: "all .2s", display: "block" }}
                onMouseEnter={e => { e.currentTarget.style.background = o.accent; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = o.accent; }}>En savoir plus</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ ANTI-ZONE GRISE ═══════════════ */
const inclus = ["Périmètre documenté et signé avant démarrage", "RACI explicite : vos responsabilités vs les nôtres", "Hypothèses listées, pas de suppositions cachées", "KPIs de mesure définis dès le cadrage", "Owner côté client nommé pour chaque livrable", "Processus de change control formalisé"];
const exclus = ["Promesses de « risque zéro » ou « conformité garantie »", "Implémentation technique (code, déploiement)", "Formation des équipes (périmètre séparé)", "Maintenance ou support continu"];

function AntiZoneGrise() {
  return (
    <section className="sec" style={{ background: C.bgAlt }}>
      <div className="ctn">
        <RevealDiv style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900 }}>Méthode <span className="grad-text serif" style={{ fontStyle: "italic" }}>anti-zone grise</span></h2>
          <p style={{ fontSize: 16, color: C.body, maxWidth: 540, margin: "16px auto 0" }}>Pas d'ambiguïté. Chaque engagement est documenté, chaque responsabilité est claire.</p>
        </RevealDiv>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 24 }}>
          <div style={{ padding: 32, borderRadius: 16, border: `1px solid ${C.border}`, background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}><I.Check /><h3 style={{ fontSize: 18, fontWeight: 700 }}>Inclus</h3></div>
            {inclus.map((t, i) => <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}><span style={{ flexShrink: 0, marginTop: 2 }}><I.Check /></span><span style={{ fontSize: 14, lineHeight: 1.6, color: C.body }}>{t}</span></div>)}
          </div>
          <div style={{ padding: 32, borderRadius: 16, border: "1px solid #fce4e4", background: "#fffbfb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}><I.XMark /><h3 style={{ fontSize: 18, fontWeight: 700 }}>Exclus</h3></div>
            {exclus.map((t, i) => <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}><span style={{ flexShrink: 0, marginTop: 2 }}><I.XMark /></span><span style={{ fontSize: 14, lineHeight: 1.6, color: C.body }}>{t}</span></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ PRÉ-DIAGNOSTIC ═══════════════ */
const quizQ = [
  { q: "Quelle est la taille de votre entreprise ?", opts: ["10 – 49 salariés", "50 – 249 salariés", "250 – 1 000 salariés", "1 000+ salariés"], scores: [1, 2, 3, 3], dim: "size", people: [5, 15, 40, 100] },
  { q: "Quel est votre secteur d'activité ?", opts: ["Industrie / Manufacturing", "Services / Conseil", "Commerce / Distribution", "Autre"], scores: [0, 0, 0, 0], dim: "sector" },
  { q: "Où en êtes-vous avec l'IA ?", opts: ["On n'a rien fait encore", "Quelques expérimentations isolées", "Des projets pilotes en cours", "Déploiement à l'échelle"], scores: [0, 1, 2, 3], dim: "maturity" },
  { q: "Quel est votre principal enjeu ?", opts: ["Réduire les coûts opérationnels", "Accélérer les process", "Améliorer l'expérience client", "Créer de nouveaux produits / services"], scores: [0, 0, 0, 0], dim: "goal" },
  { q: "Avez-vous des données structurées exploitables ?", opts: ["Pas vraiment, c'est le chaos", "Quelques bases de données", "Oui, assez bien organisées", "Data warehouse en place"], scores: [0, 1, 2, 3], dim: "data" },
  { q: "Quel budget envisagez-vous pour un premier cadrage ?", opts: ["< 3 000 €", "3 000 – 6 000 €", "6 000 – 15 000 €", "> 15 000 €"], scores: [1, 2, 3, 3], dim: "budget" },
  { q: "Quel est votre horizon de décision ?", opts: ["Immédiat (< 1 mois)", "Court terme (1–3 mois)", "Moyen terme (3–6 mois)", "Exploration sans urgence"], scores: [3, 2, 1, 0], dim: "urgency" },
  { q: "Qui porte le sujet IA dans votre organisation ?", opts: ["Le dirigeant / CEO", "Le DSI / CTO", "Un responsable métier", "Personne encore"], scores: [3, 2, 1, 0], dim: "sponsor" },
];

function getProfile(answers) {
  let score = 0, dims = {};
  answers.forEach((optIdx, qIdx) => {
    const q = quizQ[qIdx];
    score += q.scores[optIdx];
    dims[q.dim] = { idx: optIdx, label: q.opts[optIdx] };
  });
  const peopleDefault = quizQ[0].people[answers[0]] || 5;
  let profile, color, icon, offer, offerDesc, phrase;
  if (score <= 6) {
    profile = "Explorateur"; color = C.orange; icon = "🔍";
    offer = "Flash Diag"; offerDesc = "Un diagnostic express de 2h pour identifier vos premiers cas d'usage IA et valider le potentiel.";
  } else if (score <= 12) {
    profile = "Prêt à agir"; color = C.blue; icon = "🎯";
    offer = "Workshop Cadrage"; offerDesc = "2 à 3 jours pour cadrer votre stratégie IA avec des livrables actionnables et une roadmap claire.";
  } else {
    profile = "Accélérateur"; color = C.purple; icon = "🚀";
    offer = "Diagnostic complet"; offerDesc = "Audit approfondi de vos process et données, scoring ROI par cas d'usage, plan d'implémentation.";
  }
  const sector = dims.sector?.label || "";
  const maturity = dims.maturity?.label?.toLowerCase() || "";
  if (score <= 6) phrase = `En tant qu'entreprise ${sector.toLowerCase()} qui n'a ${maturity === "on n'a rien fait encore" ? "pas encore exploré l'IA" : "commencé à explorer l'IA"}, le plus efficace est de valider rapidement le potentiel avant d'investir.`;
  else if (score <= 12) phrase = `Avec ${maturity} et des données ${dims.data?.label?.toLowerCase() || "existantes"}, vous êtes dans une position idéale pour structurer votre démarche IA.`;
  else phrase = `Votre maturité IA et votre niveau de structuration data vous permettent d'accélérer. Il s'agit maintenant de maximiser le ROI sur les bons cas d'usage.`;
  return { score, maxScore: 18, profile, color, icon, offer, offerDesc, phrase, peopleDefault, dims };
}

function MiniCalculator({ defaultPeople }) {
  const [people, setPeople] = useState(defaultPeople);
  const [minutes, setMinutes] = useState(15);
  const [frequency, setFrequency] = useState(5);
  const hourly = 50;
  const weeklyGain = (minutes / 60) * frequency * people * hourly;
  const yearlyGain = weeklyGain * 47;
  const yearlyHours = Math.round((minutes / 60) * frequency * people * 47);
  const fmtEUR = (n) => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans',sans-serif", outline: "none", background: C.bgAlt, textAlign: "center" };
  return (
    <div style={{ marginTop: 28, padding: 24, borderRadius: 16, border: `1px solid ${C.border}`, background: C.bgAlt, textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <I.BarChart />
        <span style={{ fontWeight: 700, fontSize: 15 }}>Estimation rapide du gain</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div>
          <label style={{ fontSize: 12, color: C.muted, fontWeight: 500, display: "block", marginBottom: 6 }}>Personnes</label>
          <input type="number" min="1" value={people} onChange={e => setPeople(Math.max(1, +e.target.value))} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: C.muted, fontWeight: 500, display: "block", marginBottom: 6 }}>Min / tâche</label>
          <input type="number" min="1" value={minutes} onChange={e => setMinutes(Math.max(1, +e.target.value))} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, color: C.muted, fontWeight: 500, display: "block", marginBottom: 6 }}>Fois / semaine</label>
          <input type="number" min="1" value={frequency} onChange={e => setFrequency(Math.max(1, +e.target.value))} style={inputStyle} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: 16, borderRadius: 12, background: "#fff", border: `1px solid ${C.border}`, textAlign: "center" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", color: C.muted, letterSpacing: "0.06em", marginBottom: 4 }}>Gain annuel estimé</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.blue }}>{fmtEUR(yearlyGain)}</div>
          <div style={{ fontSize: 12, color: C.muted }}>{yearlyHours} heures libérées / an</div>
        </div>
        <div style={{ padding: 16, borderRadius: 12, background: "#fff", border: `1px solid ${C.border}`, textAlign: "center" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", color: C.muted, letterSpacing: "0.06em", marginBottom: 4 }}>Gain hebdo</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: C.blue }}>{fmtEUR(weeklyGain)}</div>
          <div style={{ fontSize: 12, color: C.muted }}>sur base de {hourly}€/h chargé</div>
        </div>
      </div>
      <p style={{ fontSize: 12, color: C.muted, marginTop: 12, lineHeight: 1.5, textAlign: "center" }}>Estimation indicative sur 47 semaines. Pour une analyse détaillée avec payback et comparatif :</p>
      <a href="/serviette.html" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10, padding: "12px 20px", borderRadius: 10, border: `1.5px solid ${C.blue}`, color: C.blue, fontWeight: 600, fontSize: 14, transition: "all .2s", background: "#fff" }} onMouseEnter={e => { e.currentTarget.style.background = C.blueLight; }} onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
        <I.Chart /> Affiner avec le test de la serviette
        <I.Arrow />
      </a>
    </div>
  );
}

function PreDiagnostic() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const handleAnswer = (optIdx) => { const n = [...answers, optIdx]; setAnswers(n); if (step < quizQ.length - 1) setStep(step + 1); else setDone(true); };
  const pct = Math.round((step / quizQ.length) * 100);
  const result = done ? getProfile(answers) : null;
  return (
    <section id="diagnostic" className="sec" style={{ background: C.bgAlt }}>
      <div className="ctn">
        <RevealDiv style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="serif" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900 }}>Pré-diagnostic <span className="grad-text serif" style={{ fontStyle: "italic" }}>gratuit</span></h2>
          <p style={{ fontSize: 16, color: C.body }}>8 questions · 2 minutes · Recommandation personnalisée</p>
        </RevealDiv>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "clamp(24px, 5vw, 48px)", borderRadius: 20, border: `1px solid ${C.border}`, background: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,.04)" }}>
          {!done ? (<>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: C.muted, marginBottom: 12 }}><span>Question {step + 1} / {quizQ.length}</span><span>{pct}%</span></div>
            <div style={{ height: 4, borderRadius: 2, background: C.bgDiag, marginBottom: 28 }}><div style={{ height: "100%", width: `${pct}%`, background: C.blue, borderRadius: 2, transition: "width .4s" }} /></div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, lineHeight: 1.4 }}>{quizQ[step].q}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {quizQ[step].opts.map((o, i) => <button key={i} onClick={() => handleAnswer(i)} style={{ padding: "16px 20px", borderRadius: 12, border: `1px solid ${C.border}`, background: C.bgAlt, fontSize: 15, color: C.ink, cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, transition: "all .2s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = C.blueLight; }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.bgAlt; }}>{o}</button>)}
            </div>
            {step > 0 && <button onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }} style={{ marginTop: 20, fontSize: 14, color: C.muted, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>← Précédent</button>}
          </>) : result && (
            <div>
              {/* Profile badge */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 24px", borderRadius: 100, background: `${result.color}12`, border: `2px solid ${result.color}30`, marginBottom: 16 }}>
                  <span style={{ fontSize: 22 }}>{result.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 16, color: result.color }}>{result.profile}</span>
                  <span style={{ fontSize: 13, color: C.muted }}>{result.score}/{result.maxScore}</span>
                </div>
                <h3 className="serif" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Votre profil : <span style={{ color: result.color }}>{result.profile}</span></h3>
                <p style={{ fontSize: 14, color: C.body, lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>{result.phrase}</p>
              </div>
              {/* Recommended offer */}
              <div style={{ padding: 20, borderRadius: 14, border: `2px solid ${result.color}30`, background: `${result.color}08`, marginBottom: 20 }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: C.muted, marginBottom: 6 }}>Offre recommandée</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 6 }}>{result.offer}</div>
                <p style={{ fontSize: 14, color: C.body, lineHeight: 1.6 }}>{result.offerDesc}</p>
              </div>
              {/* CTA */}
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 8 }}>
                <a href={CONFIG.contact.calendar} target="_blank" rel="noopener noreferrer" style={{ padding: "12px 24px", background: C.blue, color: "#fff", borderRadius: 10, fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}><I.Cal /> 30 min avec nos experts</a>
                <button onClick={() => setShowCalc(!showCalc)} style={{ padding: "12px 24px", borderRadius: 10, border: `1.5px solid ${C.border}`, background: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", display: "inline-flex", alignItems: "center", gap: 6, color: C.ink }}>
                  <I.BarChart /> {showCalc ? "Masquer le calcul" : "Estimer mon gain"}
                </button>
              </div>
              {/* Mini calculator */}
              {showCalc && <MiniCalculator defaultPeople={result.peopleDefault} />}
              {/* Restart */}
              <div style={{ textAlign: "center" }}>
                <button onClick={() => { setStep(0); setAnswers([]); setDone(false); setShowCalc(false); }} style={{ marginTop: 20, fontSize: 14, color: C.muted, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", textDecoration: "underline" }}>Recommencer</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ FAQ + CONTACT ═══════════════ */
const faqData = [
  { q: "Quels types d'entreprises accompagnez-vous ?", a: "Nous accompagnons principalement les PME (50-249 salariés) et ETI (250-5000 salariés) tous secteurs confondus." },
  { q: "Quelle est la différence entre le Workshop et le Diagnostic ?", a: "Le Workshop Cadrage (2-3 jours) est orienté action immédiate : vous repartez avec une roadmap. Le Diagnostic est plus approfondi : il audite vos process et données." },
  { q: "Quelles garanties offrez-vous ?", a: "Nous ne promettons jamais de « risque zéro ». En revanche : périmètre documenté, RACI explicite, hypothèses listées, KPIs définis dès le cadrage." },
  { q: "Faut-il des compétences IA en interne ?", a: "Non. Notre accompagnement est conçu pour des équipes non techniques. Si vous avez déjà des compétences, nous les embarquons." },
  { q: "Combien de temps dure une mission ?", a: "Un Workshop dure 2-3 jours. Un Diagnostic complet prend 2-4 semaines. Les Solutions sur Mesure sont dimensionnées selon vos besoins." },
  { q: "Comment mesurez-vous le succès ?", a: "Chaque mission définit des KPIs mesurables dès le départ : ROI projeté, temps gagné, taux d'adoption. Point à 30, 60 et 90 jours." },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, marginBottom: 8, background: "#fff", overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", fontSize: 15, fontWeight: 600, color: C.ink, textAlign: "left", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.4 }}>
        {item.q}
        <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .3s", flexShrink: 0, marginLeft: 12 }}><I.ChevDown /></span>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height .35s ease" }}>
        <p style={{ padding: "0 20px 18px", fontSize: 14, lineHeight: 1.7, color: C.body }}>{item.a}</p>
      </div>
    </div>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState(null);
  const contact = CONFIG.contact;

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!consent) return;
    setStatus("sending");
    const res = await sendEmail(form, contact);
    if (res.ok) { setStatus("sent"); if (!res.fallback) { setForm({ name: "", email: "", message: "" }); setConsent(false); } setTimeout(() => setStatus(null), 5000); }
    else { setStatus("error"); setTimeout(() => setStatus(null), 5000); }
  };

  const inp = { width: "100%", padding: "14px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "border-color .2s", background: C.bgAlt };

  return (
    <section id="contact" className="sec" style={{ background: C.bg }}>
      <div className="ctn">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: "48px 56px", alignItems: "flex-start" }}>
          <div>
            <RevealDiv><h2 className="serif" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 900, marginBottom: 28 }}>Questions <span className="grad-text serif" style={{ fontStyle: "italic" }}>fréquentes</span></h2></RevealDiv>
            {faqData.map((f, i) => <FAQItem key={i} item={f} />)}
          </div>
          <div>
            <h2 className="serif" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", fontWeight: 900, marginBottom: 28 }}>Parlons de <span className="grad-text serif" style={{ fontStyle: "italic" }}>votre projet</span></h2>
            <div style={{ marginBottom: 24, padding: "16px 20px", borderRadius: 10, border: `2px solid ${C.blue}`, background: C.blueLight }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.blue }}>Écrire à shōrAI</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{contact.email}</div>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" }}>Nom complet</label><input required placeholder="Jean Dupont" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inp} onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = C.border} /></div>
              <div><label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" }}>Email professionnel</label><input required type="email" placeholder="jean@entreprise.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inp} onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = C.border} /></div>
              <div><label style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" }}>Votre besoin en quelques mots</label><textarea required placeholder="Décrivez brièvement votre contexte et vos attentes..." rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ ...inp, resize: "vertical", minHeight: 100 }} onFocus={e => e.target.style.borderColor = C.blue} onBlur={e => e.target.style.borderColor = C.border} /></div>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", fontSize: 13, color: C.body, lineHeight: 1.5 }}>
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 3, accentColor: C.blue, width: 16, height: 16, flexShrink: 0 }} />
                J'accepte que shōrAI Consulting traite mes données pour répondre à ma demande. Pas de spam.
              </label>
              <button type="submit" disabled={!consent || status === "sending"} style={{ padding: "16px", borderRadius: 12, border: "none", background: !consent ? C.muted : C.blue, color: "#fff", fontSize: 15, fontWeight: 600, cursor: consent ? "pointer" : "not-allowed", fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background .2s", opacity: status === "sending" ? .7 : 1 }}
                onMouseEnter={e => { if (consent && status !== "sending") e.currentTarget.style.background = C.blueDark; }}
                onMouseLeave={e => { if (consent) e.currentTarget.style.background = C.blue; }}>
                {status === "sending" ? "Envoi..." : status === "sent" ? "✓ Envoyé !" : status === "error" ? "Erreur, réessayez" : <><I.Send /> Envoyer</>}
              </button>
            </form>
            {status === "sent" && <p style={{ marginTop: 12, fontSize: 13, color: "#16a34a", textAlign: "center" }}>Message envoyé à {contact.name}. Réponse sous 24 h.</p>}
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <p style={{ fontSize: 14, color: C.muted, marginBottom: 12 }}>Ou directement :</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <a href={contact.calendar} target="_blank" rel="noopener noreferrer" style={{ padding: "12px 20px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 14, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6, transition: "border-color .2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = C.blue} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}><I.Cal /> 30 min avec nos experts</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ FOOTER ═══════════════ */
function Footer() {
  return (
    <footer style={{ background: "#fff", borderTop: `1px solid ${C.border}`, padding: "40px 24px 28px" }}>
      <div className="ctn">
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
          <div>
            <span style={{ fontSize: 20, fontWeight: 700 }}><span style={{ color: C.blue }}>shōrAI</span> <span style={{ fontWeight: 400, color: C.muted, fontSize: 15 }}>Consulting</span></span>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{CONFIG.tagline}</p>
          </div>
          <a href="#contact" style={{ padding: "12px 24px", background: C.blue, color: "#fff", borderRadius: 10, fontWeight: 600, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6, transition: "background .2s" }} onMouseEnter={e => e.currentTarget.style.background = C.blueDark} onMouseLeave={e => e.currentTarget.style.background = C.blue}><I.Cal /> Réserver 30 min</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "20px 32px", marginBottom: 24, fontSize: 13, color: C.body, lineHeight: 1.6 }}>
          <div><div style={{ fontWeight: 700, color: C.ink, marginBottom: 8, fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em" }}>Entité juridique</div><p style={{ fontWeight: 600 }}>{CONFIG.entity}</p></div>
          {CONFIG.addresses.map((a, i) => <div key={i}><div style={{ fontWeight: 700, color: C.ink, marginBottom: 8, fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em" }}>{a.city}</div><p style={{ display: "flex", gap: 6, alignItems: "flex-start" }}><span style={{ flexShrink: 0, marginTop: 1 }}><I.Map /></span>{a.detail}</p></div>)}
          <div><div style={{ fontWeight: 700, color: C.ink, marginBottom: 8, fontSize: 12, textTransform: "uppercase", letterSpacing: ".06em" }}>Contact</div><div style={{ marginBottom: 6 }}><a href={`mailto:${CONFIG.contact.email}`} style={{ color: C.blue, fontWeight: 600 }}>{CONFIG.contact.email}</a></div></div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, fontSize: 12, color: C.muted }}>
          <span>© {new Date().getFullYear()} {CONFIG.entity}. Tous droits réservés. Site créé par shōrAI Consulting.</span>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" style={{ transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = C.ink} onMouseLeave={e => e.currentTarget.style.color = C.muted}>Mentions légales</a>
            <a href="#" style={{ transition: "color .2s" }} onMouseEnter={e => e.currentTarget.style.color = C.ink} onMouseLeave={e => e.currentTarget.style.color = C.muted}>Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════ APP ═══════════════ */
export default function App() {
  return (
    <>
      <style>{globalCSS}</style>
      <Nav />
      <Hero />
      <PainSection />
      <Methode />
      <Offres />
      <AntiZoneGrise />
      <PreDiagnostic />
      <ContactSection />
      <Footer />
    </>
  );
}
