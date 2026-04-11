"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

export default function Header() {
  const mapsUrl =
    "https://maps.google.com/?q=José+Pedro+Varela+593,+Colonia+del+Sacramento,+Uruguay";

  return (
    <header className="w-full bg-white border-b border-[#E2E8F0] z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">

            {/* Address */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 group"
            >
              <MapPin
                size={14}
                className="text-[#1B3A6B] mt-0.5 shrink-0 group-hover:scale-110 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-xs text-[#0F172A] font-semibold leading-tight">
                  JOSÉ PEDRO VARELA 593
                </span>
                <span className="text-[10px] text-[#64748B] leading-tight">
                  Colonia del Sacramento —{" "}
                  <span className="text-[#1B3A6B] group-hover:underline font-medium">
                    Ver en mapa
                  </span>
                </span>
              </div>
            </a>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-[#E2E8F0]" />

            {/* Phone / WhatsApp */}
            <a
              href="https://wa.me/59845225411"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              <div className="w-6 h-6 bg-[#25D366]/10 rounded-full flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                <svg viewBox="0 0 24 24" fill="#25D366" className="w-3.5 h-3.5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#0F172A] font-semibold leading-tight">
                  4522 5411 / 12
                </span>
                <span className="text-[10px] text-[#64748B] leading-tight">
                  Contactar por WhatsApp
                </span>
              </div>
            </a>

          </div>
        </div>
      </div>
    </header>
  );
}
