import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0D0D0D",
  surface: "#161616",
  card: "#1C1C1C",
  cardHover: "#222222",
  gold: "#C8A55C",
  goldLight: "#E2C97E",
  goldDim: "#A68A3E",
  cream: "#F5F0E8",
  creamMuted: "#BDB5A8",
  white: "#FAFAFA",
  muted: "#888880",
  accent: "#D4A853",
  green: "#5CB87A",
  greenDim: "#3A8A55",
  divider: "#2A2A28",
};

const PRODUCTS = [
  {
    name: "K8 Kangen Water Machine",
    tag: "Flagship Ionizer",
    icon: "💧",
    desc: "Transforms tap water into antioxidant-rich, hydrogen-infused Kangen water using 8 platinum-dipped titanium plates. Over 68 uses — from drinking water to beauty toner to natural disinfectant.",
    highlights: ["Molecular hydration", "68+ uses", "Built to last 20+ years", "Replaces dozens of products"],
    color: "#4A9EDE",
  },
  {
    name: "Anespa Mineral Shower",
    tag: "Luxury Spa System",
    icon: "🚿",
    desc: "Removes chlorine and heavy metals from shower water, replacing them with natural hot spring minerals from Japan. Transforms your daily shower into a healing ritual.",
    highlights: ["Removes harmful chemicals", "Japanese hot spring minerals", "Softer hair & skin", "Daily rejuvenation"],
    color: "#7EBDC2",
  },
  {
    name: "Ukon Turmeric Supplement",
    tag: "Okinawa Wellness",
    icon: "🌿",
    desc: "Grown on private farms in Okinawa — one of the world's Blue Zones. Harvested at peak potency, fermented for bioavailability, and encapsulated with Kangen water.",
    highlights: ["Blue Zone sourced", "Anti-inflammatory", "Immune support", "Capsules, soap & tea"],
    color: "#D4A853",
  },
  {
    name: "MGuard EMF Protection",
    tag: "Home Sanctuary",
    icon: "🛡️",
    desc: "Plugs into your home and neutralizes harmful electromagnetic frequencies from WiFi, devices, and electronics. Creates a calm, balanced environment for better focus and rest.",
    highlights: ["EMF neutralization", "Improved sleep & focus", "Whole-home coverage", "Plug & protect"],
    color: "#9B8EC4",
  },
];

const LEGACY_PRODUCTS = [
  { name: "K8 Kangen Machine", icon: "💧" },
  { name: "Anespa Shower", icon: "🚿" },
  { name: "Ukon Supplement", icon: "🌿" },
  { name: "MGuard EMF", icon: "🛡️" },
  { name: "Super 501", icon: "⚡" },
];

const ROADMAP_STEPS = [
  { sale: 1, rank: "3A", commission: 3030, cumulative: 3030, note: "Your very first sale" },
  { sale: 2, rank: "3A", commission: 3030, cumulative: 6060, note: "Building momentum" },
  { sale: 3, rank: "4A", commission: 4040, cumulative: 10100, note: "Already 5 figures!" },
  { sale: 4, rank: "5A", commission: 5050, cumulative: 15150, note: "Accelerating fast" },
  { sale: 5, rank: "5A", commission: 5050, cumulative: 20200, note: "$20K milestone!" },
  { sale: 6, rank: "6A", commission: 6060, cumulative: 26260, note: "Max rank unlocked" },
  { sale: 7, rank: "6A", commission: 6060, cumulative: 32320, note: "Compounding power" },
  { sale: 8, rank: "6A", commission: 6060, cumulative: 38380, note: "Consistency pays" },
  { sale: 9, rank: "6A", commission: 6060, cumulative: 44440, note: "Almost $50K" },
  { sale: 10, rank: "6A", commission: 6060, cumulative: 50500, note: "$50K from 10 sales!" },
];

const PIE_SLICES = [
  { label: "1A", angle: 45 },
  { label: "2A", angle: 45 },
  { label: "3A", angle: 45 },
  { label: "4A", angle: 45 },
  { label: "5A", angle: 45 },
  { label: "6A", angle: 45 },
  { label: "6A+", angle: 45 },
  { label: "Max", angle: 45 },
];

function AnimatedNumber({ value, prefix = "$", duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = Date.now();
          const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref}>
      {prefix}{display.toLocaleString()}
    </span>
  );
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Section({ children, id, style }) {
  const [ref, inView] = useInView(0.08);
  return (
    <section
      ref={ref}
      id={id}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(40px)",
        transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function PieChart({ activeSlices = 8 }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 85;
  const sliceAngle = 360 / 8;

  const getSlicePath = (index) => {
    const startAngle = (index * sliceAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * sliceAngle - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`;
  };

  const getLabelPos = (index) => {
    const midAngle = ((index + 0.5) * sliceAngle - 90) * (Math.PI / 180);
    return {
      x: cx + (r * 0.6) * Math.cos(midAngle),
      y: cy + (r * 0.6) * Math.sin(midAngle),
    };
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {Array.from({ length: 8 }).map((_, i) => {
        const active = i < activeSlices;
        const pos = getLabelPos(i);
        return (
          <g key={i}>
            <path
              d={getSlicePath(i)}
              fill={active ? `hsl(${40 + i * 5}, ${60 + i * 3}%, ${45 + i * 3}%)` : "#2A2A28"}
              stroke={COLORS.bg}
              strokeWidth="2"
              style={{
                transition: "all 0.5s ease",
                opacity: active ? 1 : 0.3,
              }}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={active ? "#fff" : "#555"}
              fontSize="11"
              fontWeight="600"
              fontFamily="inherit"
            >
              {i + 1}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="22" fill={COLORS.bg} />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill={COLORS.gold} fontSize="14" fontWeight="700" fontFamily="inherit">
        {activeSlices}/8
      </text>
    </svg>
  );
}

function CommissionCalculator() {
  const [salesPerMonth, setSalesPerMonth] = useState(2);
  const [packageType, setPackageType] = useState("quad");
  const [rank, setRank] = useState(6);

  const commissionPerPoint = packageType === "quad" ? 1010 : 351;
  const points = Math.min(rank + 2, 8);
  const perSale = commissionPerPoint * points;
  const monthly = perSale * salesPerMonth;
  const yearly = monthly * 12;

  return (
    <div style={{ background: COLORS.card, borderRadius: 20, padding: "36px 32px", border: `1px solid ${COLORS.divider}` }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: COLORS.cream, margin: "0 0 8px", fontWeight: 600 }}>
        Commission Calculator
      </h3>
      <p style={{ color: COLORS.muted, fontSize: 14, margin: "0 0 28px", lineHeight: 1.5 }}>
        See your potential earnings with the Quad Strategy
      </p>

      <div style={{ marginBottom: 24 }}>
        <label style={{ color: COLORS.creamMuted, fontSize: 13, display: "block", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Package Type
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { key: "k8", label: "K8 Only" },
            { key: "quad", label: "Quad" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setPackageType(opt.key)}
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 10,
                border: `1.5px solid ${packageType === opt.key ? COLORS.gold : COLORS.divider}`,
                background: packageType === opt.key ? `${COLORS.gold}15` : "transparent",
                color: packageType === opt.key ? COLORS.gold : COLORS.muted,
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "inherit",
                transition: "all 0.3s ease",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ color: COLORS.creamMuted, fontSize: 13, display: "block", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Your Rank: {rank}A {rank >= 6 && "⭐"}
        </label>
        <input
          type="range"
          min={1}
          max={6}
          value={rank}
          onChange={(e) => setRank(Number(e.target.value))}
          style={{ width: "100%", accentColor: COLORS.gold }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.muted, fontSize: 12, marginTop: 4 }}>
          <span>1A</span><span>6A</span>
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <label style={{ color: COLORS.creamMuted, fontSize: 13, display: "block", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Sales Per Month: {salesPerMonth}
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={salesPerMonth}
          onChange={(e) => setSalesPerMonth(Number(e.target.value))}
          style={{ width: "100%", accentColor: COLORS.gold }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", color: COLORS.muted, fontSize: 12, marginTop: 4 }}>
          <span>1</span><span>10</span>
        </div>
      </div>

      <div style={{ background: COLORS.bg, borderRadius: 16, padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: COLORS.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Per Sale</div>
          <div style={{ color: COLORS.green, fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
            ${perSale.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: COLORS.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Monthly</div>
          <div style={{ color: COLORS.goldLight, fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
            ${monthly.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: COLORS.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Yearly</div>
          <div style={{ color: COLORS.cream, fontSize: 24, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
            ${yearly.toLocaleString()}
          </div>
        </div>
      </div>

      {packageType === "quad" && (
        <div style={{ marginTop: 16, padding: "12px 16px", background: `${COLORS.gold}10`, borderRadius: 10, border: `1px solid ${COLORS.gold}30` }}>
          <p style={{ color: COLORS.gold, fontSize: 13, margin: 0, lineHeight: 1.5 }}>
            ✦ With the 2A Ukon Hack, your top position earns an extra 2 commission points on every sale — that's an additional ${(commissionPerPoint * 2).toLocaleString()} per sale built in.
          </p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, index, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? COLORS.cardHover : COLORS.card,
        borderRadius: 16,
        padding: "24px 20px",
        border: `1.5px solid ${isActive ? product.color + "60" : COLORS.divider}`,
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: isActive ? "scale(1.02)" : "scale(1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${product.color}, ${product.color}80)`,
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isActive ? 16 : 0 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${product.color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {product.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: COLORS.cream, fontSize: 16, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>
            {product.name}
          </div>
          <div style={{ color: product.color, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
            {product.tag}
          </div>
        </div>
        <div style={{ color: COLORS.muted, fontSize: 18, transform: isActive ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease" }}>
          ▾
        </div>
      </div>

      {isActive && (
        <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
          <p style={{ color: COLORS.creamMuted, fontSize: 14, lineHeight: 1.7, margin: "0 0 16px" }}>
            {product.desc}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {product.highlights.map((h, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: `${product.color}0A`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: COLORS.cream,
                }}
              >
                <span style={{ color: product.color, fontSize: 10 }}>◆</span>
                {h}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RoadmapTimeline() {
  const [activeSale, setActiveSale] = useState(5);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap", justifyContent: "center" }}>
        {[5, 10].map((n) => (
          <button
            key={n}
            onClick={() => setActiveSale(n)}
            style={{
              padding: "10px 24px",
              borderRadius: 50,
              border: `1.5px solid ${activeSale === n ? COLORS.gold : COLORS.divider}`,
              background: activeSale === n ? `${COLORS.gold}15` : "transparent",
              color: activeSale === n ? COLORS.gold : COLORS.muted,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              transition: "all 0.3s ease",
            }}
          >
            First {n} Sales → ${ROADMAP_STEPS[n - 1].cumulative.toLocaleString()}
          </button>
        ))}
      </div>

      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 23, top: 0, bottom: 0, width: 2, background: COLORS.divider }} />

        {ROADMAP_STEPS.slice(0, activeSale).map((step, i) => {
          const isMilestone = step.sale === 5 || step.sale === 10;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 16,
                alignItems: "center",
                animation: `fadeSlideIn 0.4s ease ${i * 0.06}s both`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: isMilestone ? COLORS.gold : COLORS.card,
                  border: `2px solid ${isMilestone ? COLORS.gold : COLORS.divider}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isMilestone ? COLORS.bg : COLORS.cream,
                  fontWeight: 700,
                  fontSize: 15,
                  zIndex: 1,
                  flexShrink: 0,
                  fontFamily: "inherit",
                }}
              >
                {step.sale}
              </div>

              <div
                style={{
                  flex: 1,
                  background: isMilestone ? `${COLORS.gold}12` : COLORS.card,
                  borderRadius: 14,
                  padding: "16px 20px",
                  border: `1px solid ${isMilestone ? COLORS.gold + "40" : COLORS.divider}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ color: COLORS.cream, fontSize: 15, fontWeight: 600 }}>
                    {step.rank} Commission
                  </div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{step.note}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: COLORS.green, fontSize: 18, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                    ${step.commission.toLocaleString()}
                  </div>
                  <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>
                    Total: ${step.cumulative.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 24,
          background: `linear-gradient(135deg, ${COLORS.gold}20, ${COLORS.gold}08)`,
          borderRadius: 16,
          padding: 24,
          textAlign: "center",
          border: `1px solid ${COLORS.gold}30`,
        }}
      >
        <div style={{ color: COLORS.gold, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
          Total from {activeSale} sales
        </div>
        <div style={{ color: COLORS.cream, fontSize: 42, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
          <AnimatedNumber value={ROADMAP_STEPS[activeSale - 1].cumulative} />
        </div>
      </div>
    </div>
  );
}

function ComparisonBar({ label, k8Val, quadVal, maxVal }) {
  const [ref, inView] = useInView(0.3);
  return (
    <div ref={ref} style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: COLORS.cream, fontSize: 14, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 32, background: COLORS.card, borderRadius: 8, overflow: "hidden", position: "relative" }}>
            <div
              style={{
                height: "100%",
                width: inView ? `${(k8Val / maxVal) * 100}%` : "0%",
                background: "linear-gradient(90deg, #4A6B8A, #4A9EDE)",
                borderRadius: 8,
                transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 10,
              }}
            >
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>${k8Val.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 4 }}>K8 Only</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 32, background: COLORS.card, borderRadius: 8, overflow: "hidden", position: "relative" }}>
            <div
              style={{
                height: "100%",
                width: inView ? `${(quadVal / maxVal) * 100}%` : "0%",
                background: `linear-gradient(90deg, ${COLORS.goldDim}, ${COLORS.gold})`,
                borderRadius: 8,
                transition: "width 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 10,
              }}
            >
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>${quadVal.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ color: COLORS.gold, fontSize: 11, marginTop: 4 }}>Quad Strategy ✦</div>
        </div>
      </div>
    </div>
  );
}

function NavDot({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        width: active ? 28 : 10,
        height: 10,
        borderRadius: 5,
        background: active ? COLORS.gold : COLORS.divider,
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        padding: 0,
      }}
    />
  );
}

const SECTIONS = [
  "hero",
  "products",
  "quad-benefits",
  "commission",
  "ukon-hack",
  "roadmap",
  "legacy-suite",
  "investment",
  "calculator",
  "cta",
];
const SECTION_LABELS = [
  "Welcome",
  "Core Products",
  "Quad Benefits",
  "Commissions",
  "2A Hack",
  "Roadmap",
  "Legacy Suite",
  "Investment",
  "Calculator",
  "Next Step",
];

export default function QuadStrategyExplainer() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [quadBenefitStep, setQuadBenefitStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(i);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const quadBenefits = [
    { title: "Experience All 4 Products", desc: "Create a holistic wellness sanctuary at home — water, shower, supplements, and EMF protection. Products built to last 25+ years that replace dozens of household items.", icon: "🏠" },
    { title: "Earn From Day One", desc: "You're guaranteed to earn $776+ right away from your own product sales before you even launch your business. Money comes directly from Enagic to you.", icon: "💰" },
    { title: "3× Commissions Immediately", desc: "Start earning triple commissions on your very first sales. The Quad structure positions you to earn from multiple points instantly.", icon: "⚡" },
    { title: "Reach 6A 4× Faster", desc: "Only 25 Quad sales vs. 100 single K8 sales to reach the maximum rank. That's the difference between months and years.", icon: "🚀" },
    { title: "All-In Mindset", desc: "When you invest at this level, you treat it like a real business. You show up differently. You lead by example. Your team sees your commitment.", icon: "🔥" },
  ];

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.cream,
        fontFamily: "'DM Sans', -apple-system, sans-serif",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px ${COLORS.gold}20; }
          50% { box-shadow: 0 0 40px ${COLORS.gold}40; }
        }

        input[type="range"] {
          -webkit-appearance: none;
          height: 6px;
          border-radius: 3px;
          background: ${COLORS.divider};
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${COLORS.gold};
          cursor: pointer;
          box-shadow: 0 2px 8px ${COLORS.gold}40;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          background: linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight});
          color: ${COLORS.bg};
          border: none;
          border-radius: 60px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.3s ease;
          letter-spacing: 0.02em;
          text-decoration: none;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px ${COLORS.gold}50;
        }

        .container {
          max-width: 780px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .section-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: ${COLORS.gold}12;
          border: 1px solid ${COLORS.gold}30;
          border-radius: 50px;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${COLORS.gold};
          margin-bottom: 20px;
          font-weight: 600;
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(28px, 5vw, 38px);
          font-weight: 600;
          color: ${COLORS.cream};
          line-height: 1.2;
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 16px;
          color: ${COLORS.creamMuted};
          line-height: 1.7;
          margin-bottom: 36px;
        }

        @media (max-width: 640px) {
          .container { padding: 0 16px; }
          .section-title { font-size: 26px; }
        }
      `}</style>

      {/* Side Navigation */}
      <div
        style={{
          position: "fixed",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          zIndex: 100,
          alignItems: "flex-end",
        }}
      >
        {SECTIONS.map((s, i) => (
          <NavDot key={s} active={activeSection === i} label={SECTION_LABELS[i]} onClick={() => scrollTo(s)} />
        ))}
      </div>

      {/* ========== HERO ========== */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 30%, ${COLORS.gold}08 0%, transparent 60%)`,
          }}
        />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
          <div className="section-tag" style={{ margin: "0 auto 24px" }}>✦ The Strategy</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(36px, 7vw, 64px)",
              fontWeight: 600,
              lineHeight: 1.1,
              marginBottom: 20,
              color: COLORS.cream,
            }}
          >
            The Quad Strategy
          </h1>
          <p
            style={{
              fontSize: "clamp(16px, 2.5vw, 20px)",
              color: COLORS.creamMuted,
              lineHeight: 1.6,
              marginBottom: 12,
              maxWidth: 520,
              margin: "0 auto 12px",
            }}
          >
            The proven approach to fast-tracking your results, maximizing your commissions, and building a freedom-based business from day one.
          </p>
          <p style={{ fontSize: 14, color: COLORS.muted, marginBottom: 40 }}>
            Scroll to explore how the numbers work →
          </p>

          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { num: "$20K+", label: "First 5 Sales" },
              { num: "4×", label: "Faster to 6A" },
              { num: "$7K+", label: "Per Sale at Max" },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 24px",
                  background: COLORS.card,
                  borderRadius: 14,
                  border: `1px solid ${COLORS.divider}`,
                  minWidth: 120,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 28,
                    fontWeight: 700,
                    color: COLORS.gold,
                    marginBottom: 4,
                  }}
                >
                  {s.num}
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CORE PRODUCTS ========== */}
      <Section id="products" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="section-tag">✦ The Foundation</div>
          <h2 className="section-title">The Core Four Products</h2>
          <p className="section-subtitle">
            Four powerful products designed to create a holistic wellness sanctuary in your home — each one addressing a different dimension of your health.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PRODUCTS.map((p, i) => (
              <ProductCard
                key={i}
                product={p}
                index={i}
                isActive={activeProduct === i}
                onClick={() => setActiveProduct(activeProduct === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* ========== QUAD BENEFITS ========== */}
      <Section id="quad-benefits" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="section-tag">✦ Why The Quad</div>
          <h2 className="section-title">Why Start With All Four?</h2>
          <p className="section-subtitle">
            You only need one product to become a distributor — so why start with four? Because the Quad Strategy changes everything about your trajectory.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {quadBenefits.map((b, i) => (
              <div
                key={i}
                onClick={() => setQuadBenefitStep(quadBenefitStep === i ? -1 : i)}
                style={{
                  background: quadBenefitStep === i ? COLORS.cardHover : COLORS.card,
                  borderRadius: 14,
                  padding: "20px 24px",
                  border: `1px solid ${quadBenefitStep === i ? COLORS.gold + "40" : COLORS.divider}`,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 24 }}>{b.icon}</span>
                  <span style={{ color: COLORS.cream, fontSize: 16, fontWeight: 600, flex: 1 }}>{b.title}</span>
                  <span style={{ color: COLORS.muted, transform: quadBenefitStep === i ? "rotate(180deg)" : "", transition: "transform 0.3s" }}>▾</span>
                </div>
                {quadBenefitStep === i && (
                  <p style={{ color: COLORS.creamMuted, fontSize: 14, lineHeight: 1.7, marginTop: 14, paddingLeft: 38, animation: "fadeSlideIn 0.3s ease" }}>
                    {b.desc}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 32,
              background: `linear-gradient(135deg, ${COLORS.gold}10, transparent)`,
              borderRadius: 16,
              padding: 28,
              border: `1px solid ${COLORS.gold}20`,
              textAlign: "center",
            }}
          >
            <div style={{ color: COLORS.gold, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Immediate Earnings From Your Own Purchase
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: COLORS.cream }}>
              <AnimatedNumber value={776} />+
            </div>
            <div style={{ color: COLORS.muted, fontSize: 14, marginTop: 6 }}>
              $195 (Anespa) + $351 (K8) + $230 (Ukon) — earned before you even launch
            </div>
          </div>
        </div>
      </Section>

      {/* ========== COMMISSION BREAKDOWN ========== */}
      <Section id="commission" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="section-tag">✦ The 8-Point System</div>
          <h2 className="section-title">Think of It Like a Pie</h2>
          <p className="section-subtitle">
            Enagic's compensation plan has 8 points of commission — like 8 slices of a pie. As you rank up, you earn more slices. With the Quad Strategy, you can eventually earn all 8.
          </p>

          <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <PieChart activeSlices={1} />
              <div style={{ marginTop: 12, color: COLORS.muted, fontSize: 13 }}>Starting Out (1A)</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: COLORS.cream, marginTop: 4 }}>$351/point</div>
            </div>
            <div style={{ color: COLORS.gold, fontSize: 32 }}>→</div>
            <div style={{ textAlign: "center" }}>
              <PieChart activeSlices={8} />
              <div style={{ marginTop: 12, color: COLORS.gold, fontSize: 13, fontWeight: 600 }}>Quad at 6A (All 8)</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: COLORS.gold, marginTop: 4 }}>$7,164+</div>
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: COLORS.cream, marginBottom: 24 }}>
              K8 vs. Quad — Side by Side
            </h3>
            <ComparisonBar label="Per Point Commission" k8Val={351} quadVal={1010} maxVal={1100} />
            <ComparisonBar label="All 8 Points (per sale)" k8Val={2808} quadVal={7164} maxVal={7500} />
            <ComparisonBar label="5 Sales/Month at Max Rank" k8Val={14040} quadVal={35820} maxVal={58000} />
          </div>
        </div>
      </Section>

      {/* ========== 2A UKON HACK ========== */}
      <Section id="ukon-hack" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="section-tag">✦ The Secret Advantage</div>
          <h2 className="section-title">The 2A Ukon Hack</h2>
          <p className="section-subtitle">
            This is where the Quad Strategy truly shines. By placing your Ukon in your 2A lane, your top position earns an extra 2 commission points on every single sale you make — automatically.
          </p>

          <div style={{ background: COLORS.card, borderRadius: 20, padding: 32, border: `1px solid ${COLORS.divider}` }}>
            {/* Visual Diagram */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    padding: "14px 28px",
                    background: `${COLORS.gold}18`,
                    border: `2px solid ${COLORS.gold}`,
                    borderRadius: 12,
                    color: COLORS.gold,
                    fontWeight: 700,
                    fontSize: 15,
                  }}
                >
                  🔝 Your Top Position (MGA)
                </div>
                <div style={{ color: COLORS.gold, fontSize: 13 }}>Always earns 2A commissions ↓</div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 2, height: 20, background: COLORS.divider, margin: "0 auto" }} />
                    <div style={{ padding: "10px 20px", background: COLORS.card, border: `1.5px solid ${COLORS.divider}`, borderRadius: 10, fontSize: 13, color: COLORS.creamMuted }}>
                      1A Lane<br /><span style={{ fontSize: 11, color: COLORS.muted }}>Anespa & K8</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 2, height: 20, background: COLORS.gold, margin: "0 auto" }} />
                    <div
                      style={{
                        padding: "10px 20px",
                        background: `${COLORS.gold}12`,
                        border: `1.5px solid ${COLORS.gold}60`,
                        borderRadius: 10,
                        fontSize: 13,
                        color: COLORS.gold,
                        animation: "pulseGlow 2s infinite",
                      }}
                    >
                      2A Lane ✦<br /><span style={{ fontSize: 11 }}>Your Ukon → All sales here</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: COLORS.divider, margin: "24px 0" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ background: COLORS.bg, borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ color: COLORS.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Extra per K8 sale</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: COLORS.green }}>+$702</div>
              </div>
              <div style={{ background: COLORS.bg, borderRadius: 12, padding: 20, textAlign: "center" }}>
                <div style={{ color: COLORS.muted, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Extra per Quad sale</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: COLORS.gold }}>+$2,020</div>
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                padding: "16px 20px",
                background: `${COLORS.green}10`,
                border: `1px solid ${COLORS.green}30`,
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <p style={{ color: COLORS.green, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                With just 1 Quad sale per month, the 2A Ukon Hack earns you an extra <strong>$24,240/year</strong> — with zero additional work. It's built into the structure.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ========== ROADMAP ========== */}
      <Section id="roadmap" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="section-tag">✦ Your Roadmap</div>
          <h2 className="section-title">Your Path to $20K — Then $50K</h2>
          <p className="section-subtitle">
            Here's exactly what happens sale by sale using the Quad Strategy. Watch how quickly the commissions compound as you move through the ranks.
          </p>
          <RoadmapTimeline />
        </div>
      </Section>

      {/* ========== LEGACY SUITE ========== */}
      <Section id="legacy-suite" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="section-tag">✦ The Ultimate Package</div>
          <h2 className="section-title">The Legacy Suite</h2>
          <p className="section-subtitle">
            For those ready to go all-in at the highest level, the Legacy Suite adds the powerful Super 501 to the Quad — Enagic's premium commercial-grade machine. Five products. Maximum commission potential.
          </p>

          <div style={{ background: COLORS.card, borderRadius: 20, padding: 32, border: `1px solid ${COLORS.gold}30`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.goldLight}, ${COLORS.gold})` }} />

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
              {LEGACY_PRODUCTS.map((p, i) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 18px",
                    background: i === 4 ? `${COLORS.gold}18` : COLORS.bg,
                    border: `1.5px solid ${i === 4 ? COLORS.gold : COLORS.divider}`,
                    borderRadius: 12,
                    textAlign: "center",
                    minWidth: 110,
                    animation: `fadeSlideIn 0.4s ease ${i * 0.1}s both`,
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{p.icon}</div>
                  <div style={{ fontSize: 12, color: i === 4 ? COLORS.gold : COLORS.creamMuted, fontWeight: 600 }}>{p.name}</div>
                  {i === 4 && <div style={{ fontSize: 10, color: COLORS.gold, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>New Addition</div>}
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Products", value: "5", sub: "Complete ecosystem" },
                { label: "Commission Points", value: "10+", sub: "Even more pie slices" },
                { label: "Rank Acceleration", value: "5×", sub: "Fastest path to 6A" },
              ].map((item, i) => (
                <div key={i} style={{ background: COLORS.bg, borderRadius: 12, padding: 18, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: COLORS.gold }}>{item.value}</div>
                  <div style={{ fontSize: 13, color: COLORS.cream, fontWeight: 500, marginTop: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{item.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: "16px 20px", background: `${COLORS.gold}10`, borderRadius: 12, border: `1px solid ${COLORS.gold}25` }}>
              <p style={{ color: COLORS.goldLight, fontSize: 14, lineHeight: 1.6, margin: 0, textAlign: "center" }}>
                The Legacy Suite is the ultimate investment for those who want maximum commissions, maximum health benefits, and the fastest path to financial freedom. Your clarity coach will walk you through exactly how this looks for your situation.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ========== INVESTMENT MINDSET ========== */}
      <Section id="investment" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="section-tag">✦ Perspective Shift</div>
          <h2 className="section-title">It's an Investment — Let's Be Real</h2>
          <p className="section-subtitle">
            With full transparency — this is a significant investment. But let's put it in perspective against what people already spend without thinking twice.
          </p>

          <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
            {[
              { item: "University Degree", cost: "$40,000 – $80,000+", result: "Often leads to a job outside your field", icon: "🎓" },
              { item: "Trade School", cost: "$15,000 – $20,000", result: "Learn one skill, work your way up", icon: "🔧" },
              { item: "New Car (Financed)", cost: "$40,000+", result: "Only goes down in value", icon: "🚗" },
              { item: "iPhones Over 5 Years", cost: "$5,000+", result: "Obsolete in 2 years each", icon: "📱" },
              { item: "Wedding", cost: "$30,000+", result: "One beautiful day", icon: "💒" },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "18px 20px",
                  background: COLORS.card,
                  borderRadius: 14,
                  border: `1px solid ${COLORS.divider}`,
                  animation: `fadeSlideIn 0.4s ease ${i * 0.08}s both`,
                }}
              >
                <span style={{ fontSize: 28, flexShrink: 0 }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: COLORS.cream, fontSize: 15, fontWeight: 600 }}>{c.item}</div>
                  <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>{c.result}</div>
                </div>
                <div style={{ color: "#E07070", fontSize: 15, fontWeight: 700, fontFamily: "'Playfair Display', serif", whiteSpace: "nowrap" }}>{c.cost}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.gold}05)`,
              borderRadius: 20,
              padding: 32,
              border: `1px solid ${COLORS.gold}30`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 15, color: COLORS.creamMuted, lineHeight: 1.8, maxWidth: 560, margin: "0 auto 20px" }}>
              This investment gives you back two things none of the above ever will:
            </div>
            <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
              <div style={{ padding: "18px 28px", background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.gold}30` }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🌿</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: COLORS.gold, fontWeight: 600 }}>Your Health</div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>Products that last 20+ years</div>
              </div>
              <div style={{ padding: "18px 28px", background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.gold}30` }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>✨</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: COLORS.gold, fontWeight: 600 }}>Your Freedom</div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>Income that grows with you</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ========== CALCULATOR ========== */}
      <Section id="calculator" style={{ padding: "100px 0" }}>
        <div className="container">
          <div className="section-tag">✦ Run Your Numbers</div>
          <h2 className="section-title">See What's Possible For You</h2>
          <p className="section-subtitle">
            Adjust the sliders to model your potential earnings based on your package, rank, and activity level.
          </p>
          <CommissionCalculator />
        </div>
      </Section>

      {/* ========== CTA ========== */}
      <Section id="cta" style={{ padding: "120px 0 100px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.card}, ${COLORS.surface})`,
              borderRadius: 28,
              padding: "56px 36px",
              border: `1px solid ${COLORS.gold}25`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse at 50% 0%, ${COLORS.gold}10 0%, transparent 60%)`,
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 42, marginBottom: 20 }}>✦</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(28px, 5vw, 40px)",
                  fontWeight: 600,
                  color: COLORS.cream,
                  lineHeight: 1.2,
                  marginBottom: 16,
                }}
              >
                Ready to Step Into<br />Your Freedom?
              </h2>
              <p style={{ fontSize: 16, color: COLORS.creamMuted, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 32px" }}>
                Your clarity coach will walk you through the exact investment, financing options, and the best path for your personal situation. No pressure — just clarity.
              </p>
              <button className="cta-btn" onClick={() => window.open && window.open("#book", "_blank")}>
                Book Your Clarity Call
                <span style={{ fontSize: 18 }}>→</span>
              </button>
              <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 20 }}>
                Financing options available • Personalized to your situation
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: `1px solid ${COLORS.divider}` }}>
        <p style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
          Results vary based on individual effort, market conditions, and other factors. Commissions shown are based on the Enagic compensation plan structure. All figures in USD unless otherwise noted.
        </p>
      </footer>
    </div>
  );
}
