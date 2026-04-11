"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Car, Search, ArrowRight, CheckCircle2, Clock, ShieldCheck, Wrench } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────

const workshopBrands = [
  { name: "Peugeot",  image: "/images/marcas/Marca4.png" },
  { name: "Nissan",   image: "/images/marcas/Marca2.png" },
  { name: "Citroën",  image: "/images/marcas/Marca3.png" },
  { name: "Subaru",   image: "/images/marcas/Marca7.png" },
  { name: "BYD",      image: "/images/marcas/Marca1.png" },
  { name: "Renault",  image: "/images/marcas/Marca6.png" },
  { name: "Riddara",  image: "/images/marcas/Marca5.png" },
];

const highlights = [
  { icon: Clock,        text: "Más de 50 años de trayectoria" },
  { icon: ShieldCheck,  text: "Técnicos certificados por fábrica" },
  { icon: CheckCircle2, text: "Diagnóstico digital y repuestos originales" },
  { icon: Wrench,       text: "Mantenimiento, garantía y servicio post-venta" },
];

const saleBanners = [
  {
    icon: Car,
    number: "01",
    title: "Autos 0 km",
    desc: "Últimos modelos de las mejores marcas, con financiación a medida y entrega inmediata.",
    cta: "Ver nuevos",
    href: "#vehiculos",
  },
  {
    icon: Search,
    number: "02",
    title: "Autos Usados",
    desc: "Seleccionados, revisados y con historial verificado. Todos pasan inspección técnica.",
    cta: "Ver usados",
    href: "#vehiculos",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".srv-header", {
        opacity: 0, y: 40, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".srv-header", start: "top 85%", once: true },
      });
      gsap.from(".srv-workshop", {
        opacity: 0, y: 50, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".srv-workshop", start: "top 88%", once: true },
      });
      gsap.from(".srv-sale-card", {
        opacity: 0, y: 40, stagger: 0.15, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".srv-sale-card", start: "top 90%", once: true },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="servicios"
      ref={sectionRef}
      className="bg-[#f4f5f7] py-24 lg:py-32 border-y border-border"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-14">

        {/* Header */}
        <div className="srv-header text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="w-6 h-0.5 bg-navy rounded-full" />
            <p className="text-navy text-xs font-bold tracking-[0.25em] uppercase">Lo que hacemos</p>
            <span className="w-6 h-0.5 bg-navy rounded-full" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900">
            Nuestros <span className="text-gradient">servicios</span>
          </h2>
        </div>

        {/* ── Workshop Feature Block ─────────────────────────────────── */}
        <div className="srv-workshop bg-navy rounded-3xl overflow-hidden grid lg:grid-cols-2">

          {/* Left: content */}
          <div className="p-10 lg:p-14 flex flex-col justify-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-crimson/15 text-crimson text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full w-fit mb-8">
              <Wrench size={12} />
              Taller oficial
            </span>

            <h3 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
              Servicio post-venta<br />
              <span className="text-crimson">+50 años</span> de experiencia
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-sm">
              Nuestro taller mecánico trabaja con equipamiento de diagnóstico de última generación y técnicos certificados por cada marca que representamos.
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-10">
              {highlights.map((h) => (
                <li key={h.text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <h.icon size={14} className="text-crimson" />
                  </div>
                  <span className="text-white/80 text-sm">{h.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="#contacto"
              className="inline-flex items-center gap-2 bg-crimson hover:bg-crimson/90 text-white text-sm font-bold px-6 py-3 rounded-full w-fit transition-colors"
            >
              Agendar turno
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right: brand logos grid */}
          <div className="flex flex-col justify-center p-10 lg:p-14 border-t lg:border-t-0 lg:border-l border-white/10">
            <p className="text-white/40 text-xs font-bold tracking-[0.25em] uppercase mb-8">
              Marcas autorizadas
            </p>
            <div className="grid grid-cols-4 gap-4">
              {workshopBrands.map((b) => (
                <div
                  key={b.name}
                  className="aspect-square bg-white/5 hover:bg-white/10 transition-colors rounded-2xl flex items-center justify-center p-3"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={b.image}
                      alt={b.name}
                      fill
                      sizes="80px"
                      className="object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Sale Cards ────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">
          {saleBanners.map((s) => (
            <div
              key={s.number}
              className="srv-sale-card group relative flex flex-col p-8 rounded-3xl bg-white border border-border hover:border-navy/30 hover:shadow-[0_8px_30px_rgba(27,58,107,0.08)] transition-all duration-300"
            >
              <span className="absolute top-7 right-8 text-6xl font-black select-none leading-none text-slate-900/5">
                {s.number}
              </span>

              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8 bg-surface text-navy border border-border">
                <s.icon size={22} />
              </div>

              <h3 className="text-xl font-black mb-3 text-slate-900">{s.title}</h3>
              <p className="text-sm leading-relaxed flex-1 mb-8 text-slate-500">{s.desc}</p>

              <Link
                href={s.href}
                className="group/cta inline-flex items-center gap-2 text-sm font-bold tracking-wide text-navy hover:text-navy-dark transition-colors"
              >
                {s.cta}
                <ArrowRight size={15} className="group-hover/cta:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
