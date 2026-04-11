"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

export type FilterState = {
  sort:        string;
  carroceria:  string[];
  marca:       string[];
  precio:      string[];
  combustible: string[];
  transmision: string[];
};

export const EMPTY_FILTERS: FilterState = {
  sort:        "relevance",
  carroceria:  [],
  marca:       [],
  precio:      [],
  combustible: [],
  transmision: [],
};

export const PRICE_RANGES = [
  { label: "Hasta USD 25.000",    key: "0-25000",     min: 0,     max: 25000    },
  { label: "USD 25.001 – 35.000", key: "25001-35000", min: 25001, max: 35000    },
  { label: "USD 35.001 – 45.000", key: "35001-45000", min: 35001, max: 45000    },
  { label: "Más de USD 45.000",   key: "45001+",      min: 45001, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Más relevantes", value: "relevance"  },
  { label: "Menor precio",   value: "price-asc"  },
  { label: "Mayor precio",   value: "price-desc" },
  { label: "Más recientes",  value: "year-desc"  },
];

export type CountMaps = {
  carroceria:  Record<string, number>;
  marca:       Record<string, number>;
  combustible: Record<string, number>;
  transmision: Record<string, number>;
  precio:      Record<string, number>;
};

interface FiltersProps {
  filters:  FilterState;
  onChange: (f: FilterState) => void;
  counts:   CountMaps;
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-3"
      >
        <span className="text-[11px] font-bold text-slate-500 tracking-[0.1em] uppercase">
          {title}
        </span>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="pb-3 space-y-0.5">{children}</div>}
    </div>
  );
}

function CheckItem({
  label,
  count,
  checked,
  onToggle,
}: {
  label:    string;
  count:    number;
  checked:  boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between gap-2 py-1 group"
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors duration-150 ${
            checked ? "bg-navy border-navy" : "border-slate-300 group-hover:border-slate-400"
          }`}
        >
          {checked && (
            <svg viewBox="0 0 8 6" className="w-2 h-1.5">
              <polyline
                points="1,3 3,5 7,1"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span
          className={`text-xs transition-colors duration-150 ${
            checked
              ? "text-slate-800 font-semibold"
              : "text-slate-500 group-hover:text-slate-700"
          }`}
        >
          {label}
        </span>
      </div>
      <span className="text-[10px] text-slate-400 tabular-nums font-medium">{count}</span>
    </button>
  );
}

export default function Filtros({ filters, onChange, counts }: FiltersProps) {
  const activeCount =
    filters.carroceria.length +
    filters.marca.length +
    filters.precio.length +
    filters.combustible.length +
    filters.transmision.length;

  function toggle(key: keyof Omit<FilterState, "sort">, value: string) {
    const arr = filters[key] as string[];
    onChange({
      ...filters,
      [key]: arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value],
    });
  }

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={12} className="text-navy" />
          <span className="text-xs font-bold text-slate-700">Filtros</span>
          {activeCount > 0 && (
            <span className="text-[10px] bg-navy text-white font-bold px-1.5 py-0.5 rounded-full leading-none">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-crimson transition-colors"
          >
            <X size={10} />
            Limpiar
          </button>
        )}
      </div>

      <div className="px-4">
        {/* Sort */}
        <div className="py-3 border-b border-border">
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.1em] uppercase mb-1.5">
            Ordenar
          </p>
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => onChange({ ...filters, sort: e.target.value })}
              className="w-full text-xs text-slate-700 font-medium bg-transparent appearance-none pr-5 py-0.5 outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        <Section title="Carrocería">
          {Object.entries(counts.carroceria).map(([label, count]) => (
            <CheckItem
              key={label} label={label} count={count}
              checked={filters.carroceria.includes(label)}
              onToggle={() => toggle("carroceria", label)}
            />
          ))}
        </Section>

        <Section title="Marca">
          {Object.entries(counts.marca).map(([label, count]) => (
            <CheckItem
              key={label} label={label} count={count}
              checked={filters.marca.includes(label)}
              onToggle={() => toggle("marca", label)}
            />
          ))}
        </Section>

        <Section title="Rango de precios">
          {PRICE_RANGES.map((r) => (
            <CheckItem
              key={r.key} label={r.label} count={counts.precio[r.key] ?? 0}
              checked={filters.precio.includes(r.key)}
              onToggle={() => toggle("precio", r.key)}
            />
          ))}
        </Section>

        <Section title="Combustible">
          {Object.entries(counts.combustible).map(([label, count]) => (
            <CheckItem
              key={label} label={label} count={count}
              checked={filters.combustible.includes(label)}
              onToggle={() => toggle("combustible", label)}
            />
          ))}
        </Section>

        <Section title="Transmisión" defaultOpen={false}>
          {Object.entries(counts.transmision).map(([label, count]) => (
            <CheckItem
              key={label} label={label} count={count}
              checked={filters.transmision.includes(label)}
              onToggle={() => toggle("transmision", label)}
            />
          ))}
        </Section>
      </div>
    </div>
  );
}
