"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Award, Users, Handshake, ImageIcon } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "+45", label: "Años en el mercado" },
  { value: "7", label: "Marcas oficiales" },
  { value: "100%", label: "Garantía de fábrica" },
];

const values = [
  { icon: ShieldCheck, title: "Transparencia", desc: "Sin letra chica ni sorpresas." },
  { icon: Award, title: "Calidad", desc: "Revisión técnica certificada." },
  { icon: Users, title: "Atención", desc: "Asesoramiento real, sin presión." },
  { icon: Handshake, title: "Confianza", desc: "45 años respaldando cada venta." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".about-badge, .about-heading, .about-body, .about-stats", {
        opacity: 0, y: 28, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ".about-badge", start: "top 82%", once: true },
      });
      gsap.from(".about-image-col", {
        opacity: 0, x: 50, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".about-image-col", start: "top 80%", once: true },
      });
      gsap.from(".value-pill", {
        opacity: 0, x: -16, stagger: 0.08, duration: 0.5, ease: "power3.out",
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

            <h2 className="about-heading text-4xl lg:text-[2.75rem] font-black text-slate-900 leading-[1.12] mb-6">
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
                  <div className={`${i !== 0 ? 'pl-6' : ''} ${i !== stats.length - 1 ? 'pr-6' : ''}`}>
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

          {/* ── Right: image ───────────────────────────────────────── */}
          <div className="about-image-col flex flex-col gap-4">

            {/* Main photo placeholder */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-navy">
              {/* decorative grid */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              {/* corner accents */}
              <div className="absolute top-5 left-5 w-10 h-10 border-l-2 border-t-2 border-white/20 rounded-tl-lg" />
              <div className="absolute top-5 right-5 w-10 h-10 border-r-2 border-t-2 border-white/20 rounded-tr-lg" />
              <div className="absolute bottom-5 left-5 w-10 h-10 border-l-2 border-b-2 border-white/20 rounded-bl-lg" />
              <div className="absolute bottom-5 right-5 w-10 h-10 border-r-2 border-b-2 border-white/20 rounded-br-lg" />

              {/* center placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/25">
                <ImageIcon size={36} strokeWidth={1.2} />
              </div>

              {/* bottom overlay with address */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent px-6 py-5">
                <p className="text-white font-bold text-[15px]">Videsol — Colonia del Sacramento</p>
                <p className="text-white/60 text-xs mt-0.5">José Pedro Varela 593, Uruguay</p>
              </div>

              {/* crimson accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-crimson" />
            </div>



          </div>

        </div>
      </div>
    </section>
  );
}
