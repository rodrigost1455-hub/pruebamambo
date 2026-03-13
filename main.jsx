import { useState, useEffect, useRef } from "react";

/* ─── BRAND TOKENS ──────────────────────────────────────────────── */
const COLORS = {
  sage:      "#769C76",
  sageLight: "#9BBD9B",
  sageDark:  "#4A7A4A",
  cream:     "#F5F0E6",
  creamDeep: "#EDE6D4",
  ink:       "#1C1F1A",
  inkMid:    "#3D4239",
  muted:     "#8A9085",
  white:     "#FDFCF8",
};

/* ─── GOOGLE FONTS ──────────────────────────────────────────────── */
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

/* ─── GLOBAL STYLES ─────────────────────────────────────────────── */
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${COLORS.cream}; color: ${COLORS.ink}; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.cream}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.sage}; border-radius: 3px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }
  @keyframes float { 0%,100% { transform:translateY(0px) rotate(0deg); } 50% { transform:translateY(-12px) rotate(2deg); } }
  @keyframes pulse-ring { 0% { transform:scale(0.95); box-shadow:0 0 0 0 rgba(118,156,118,0.4); } 70% { transform:scale(1); box-shadow:0 0 0 12px rgba(118,156,118,0); } 100% { transform:scale(0.95); box-shadow:0 0 0 0 rgba(118,156,118,0); } }
  @keyframes shimmer { 0% { background-position:-1000px 0; } 100% { background-position:1000px 0; } }
  .animate-fadeUp { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
  .animate-fadeIn { animation: fadeIn 0.6s ease both; }
  .animate-scaleIn { animation: scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
  .float-anim { animation: float 6s ease-in-out infinite; }
  .pulse-ring { animation: pulse-ring 2.5s cubic-bezier(0.455,0.03,0.515,0.955) infinite; }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
  .grain-overlay::after { content:''; position:fixed; inset:0; pointer-events:none; z-index:9999;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
    opacity:0.4; mix-blend-mode:multiply; }
  .nav-link { position:relative; transition: color 0.2s; }
  .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1.5px; background:${COLORS.sage}; transition:width 0.3s ease; }
  .nav-link:hover::after { width:100%; }
  .card-hover { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease; }
  .card-hover:hover { transform:translateY(-5px); box-shadow:0 20px 50px rgba(28,31,26,0.12); }
  .btn-primary { display:inline-flex; align-items:center; gap:8px; background:${COLORS.ink}; color:${COLORS.cream}; padding:14px 32px; border-radius:100px; font-family:'DM Sans',sans-serif; font-weight:500; font-size:15px; letter-spacing:0.02em; border:none; cursor:pointer; transition:transform 0.2s, background 0.2s, box-shadow 0.2s; }
  .btn-primary:hover { background:${COLORS.sageDark}; transform:translateY(-2px); box-shadow:0 12px 30px rgba(74,122,74,0.35); }
  .btn-sage { display:inline-flex; align-items:center; gap:8px; background:${COLORS.sage}; color:white; padding:14px 32px; border-radius:100px; font-family:'DM Sans',sans-serif; font-weight:500; font-size:15px; border:none; cursor:pointer; transition:transform 0.2s, background 0.2s, box-shadow 0.2s; }
  .btn-sage:hover { background:${COLORS.sageDark}; transform:translateY(-2px); box-shadow:0 12px 30px rgba(74,122,74,0.35); }
  .btn-outline { display:inline-flex; align-items:center; gap:8px; background:transparent; color:${COLORS.ink}; padding:13px 31px; border-radius:100px; font-family:'DM Sans',sans-serif; font-weight:500; font-size:15px; border:1.5px solid ${COLORS.ink}; cursor:pointer; transition:all 0.2s; }
  .btn-outline:hover { background:${COLORS.ink}; color:${COLORS.cream}; transform:translateY(-2px); }
  .tab-pill { padding:9px 22px; border-radius:100px; font-size:14px; font-weight:500; cursor:pointer; border:none; transition:all 0.25s ease; font-family:'DM Sans',sans-serif; }
  .input-field { width:100%; background:${COLORS.white}; border:1.5px solid #D8D5CC; border-radius:12px; padding:14px 18px; font-family:'DM Sans',sans-serif; font-size:15px; color:${COLORS.ink}; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
  .input-field:focus { border-color:${COLORS.sage}; box-shadow:0 0 0 4px rgba(118,156,118,0.12); }
  .tag-badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; }
`;

/* ─── SVG LOGO (Mantis) ─────────────────────────────────────────── */
const MantisLogo = ({ size = 40, color = COLORS.sage }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <ellipse cx="40" cy="48" rx="5" ry="14" fill={color} />
    {/* Head */}
    <circle cx="40" cy="30" r="7" fill={color} />
    {/* Antennae */}
    <path d="M38 24 Q30 12 24 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <path d="M42 24 Q50 12 56 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    {/* Left prayer arm */}
    <path d="M36 36 Q22 32 18 38 Q16 44 22 44 Q28 44 34 40" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Right prayer arm */}
    <path d="M44 36 Q58 32 62 38 Q64 44 58 44 Q52 44 46 40" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
    {/* Back legs */}
    <path d="M37 52 Q28 56 24 64" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    <path d="M43 52 Q52 56 56 64" stroke={color} strokeWidth="1.6" strokeLinecap="round" fill="none"/>
    {/* Mid legs */}
    <path d="M36 48 Q26 50 20 58" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    <path d="M44 48 Q54 50 60 58" stroke={color} strokeWidth="1.4" strokeLinecap="round" fill="none"/>
    {/* Eyes */}
    <circle cx="37" cy="29" r="1.5" fill={COLORS.white}/>
    <circle cx="43" cy="29" r="1.5" fill={COLORS.white}/>
  </svg>
);

/* ─── MENU DATA ─────────────────────────────────────────────────── */
const MENU = {
  chilaquiles: {
    label: "Chilaquiles",
    emoji: "🌶️",
    items: [
      { name: "Chilaquiles Verdes", desc: "Totopos bañados en salsa verde, crema, queso fresco y cebolla morada", price: "$145", tag: "Estrella", tagColor: COLORS.sageDark },
      { name: "Chilaquiles Rojos", desc: "Totopos en salsa roja casera, frijoles negros y dos huevos al gusto", price: "$145", tag: null },
      { name: "Chilaquiles con Pollo", desc: "Salsa verde o roja, pechuga de pollo desmenuzada, crema y queso Oaxaca", price: "$175", tag: "Recomendado", tagColor: COLORS.sage },
      { name: "Chilaquiles Divorciados", desc: "La mitad en rojo y la mitad en verde, con los dos mejores salsas de la casa", price: "$160", tag: "Nuevo", tagColor: COLORS.sageDark },
      { name: "Chilaquiles Negros", desc: "Salsa de chile negro ahumado, frijoles charros y queso panela crujiente", price: "$160", tag: null },
    ]
  },
  cafe: {
    label: "Café",
    emoji: "☕",
    items: [
      { name: "Espresso", desc: "Extracción doble, origen único de altura. 18g in / 36ml out en 27 segundos", price: "$65", tag: null },
      { name: "Cappuccino", desc: "Espresso doble con leche vaporizada en microespuma de textura sedosa", price: "$85", tag: null },
      { name: "Latte de la Casa", desc: "Espresso, leche entera, jarabe de canela y vainilla mexicana", price: "$95", tag: "Recomendado", tagColor: COLORS.sage },
      { name: "Cold Brew Naranja", desc: "Cold brew 18 horas, tónica, ralladura de naranja y hielo esférico", price: "$110", tag: "Nuevo", tagColor: COLORS.sageDark },
      { name: "Cortado Verde", desc: "Espresso con matcha latte y leche de avena, helado o caliente", price: "$100", tag: null },
    ]
  },
  brewbar: {
    label: "Brew Bar",
    emoji: "🫖",
    items: [
      { name: "V60 Single Origin", desc: "Varietal etíope natural, notas de durazno, bergamota y chocolate blanco", price: "$120", tag: "Estrella", tagColor: COLORS.sageDark },
      { name: "Aeropress Inverted", desc: "Guatemala SHB, 15 bar de presión, extracción de 90 segundos. Cuerpo denso", price: "$110", tag: null },
      { name: "Chemex 3 Tazas", desc: "Perfecto para compartir. Proceso lavado de Colombia, caramelo y mandarina", price: "$185", tag: "Para dos", tagColor: COLORS.muted },
      { name: "Cold Brew Botella", desc: "24 horas de inmersión en frío, servido en botella de 350ml con popote de caña", price: "$95", tag: null },
      { name: "Siphon Japonés", desc: "Técnica de vacío, granos de temporada. La ciencia del café en tu mesa", price: "$145", tag: "Exclusivo", tagColor: COLORS.sageDark },
    ]
  },
  pizzas: {
    label: "Pizzas",
    emoji: "🍕",
    items: [
      { name: "Margherita Clásica", desc: "Masa madre 72h, salsa San Marzano, mozzarella di bufala y albahaca fresca", price: "$215", tag: null },
      { name: "Prosciutto & Rúcula", desc: "Base blanca de ricotta, jamón serrano, rúcula baby, parmesano y miel de trufa", price: "$265", tag: "Recomendado", tagColor: COLORS.sage },
      { name: "Chapulín & Requesón", desc: "Chapulines tostados de Oaxaca, requesón, chile de agua y maíz morado", price: "$245", tag: "Nuevo", tagColor: COLORS.sageDark },
      { name: "Funghi Trufado", desc: "Crema de hongos, mix de setas silvestres, aceite de trufa negra y tomillo fresco", price: "$250", tag: null },
      { name: "Mamboreta Signature", desc: "Barbacoa de res, salsa borracha, guacamole y cebollas encurtidas en lima", price: "$280", tag: "Estrella", tagColor: COLORS.sageDark },
    ]
  },
  mixologia: {
    label: "Mixología",
    emoji: "🍹",
    items: [
      { name: "Mamboreta Sour", desc: "Mezcal artesanal, yuzu, aquafaba, sal de gusano y espuma de lima. La firma", price: "$165", tag: "Estrella", tagColor: COLORS.sageDark },
      { name: "Verde Que Te Quiero", desc: "Gin, pepino, matcha, limón persa y soda de pepita de uva. Refrescante y herbáceo", price: "$150", tag: "Recomendado", tagColor: COLORS.sage },
      { name: "Negrita Pasión", desc: "Ron negro, maracuyá, jengibre, bitters de cardamomo y ginger beer artesanal", price: "$155", tag: null },
      { name: "Mantis Spritz", desc: "Aperol, cava rosado, naranja sanguínea, tomillo y hielo esférico gigante", price: "$160", tag: "Nuevo", tagColor: COLORS.sageDark },
      { name: "Sin Alcohol: Brunch Garden", desc: "Agua de Jamaica cold brew, lavanda, limón, menta y soda de jengibre", price: "$95", tag: "Zero", tagColor: COLORS.sage },
    ]
  },
};

const TABS = Object.keys(MENU);

/* ─── TIME SLOTS ─────────────────────────────────────────────────── */
const SLOTS = [
  "9:00 am","9:30 am","10:00 am","10:30 am",
  "11:00 am","11:30 am","12:00 pm","12:30 pm",
  "1:00 pm","1:30 pm","7:00 pm","7:30 pm",
  "8:00 pm","8:30 pm","9:00 pm","9:30 pm",
];
const TAKEN = ["10:30 am","12:00 pm","8:00 pm","9:00 pm"];

/* ─── COMPONENTS ──────────────────────────────────────────────────── */

const Navbar = ({ scrolled }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:1000,
      padding:"0 32px",
      background: scrolled ? "rgba(245,240,230,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid rgba(118,156,118,0.15)` : "none",
      transition:"all 0.4s ease",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      height:"72px",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
        <MantisLogo size={36} color={COLORS.sage} />
        <div>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:600, fontSize:"18px", letterSpacing:"0.04em", color:COLORS.ink, lineHeight:1 }}>
            MAMBORETA
          </div>
          <div style={{ fontSize:"10px", fontWeight:400, color:COLORS.muted, letterSpacing:"0.2em", textTransform:"uppercase", marginTop:"1px" }}>
            Coffee · Brunch · Dinner
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:"36px", alignItems:"center" }}>
        {["Menú","Reservar","Nosotros"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} className="nav-link"
            style={{ fontSize:"14px", fontWeight:500, color:COLORS.inkMid, textDecoration:"none", letterSpacing:"0.02em" }}>
            {l}
          </a>
        ))}
        <a href="#reservar">
          <button className="btn-primary" style={{ padding:"10px 24px", fontSize:"14px" }}>
            Book a Table
          </button>
        </a>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section id="inicio" style={{
    minHeight:"100vh", display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", textAlign:"center",
    padding:"120px 24px 80px",
    position:"relative", overflow:"hidden",
    background:`linear-gradient(170deg, ${COLORS.white} 0%, ${COLORS.cream} 60%, ${COLORS.creamDeep} 100%)`,
  }}>
    {/* Decorative circles */}
    <div style={{
      position:"absolute", top:"10%", left:"-8%", width:"500px", height:"500px",
      background:`radial-gradient(circle, rgba(118,156,118,0.12) 0%, transparent 70%)`,
      borderRadius:"50%", pointerEvents:"none",
    }}/>
    <div style={{
      position:"absolute", bottom:"5%", right:"-5%", width:"400px", height:"400px",
      background:`radial-gradient(circle, rgba(118,156,118,0.08) 0%, transparent 70%)`,
      borderRadius:"50%", pointerEvents:"none",
    }}/>
    {/* Floating mantis */}
    <div className="float-anim animate-fadeIn delay-200" style={{ marginBottom:"32px" }}>
      <MantisLogo size={88} color={COLORS.sage} />
    </div>

    <div className="animate-fadeUp" style={{ maxWidth:"760px" }}>
      <div style={{
        display:"inline-flex", alignItems:"center", gap:"8px",
        background:"rgba(118,156,118,0.12)", border:`1px solid rgba(118,156,118,0.3)`,
        borderRadius:"100px", padding:"6px 18px", marginBottom:"28px",
        fontSize:"12px", fontWeight:600, color:COLORS.sageDark, letterSpacing:"0.12em", textTransform:"uppercase",
      }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:COLORS.sage, display:"inline-block" }}/>
        Ahora abierto · Durango, México
      </div>

      <h1 style={{
        fontFamily:"'Cormorant Garamond', serif", fontWeight:300, lineHeight:1.05,
        fontSize:"clamp(56px, 8vw, 100px)", color:COLORS.ink, letterSpacing:"-0.02em",
        marginBottom:"8px",
      }}>
        El sabor que<br/>
        <em style={{ fontStyle:"italic", color:COLORS.sage }}>cambia</em> todo.
      </h1>

      <p className="animate-fadeUp delay-200" style={{
        fontSize:"clamp(16px, 2vw, 20px)", fontWeight:300, color:COLORS.muted,
        maxWidth:"540px", margin:"24px auto 48px", lineHeight:1.7,
      }}>
        Brunch sin apuro, cenas con historia y café de especialidad que detiene el tiempo.
        Bienvenido a Mamboreta.
      </p>

      <div className="animate-fadeUp delay-300" style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
        <a href="#reservar">
          <button className="btn-primary pulse-ring" style={{ fontSize:"16px", padding:"16px 36px" }}>
            <span>Book a Table</span>
            <span>→</span>
          </button>
        </a>
        <a href="#menu">
          <button className="btn-outline">Ver Menú</button>
        </a>
      </div>
    </div>

    {/* Stats row */}
    <div className="animate-fadeUp delay-500" style={{
      display:"flex", gap:"48px", justifyContent:"center", flexWrap:"wrap",
      marginTop:"80px", paddingTop:"48px",
      borderTop:`1px solid rgba(118,156,118,0.2)`,
    }}>
      {[
        { num:"5+", label:"Años de experiencia" },
        { num:"48", label:"Asientos disponibles" },
        { num:"100%", label:"Ingredientes locales" },
        { num:"☕", label:"Café de especialidad" },
      ].map(s => (
        <div key={s.label} style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"32px", fontWeight:600, color:COLORS.ink }}>{s.num}</div>
          <div style={{ fontSize:"12px", fontWeight:400, color:COLORS.muted, marginTop:"4px", letterSpacing:"0.05em" }}>{s.label}</div>
        </div>
      ))}
    </div>
    {/* Scroll hint */}
    <div style={{ position:"absolute", bottom:"32px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", opacity:0.4 }}>
      <div style={{ fontSize:"11px", letterSpacing:"0.15em", textTransform:"uppercase", color:COLORS.muted }}>Scroll</div>
      <div style={{ width:"1px", height:"40px", background:COLORS.sage, opacity:0.6 }}/>
    </div>
  </section>
);

const MenuCard = ({ item }) => (
  <div className="card-hover animate-scaleIn" style={{
    background:COLORS.white, borderRadius:"20px", padding:"28px",
    border:`1px solid rgba(118,156,118,0.12)`,
    display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"16px",
  }}>
    <div style={{ flex:1 }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px", flexWrap:"wrap" }}>
        <span style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:600, fontSize:"19px", color:COLORS.ink }}>
          {item.name}
        </span>
        {item.tag && (
          <span className="tag-badge" style={{
            background: item.tagColor ? `${item.tagColor}18` : `${COLORS.sage}18`,
            color: item.tagColor || COLORS.sage,
            border:`1px solid ${item.tagColor || COLORS.sage}30`,
          }}>
            {item.tag}
          </span>
        )}
      </div>
      <p style={{ fontSize:"14px", fontWeight:300, color:COLORS.muted, lineHeight:1.6 }}>{item.desc}</p>
    </div>
    <div style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:600, fontSize:"22px", color:COLORS.sageDark, whiteSpace:"nowrap" }}>
      {item.price}
    </div>
  </div>
);

const MenuSection = () => {
  const [active, setActive] = useState("chilaquiles");

  return (
    <section id="menu" style={{ padding:"120px 0", background:COLORS.cream }}>
      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"0 24px" }}>
        {/* Heading */}
        <div style={{ textAlign:"center", marginBottom:"64px" }}>
          <div style={{ fontSize:"12px", fontWeight:600, color:COLORS.sage, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"16px" }}>
            — Menú Digital —
          </div>
          <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:300, fontSize:"clamp(40px, 5vw, 60px)", color:COLORS.ink, lineHeight:1.1 }}>
            Una mesa llena de<br/><em style={{ fontStyle:"italic", color:COLORS.sage }}>posibilidades</em>
          </h2>
          <p style={{ fontSize:"16px", fontWeight:300, color:COLORS.muted, marginTop:"20px", maxWidth:"480px", margin:"20px auto 0", lineHeight:1.7 }}>
            Desde el primer café hasta la última copa. Todo hecho con atención, sin atajos.
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display:"flex", gap:"8px", justifyContent:"center", flexWrap:"wrap",
          marginBottom:"48px",
          background:COLORS.creamDeep, borderRadius:"100px", padding:"6px",
          maxWidth:"fit-content", margin:"0 auto 48px",
        }}>
          {TABS.map(t => (
            <button key={t} className="tab-pill"
              onClick={() => setActive(t)}
              style={{
                background: active === t ? COLORS.ink : "transparent",
                color: active === t ? COLORS.cream : COLORS.muted,
              }}
            >
              {MENU[t].emoji} {MENU[t].label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div key={active} style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
          {MENU[active].items.map((item, i) => (
            <div key={item.name} className={`delay-${i * 100}`} style={{ animationDelay:`${i * 0.07}s` }}>
              <MenuCard item={item} />
            </div>
          ))}
        </div>

        <div style={{ textAlign:"center", marginTop:"48px", fontSize:"13px", color:COLORS.muted, fontStyle:"italic" }}>
          Precios en pesos mexicanos · IVA incluido · Menú de temporada sujeto a cambios
        </div>
      </div>
    </section>
  );
};

/* ─── RESERVATION FORM ───────────────────────────────────────────── */
const ReservationSection = () => {
  const [form, setForm] = useState({ name:"", date:"", time:"", guests:2, contact:"", notes:"" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [apiResponse, setApiResponse] = useState(null);

  const set = (k,v) => setForm(f => ({ ...f, [k]:v }));

  const available = SLOTS.filter(s => !TAKEN.includes(s));
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!form.name || !form.date || !form.time || !form.contact) {
      setStatus("error"); return;
    }
    setStatus("loading");
    // Simulate API call
    await new Promise(r => setTimeout(r, 1800));
    const payload = {
      reservationId: `MMB-${Math.random().toString(36).substring(2,8).toUpperCase()}`,
      status: "confirmed",
      ...form,
      timestamp: new Date().toISOString(),
      confirmationSentTo: form.contact,
    };
    setApiResponse(payload);
    setStatus("success");
  };

  if (status === "success") return (
    <section id="reservar" style={{ padding:"120px 0", background:`linear-gradient(160deg, ${COLORS.white}, ${COLORS.cream})` }}>
      <div style={{ maxWidth:"600px", margin:"0 auto", padding:"0 24px", textAlign:"center" }}>
        <div className="animate-scaleIn" style={{
          background:COLORS.white, borderRadius:"28px", padding:"56px 48px",
          border:`2px solid rgba(118,156,118,0.3)`,
          boxShadow:"0 40px 80px rgba(28,31,26,0.08)",
        }}>
          <div style={{ fontSize:"56px", marginBottom:"20px" }}>🎉</div>
          <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:400, fontSize:"36px", color:COLORS.ink, marginBottom:"12px" }}>
            ¡Reserva confirmada!
          </h3>
          <p style={{ color:COLORS.muted, fontSize:"16px", fontWeight:300, marginBottom:"32px" }}>
            Te esperamos el <strong style={{color:COLORS.ink}}>{apiResponse?.date}</strong> a las <strong style={{color:COLORS.ink}}>{apiResponse?.time}</strong>
          </p>
          {/* JSON Payload - developer easter egg */}
          <div style={{
            background:COLORS.ink, borderRadius:"16px", padding:"24px", textAlign:"left",
            fontFamily:"monospace", fontSize:"12px", lineHeight:1.7, color:"#a8d8a8",
            marginBottom:"32px", overflow:"auto",
          }}>
            <div style={{ color:"#769C76", marginBottom:"8px", fontSize:"11px", letterSpacing:"0.1em" }}>// API Response 200 OK</div>
            {JSON.stringify(apiResponse, null, 2).split("\n").map((l,i) => (
              <div key={i} style={{ color: l.includes('"') ? "#c8e6c9" : "#ffffff" }}>{l}</div>
            ))}
          </div>
          <p style={{ fontSize:"12px", color:COLORS.muted }}>Recibirás confirmación a: <strong>{apiResponse?.contact}</strong></p>
          <button className="btn-sage" style={{ marginTop:"24px" }} onClick={() => { setStatus("idle"); setForm({ name:"",date:"",time:"",guests:2,contact:"",notes:"" }); setApiResponse(null); }}>
            Nueva Reserva
          </button>
        </div>
      </div>
    </section>
  );

  return (
    <section id="reservar" style={{ padding:"120px 0", background:`linear-gradient(160deg, ${COLORS.white}, ${COLORS.cream})` }}>
      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"0 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"start" }}>
        {/* Left copy */}
        <div>
          <div style={{ fontSize:"12px", fontWeight:600, color:COLORS.sage, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:"20px" }}>
            — Reservaciones —
          </div>
          <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:300, fontSize:"clamp(36px, 4vw, 54px)", color:COLORS.ink, lineHeight:1.1, marginBottom:"24px" }}>
            Asegura tu<br/><em style={{ fontStyle:"italic", color:COLORS.sage }}>lugar</em> en la mesa
          </h2>
          <p style={{ fontSize:"16px", fontWeight:300, color:COLORS.muted, lineHeight:1.7, marginBottom:"40px" }}>
            Mesas para brunch de jueves a domingo desde las 9am. Cenas de martes a sábado a partir de las 7pm. Grupos de más de 8 personas, escríbenos directo.
          </p>
          {/* Info cards */}
          {[
            { icon:"🕘", label:"Brunch", val:"Jue–Dom · 9am – 2pm" },
            { icon:"🌙", label:"Cena", val:"Mar–Sáb · 7pm – 11pm" },
            { icon:"📍", label:"Ubicación", val:"C. Aquiles Serdán 1225, Madrazo, Durango" },
          ].map(info => (
            <div key={info.label} style={{
              display:"flex", alignItems:"center", gap:"16px", marginBottom:"16px",
              background:COLORS.white, borderRadius:"14px", padding:"16px 20px",
              border:`1px solid rgba(118,156,118,0.15)`,
            }}>
              <span style={{ fontSize:"22px" }}>{info.icon}</span>
              <div>
                <div style={{ fontSize:"12px", fontWeight:600, color:COLORS.muted, letterSpacing:"0.08em", textTransform:"uppercase" }}>{info.label}</div>
                <div style={{ fontSize:"15px", fontWeight:400, color:COLORS.ink, marginTop:"2px" }}>{info.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right form */}
        <div style={{
          background:COLORS.white, borderRadius:"28px", padding:"40px",
          boxShadow:"0 30px 70px rgba(28,31,26,0.07)",
          border:`1px solid rgba(118,156,118,0.15)`,
        }}>
          <h3 style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:600, fontSize:"26px", color:COLORS.ink, marginBottom:"28px" }}>
            Hacer una reserva
          </h3>
          {status === "error" && (
            <div style={{ background:"#fff3f3", border:"1px solid #ffb3b3", borderRadius:"12px", padding:"12px 16px", marginBottom:"20px", fontSize:"14px", color:"#cc2200" }}>
              Por favor completa todos los campos requeridos.
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            <div>
              <label style={{ fontSize:"12px", fontWeight:600, color:COLORS.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:"8px" }}>
                Nombre completo *
              </label>
              <input className="input-field" placeholder="Tu nombre" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <div>
                <label style={{ fontSize:"12px", fontWeight:600, color:COLORS.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:"8px" }}>
                  Fecha *
                </label>
                <input type="date" className="input-field" min={today} value={form.date} onChange={e => set("date", e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:"12px", fontWeight:600, color:COLORS.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:"8px" }}>
                  Personas
                </label>
                <select className="input-field" value={form.guests} onChange={e => set("guests", e.target.value)}>
                  {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1?"persona":"personas"}</option>)}
                </select>
              </div>
            </div>

            {/* Time slots */}
            <div>
              <label style={{ fontSize:"12px", fontWeight:600, color:COLORS.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:"12px" }}>
                Horario * {form.time && <span style={{ color:COLORS.sage, marginLeft:"8px" }}>✓ {form.time}</span>}
              </label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                {SLOTS.map(slot => {
                  const isTaken = TAKEN.includes(slot);
                  const isSelected = form.time === slot;
                  return (
                    <button key={slot} disabled={isTaken}
                      onClick={() => !isTaken && set("time", slot)}
                      style={{
                        padding:"8px 14px", borderRadius:"10px", fontSize:"13px", fontWeight:500,
                        border:`1.5px solid ${isSelected ? COLORS.sage : isTaken ? "#E8E5DF" : "#D8D5CC"}`,
                        background: isSelected ? COLORS.sage : isTaken ? "#F5F3EF" : COLORS.white,
                        color: isSelected ? "white" : isTaken ? "#C5C0B5" : COLORS.inkMid,
                        cursor: isTaken ? "not-allowed" : "pointer",
                        transition:"all 0.15s",
                        textDecoration: isTaken ? "line-through" : "none",
                        fontFamily:"'DM Sans', sans-serif",
                      }}>
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ fontSize:"12px", fontWeight:600, color:COLORS.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:"8px" }}>
                Contacto (tel / email) *
              </label>
              <input className="input-field" placeholder="612 345 6789 o tu@email.com" value={form.contact} onChange={e => set("contact", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize:"12px", fontWeight:600, color:COLORS.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:"8px" }}>
                Notas especiales
              </label>
              <textarea className="input-field" rows={2} placeholder="Alergias, ocasión especial, preferencias..." value={form.notes} onChange={e => set("notes", e.target.value)} style={{ resize:"vertical", minHeight:"80px" }} />
            </div>

            <button className="btn-sage" onClick={handleSubmit} disabled={status === "loading"}
              style={{ marginTop:"8px", justifyContent:"center", fontSize:"16px", padding:"16px", width:"100%", opacity: status === "loading" ? 0.75 : 1 }}>
              {status === "loading" ? (
                <span>Verificando disponibilidad…</span>
              ) : (
                <><span>Confirmar Reserva</span><span>→</span></>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── FOOTER ─────────────────────────────────────────────────────── */
const Footer = () => {
  const [showEgg, setShowEgg] = useState(false);

  return (
    <footer style={{
      background:COLORS.ink, color:COLORS.cream, padding:"80px 24px 40px",
    }}>
      <div style={{ maxWidth:"960px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr", gap:"64px", marginBottom:"64px", flexWrap:"wrap" }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
              <MantisLogo size={40} color={COLORS.sage} />
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:600, fontSize:"20px", letterSpacing:"0.06em" }}>MAMBORETA</div>
                <div style={{ fontSize:"10px", fontWeight:300, color:COLORS.muted, letterSpacing:"0.2em", textTransform:"uppercase" }}>Coffee · Brunch · Dinner</div>
              </div>
            </div>
            <p style={{ fontSize:"14px", fontWeight:300, color:"rgba(245,240,230,0.55)", lineHeight:1.7, maxWidth:"280px" }}>
              Un espacio donde el café de especialidad se encuentra con la cocina contemporánea y la mixología de autor.
            </p>
            <div style={{ display:"flex", gap:"16px", marginTop:"28px" }}>
              {["Instagram","Facebook"].map(s => (
                <a key={s} href="#" style={{
                  display:"inline-flex", alignItems:"center", gap:"6px",
                  background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)",
                  borderRadius:"100px", padding:"8px 18px", fontSize:"13px", fontWeight:500,
                  color:"rgba(245,240,230,0.75)", textDecoration:"none", transition:"all 0.2s",
                }}>
                  {s === "Instagram" ? "📸" : "👤"} {s}
                </a>
              ))}
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h4 style={{ fontWeight:600, fontSize:"13px", letterSpacing:"0.15em", textTransform:"uppercase", color:COLORS.sage, marginBottom:"20px" }}>Horarios</h4>
            {[
              ["Lunes–Miércoles","Cerrado"],
              ["Jueves–Domingo","Brunch 9am–2pm"],
              ["Martes–Sábado","Cena 7pm–11pm"],
            ].map(([d,h]) => (
              <div key={d} style={{ marginBottom:"12px" }}>
                <div style={{ fontSize:"12px", color:"rgba(245,240,230,0.45)", marginBottom:"2px" }}>{d}</div>
                <div style={{ fontSize:"14px", fontWeight:400 }}>{h}</div>
              </div>
            ))}
          </div>

          {/* Contacto */}
          <div>
            <h4 style={{ fontWeight:600, fontSize:"13px", letterSpacing:"0.15em", textTransform:"uppercase", color:COLORS.sage, marginBottom:"20px" }}>Contacto</h4>
            {[
              ["📍","C. Aquiles Serdán 1225, Madrazo, 34075 Durango, Dgo."],
              ["📱","WhatsApp disponible"],
              ["📧","hola@mamboreta.mx"],
            ].map(([icon, val]) => (
              <div key={val} style={{ display:"flex", gap:"10px", alignItems:"flex-start", marginBottom:"14px" }}>
                <span>{icon}</span>
                <span style={{ fontSize:"14px", fontWeight:300, color:"rgba(245,240,230,0.7)" }}>{val}</span>
              </div>
            ))}
            {/* Easter egg trigger */}
            <div style={{ marginTop:"24px" }}>
              <div
                onClick={() => setShowEgg(e => !e)}
                style={{ cursor:"pointer", display:"inline-flex", alignItems:"center", gap:"8px",
                  fontSize:"12px", color:"rgba(245,240,230,0.3)",
                  borderBottom:"1px dashed rgba(245,240,230,0.15)", paddingBottom:"2px",
                  transition:"color 0.2s",
                }}
                title="👀 pssst...">
                🌐 Red Wi-Fi
              </div>
              {showEgg && (
                <div className="animate-scaleIn" style={{
                  marginTop:"12px", background:"rgba(118,156,118,0.15)",
                  border:`1px solid rgba(118,156,118,0.3)`, borderRadius:"12px",
                  padding:"14px 18px",
                }}>
                  <div style={{ fontSize:"11px", color:COLORS.sage, letterSpacing:"0.1em", marginBottom:"4px" }}>🔐 CONTRASEÑA WI-FI</div>
                  <div style={{ fontFamily:"monospace", fontSize:"16px", fontWeight:600, color:COLORS.cream, letterSpacing:"0.05em" }}>
                    mamboreta2024
                  </div>
                  <div style={{ fontSize:"11px", color:"rgba(245,240,230,0.35)", marginTop:"4px" }}>¡Bienvenido, explorador! 🪲</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{
          borderTop:`1px solid rgba(255,255,255,0.08)`, paddingTop:"32px",
          display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px",
          fontSize:"12px", color:"rgba(245,240,230,0.3)",
        }}>
          <span>© {new Date().getFullYear()} Mamboreta. Todos los derechos reservados.</span>
          <span>Hecho con ☕ & 🪲 en Durango, México</span>
        </div>
      </div>
    </footer>
  );
};

/* ─── APP ─────────────────────────────────────────────────────────── */
export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalCSS;
    document.head.appendChild(style);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="grain-overlay">
      <Navbar scrolled={scrolled} />
      <Hero />
      <MenuSection />
      <ReservationSection />
      <Footer />
    </div>
  );
}
