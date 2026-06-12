"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Wrench,
  PlayCircle,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const workshopBrands = [
  { name: "Peugeot", image: "/images/marcas/Marca4.png" },
  { name: "Nissan", image: "/images/marcas/Marca2.png" },
  { name: "Citroën", image: "/images/marcas/Marca3.png" },
  { name: "Subaru", image: "/images/marcas/Marca7.png" },
  { name: "BYD", image: "/images/marcas/Marca1.png" },
  { name: "Renault", image: "/images/marcas/Marca6.png" },
  { name: "Riddara", image: "/images/marcas/Marca5.png" },
];

const highlights = [
  { icon: Clock, text: "Más de 50 años de trayectoria" },
  { icon: ShieldCheck, text: "Técnicos certificados por fábrica" },
  { icon: CheckCircle2, text: "Diagnóstico digital y repuestos originales" },
  { icon: Wrench, text: "Mantenimiento, garantía y servicio post-venta" },
];

const heroStats = [
  { value: "+50", label: "Años de trayectoria" },
  { value: "10", label: "Marcas oficiales" },
  { value: "100%", label: "Repuestos originales" },
];

// WhatsApp link — agendar turno
const WHATSAPP_URL =
  "https://wa.me/59897222623?text=" +
  encodeURIComponent("Hola, quisiera agendar un turno.");

// ─── Component ────────────────────────────────────────────────────────────────

export default function Taller() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".srv-header", {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".srv-header", start: "top 85%", once: true },
      });
      gsap.from(".srv-video", {
        opacity: 0,
        y: 60,
        scale: 0.98,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".srv-video", start: "top 85%", once: true },
      });
      gsap.from(".srv-stat", {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".srv-stats", start: "top 90%", once: true },
      });
      gsap.from(".srv-content", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".srv-content", start: "top 88%", once: true },
      });
      gsap.from(".srv-brand", {
        opacity: 0,
        y: 20,
        stagger: 0.06,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".srv-brands", start: "top 88%", once: true },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="relative bg-[#f4f5f7] py-24 lg:py-32 border-y border-border overflow-hidden"
    >
      {/* Soft background ornamentation */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 0%, #1b3a6b 0, transparent 40%), radial-gradient(circle at 90% 100%, #c8102e 0, transparent 35%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 space-y-20">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="srv-header text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <span className="w-6 h-0.5 bg-navy rounded-full" />
            <p className="text-navy text-xs font-bold tracking-[0.25em] uppercase">
              Taller oficial
            </p>
            <span className="w-6 h-0.5 bg-navy rounded-full" />
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
            Servicio <span className="text-gradient">post-venta</span>
          </h2>
          <p className="mt-6 text-slate-500 text-base lg:text-lg leading-relaxed">
            Más de 50 años cuidando tu auto. Taller oficial de las marcas que
            representamos, con técnicos certificados y diagnóstico de última
            generación.
          </p>
        </div>

        {/* ── Cinematic video block ───────────────────────────────────── */}
        <div className="srv-video relative">
          <div className="relative aspect-4/3 sm:aspect-video lg:aspect-21/9 rounded-xl sm:rounded-4xl overflow-hidden ring-1 ring-black/5 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)]">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/videos/taller1.mp4"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/taller-poster.jpg"
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Top row: play indicator */}
            <div className="absolute top-6 lg:top-8 right-6 lg:right-10 flex justify-end">
              <span className="hidden sm:inline-flex items-center gap-2 text-white/70 text-xs font-medium tracking-[0.2em] uppercase">
                <PlayCircle size={14} />
                Recorrido
              </span>
            </div>

            {/* Bottom-left: headline overlay */}
            <div className="absolute bottom-8 lg:bottom-14 left-6 lg:left-10 right-6 lg:right-10 max-w-2xl">
              <h3 className="text-white text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.02] tracking-tight">
                Tu auto, en manos<br />
                <span className="text-crimson">expertas.</span>
              </h3>
              <p className="mt-4 text-white/75 text-sm lg:text-base max-w-md leading-relaxed">
                Equipamiento de diagnóstico de última generación y técnicos
                certificados por cada marca que representamos.
              </p>
            </div>
          </div>

          {/* ── Floating stat strip ─────────────────────────────────── */}
          <div className="srv-stats relative -mt-10 lg:-mt-12 mx-4 lg:mx-12">
            <div className="bg-white rounded-2xl shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] ring-1 ring-black/5 grid grid-cols-3 divide-x divide-slate-100">
              {heroStats.map((s) => (
                <div
                  key={s.label}
                  className="srv-stat px-3 sm:px-6 py-4 lg:py-6 flex flex-col items-start"
                >
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                    {s.value}
                  </span>
                  <span className="mt-1 text-[9px] sm:text-[11px] lg:text-xs font-bold tracking-[0.12em] sm:tracking-[0.18em] uppercase text-slate-500">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Workshop content (light) ────────────────────────────────── */}
        <div className="srv-content grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Left: copy + highlights + CTA */}
          <div>
            <span className="inline-flex items-center gap-2 bg-crimson/10 text-crimson text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full w-fit mb-6">
              <Wrench size={12} />
              Servicio post-venta
            </span>

            <h3 className="text-3xl lg:text-[2.5rem] font-black text-slate-900 leading-[1.05] mb-5 tracking-tight">
              Un taller con <span className="text-crimson">+50 años</span><br />
              de experiencia
            </h3>
            <p className="text-slate-500 text-base lg:text-[17px] leading-relaxed mb-10 max-w-xl">
              Trabajamos como taller oficial de las marcas que representamos,
              con repuestos originales, garantía de fábrica y mantenimiento
              programado. Cada vehículo se atiende según el protocolo de su
              fabricante.
            </p>

            {/* Highlights — two columns */}
            <ul className="grid sm:grid-cols-2 gap-4 mb-10 max-w-xl">
              {highlights.map((h) => (
                <li
                  key={h.text}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white ring-1 ring-slate-200/70 hover:ring-navy/20 hover:shadow-[0_8px_20px_-12px_rgba(15,23,42,0.2)] transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-crimson/10 text-crimson flex items-center justify-center shrink-0">
                    <h.icon size={16} />
                  </div>
                  <span className="text-slate-700 text-sm lg:text-[15px] font-medium leading-snug pt-0.5">
                    {h.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA → WhatsApp */}
            <div className="flex flex-wrap items-center gap-5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta inline-flex items-center gap-3 bg-crimson hover:bg-crimson/90 text-white text-sm font-bold px-7 py-4 rounded-full transition-all shadow-[0_10px_30px_-10px_rgba(200,16,46,0.7)] hover:shadow-[0_14px_40px_-10px_rgba(200,16,46,0.85)] hover:-translate-y-0.5"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-.607zM17.0 14.382c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                </svg>
                Agendar turno por WhatsApp
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover/cta:bg-white/25 transition-colors">
                  <ArrowUpRight size={13} />
                </span>
              </a>
              <div className="flex flex-col">
                <span className="text-slate-500 text-xs font-bold tracking-[0.18em] uppercase">
                  Hablá con nosotros
                </span>
                <span className="text-slate-900 text-base font-bold tracking-tight">
                  +598 97 222 623
                </span>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
}
