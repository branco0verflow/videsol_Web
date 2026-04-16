export interface BrandInfo {
  name:  string
  image: string
}

export const BRAND_MAP: Record<string, BrandInfo> = {
  byd:     { name: 'BYD',     image: '/images/seccion/byd.png' },
  nissan:  { name: 'Nissan',  image: '/images/seccion/nissan.png' },
  citroen: { name: 'Citroën', image: '/images/seccion/citroen.png' },
  peugeot: { name: 'Peugeot', image: '/images/seccion/peugeot.png' },
  riddara: { name: 'Riddara', image: '/images/seccion/riddara.png' },
  renault: { name: 'Renault', image: '/images/seccion/renault.png' },
  subaru:  { name: 'Subaru',  image: '/images/seccion/subaru.png' },
}

/** Convierte el nombre de una marca a su slug URL (ej: "Citroën" → "citroen") */
export function brandToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
