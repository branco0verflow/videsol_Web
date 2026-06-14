"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, RotateCcw } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

type Rating = { key: number; label: string; color: string };

const RATINGS: Rating[] = [
  { key: 1, label: "Malo",      color: "#ef4444" },
  { key: 2, label: "Regular",   color: "#f97316" },
  { key: 3, label: "Bueno",     color: "#eab308" },
  { key: 4, label: "Muy bueno", color: "#22a565" },
  { key: 5, label: "Excelente", color: "#16a34a" },
];

// ─── Animated face ────────────────────────────────────────────────────────────

function Face({ level, color }: { level: number; color: string }) {
  const mouths: Record<number, string> = {
    1: "M34 64 Q50 52 66 64",
    2: "M34 62 Q50 55 66 62",
    3: "M36 60 L64 60",
    4: "M34 58 Q50 70 66 58",
    5: "M32 56 Q50 78 68 56 Z",
  };
  const big = level === 5;

  const eyes =
    level <= 2 ? (
      <>
        <circle cx="38" cy="42" r="3.4" fill="#1f2937" />
        <circle cx="62" cy="42" r="3.4" fill="#1f2937" />
        <path d="M32 35 L43 38" stroke="#1f2937" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M68 35 L57 38" stroke="#1f2937" strokeWidth="2.4" strokeLinecap="round" />
      </>
    ) : level >= 5 ? (
      <>
        <path d="M33 43 Q38 37 43 43" stroke="#1f2937" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M57 43 Q62 37 67 43" stroke="#1f2937" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="38" cy="43" r="3.6" fill="#1f2937" />
        <circle cx="62" cy="43" r="3.6" fill="#1f2937" />
      </>
    );

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="faceSheen" cx="40%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={color} opacity="0.16" />
      <circle cx="50" cy="50" r="38" fill={color} opacity="0.95" />
      <circle cx="50" cy="50" r="38" fill="url(#faceSheen)" />
      {level >= 4 && (
        <>
          <circle cx="30" cy="56" r="5" fill={color} opacity="0.25" />
          <circle cx="70" cy="56" r="5" fill={color} opacity="0.25" />
        </>
      )}
      {eyes}
      {big ? (
        <>
          <path d={mouths[5]} fill="#1f2937" />
          <path d="M40 67 Q50 73 60 67" fill="#ff6b81" />
        </>
      ) : (
        <path d={mouths[level]} stroke="#1f2937" strokeWidth="3.6" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

// ─── Star ─────────────────────────────────────────────────────────────────────

function Star({ lit, size = 40 }: { lit: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="block">
      <path
        d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.77 6.2 20.36l1.11-6.46-4.7-4.58 6.49-.94L12 2.5z"
        strokeWidth="1.4"
        strokeLinejoin="round"
        style={{
          fill: lit ? "#f5b301" : "#e9edf2",
          stroke: lit ? "#e09b00" : "#d4dae2",
          filter: lit ? "drop-shadow(0 6px 14px rgba(245,179,1,.45))" : "none",
          transition: "fill .18s ease, stroke .18s ease",
        }}
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Calificanos() {
  const sectionRef = useRef<HTMLElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const active = hover || selected; // 0 = idle

  useGSAP(
    () => {
      gsap.from(".calif-reveal", {
        opacity: 0, y: 28, duration: 0.85, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      });
    },
    { scope: sectionRef }
  );

  function fireConfetti() {
    const host = confettiRef.current;
    if (!host) return;
    host.innerHTML = "";
    const colors = ["#1b3a6b", "#c8102e", "#f5b301", "#22a565", "#ffffff"];
    for (let i = 0; i < 46; i++) {
      const c = document.createElement("span");
      c.style.cssText = `position:absolute;width:9px;height:14px;top:-20px;border-radius:2px;opacity:0;left:${
        Math.random() * 100
      }%;background:${colors[i % colors.length]};transform:rotate(${
        Math.random() * 360
      }deg);animation:calif-fall ${1.1 + Math.random() * 1.1}s ${
        Math.random() * 0.35
      }s cubic-bezier(.3,.6,.4,1) forwards`;
      host.appendChild(c);
    }
  }

  function handleSubmit() {
    if (selected < 1) return;
    setSubmitted(true);
    requestAnimationFrame(fireConfetti);
    // TODO: enviar `selected` a tu backend / Google Sheets / email aquí.
  }

  function reset() {
    setSubmitted(false);
    setSelected(0);
    setHover(0);
  }

  const r = active > 0 ? RATINGS[active - 1] : null;

  return (
    <section
      id="calificanos"
      ref={sectionRef}
      className="relative py-10 lg:py-10 overflow-hidden bg-[#f4f5f7] border-y border-border"
    >
      {/* keyframes scoped to this component */}
      <style>{`
        @keyframes calif-fall {
          0%{opacity:0;transform:translateY(-30px) rotate(0)}
          10%{opacity:1}
          100%{opacity:0;transform:translateY(360px) rotate(540deg)}
        }
        @keyframes calif-pop {
          0%{transform:scale(.85)} 55%{transform:scale(1.06)} 100%{transform:scale(1)}
        }
      `}</style>

      {/* ambient ornamentation */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 10%, #1b3a6b 0, transparent 38%), radial-gradient(circle at 88% 95%, #c8102e 0, transparent 34%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6">
        {/* eyebrow */}
        <div className="calif-reveal text-center mb-10">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <span className="w-6 h-0.5 bg-crimson rounded-full" />
            <p className="text-crimson text-xs font-bold tracking-[0.25em] uppercase">
              Tu opinión
            </p>
            <span className="w-6 h-0.5 bg-crimson rounded-full" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-black leading-[1.08] tracking-tight text-slate-900">
            Califícanos
          </h2>
        </div>

        {/* Rating card */}
        <div className="calif-reveal relative bg-white rounded-[2rem] ring-1 ring-slate-200/70 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)] px-7 sm:px-12 py-12 lg:py-14 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-navy via-crimson to-navy" />

          {/* confetti mount */}
          <div ref={confettiRef} className="pointer-events-none absolute inset-0 overflow-hidden" />

          {!submitted ? (
            /* ── RATING STATE ─────────────────────────────────── */
            <div className="relative text-center">
              <p className="text-slate-900 text-xl lg:text-2xl font-black tracking-tight leading-snug max-w-md mx-auto">
                ¿Cómo calificás el proceso
                <br className="hidden sm:block" /> de venta y asesoramiento?
              </p>
              <p className="text-slate-400 text-sm mt-3">
                Tocá una estrella para puntuar tu experiencia.
              </p>

              {/* Face */}
              <div className="relative mx-auto mt-9 mb-2 w-28 h-28 lg:w-32 lg:h-32">
                {RATINGS.map((rt) => (
                  <div
                    key={rt.key}
                    className="absolute inset-0"
                    style={{
                      transition: "opacity .35s ease, transform .45s cubic-bezier(.34,1.56,.64,1)",
                      opacity: rt.key === active ? 1 : 0,
                      transform: rt.key === active ? "scale(1) rotate(0)" : "scale(.6) rotate(-8deg)",
                    }}
                  >
                    <Face level={rt.key} color={rt.color} />
                  </div>
                ))}
                {/* idle */}
                <div
                  className="absolute inset-0"
                  style={{
                    transition: "opacity .35s ease, transform .45s cubic-bezier(.34,1.56,.64,1)",
                    opacity: active > 0 ? 0 : 1,
                    transform: active > 0 ? "scale(.6) rotate(-8deg)" : "scale(1) rotate(0)",
                  }}
                >
                  <Face level={3} color="#cbd5e1" />
                </div>
              </div>

              {/* Label pill */}
              <div className="h-9 flex items-center justify-center mb-7">
                <span
                  className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wide transition-colors"
                  style={{
                    background: r ? r.color + "22" : "#f1f5f9",
                    color: r ? r.color : "#94a3b8",
                  }}
                >
                  {r ? r.label : selected ? RATINGS[selected - 1].label : "Esperando tu puntuación"}
                </span>
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-2 sm:gap-3.5 mb-10">
                {RATINGS.map((rt, i) => (
                  <button
                    key={rt.key}
                    aria-label={`${rt.key} estrellas — ${rt.label}`}
                    onMouseEnter={() => setHover(rt.key)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setSelected(rt.key)}
                    className="transition-transform duration-200 hover:scale-[1.18] hover:-translate-y-0.5 active:scale-95"
                    style={{ transformOrigin: "center" }}
                  >
                    <Star lit={active > 0 && i < active} />
                  </button>
                ))}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={selected < 1}
                className={
                  "group inline-flex items-center gap-3 text-sm font-bold px-8 py-4 rounded-full transition-all active:scale-[0.97] " +
                  (selected < 1
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-crimson hover:bg-crimson/90 text-white hover:-translate-y-0.5 shadow-[0_12px_30px_-10px_rgba(200,16,46,0.7)] cursor-pointer")
                }
              >
                Enviar calificación
                <span
                  className={
                    "w-6 h-6 rounded-full flex items-center justify-center transition-colors " +
                    (selected < 1 ? "bg-black/5" : "bg-white/15 group-hover:bg-white/25")
                  }
                >
                  <ArrowUp size={14} />
                </span>
              </button>
            </div>
          ) : (
            /* ── THANK YOU STATE ─────────────────────────────── */
            <div
              className="relative text-center"
              style={{ animation: "calif-pop .5s cubic-bezier(.34,1.56,.64,1) both" }}
            >
              <div className="mx-auto w-24 h-24 lg:w-28 lg:h-28 mb-7">
                <Face
                  level={selected}
                  color={RATINGS[selected - 1].color}
                />
              </div>

              <div className="flex items-center justify-center gap-2 mb-7">
                {RATINGS.map((rt, i) => (
                  <Star key={rt.key} lit={i < selected} size={26} />
                ))}
              </div>

              <h3 className="text-2xl lg:text-3xl font-black tracking-tight leading-tight text-slate-900">
                ¡Gracias! <span className="text-gradient">Tu opinión nos importa.</span>
              </h3>
              <p className="text-slate-500 mt-4 text-base lg:text-lg leading-relaxed max-w-sm mx-auto">
                Que disfrutes muchísimo tu nuevo auto. 🚗💨
                <br />
                Te esperamos para tu próximo service.
              </p>

              <button
                onClick={reset}
                className="mt-9 text-navy text-sm font-bold tracking-wide hover:text-crimson transition-colors inline-flex items-center gap-2"
              >
                <RotateCcw size={15} />
                Volver a calificar
              </button>
            </div>
          )}
        </div>

        <p className="calif-reveal text-center text-slate-400 text-xs mt-7 tracking-wide">
          Videsol · Tu opinión nos ayuda a mejorar cada entrega.
        </p>
      </div>
    </section>
  );
}
