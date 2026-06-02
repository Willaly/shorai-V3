import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

/* =============================================================
   shōrAI Consulting - Design-system build
   Uses CSS classes from tokens.css + site.css
   ============================================================= */

const CONFIG = {
  brand: "shōrAI",
  kanji: "将来",
  entity: "SHOURAI CONSULTING OÜ",
  tagline: "Conseil IA opérationnel pour PME & ETI",
  contact: {
    name: "shōrAI",
    email: "contact@shorai-group.com",
    calendar: "https://calendar.app.google/Mib5EFdjDi21g46s8",
  },
  emailjs: { serviceId: "YOUR_SERVICE_ID", templateId: "YOUR_TEMPLATE_ID", publicKey: "YOUR_PUBLIC_KEY" },
};

/* ---- Scroll reveal via IntersectionObserver ---- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("in"); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = "", as: Tag = "div" }) {
  const r = useReveal();
  return <Tag ref={r} className={`reveal ${className}`}>{children}</Tag>;
}

/* ---- Icons (inline SVG) ---- */
const I = {
  Arrow: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  ArrowLg: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Menu: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Check: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange-500)" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  XMark: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2.5">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Cal: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
    </svg>
  ),
  Chart: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange-500)" strokeWidth="1.8">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Target: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange-500)" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  BarChart: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange-500)" strokeWidth="1.8">
      <rect x="3" y="12" width="4" height="9" /><rect x="10" y="7" width="4" height="14" /><rect x="17" y="3" width="4" height="18" />
    </svg>
  ),
};

/* ---- EmailJS ---- */
async function sendEmail(formData) {
  if (CONFIG.emailjs.serviceId === "YOUR_SERVICE_ID") {
    const subj = encodeURIComponent(`[shōrAI] Message de ${formData.name}`);
    const body = encodeURIComponent(`Nom : ${formData.name}\nEmail : ${formData.email}\n\n${formData.message}`);
    window.open(`mailto:${CONFIG.contact.email}?subject=${subj}&body=${body}`, "_self");
    return { ok: true, fallback: true };
  }
  try {
    await emailjs.send(
      CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId,
      { from_name: formData.name, from_email: formData.email, to_email: CONFIG.contact.email, to_name: CONFIG.contact.name, message: formData.message },
      CONFIG.emailjs.publicKey
    );
    return { ok: true };
  } catch (err) { return { ok: false, error: err }; }
}

/* =================================================================
   NAV
   ================================================================= */
function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Services", href: "#services" },
    { label: "Réalisations", href: "#realisations" },
    { label: "Pré-diagnostic", href: "#diagnostic" },
    { label: "Calculateur ROI", href: "#calculateur" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav className="nav">
        <div className="nav__inner">
          <a href="#" className="nav__brand">
            <img src="/mark-color.png" alt="shōrAI" />
            shōrAI
          </a>
          <div className="nav__links">
            {links.map(l => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </div>
          <a href={CONFIG.contact.calendar} target="_blank" rel="noopener noreferrer" className="nav__cta">
            Prendre RDV <I.Arrow />
          </a>
          <button className="nav__burger" onClick={() => setOpen(true)} aria-label="Menu">
            <I.Menu />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${open ? "open" : ""}`}>
        <button className="mobile-menu__close" onClick={() => setOpen(false)} aria-label="Fermer">
          <I.X />
        </button>
        {links.map(l => (
          <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <a href={CONFIG.contact.calendar} target="_blank" rel="noopener noreferrer"
           className="mobile-menu__cta" onClick={() => setOpen(false)}>
          Prendre RDV <I.Arrow />
        </a>
      </div>
    </>
  );
}

/* =================================================================
   HERO
   ================================================================= */
function Hero() {
  const stats = [
    { val: "+37h", sub: "gagnées par semaine, équipe opérations" },
    { val: "−42%", sub: "temps de traitement des commandes" },
    { val: "14 j.", sub: "de l'audit à la roadmap chiffrée" },
  ];

  return (
    <section className="hero" style={{ backgroundImage: "url('/bg-hero.jpg')" }}>
      <div className="hero__scrim" />
      <div className="hero__watermark">
        <img src="/mark-color.png" alt="" className="mark-spin" />
      </div>
      <div className="shell hero__content">
        <div>
          <div className="hero__eyebrow">Consulting IA &middot; Productivité mesurée</div>
          <h1>
            L'IA, <span className="italic">au service</span><br />
            de votre<br />
            <span className="grad">productivité.</span>
          </h1>
          <p className="hero__lead">
            shōrAI identifie en 72 h les cas d'usage IA à fort ROI dans votre organisation,
            avec une méthode structurée, un Go/NoGo clair, et zéro zone grise.
          </p>
          <div className="hero__ctas">
            <a href="#contact" className="hero__primary">Démarrer l'audit <I.Arrow /></a>
            <a href="#methode" className="hero__ghost">Voir la méthode</a>
          </div>
        </div>
        <div className="hero__stats">
          {stats.map((s, i) => (
            <div key={i} className="hero__stat">
              <div className="hero__stat-value">{s.val}</div>
              <div className="hero__stat-label">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hero__kanji">
        <span className="kanji">将来</span> shōrai &middot; future
      </div>
    </section>
  );
}

/* =================================================================
   TRUST STRIP
   ================================================================= */
function Trust() {
  const sectors = [
    { name: "INDUSTRIE", n: "800" },
    { name: "SERVICES B2B", n: "120" },
    { name: "E-COMMERCE", n: "60" },
    { name: "BIOTECH", n: "240" },
    { name: "LEGAL", n: "40" },
    { name: "RETAIL", n: "1200" },
  ];
  return (
    <section className="trust">
      <div className="shell">
        <p className="trust__label">Secteurs accompagnés</p>
        <div className="trust__row">
          {sectors.map(s => (
            <div key={s.name} className="trust__logo">
              {s.name} <small>{s.n}+ process audités</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   METHODE
   ================================================================= */
function Methode() {
  const steps = [
    { n: "01", label: "STEP 01", title: "Diagnostic", desc: "Audit des process, données et outils existants. Identification des cas d'usage IA à fort potentiel.", duration: "~5 jours" },
    { n: "02", label: "STEP 02", title: "Roadmap", desc: "Scoring ROI par cas d'usage, plan de déploiement priorisé, RACI, hypothèses documentées.", duration: "~7 jours" },
    { n: "03", label: "STEP 03", title: "Déploiement", desc: "Mise en place des solutions IA retenues, intégration dans vos process et outils existants.", duration: "4-12 sem." },
    { n: "04", label: "STEP 04", title: "Mesure", desc: "Suivi des KPIs définis, ajustements, points à 30/60/90 jours. Amélioration continue.", duration: "continu" },
  ];

  return (
    <section id="methode" className="section">
      <div className="shell">
        <Reveal>
          <div className="eyebrow">Méthode</div>
          <h2 className="section__title">La méthode shōrAI</h2>
          <p className="section__lead">Structurée, transparente, orientée résultat. De l'audit à la roadmap chiffrée en 14 jours.</p>
        </Reveal>
        <div className="method-grid">
          {steps.map((s, i) => (
            <Reveal key={i}>
              <div className="method">
                <div className="method__num">
                  <span className="dot">{s.n}</span>
                  <span className="step-label">{s.label}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="method__duration">{s.duration}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   SERVICES
   ================================================================= */
const servicesData = [
  {
    num: "01", dark: false,
    title: "Sites & plateformes augmentés par l'IA",
    tagline: "Des sites qui travaillent pour vous, pas juste qui existent.",
    desc: "Conception, replatforming et optimisation de sites web et plateformes digitales, enrichis par l'IA : personnalisation, SEO intelligent, chatbots, analytics prédictifs.",
    items: ["Replatforming & modernisation de stack", "Intégration de briques IA (chatbot, reco, search)", "Optimisation SEO et performance", "Sites vitrines, e-commerce, plateformes métier"],
  },
  {
    num: "02", dark: true,
    title: "Consulting stratégie IA",
    tagline: "Identifier les cas d'usage à fort ROI avant d'investir.",
    desc: "Diagnostic de maturité, cadrage stratégique, roadmap IA priorisée. On vous dit Go ou NoGo, avec des livrables actionnables et zéro zone grise.",
    items: ["Workshop cadrage (2-3 jours)", "Diagnostic IA complet (2-4 semaines)", "Scoring ROI par cas d'usage", "RACI, hypothèses, KPIs dès le cadrage"],
  },
  {
    num: "03", dark: false,
    title: "Automatisation IA",
    tagline: "Libérer vos équipes des tâches répétitives.",
    desc: "Identification, conception et déploiement d'automatisations métier alimentées par l'IA. Du process mapping au workflow autonome.",
    items: ["Audit des process automatisables", "Conception et build des workflows IA", "Intégration dans vos outils existants", "Mesure du temps libéré et du ROI réel"],
  },
];

function Services() {
  return (
    <section id="services" className="section section--alt">
      <div className="shell">
        <Reveal>
          <div className="eyebrow">Services</div>
          <h2 className="section__title">Nos services</h2>
          <p className="section__lead">Trois expertises, un seul fil rouge : l'IA au service de votre performance opérationnelle.</p>
        </Reveal>
        <div className="services">
          {servicesData.map((s, i) => (
            <Reveal key={i}>
              <div className={`service ${s.dark ? "service--dark" : ""}`}>
                <div>
                  <div className="service__num">{s.num} &middot; SERVICE</div>
                  <h3 className="service__title">{s.title}</h3>
                  <p className="service__desc" style={{ fontStyle: "italic", fontWeight: 600, marginBottom: 8, color: "var(--ink-700)" }}>{s.tagline}</p>
                  <p className="service__desc">{s.desc}</p>
                </div>
                <div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {s.items.map((item, j) => (
                      <li key={j} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "var(--ink-600)" }}>
                        <I.Check />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <a href="#contact" className="service__cta">
                  En discuter
                  <span className="arrow"><I.ArrowLg /></span>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   REALISATIONS
   ================================================================= */
const realisations = [
  {
    client: "Maison Présence",
    sector: "PME · Bien-être & lifestyle",
    mission: "Replatforming web augmenté par l'IA",
    desc: "Accompagnement complet d'une PME dans la refonte de sa plateforme digitale : migration technique, refonte UX, intégration de briques IA (recommandations produit, SEO intelligent, analytics prédictifs) pour transformer un site vitrine en véritable outil de conversion.",
    results: [
      "Migration technique réussie sans interruption de service",
      "Temps de chargement divisé par 3",
      "Briques IA opérationnelles dès le lancement",
      "Autonomie de gestion retrouvée pour l'équipe interne",
    ],
    tags: ["Site Web", "IA", "Replatforming"],
  },
];

function Realisations() {
  return (
    <section id="realisations" className="section">
      <div className="shell">
        <Reveal>
          <div className="eyebrow">Cas clients</div>
          <h2 className="section__title">Nos réalisations</h2>
          <p className="section__lead">Des missions concrètes, des résultats mesurables.</p>
        </Reveal>
        {realisations.map((r, i) => (
          <Reveal key={i}>
            <div className="realisation-card">
              <div className="realisation-tags">
                {r.tags.map((t, j) => <span key={j} className="realisation-tag">{t}</span>)}
              </div>
              <div className="realisation-grid">
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(22px, 2.4vw, 28px)", letterSpacing: "-0.02em", margin: "0 0 4px" }}>{r.client}</h3>
                  <p style={{ fontSize: 13, color: "var(--ink-400)", margin: "0 0 16px" }}>{r.sector}</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "var(--brand-orange-500)", margin: "0 0 12px" }}>{r.mission}</p>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-600)", margin: 0 }}>{r.desc}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-400)", margin: "0 0 20px" }}>Résultats clés</h4>
                  {r.results.map((res, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                      <span style={{ flexShrink: 0, marginTop: 2 }}><I.Check /></span>
                      <span style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-600)" }}>{res}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* =================================================================
   ANTI-ZONE GRISE
   ================================================================= */
const inclus = [
  "Périmètre documenté et signé avant démarrage",
  "RACI explicite : vos responsabilités vs les nôtres",
  "Hypothèses listées, pas de suppositions cachées",
  "KPIs de mesure définis dès le cadrage",
  "Owner côté client nommé pour chaque livrable",
  "Processus de change control formalisé",
];
const exclus = [
  "Promesses de « risque zéro » ou « conformité garantie »",
  "Implémentation technique (code, déploiement)",
  "Formation des équipes (périmètre séparé)",
  "Maintenance ou support continu",
];

function AntiZoneGrise() {
  return (
    <section className="section section--alt">
      <div className="shell">
        <Reveal>
          <div className="eyebrow">Transparence</div>
          <h2 className="section__title">Méthode anti-zone grise</h2>
          <p className="section__lead">Pas d'ambiguïté. Chaque engagement est documenté, chaque responsabilité est claire.</p>
        </Reveal>
        <div className="zone-grid">
          <div className="zone-card zone-card--inclus">
            <h3 className="zone-card__title"><I.Check /> Inclus</h3>
            {inclus.map((t, i) => (
              <div key={i} className="zone-item">
                <span className="zone-item__icon"><I.Check /></span>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="zone-card zone-card--exclus">
            <h3 className="zone-card__title"><I.XMark /> Exclus</h3>
            {exclus.map((t, i) => (
              <div key={i} className="zone-item">
                <span className="zone-item__icon"><I.XMark /></span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   PRE-DIAGNOSTIC (quiz with scoring)
   ================================================================= */
const quizQ = [
  { q: "Quelle est la taille de votre entreprise ?", opts: ["10-49 salariés", "50-249 salariés", "250-1 000 salariés", "1 000+ salariés"], scores: [1, 2, 3, 3], dim: "size", people: [5, 15, 40, 100] },
  { q: "Quel est votre secteur d'activité ?", opts: ["Industrie / Manufacturing", "Services / Conseil", "Commerce / Distribution", "Autre"], scores: [0, 0, 0, 0], dim: "sector" },
  { q: "Où en êtes-vous avec l'IA ?", opts: ["On n'a rien fait encore", "Quelques expérimentations isolées", "Des projets pilotes en cours", "Déploiement à l'échelle"], scores: [0, 1, 2, 3], dim: "maturity" },
  { q: "Quel est votre principal enjeu ?", opts: ["Réduire les coûts opérationnels", "Accélérer les process", "Améliorer l'expérience client", "Créer de nouveaux produits / services"], scores: [0, 0, 0, 0], dim: "goal" },
  { q: "Avez-vous des données structurées exploitables ?", opts: ["Pas vraiment, c'est le chaos", "Quelques bases de données", "Oui, assez bien organisées", "Data warehouse en place"], scores: [0, 1, 2, 3], dim: "data" },
  { q: "Quel budget envisagez-vous pour un premier cadrage ?", opts: ["< 3 000 €", "3 000-6 000 €", "6 000-15 000 €", "> 15 000 €"], scores: [1, 2, 3, 3], dim: "budget" },
  { q: "Quel est votre horizon de décision ?", opts: ["Immédiat (< 1 mois)", "Court terme (1-3 mois)", "Moyen terme (3-6 mois)", "Exploration sans urgence"], scores: [3, 2, 1, 0], dim: "urgency" },
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
    profile = "Explorateur"; color = "var(--brand-orange-500)"; icon = "🔍";
    offer = "Flash Diag";
    offerDesc = "Un diagnostic express de 2h pour identifier vos premiers cas d'usage IA et valider le potentiel.";
  } else if (score <= 12) {
    profile = "Prêt à agir"; color = "var(--brand-blue-500)"; icon = "🎯";
    offer = "Workshop Cadrage";
    offerDesc = "2 à 3 jours pour cadrer votre stratégie IA avec des livrables actionnables et une roadmap claire.";
  } else {
    profile = "Accélérateur"; color = "#7048C6"; icon = "🚀";
    offer = "Diagnostic complet";
    offerDesc = "Audit approfondi de vos process et données, scoring ROI par cas d'usage, plan d'implémentation.";
  }

  const sector = dims.sector?.label || "";
  const maturity = dims.maturity?.label?.toLowerCase() || "";
  if (score <= 6) {
    phrase = `En tant qu'entreprise ${sector.toLowerCase()} qui n'a ${maturity === "on n'a rien fait encore" ? "pas encore exploré l'IA" : "commencé à explorer l'IA"}, le plus efficace est de valider rapidement le potentiel avant d'investir.`;
  } else if (score <= 12) {
    phrase = `Avec ${maturity} et des données ${dims.data?.label?.toLowerCase() || "existantes"}, vous êtes dans une position idéale pour structurer votre démarche IA.`;
  } else {
    phrase = `Votre maturité IA et votre niveau de structuration data vous permettent d'accélérer. Il s'agit maintenant de maximiser le ROI sur les bons cas d'usage.`;
  }

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
  const fmtEUR = n => n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  return (
    <div className="mini-calc">
      <div className="mini-calc__head">
        <I.BarChart /><span style={{ fontWeight: 700, fontSize: 15 }}>Estimation rapide du gain</span>
      </div>
      <div className="mini-calc__inputs">
        <div className="mini-calc__field">
          <label>Personnes</label>
          <input type="number" min="1" value={people} onChange={e => setPeople(Math.max(1, +e.target.value))} />
        </div>
        <div className="mini-calc__field">
          <label>Min / tâche</label>
          <input type="number" min="1" value={minutes} onChange={e => setMinutes(Math.max(1, +e.target.value))} />
        </div>
        <div className="mini-calc__field">
          <label>Fois / semaine</label>
          <input type="number" min="1" value={frequency} onChange={e => setFrequency(Math.max(1, +e.target.value))} />
        </div>
      </div>
      <div className="mini-calc__results">
        <div className="mini-calc__result">
          <div className="mini-calc__result-label">Gain annuel estimé</div>
          <div className="mini-calc__result-value">{fmtEUR(yearlyGain)}</div>
          <div className="mini-calc__result-sub">{yearlyHours} heures libérées / an</div>
        </div>
        <div className="mini-calc__result">
          <div className="mini-calc__result-label">Gain hebdo</div>
          <div className="mini-calc__result-value">{fmtEUR(weeklyGain)}</div>
          <div className="mini-calc__result-sub">sur base de {hourly}€/h chargé</div>
        </div>
      </div>
      <a href="/serviette.html" target="_blank" rel="noopener noreferrer" className="mini-calc__link">
        <I.Chart /> Affiner avec le test de la serviette <I.Arrow />
      </a>
    </div>
  );
}

function PreDiagnostic() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  const handleAnswer = optIdx => {
    const n = [...answers, optIdx];
    setAnswers(n);
    if (step < quizQ.length - 1) setStep(step + 1);
    else setDone(true);
  };

  const pct = Math.round((step / quizQ.length) * 100);
  const result = done ? getProfile(answers) : null;

  return (
    <section id="diagnostic" className="section">
      <div className="shell">
        <Reveal className="quiz-header">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Pré-diagnostic</div>
          <h2 className="section__title" style={{ textAlign: "center" }}>Pré-diagnostic gratuit</h2>
          <p className="section__lead" style={{ textAlign: "center", margin: "0 auto 0" }}>8 questions &middot; 2 minutes &middot; Recommandation personnalisée</p>
        </Reveal>

        <div className="quiz-card">
          {!done ? (
            <>
              <div className="quiz-progress-row">
                <span>Question {step + 1} / {quizQ.length}</span>
                <span>{pct}%</span>
              </div>
              <div className="quiz-progress-bar">
                <div className="quiz-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <h3 className="quiz-question">{quizQ[step].q}</h3>
              <div className="quiz-options">
                {quizQ[step].opts.map((o, i) => (
                  <button key={i} className="quiz-option" onClick={() => handleAnswer(i)}>{o}</button>
                ))}
              </div>
              {step > 0 && (
                <button className="quiz-back" onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}>
                  ← Précédent
                </button>
              )}
            </>
          ) : result && (
            <div className="quiz-result">
              <div className="quiz-result__badge" style={{ borderColor: result.color, background: `color-mix(in srgb, ${result.color} 8%, transparent)` }}>
                <span style={{ fontSize: 22 }}>{result.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 16, color: result.color }}>{result.profile}</span>
                <span style={{ fontSize: 13, color: "var(--ink-400)" }}>{result.score}/{result.maxScore}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 24, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
                Votre profil : <span style={{ color: result.color }}>{result.profile}</span>
              </h3>
              <p style={{ fontSize: 14, color: "var(--ink-600)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 24px" }}>{result.phrase}</p>

              <div className="quiz-offer" style={{ borderColor: result.color, background: `color-mix(in srgb, ${result.color} 5%, transparent)` }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-400)", marginBottom: 6 }}>Offre recommandée</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>{result.offer}</div>
                <p style={{ fontSize: 14, color: "var(--ink-600)", lineHeight: 1.6, margin: 0 }}>{result.offerDesc}</p>
              </div>

              <div className="quiz-actions">
                <a href={CONFIG.contact.calendar} target="_blank" rel="noopener noreferrer" className="quiz-cta-primary">
                  <I.Cal /> 30 min avec nos experts
                </a>
                <button className="quiz-cta-secondary" onClick={() => setShowCalc(!showCalc)}>
                  <I.BarChart /> {showCalc ? "Masquer le calcul" : "Estimer mon gain"}
                </button>
              </div>

              {showCalc && <MiniCalculator defaultPeople={result.peopleDefault} />}

              <div style={{ textAlign: "center" }}>
                <button className="quiz-restart" onClick={() => { setStep(0); setAnswers([]); setDone(false); setShowCalc(false); }}>
                  Recommencer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   CALCULATEUR ROI
   ================================================================= */
function CalculateurSection() {
  return (
    <section id="calculateur" className="section section--alt">
      <div className="shell">
        <div className="calc-wrapper">
          <Reveal className="calc-header">
            <div className="eyebrow" style={{ justifyContent: "center" }}>Calculateur ROI</div>
            <h2 className="section__title" style={{ textAlign: "center" }}>Le test de la serviette</h2>
            <p className="section__lead" style={{ textAlign: "center", margin: "0 auto 0" }}>
              Avant d'investir dans une automatisation, posez-vous une question simple : est-ce que ça vaut le coup ?
            </p>
          </Reveal>
          <Reveal>
            <div className="calc-card">
              <div className="calc-grid">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <I.Chart />
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, margin: 0 }}>Le concept</h3>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-600)", margin: 0 }}>
                    Le test de la serviette est une heuristique rapide pour évaluer si une tâche mérite d'être automatisée.
                    En 2 minutes, vous estimez le temps perdu, le coût réel et le payback d'un investissement en automatisation.
                  </p>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <I.Target />
                    <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17, margin: 0 }}>Comment ça marche</h3>
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--ink-600)", margin: 0 }}>
                    Décrivez la tâche (temps, fréquence, personnes), estimez le coût du build,
                    et l'outil calcule votre payback en semaines. Verdict immédiat : Go, À discuter, ou Stop.
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <a href="/serviette.html" target="_blank" rel="noopener noreferrer" className="calc-cta">
                  <I.BarChart /> Lancer le calculateur ROI <I.Arrow />
                </a>
                <p style={{ fontSize: 13, color: "var(--ink-400)", marginTop: 14 }}>Gratuit &middot; Sans inscription &middot; Résultat instantané</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   QUOTE (editorial kanji moment)
   ================================================================= */
function Quote() {
  return (
    <section className="quote" style={{ backgroundImage: "none", background: "var(--ink-900)" }}>
      <div className="quote__bg" style={{ backgroundImage: "url('/bg-quote.jpg')" }} />
      <div className="shell">
        <div className="quote__inner">
          <div className="quote__romaji">shōrai &middot; future</div>
          <div className="quote__kanji">将来</div>
          <p className="quote__text">
            &laquo; Le futur n'est pas un concept lointain. C'est ce que vous construisez aujourd'hui. &raquo;
          </p>
          <div className="quote__attr">shōrAI Consulting</div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   FAQ
   ================================================================= */
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
    <div className={`faq__item ${open ? "open" : ""}`}>
      <button className="faq__q" onClick={() => setOpen(!open)}>
        {item.q}
        <span className="faq__icon">+</span>
      </button>
      <div className="faq__a">
        <div className="faq__a-inner">{item.a}</div>
      </div>
    </div>
  );
}

/* =================================================================
   CONTACT
   ================================================================= */
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!consent) return;
    setStatus("sending");
    const res = await sendEmail(form);
    if (res.ok) {
      setStatus("sent");
      if (!res.fallback) { setForm({ name: "", email: "", message: "" }); setConsent(false); }
      setTimeout(() => setStatus(null), 5000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="shell">
        <div className="contact">
          {/* Left: FAQ */}
          <div className="contact__left">
            <Reveal>
              <div className="eyebrow">Questions fréquentes</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(28px, 3.6vw, 40px)", letterSpacing: "-0.02em", margin: "0 0 28px" }}>
                Ce que vous voudriez nous demander.
              </h2>
            </Reveal>
            <div className="faq">
              {faqData.map((f, i) => <FAQItem key={i} item={f} />)}
            </div>
            <div className="contact__details" style={{ marginTop: 40 }}>
              <div className="contact__detail">
                <span className="contact__detail-label">Email</span>
                <a href={`mailto:${CONFIG.contact.email}`} className="contact__detail-value">{CONFIG.contact.email}</a>
              </div>
              <div className="contact__detail">
                <span className="contact__detail-label">Localisation</span>
                <span className="contact__detail-value">Paris &middot; Lyon &middot; Bordeaux</span>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <Reveal>
              <div className="eyebrow">Premier rendez-vous</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(28px, 3.6vw, 40px)", letterSpacing: "-0.02em", margin: "0 0 28px" }}>
                Parlons de votre projet
              </h2>
            </Reveal>
            <form onSubmit={handleSubmit} className="form">
              <div className="form__row">
                <div className="form__field">
                  <label>Nom complet</label>
                  <input required placeholder="Jean Dupont" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form__field">
                  <label>Email professionnel</label>
                  <input required type="email" placeholder="jean@entreprise.com" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className="form__field">
                <label>Votre besoin en quelques mots</label>
                <textarea required placeholder="Décrivez brièvement votre contexte et vos attentes..." rows={4}
                  value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
              </div>
              <label className="form-consent">
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
                J'accepte que shōrAI Consulting traite mes données pour répondre à ma demande. Pas de spam.
              </label>
              <button type="submit" className="form__submit" disabled={!consent || status === "sending"}
                style={{ opacity: !consent ? 0.5 : status === "sending" ? 0.7 : 1, cursor: consent ? "pointer" : "not-allowed" }}>
                {status === "sending" ? "Envoi..." : status === "sent" ? "✓ Envoyé !" : status === "error" ? "Erreur, réessayez" : <><I.Send /> Envoyer</>}
              </button>
              {status === "sent" && <p className="form__legal" style={{ color: "var(--color-success)" }}>Message envoyé. Réponse sous 24 h.</p>}
              <p className="form__legal">
                Ou directement :
                <a href={CONFIG.contact.calendar} target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--brand-orange-500)", fontWeight: 600, marginLeft: 6 }}>
                  <I.Cal /> 30 min avec nos experts
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================
   FOOTER
   ================================================================= */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__bg" />
      <div className="shell">
        <div className="footer__inner">
          <div>
            <div className="footer__brand">
              <img src="/mark-color.png" alt="shōrAI" />
              shōrAI
            </div>
            <p className="footer__tag">
              Consulting IA. Audit, stratégie, déploiement. Productivité mesurée. Future, engineered today.
            </p>
          </div>
          <div className="footer__col">
            <h5>Services</h5>
            <ul>
              <li><a href="#services">Audit IA</a></li>
              <li><a href="#services">Stratégie & roadmap</a></li>
              <li><a href="#services">Déploiement & formation</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Cabinet</h5>
            <ul>
              <li><a href="#methode">Méthode</a></li>
              <li><a href="#realisations">Cas clients</a></li>
              <li><a href="#calculateur">Calculateur ROI</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h5>Contact</h5>
            <ul>
              <li><a href={`mailto:${CONFIG.contact.email}`}>{CONFIG.contact.email}</a></li>
              <li>Paris &middot; Lyon &middot; Bordeaux</li>
              <li><a href={CONFIG.contact.calendar} target="_blank" rel="noopener noreferrer" style={{ color: "var(--brand-orange-500)", fontWeight: 600 }}>Prendre rendez-vous</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>&copy; {new Date().getFullYear()} {CONFIG.entity}. Tous droits réservés.</span>
          <span className="footer__kanji">将来 &middot; shōrai &middot; future</span>
        </div>
      </div>
    </footer>
  );
}

/* =================================================================
   APP - main component
   ================================================================= */
export default function App() {
  return (
    <div className="site">
      <style>{`
        /* ============================================================
           Custom styles for sections not fully in the design system
           ============================================================ */

        /* -- Realisations -- */
        .realisation-card {
          padding: clamp(28px, 5vw, 48px);
          border-radius: 28px;
          border: 1px solid rgba(11, 18, 71, 0.06);
          background: #fff;
          box-shadow: var(--shadow-sm);
          margin-bottom: 24px;
        }
        .realisation-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }
        .realisation-tag {
          padding: 4px 14px;
          border-radius: 999px;
          background: var(--brand-orange-50);
          color: var(--brand-orange-500);
          font-size: 12px;
          font-weight: 600;
        }
        .realisation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
          gap: 32px 48px;
        }

        /* -- Anti-zone grise -- */
        .zone-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
          gap: 24px;
        }
        .zone-card {
          padding: 32px;
          border-radius: 24px;
          border: 1px solid rgba(11, 18, 71, 0.06);
          background: #fff;
        }
        .zone-card--exclus {
          border-color: #fce4e4;
          background: #fffbfb;
        }
        .zone-card__title {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 18px;
          margin: 0 0 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .zone-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-bottom: 14px;
          font-size: 14px;
          line-height: 1.6;
          color: var(--ink-600);
        }
        .zone-item__icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* -- Pre-diagnostic quiz -- */
        .quiz-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .quiz-card {
          max-width: 640px;
          margin: 0 auto;
          padding: clamp(24px, 5vw, 48px);
          border-radius: 28px;
          border: 1px solid rgba(11, 18, 71, 0.06);
          background: #fff;
          box-shadow: var(--shadow-sm);
        }
        .quiz-progress-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--ink-400);
          margin-bottom: 12px;
        }
        .quiz-progress-bar {
          height: 4px;
          border-radius: 2px;
          background: var(--ink-100);
          margin-bottom: 28px;
        }
        .quiz-progress-fill {
          height: 100%;
          background: var(--brand-orange-500);
          border-radius: 2px;
          transition: width 0.4s var(--ease-out);
        }
        .quiz-question {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 18px;
          letter-spacing: -0.01em;
          margin: 0 0 20px;
          line-height: 1.4;
        }
        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .quiz-option {
          padding: 16px 20px;
          border-radius: 14px;
          border: 1px solid var(--ink-200);
          background: var(--ink-50);
          font-size: 15px;
          color: var(--ink-900);
          cursor: pointer;
          text-align: left;
          font-family: var(--font-sans);
          font-weight: 500;
          transition: all 160ms var(--ease-out);
        }
        .quiz-option:hover {
          border-color: var(--brand-orange-500);
          background: var(--brand-orange-50);
        }
        .quiz-back {
          margin-top: 20px;
          font-size: 14px;
          color: var(--ink-400);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
        }
        .quiz-result { text-align: center; }
        .quiz-result__badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 24px;
          border-radius: 999px;
          border: 2px solid;
          margin-bottom: 16px;
        }
        .quiz-offer {
          padding: 20px;
          border-radius: 16px;
          border: 2px solid;
          text-align: left;
          margin-bottom: 20px;
        }
        .quiz-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .quiz-cta-primary {
          padding: 12px 24px;
          background: var(--ink-900);
          color: #fff;
          border-radius: 999px;
          font-weight: 600;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: background 140ms var(--ease-out);
        }
        .quiz-cta-primary:hover { background: var(--ink-700); }
        .quiz-cta-secondary {
          padding: 12px 24px;
          border-radius: 999px;
          border: 1px solid var(--ink-200);
          background: #fff;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          font-family: var(--font-sans);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--ink-900);
        }
        .quiz-restart {
          margin-top: 20px;
          font-size: 14px;
          color: var(--ink-400);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          text-decoration: underline;
        }

        /* -- Mini calculator (inside quiz result) -- */
        .mini-calc {
          margin-top: 28px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid rgba(11, 18, 71, 0.06);
          background: var(--ink-50);
          text-align: left;
        }
        .mini-calc__head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }
        .mini-calc__inputs {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }
        .mini-calc__field label {
          font-size: 12px;
          color: var(--ink-400);
          font-weight: 500;
          display: block;
          margin-bottom: 6px;
        }
        .mini-calc__field input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid var(--ink-200);
          font-size: 15px;
          font-family: var(--font-sans);
          outline: none;
          background: #fff;
          text-align: center;
          transition: border-color 160ms;
        }
        .mini-calc__field input:focus {
          border-color: var(--brand-blue-500);
          box-shadow: 0 0 0 3px rgba(27, 54, 229, 0.1);
        }
        .mini-calc__results {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .mini-calc__result {
          padding: 16px;
          border-radius: 14px;
          background: #fff;
          border: 1px solid rgba(11, 18, 71, 0.06);
          text-align: center;
        }
        .mini-calc__result-label {
          font-size: 11px;
          text-transform: uppercase;
          color: var(--ink-400);
          letter-spacing: .06em;
          margin-bottom: 4px;
        }
        .mini-calc__result-value {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 24px;
          letter-spacing: -0.02em;
          background: var(--brand-gradient);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .mini-calc__result-sub {
          font-size: 12px;
          color: var(--ink-400);
        }
        .mini-calc__link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
          padding: 12px 20px;
          border-radius: 999px;
          border: 1.5px solid var(--brand-orange-500);
          color: var(--brand-orange-500);
          font-weight: 600;
          font-size: 14px;
          background: #fff;
          text-decoration: none;
          transition: background 160ms;
        }
        .mini-calc__link:hover { background: var(--brand-orange-50); }

        /* -- Calculateur ROI section -- */
        .calc-wrapper {
          max-width: 720px;
          margin: 0 auto;
        }
        .calc-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .calc-card {
          padding: clamp(28px, 5vw, 48px);
          border-radius: 28px;
          border: 1px solid rgba(11, 18, 71, 0.06);
          background: #fff;
          box-shadow: var(--shadow-sm);
        }
        .calc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
          gap: 24px 40px;
        }
        .calc-cta {
          padding: 18px 32px;
          background: var(--ink-900);
          color: #fff;
          border-radius: 999px;
          font-weight: 600;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          transition: background 140ms, transform 140ms, box-shadow 200ms;
          box-shadow: var(--shadow-sm);
        }
        .calc-cta:hover {
          background: var(--ink-700);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        /* -- Form consent row -- */
        .form-consent {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          cursor: pointer;
          font-size: 13px;
          color: var(--ink-600);
          line-height: 1.5;
        }
        .form-consent input {
          margin-top: 3px;
          accent-color: var(--brand-orange-500);
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        /* -- Quote section override to restore dark style -- */
        .quote {
          background: var(--ink-900) !important;
          color: #fff !important;
        }
        .quote__bg {
          display: block !important;
          opacity: 0.35;
          filter: blur(2px);
        }
        .quote__text { color: #fff !important; }
        .quote__romaji { color: rgba(255,255,255,0.55) !important; }
        .quote__attr { color: rgba(255,255,255,0.65) !important; }
      `}</style>

      <Nav />
      <Hero />
      <Trust />
      <Methode />
      <Services />
      <Realisations />
      <AntiZoneGrise />
      <PreDiagnostic />
      <CalculateurSection />
      <Quote />
      <ContactSection />
      <Footer />
    </div>
  );
}
