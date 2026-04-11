"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
  { value: 50,     suffix: "+",  label: "Años de experiencia",  large: false },
  { value: 100000, suffix: "+",  label: "Autos vendidos",        large: true  },
  { value: 7,      suffix: "",   label: "Marcas oficiales",      large: false },
  { value: 100,    suffix: "%",  label: "Garantía respaldada",   large: false },
];

function formatDisplay(val: number, large: boolean): string {
  if (large && val >= 1000) {
    return Math.round(val)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return Math.round(val).toString();
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".stat-item", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 88%",
          once: true,
        },
      });

      const numbers = sectionRef.current?.querySelectorAll<HTMLElement>(".stat-number");
      numbers?.forEach((el) => {
        const target  = parseInt(el.getAttribute("data-target") || "0");
        const isLarge = el.getAttribute("data-large") === "true";
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: isLarge ? 2.5 : 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
          onUpdate() {
            el.textContent = formatDisplay(obj.val, isLarge);
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-white border-b border-border py-8 lg:py-10">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
          {stats.map((s) => (
            <div key={s.label} className="stat-item flex flex-col items-center gap-1.5 px-8 py-4">

              {/* Number */}
              <div className="flex items-baseline gap-0.5">
                <span
                  className="stat-number font-extrabold text-slate-800 tabular-nums leading-none tracking-tight"
                  style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontFamily: "var(--font-outfit)" }}
                  data-target={s.value}
                  data-large={s.large}
                >
                  0
                </span>
                <span
                  className="font-extrabold text-crimson leading-none tracking-tight"
                  style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)", fontFamily: "var(--font-outfit)" }}
                >
                  {s.suffix}
                </span>
              </div>

              {/* Label */}
              <p className="text-[11px] text-slate-400 tracking-[0.18em] uppercase font-medium text-center leading-snug">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
