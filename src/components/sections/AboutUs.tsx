"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  Award,
  Users,
  Handshake,
  ChevronsLeftRight,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "+50", label: "Años en el mercado" },
  { value: "10", label: "Marcas oficiales" },
  { value: "100%", label: "Garantía de fábrica" },
];

const values = [
  { icon: ShieldCheck, title: "Transparencia", desc: "Sin letra chica ni sorpresas." },
  { icon: Award, title: "Calidad", desc: "Revisión técnica certificada." },
  { icon: Users, title: "Atención", desc: "Asesoramiento real, sin presión." },
  { icon: Handshake, title: "Confianza", desc: "45 años respaldando cada venta." },
];

// ─── Before / After reveal slider ───────────────────────────────────────────────
// Movimiento manejado por refs (estilos directos al DOM) en vez de estado de React,
// para que el arrastre sea 100% fluido y no dispare re-renders en cada pixel.

function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null); // capa recortada (foto de DÍA)
  const handleRef = useRef<HTMLDivElement>(null); // línea + tirador
  const posRef = useRef(80); // posición actual 0–100 (80% = mayormente de día)
  const draggingRef = useRef(false);

  // Aplica la posición al DOM (clip + handle) sin pasar por estado de React.
  const apply = useCallback((p: number) => {
    const clamped = Math.max(0, Math.min(100, p));
    posRef.current = clamped;
    if (clipRef.current) {
      // recorta la parte derecha de la foto de día → deja ver la de noche detrás
      clipRef.current.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
    }
    if (handleRef.current) {
      handleRef.current.style.left = `${clamped}%`;
      handleRef.current.setAttribute("aria-valuenow", String(Math.round(clamped)));
    }
  }, []);

  const clientXToPos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return posRef.current;
    const rect = el.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }, []);

  // Listeners globales de arrastre (mouse + touch)
  useEffect(() => {
    apply(80);

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!draggingRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      apply(clientXToPos(clientX));
    };
    const onUp = () => {
      draggingRef.current = false;
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [apply, clientXToPos]);

  // Barrido automático al entrar en viewport → indica que es interactivo.
  useGSAP(
    () => {
      const proxy = { v: 80 };
      gsap.fromTo(
        proxy,
        { v: 45 },
        {
          v: 80,
          duration: 1.6,
          ease: "power2.inOut",
          delay: 0.35,
          onUpdate: () => apply(proxy.v),
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  const startDrag = (clientX: number) => {
    draggingRef.current = true;
    document.body.style.userSelect = "none";
    apply(clientXToPos(clientX));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") apply(posRef.current - 4);
    if (e.key === "ArrowRight") apply(posRef.current + 4);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-navy select-none touch-pan-y"
    >
      {/* Capa de fondo: NOCHE (local2.png) */}
      <Image
        src="/images/local2.png"
        alt="Videsol de noche"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
        draggable={false}
      />

      {/* Capa superior recortada: DÍA (local1.png) */}
      <div ref={clipRef} className="absolute inset-0 will-change-[clip-path]">
        <Image
          src="/images/local1.png"
          alt="Videsol de día"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          draggable={false}
        />
      </div>

      {/* Línea divisoria + tirador */}
      <div
        ref={handleRef}
        role="slider"
        tabIndex={0}
        aria-label="Comparar local de día y de noche"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={80}
        onKeyDown={onKeyDown}
        onMouseDown={(e) => startDrag(e.clientX)}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        className="absolute top-0 bottom-0 z-30 -translate-x-1/2 cursor-ew-resize focus:outline-none"
        style={{ left: "80%" }}
      >
        {/* línea vertical */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.4)]" />
        {/* perilla */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center ring-2 ring-crimson/70">
          <ChevronsLeftRight size={18} className="text-navy" />
        </div>
      </div>

      {/* Esquinas decorativas (se mantienen como marco) */}
      <div className="absolute top-5 left-5 z-10 w-10 h-10 border-l-2 border-t-2 border-white/25 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-5 right-5 z-10 w-10 h-10 border-r-2 border-t-2 border-white/25 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-5 left-5 z-10 w-10 h-10 border-l-2 border-b-2 border-white/25 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-5 right-5 z-10 w-10 h-10 border-r-2 border-b-2 border-white/25 rounded-br-lg pointer-events-none" />

      {/* Overlay inferior con dirección (no bloquea el arrastre) */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-linear-to-t from-black/70 to-transparent px-6 py-5 pointer-events-none">
        <p className="text-white font-bold text-[15px]">Videsol — Colonia del Sacramento</p>
        <p className="text-white/60 text-xs mt-0.5">José Pedro Varela 593, Uruguay</p>
      </div>

      {/* Barra superior crimson */}
      <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-crimson" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null);

  // ── Scroll to section when arriving via /#nosotros hash ──────────────────
  useEffect(() => {
    if (window.location.hash === "#nosotros") {
      const timer = setTimeout(() => {
        const el = document.getElementById("nosotros");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  useGSAP(
    () => {
      gsap.from(".about-badge, .about-heading, .about-body, .about-stats", {
        opacity: 0, y: 28, duration: 0.8, stagger: 0.1, ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".about-badge", start: "top 82%", once: true },
      });
      gsap.from(".about-image-col", {
        opacity: 0, x: 50, duration: 1, ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".about-image-col", start: "top 80%", once: true },
      });
      gsap.from(".value-pill", {
        opacity: 0, x: -16, stagger: 0.08, duration: 0.5, ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".value-pill", start: "top 90%", once: true },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="nosotros" ref={sectionRef} className="bg-white py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: text ─────────────────────────────────────────── */}
          <div>
            <div className="about-badge flex items-center gap-2.5 mb-6">
              <span className="w-6 h-0.5 bg-navy rounded-full" />
              <p className="text-navy text-xs font-bold tracking-[0.25em] uppercase">Sobre nosotros</p>
            </div>

            <h2 className="about-heading text-[2rem] lg:text-[2.75rem] font-bold tracking-tight text-slate-900 leading-[1.1] text-balance mb-6">
              Más de cuatro décadas<br />
              <span className="text-gradient">al servicio</span> del<br />
              automovilista uruguayo.
            </h2>

            <div className="about-body space-y-4 text-slate-500 leading-relaxed text-[15px] mb-10">
              <p>
                Videsol se guía por una convicción clara:
                cada persona merece encontrar el vehículo que se ajusta a sus necesidades,
                respaldada por asesoramiento profesional, precios transparentes con servicio postventa.
              </p>
              <p>
                Representantes oficiales de BYD, Nissan, Peugeot, Renault,
                Citroën, Subaru y Riddara — con servicio mecánico certificado
                para que tu inversión esté siempre respaldada.
              </p>
            </div>

            {/* Stats */}
            <div className="about-stats flex items-center gap-0 mb-10">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-0">
                  <div className={`${i !== 0 ? "pl-6" : ""} ${i !== stats.length - 1 ? "pr-6" : ""}`}>
                    <p className="text-[2rem] font-black text-navy leading-none">{s.value}</p>
                    <p className="text-slate-400 text-xs mt-1 leading-tight">{s.label}</p>
                  </div>
                  {i < stats.length - 1 && (
                    <div className="w-px h-10 bg-slate-200 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Value pills */}
            <div className="grid grid-cols-2 gap-2.5">
              {values.map((v) => (
                <div key={v.title} className="value-pill flex items-start gap-3 bg-surface border border-border rounded-2xl px-4 py-3.5">
                  <div className="w-7 h-7 rounded-lg bg-navy/8 flex items-center justify-center shrink-0 mt-0.5">
                    <v.icon size={14} className="text-navy" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold text-[13px]">{v.title}</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: before/after reveal slider ──────────────────── */}
          <div className="about-image-col flex flex-col gap-4">
            <BeforeAfterSlider />
          </div>

        </div>
      </div>
    </section>
  );
}