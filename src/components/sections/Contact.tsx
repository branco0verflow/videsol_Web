"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Clock, Send } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm]   = useState({ name: "", phone: "", message: "" });
  const [sent, setSent]   = useState(false);

  useGSAP(
    () => {
      gsap.from(".contact-left", {
        opacity: 0, x: -50, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-left", start: "top 82%", once: true },
      });
      gsap.from(".contact-right", {
        opacity: 0, x: 50, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".contact-right", start: "top 82%", once: true },
      });
    },
    { scope: sectionRef }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hola! Me llamo ${form.name}. ${form.message}`;
    window.open(`https://wa.me/59891307261?text=${encodeURIComponent(text)}`, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", phone: "", message: "" });
  };

  return (
    <section id="contacto" ref={sectionRef} className="bg-surface py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <span className="w-6 h-0.5 bg-navy rounded-full" />
            <p className="text-navy text-xs font-bold tracking-[0.25em] uppercase">Contacto</p>
            <span className="w-6 h-0.5 bg-navy rounded-full" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Conversemos</h2>
          <p className="text-slate-500 mt-3 max-w-md mx-auto text-sm">
            Asesoría personalizada para que tomes la mejor decisión.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Info */}
          <div className="contact-left space-y-7">

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy/8 border border-navy/15 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={17} className="text-navy" />
              </div>
              <div>
                <p className="text-slate-800 font-bold text-sm mb-1.5">Ubicación</p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  José Pedro Varela 593<br />Colonia del Sacramento, Uruguay
                </p>
                <a
                  href="https://maps.google.com/?q=José+Pedro+Varela+593,+Colonia+del+Sacramento,+Uruguay"
                  target="_blank" rel="noopener noreferrer"
                  className="text-navy text-xs font-semibold hover:underline mt-1 inline-block"
                >
                  Ver en Google Maps →
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy/8 border border-navy/15 flex items-center justify-center shrink-0 mt-0.5">
                <Phone size={17} className="text-navy" />
              </div>
              <div>
                <p className="text-slate-800 font-bold text-sm mb-1.5">Teléfono</p>
                <a href="https://wa.me/59845225411" target="_blank" rel="noopener noreferrer"
                  className="text-slate-500 text-sm hover:text-navy transition-colors">
                  4522 5411 / 5412
                </a>
                <p className="text-slate-400 text-xs mt-0.5">También por WhatsApp</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy/8 border border-navy/15 flex items-center justify-center shrink-0 mt-0.5">
                <Clock size={17} className="text-navy" />
              </div>
              <div>
                <p className="text-slate-800 font-bold text-sm mb-2">Horarios</p>
                <div className="text-sm space-y-1">
                  {[
                    { day: "Lun — Vie", hours: "08:00 - 12:00 — 14:00 - 18:00", closed: false },
                    { day: "Sábado",    hours: "08:00 — 12:00",                  closed: false },
                    { day: "Domingo",   hours: "Cerrado",                         closed: true  },
                  ].map((r) => (
                    <div key={r.day} className="flex justify-between gap-8">
                      <span className="text-slate-500">{r.day}</span>
                      <span className={r.closed ? "text-slate-400" : "text-slate-800 font-semibold"}>
                        {r.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=José+Pedro+Varela+593,+Colonia+del+Sacramento,+Uruguay"
              target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-2 w-full h-44 bg-white border-2 border-dashed border-border rounded-2xl text-slate-400 hover:border-navy/30 hover:text-navy transition-all"
            >
              <MapPin size={24} />
              <span className="text-xs font-semibold tracking-widest uppercase">Abrir en Google Maps</span>
            </a>
          </div>

          {/* Form */}
          <div className="contact-right">
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-border rounded-3xl p-8 shadow-[0_4px_24px_rgba(27,58,107,0.06)] space-y-5"
            >
              <div className="mb-2">
                <h3 className="text-slate-900 font-black text-xl">Dejanos tu consulta</h3>
                <p className="text-slate-400 text-xs mt-1">Te respondemos por WhatsApp.</p>
              </div>

              {[
                { id: "name",  label: "Nombre",             type: "text", autoComplete: "name",  placeholder: "Tu nombre",              required: true  },
                { id: "phone", label: "Teléfono (opcional)", type: "tel",  autoComplete: "tel",   placeholder: "Tu teléfono o WhatsApp", required: false },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-2">
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    name={f.id}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    required={f.required}
                    value={form[f.id as "name" | "phone"]}
                    onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                    placeholder={f.placeholder}
                    suppressHydrationWarning
                    className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-navy/50 focus:bg-white transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="block text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-2">
                  Mensaje
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="¿En qué vehículo estás interesado?"
                  rows={4}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:border-navy/50 focus:bg-white transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                suppressHydrationWarning
                className="w-full flex items-center justify-center gap-2.5 bg-crimson text-white font-bold text-sm tracking-widest uppercase py-4 rounded-xl hover:bg-crimson-hover active:scale-[0.98] transition-all duration-200"
              >
                {sent ? "¡Redirigiendo a WhatsApp!" : <><span>Enviar por WhatsApp</span><Send size={14} /></>}
              </button>

              <p className="text-center text-slate-300 text-xs">Al enviar, serás redirigido a WhatsApp.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}