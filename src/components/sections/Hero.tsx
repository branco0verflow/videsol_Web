"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(useGSAP);

const PHRASES = [
  "Tu camino\nempieza acá",
  "Líderes en\nvehículos eléctricos",
  "Entregas\ninmediatas",
  "La mejor\nfinanciación",
];

const INTERVAL = 10000;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const phraseRef  = useRef<HTMLDivElement>(null);
  const dotRef     = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // ── Entrance animation ───────────────────────────────────────────────────
  useGSAP(
    () => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-overlay",  { opacity: 0, duration: 1.2 })
        .from(".hero-badge",    { opacity: 0, x: -24, duration: 0.6 }, "-=0.5")
        .from(".phrase-block",  { opacity: 0, y: 30,  duration: 0.7 }, "-=0.3")
        .from(".hero-cta",      { opacity: 0, y: 16, stagger: 0.1, duration: 0.5 }, "-=0.3");

      gsap.from(".hero-accent-line", {
        scaleX: 0,
        duration: 1.6,
        ease: "power3.out",
        delay: 0.2,
        transformOrigin: "left center",
      });
    },
    { scope: sectionRef }
  );

  // ── Phrase rotation ───────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      if (!phraseRef.current || !dotRef.current) return;

      gsap.to(phraseRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setIndex((prev) => (prev + 1) % PHRASES.length);
          gsap.fromTo(
            phraseRef.current!,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }
          );
        },
      });

      gsap.fromTo(
        dotRef.current,
        { scale: 1 },
        { scale: 1.7, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.inOut" }
      );
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const lines = PHRASES[index].split("\n");

  return (
    <section
      id="inicio"
      ref={sectionRef}
      /* 1920×520 ratio, with a mobile floor so content stays readable */
      className="relative w-full overflow-hidden bg-navy-dark min-h-[280px] sm:min-h-0 sm:aspect-[1920/520]"
    >
      {/* ── Video ─────────────────────────────────────────────────────── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/videos/inicio.mp4" type="video/mp4" />
      </video>

      {/* ── Overlay: strong left → transparent right ──────────────────── */}
      <div className="hero-overlay absolute inset-0 bg-linear-to-r from-navy-dark/38 via-navy-dark/15 to-transparent" />

      {/* ── Top accent bar ────────────────────────────────────────────── */}
      <div className="hero-accent-line absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-navy via-navy-light to-crimson z-10" />

      {/* ── Content — left-aligned, vertically centered ───────────────── */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16 xl:px-24 z-10">

        {/* Location badge */}
        <div className="hero-badge flex items-center gap-2 mb-4 sm:mb-5">
          <div ref={dotRef} className="w-1.5 h-1.5 rounded-full bg-crimson shrink-0" />
          <span className="text-white/55 text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase">
            Colonia del Sacramento, Uruguay
          </span>
        </div>

        {/* Rotating phrases — Bebas Neue, all caps, impactful */}
        <div ref={phraseRef} className="phrase-block mb-4 sm:mb-6">
          {lines.map((line, i) => (
            <div key={i} className="overflow-clip leading-none">
              <p
                className="text-white uppercase tracking-[0.06em]"
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontWeight: 400,
                  fontSize: "clamp(2.6rem, 5.5vw, 5.5rem)",
                  lineHeight: 1.0,
                  textShadow: "0 2px 24px rgba(0,0,0,0.35)",
                }}
              >
                {line}
              </p>
            </div>
          ))}
        </div>

        {/* Phrase progress dots */}
        <div className="flex items-center gap-1.5 mb-5 sm:mb-7">
          {PHRASES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Frase ${i + 1}`}
              suppressHydrationWarning
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? "w-5 h-1 bg-crimson"
                  : "w-1 h-1 bg-white/30 hover:bg-white/55"
              }`}
            />
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="#vehiculos"
            className="hero-cta group flex items-center gap-2.5 bg-white text-navy text-[11px] sm:text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-full hover:bg-slate-100 transition-all duration-300"
          >
            Ver Catálogo
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#contacto"
            className="hero-cta flex items-center gap-2.5 border border-white/35 text-white text-[11px] sm:text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-full hover:border-white hover:bg-white/10 transition-all duration-300"
          >
            Contactar
          </Link>
        </div>
      </div>
    </section>
  );
}
