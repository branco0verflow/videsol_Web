export interface BrandInfo {
  name:  string
  image: string
}

export const BRAND_MAP: Record<string, BrandInfo> = {
  byd:     { name: 'BYD',     image: '/images/seccion/byd.png' },
  nissan:  { name: 'Nissan',  image: '/images/marcas/Marca2.png' },
  citroen: { name: 'Citroën', image: '/images/marcas/Marca3.png' },
  peugeot: { name: 'Peugeot', image: '/images/seccion/peugeot.png' },
  riddara: { name: 'Riddara', image: '/images/marcas/Marca5.png' },
  renault: { name: 'Renault', image: '/images/seccion/renault.png' },
  subaru:  { name: 'Subaru',  image: '/images/marcas/Marca7.png' },
}

/** Convierte el nombre de una marca a su slug URL (ej: "Citroën" → "citroen") */
export function brandToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
