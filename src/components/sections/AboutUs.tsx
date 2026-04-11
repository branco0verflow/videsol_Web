"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, Award, Users, Handshake } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const values = [
  { icon: ShieldCheck, title: "Transparencia", desc: "Documentación al día, sin letra chica ni sorpresas."      },
  { icon: Award,       title: "Calidad",        desc: "Cada vehículo pasa por revisión técnica certificada."    },
  { icon: Users,       title: "Atención",        desc: "Asesoramiento personalizado real, sin presión."          },
  { icon: Handshake,   title: "Confianza",       desc: "Más de 50 años respaldando cada venta."                  },
];

export default function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".about-left", {
        opacity: 0, x: -60, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".about-left", start: "top 80%", once: true },
      });
      gsap.from(".about-right", {
        opacity: 0, x: 60, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".about-right", start: "top 80%", once: true },
      });
      gsap.from(".value-card", {
        opacity: 0, y: 30, stagger: 0.1, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: ".value-card", start: "top 88%", once: true },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="nosotros" ref={sectionRef} className="bg-surface py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left */}
          <div className="about-left">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-6 h-0.5 bg-navy rounded-full" />
              <p className="text-navy text-xs font-bold tracking-[0.25em] uppercase">Sobre nosotros</p>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-8">
              Más de cinco décadas<br />
              <span className="text-gradient">al servicio</span> del<br />
              automovilista uruguayo.
            </h2>
            <div className="space-y-4 text-slate-500 leading-relaxed text-[15px]">
              <p>
                Videsol nació en Colonia del Sacramento con una misión simple:
                conectar a las personas con el vehículo que necesitan, con
                honestidad, precios justos y atención de calidad.
              </p>
              <p>
                Con más de 50 años en el mercado, nos convertimos en la
                automotora de referencia de la región, representando marcas
                oficiales como BYD, Nissan, Peugeot, Renault, Citroën, Subaru y Riddara.
              </p>
              <p>
                Cada venta es el comienzo de una relación. Por eso también
                contamos con servicio mecánico certificado, para que tu
                inversión esté siempre respaldada.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="about-right">
            <div className="relative mb-6 p-8 bg-navy rounded-3xl overflow-hidden">
              <div className="absolute -top-6 -right-6 text-[130px] font-black text-white/5 leading-none select-none">50</div>
              <p className="text-white/60 text-xs font-bold tracking-[0.25em] uppercase mb-2">
                Fundada hace más de 50 años
              </p>
              <p className="text-3xl font-black text-white mb-1">Colonia del Sacramento</p>
              <p className="text-white/50 text-sm">Uruguay — José Pedro Varela 593</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-crimson" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="value-card bg-white border border-border rounded-2xl p-5 hover:border-navy/25 hover:shadow-[0_4px_16px_rgba(27,58,107,0.07)] transition-all duration-300"
                >
                  <v.icon size={18} className="text-navy mb-3" />
                  <p className="text-slate-800 font-bold text-sm mb-1">{v.title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
