// ============================================================
//  DATOS DE VEHÍCULOS — VIDESOL CONCESIONARIA
//  Estructura de cada vehículo:
//  marca, modelo, anio, km, precio, version, tipo, cilindrada,
//  potencia, combustible, puertas, direccion, transmision,
//  garantia, financiacion, descripcion, catalogo (URL o null),
//  prin (img principal del color seleccionado por defecto),
//  colorSeleccionado (string — color activo al cargar),
//  colores: [ { nombre, swatch, prin, imagenes[] } ]
// ============================================================
 
const vehiculos = {
 
  okm: [
    {
      id: "okm-01",
      marca: "BYD",
      modelo: "Yuan",
      version: "Pro",
      anio: 2026,
      km: 0,
      precio: 28990,
      tipo: "SUV",
      cilindrada: null,
      potencia: "204 hp",
      combustible: "Eléctrico",
      puertas: 5,
      direccion: "Eléctrica",
      transmision: "Automática",
      garantia: true,
      financiacion: true,
      descripcion: "El BYD Yuan Pro 2026 es el SUV eléctrico que redefine la movilidad urbana. Autonomía de hasta 430 km, carga rápida, pantalla giratoria de 12.8 pulgadas, sistema DiPilot con asistentes de conducción inteligentes y cero emisiones. El futuro ya llegó.",
      catalogo: null,
      prin: "https://res.cloudinary.com/ds00uigkd/image/upload/v1776012901/1-1-5_iaypkv.jpg",
      colorSeleccionado: "Blanco",
      colores: [
        {
          nombre: "Blanco",
          swatch: "https://res.cloudinary.com/ds00uigkd/image/upload/v1776012901/1-1-5_iaypkv.jpg",
          prin: "https://res.cloudinary.com/ds00uigkd/image/upload/v1776012901/1-1-5_iaypkv.jpg",
          imagenes: [
            "https://res.cloudinary.com/ds00uigkd/image/upload/v1776012901/1-1-5_iaypkv.jpg",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
          ]
        },
        {
          nombre: "Gris",
          swatch: "https://res.cloudinary.com/ds00uigkd/image/upload/v1776013877/YUAN-PRO-Time_Gray_zzm4xs.webp",
          prin: "https://res.cloudinary.com/ds00uigkd/image/upload/v1776013877/YUAN-PRO-Time_Gray_zzm4xs.webp",
          imagenes: [
            "https://res.cloudinary.com/ds00uigkd/image/upload/v1776013877/YUAN-PRO-Time_Gray_zzm4xs.webp",
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800",
            "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800",
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800"
          ]
        },
        {
          nombre: "Negro",
          swatch: "https://res.cloudinary.com/ds00uigkd/image/upload/v1776013994/Kgawa49jm_1748472588210_kosjly.jpg",
          prin: "https://res.cloudinary.com/ds00uigkd/image/upload/v1776013994/Kgawa49jm_1748472588210_kosjly.jpg",
          imagenes: [
            "https://res.cloudinary.com/ds00uigkd/image/upload/v1776013994/Kgawa49jm_1748472588210_kosjly.jpg",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
            "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800",
            "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
            "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800"
          ]
        },
        {
          nombre: "Azul",
          swatch: "https://res.cloudinary.com/ds00uigkd/image/upload/v1776014201/1737950414881-hoc6cs-malachite_darkcyan_pc_cwauof.jpg",
          prin: "https://res.cloudinary.com/ds00uigkd/image/upload/v1776014201/1737950414881-hoc6cs-malachite_darkcyan_pc_cwauof.jpg",
          imagenes: [
            "https://res.cloudinary.com/ds00uigkd/image/upload/v1776014201/1737950414881-hoc6cs-malachite_darkcyan_pc_cwauof.jpg",
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800"
          ]
        }
      ]
    },
    {
      id: "okm-02",
      marca: "Renault",
      modelo: "Oroch",
      version: "Intens 1.3 CVT 4X2",
      anio: 2026,
      km: 0,
      precio: 25600,
      tipo: "Pick-Up",
      cilindrada: "1300 cc",
      potencia: null,
      combustible: "Nafta",
      puertas: 4,
      direccion: "Eléctrica",
      transmision: "Automática (CVT)",
      garantia: true,
      financiacion: true,
      descripcion: "La Renault Oroch Intens 2026 llega con motor turbo 1.3 CVT y tracción 4x2. Pick-up compacta que combina versatilidad para el trabajo con el confort de un SUV. Equipamiento Intens con conectividad multimedia y asistentes de seguridad.",
      catalogo: "https://www.renault.com.uy/CountriesData/Uruguay/images/catalogos/2025/RENAULT_Catalogo_OROCH-Diciembre_2025.pdf",
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/1154/1154_4036_desktop.jpeg",
      colorSeleccionado: "Gris",
      colores: [
        {
          nombre: "Gris",
          swatch: "https://cdn.pilotsolution.net/crm/stock/videsol/1154/1154_4036_desktop.jpeg",
          prin: "https://cdn.pilotsolution.net/crm/stock/videsol/1154/1154_4036_desktop.jpeg",
          imagenes: [
            "https://cdn.pilotsolution.net/crm/stock/videsol/1154/1154_4036_desktop.jpeg",
            "https://cdn.pilotsolution.net/crm/stock/videsol/1154/1154_4037_desktop.jpeg",
            "https://cdn.pilotsolution.net/crm/stock/videsol/1154/1154_4038_desktop.jpeg",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
          ]
        },
        {
          nombre: "Blanco",
          swatch: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          prin: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
            "https://images.unsplash.com/photo-1609695001649-afb26d43a857?w=800",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
          ]
        },
        {
          nombre: "Rojo",
          swatch: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
          prin: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800"
          ]
        },
        {
          nombre: "Negro",
          swatch: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
          prin: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
            "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800",
            "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800"
          ]
        }
      ]
    },
    {
      id: "okm-03",
      marca: "Renault",
      modelo: "Nueva Stepway",
      version: "Zen 1.6 CVT",
      anio: 2026,
      km: 0,
      precio: 20500,
      tipo: "Hatchback",
      cilindrada: "1600 cc",
      potencia: "115 hp",
      combustible: "Nafta",
      puertas: 5,
      direccion: "Eléctrica",
      transmision: "Automática (CVT)",
      garantia: true,
      financiacion: true,
      descripcion: "La Nueva Renault Stepway 2026 combina diseño crossover moderno con equipamiento de alta tecnología. Techo bicolor, control de estabilidad, pantalla multimedia de 8 pulgadas y cámara de retroceso. Ideal para la ciudad y caminos de tierra.",
      catalogo: null,
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/663/663_764_phablet.jpeg",
      colorSeleccionado: "Rojo",
      colores: [
        {
          nombre: "Rojo",
          swatch: "https://cdn.pilotsolution.net/crm/stock/videsol/663/663_764_phablet.jpeg",
          prin: "https://cdn.pilotsolution.net/crm/stock/videsol/663/663_764_phablet.jpeg",
          imagenes: [
            "https://cdn.pilotsolution.net/crm/stock/videsol/663/663_764_phablet.jpeg",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
          ]
        },
        {
          nombre: "Blanco",
          swatch: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          prin: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
            "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800"
          ]
        },
        {
          nombre: "Gris",
          swatch: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
          prin: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800",
            "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
            "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
          ]
        }
      ]
    },
    {
      id: "okm-04",
      marca: "Renault",
      modelo: "Kangoo",
      version: "Intens 1.5 dCi",
      anio: 2026,
      km: 0,
      precio: 22500,
      tipo: "Utilitario",
      cilindrada: "1500 cc",
      potencia: "95 hp",
      combustible: "Diesel",
      puertas: 5,
      direccion: "Hidráulica",
      transmision: "Manual 5 vel.",
      garantia: true,
      financiacion: true,
      descripcion: "El Renault Kangoo 2026 es el utilitario familiar por excelencia. Amplio maletero, asientos rebatibles, climatizador bizona y conectividad total. Perfecto para trabajo y familia con la economía del motor diésel.",
      catalogo: null,
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/667/667_800_phablet.jpeg",
      colorSeleccionado: "Blanco",
      colores: [
        {
          nombre: "Blanco",
          swatch: "https://cdn.pilotsolution.net/crm/stock/videsol/667/667_800_phablet.jpeg",
          prin: "https://cdn.pilotsolution.net/crm/stock/videsol/667/667_800_phablet.jpeg",
          imagenes: [
            "https://cdn.pilotsolution.net/crm/stock/videsol/667/667_800_phablet.jpeg",
            "https://images.unsplash.com/photo-1609695001649-afb26d43a857?w=800",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
            "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
          ]
        },
        {
          nombre: "Gris",
          swatch: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
          prin: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800",
            "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800"
          ]
        },
        {
          nombre: "Rojo",
          swatch: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
          prin: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"
          ]
        }
      ]
    },
    {
      id: "okm-05",
      marca: "Renault",
      modelo: "Master",
      version: "L2H2 2.3 dCi",
      anio: 2026,
      km: 0,
      precio: 38000,
      tipo: "Furgón",
      cilindrada: "2300 cc",
      potencia: "136 hp",
      combustible: "Diesel",
      puertas: 3,
      direccion: "Eléctrica",
      transmision: "Manual 6 vel.",
      garantia: true,
      financiacion: true,
      descripcion: "El Renault Master 2026 es la solución definitiva para el transporte de carga. Gran volumen interior, puerta lateral deslizante, sistema de frenado ABS y asistente de arranque en pendiente. Máxima eficiencia para tu negocio.",
      catalogo: null,
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/668/668_4284_phablet.png",
      colorSeleccionado: "Blanco",
      colores: [
        {
          nombre: "Blanco",
          swatch: "https://cdn.pilotsolution.net/crm/stock/videsol/668/668_4284_phablet.png",
          prin: "https://cdn.pilotsolution.net/crm/stock/videsol/668/668_4284_phablet.png",
          imagenes: [
            "https://cdn.pilotsolution.net/crm/stock/videsol/668/668_4284_phablet.png",
            "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
            "https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0?w=800",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800"
          ]
        },
        {
          nombre: "Gris Oscuro",
          swatch: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
          prin: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
            "https://images.unsplash.com/photo-1609695001649-afb26d43a857?w=800",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
            "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800"
          ]
        }
      ]
    },
    {
      id: "okm-06",
      marca: "Citroen",
      modelo: "New Jumpy",
      version: "Business 2.0 BlueHDi",
      anio: 2026,
      km: 0,
      precio: 33490,
      tipo: "Furgón",
      cilindrada: "2000 cc",
      potencia: "122 hp",
      combustible: "Diesel",
      puertas: 5,
      direccion: "Eléctrica",
      transmision: "Automática",
      garantia: true,
      financiacion: true,
      descripcion: "El Citroën New Jumpy 2026 ofrece comodidad de automóvil en un vehículo comercial. Interior premium, pantalla táctil de 10 pulgadas, asistentes de conducción avanzados y modulabilidad excepcional para pasajeros o carga.",
      catalogo: null,
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/690/690_882_phablet.jpeg",
      colorSeleccionado: "Gris",
      colores: [
        {
          nombre: "Gris",
          swatch: "https://cdn.pilotsolution.net/crm/stock/videsol/690/690_882_phablet.jpeg",
          prin: "https://cdn.pilotsolution.net/crm/stock/videsol/690/690_882_phablet.jpeg",
          imagenes: [
            "https://cdn.pilotsolution.net/crm/stock/videsol/690/690_882_phablet.jpeg",
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800"
          ]
        },
        {
          nombre: "Blanco",
          swatch: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          prin: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
            "https://images.unsplash.com/photo-1609695001649-afb26d43a857?w=800"
          ]
        },
        {
          nombre: "Negro",
          swatch: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
          prin: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
            "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800",
            "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
            "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800"
          ]
        }
      ]
    },
    {
      id: "okm-07",
      marca: "Citroen",
      modelo: "C4 Cactus",
      version: "Feel 1.6 VTi",
      anio: 2026,
      km: 0,
      precio: 24990,
      tipo: "Crossover",
      cilindrada: "1600 cc",
      potencia: "115 hp",
      combustible: "Nafta",
      puertas: 5,
      direccion: "Eléctrica",
      transmision: "Automática (CVT)",
      garantia: true,
      financiacion: true,
      descripcion: "El Citroën C4 Cactus 2026 redefine el concepto de crossover urbano. Airbumps laterales para protección urbana, suspensión Progressive Hydraulic Cushions para máximo confort, y un diseño exterior audaz que destaca en cualquier calle.",
      catalogo: null,
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/691/691_885_phablet.jpeg",
      colorSeleccionado: "Verde",
      colores: [
        {
          nombre: "Verde",
          swatch: "https://cdn.pilotsolution.net/crm/stock/videsol/691/691_885_phablet.jpeg",
          prin: "https://cdn.pilotsolution.net/crm/stock/videsol/691/691_885_phablet.jpeg",
          imagenes: [
            "https://cdn.pilotsolution.net/crm/stock/videsol/691/691_885_phablet.jpeg",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
            "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
            "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800"
          ]
        },
        {
          nombre: "Naranja",
          swatch: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
          prin: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800"
          ]
        },
        {
          nombre: "Blanco",
          swatch: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          prin: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
            "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800"
          ]
        },
        {
          nombre: "Gris",
          swatch: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
          prin: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
            "https://images.unsplash.com/photo-1609695001649-afb26d43a857?w=800",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
            "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"
          ]
        }
      ]
    },
    {
      id: "okm-08",
      marca: "Peugeot",
      modelo: "New 5008",
      version: "Allure Pack 1.6 THP",
      anio: 2026,
      km: 0,
      precio: 54990,
      tipo: "SUV 7 asientos",
      cilindrada: "1600 cc",
      potencia: "180 hp",
      combustible: "Nafta",
      puertas: 5,
      direccion: "Eléctrica",
      transmision: "Automática 8 vel.",
      garantia: true,
      financiacion: true,
      descripcion: "El Peugeot New 5008 2026 es el SUV familiar de referencia. Siete plazas confortables, i-Cockpit® con cuadro digital de 12 pulgadas, Night Vision, y tracción en las cuatro ruedas. Lujo, espacio y tecnología en un solo vehículo.",
      catalogo: null,
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/695/695_4568_phablet.jpeg",
      colorSeleccionado: "Negro",
      colores: [
        {
          nombre: "Negro",
          swatch: "https://cdn.pilotsolution.net/crm/stock/videsol/695/695_4568_phablet.jpeg",
          prin: "https://cdn.pilotsolution.net/crm/stock/videsol/695/695_4568_phablet.jpeg",
          imagenes: [
            "https://cdn.pilotsolution.net/crm/stock/videsol/695/695_4568_phablet.jpeg",
            "https://images.unsplash.com/photo-1609695001649-afb26d43a857?w=800",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
            "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800"
          ]
        },
        {
          nombre: "Blanco Nacarado",
          swatch: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          prin: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800"
          ]
        },
        {
          nombre: "Gris Platino",
          swatch: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800",
          prin: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800",
            "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
            "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800"
          ]
        },
        {
          nombre: "Azul Oscuro",
          swatch: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
          prin: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
            "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800"
          ]
        }
      ]
    },
    {
      id: "okm-09",
      marca: "Nissan",
      modelo: "Nuevo Sentra B18",
      version: "Advance 2.0 CVT",
      anio: 2026,
      km: 0,
      precio: 34990,
      tipo: "Sedán",
      cilindrada: "2000 cc",
      potencia: "149 hp",
      combustible: "Nafta",
      puertas: 4,
      direccion: "Eléctrica",
      transmision: "Automática (CVT)",
      garantia: true,
      financiacion: true,
      descripcion: "El Nissan Nuevo Sentra B18 2026 eleva el estándar del sedán con su diseño deportivo y cabina ultra-tecnológica. ProPilot Assist, pantalla de 9 pulgadas con Apple CarPlay/Android Auto y el motor más eficiente de su segmento.",
      catalogo: null,
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/702/702_3934_phablet.jpeg",
      colorSeleccionado: "Azul",
      colores: [
        {
          nombre: "Azul",
          swatch: "https://cdn.pilotsolution.net/crm/stock/videsol/702/702_3934_phablet.jpeg",
          prin: "https://cdn.pilotsolution.net/crm/stock/videsol/702/702_3934_phablet.jpeg",
          imagenes: [
            "https://cdn.pilotsolution.net/crm/stock/videsol/702/702_3934_phablet.jpeg",
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800"
          ]
        },
        {
          nombre: "Negro",
          swatch: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
          prin: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
            "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800",
            "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
            "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800"
          ]
        },
        {
          nombre: "Blanco",
          swatch: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          prin: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800"
          ]
        },
        {
          nombre: "Rojo",
          swatch: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
          prin: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
            "https://images.unsplash.com/photo-1609695001649-afb26d43a857?w=800",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800"
          ]
        }
      ]
    },
    {
      id: "okm-10",
      marca: "Nissan",
      modelo: "Nueva Kicks",
      version: "Exclusive 1.6 CVT",
      anio: 2026,
      km: 0,
      precio: 27990,
      tipo: "SUV",
      cilindrada: "1600 cc",
      potencia: "118 hp",
      combustible: "Nafta",
      puertas: 5,
      direccion: "Eléctrica",
      transmision: "Automática (CVT)",
      garantia: true,
      financiacion: true,
      descripcion: "La Nissan Nueva Kicks 2026 es el SUV urbano más completo. Cámara 360°, asistente de permanencia en carril, freno de emergencia autónomo y pantalla multimedia de 8 pulgadas con conectividad total. Estilo y seguridad sin compromisos.",
      catalogo: null,
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/711/711_949_phablet.jpeg",
      colorSeleccionado: "Naranja",
      colores: [
        {
          nombre: "Naranja",
          swatch: "https://cdn.pilotsolution.net/crm/stock/videsol/711/711_949_phablet.jpeg",
          prin: "https://cdn.pilotsolution.net/crm/stock/videsol/711/711_949_phablet.jpeg",
          imagenes: [
            "https://cdn.pilotsolution.net/crm/stock/videsol/711/711_949_phablet.jpeg",
            "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
            "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"
          ]
        },
        {
          nombre: "Negro",
          swatch: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800",
          prin: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800",
            "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
            "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800",
            "https://images.unsplash.com/photo-1609695001649-afb26d43a857?w=800",
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800"
          ]
        },
        {
          nombre: "Blanco",
          swatch: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          prin: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
            "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800"
          ]
        },
        {
          nombre: "Azul",
          swatch: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
          prin: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
          imagenes: [
            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800",
            "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
            "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"
          ]
        }
      ]
    }
  ],

  usados: [
    {
      id: "usado-01",
      marca: "Chevrolet",
      modelo: "Tracker",
      version: "LTZ 1.8 AT",
      anio: 2013,
      km: 140000,
      precio: 13300,
      tipo: "SUV",
      cilindrada: "1800 cc",
      potencia: "140 hp",
      combustible: "Nafta",
      color: "Plateado",
      puertas: 5,
      direccion: "Hidráulica",
      transmision: "Automática 6 vel.",
      garantia: false,
      financiacion: true,
      descripcion: "Chevrolet Tracker 2013 en excelente estado. Motor 1.8 nafta con transmisión automática de 6 velocidades. Equipado con cuero, climatizador automático y sensores de estacionamiento. Revisión mecánica completa al día.",
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/1600/1600_4692_desktop.jpeg",
      imagenes: [
        "https://cdn.pilotsolution.net/crm/stock/videsol/1600/1600_4692_desktop.jpeg",
        "https://images.unsplash.com/photo-1609695001649-afb26d43a857?w=800",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"
      ]
    },
    {
      id: "usado-02",
      marca: "Tavria",
      modelo: "1102",
      version: "Standard",
      anio: 1994,
      km: 500,
      precio: 4500,
      tipo: "Hatchback",
      cilindrada: "1100 cc",
      potencia: "53 hp",
      combustible: "Nafta",
      color: "Blanco",
      puertas: 5,
      direccion: "Mecánica",
      transmision: "Manual 4 vel.",
      garantia: false,
      financiacion: false,
      descripcion: "Rareza coleccionable: Tavria 1102 año 1994 con apenas 500 km reales. Prácticamente intacto, ideal para coleccionistas. Toda su mecánica original, interior sin desgaste. Una pieza única de la historia automotriz.",
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/2004/2004_2932_phablet.jpeg",
      imagenes: [
        "https://cdn.pilotsolution.net/crm/stock/videsol/2004/2004_2932_phablet.jpeg",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
        "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800",
        "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800"
      ]
    },
    {
      id: "usado-03",
      marca: "Chevrolet",
      modelo: "S10",
      version: "High Country 2.8 TD 4x4",
      anio: 2019,
      km: 314000,
      precio: 36300,
      tipo: "Pick-Up",
      cilindrada: "2800 cc",
      potencia: "200 hp",
      combustible: "Diesel",
      color: "Gris Oscuro",
      puertas: 4,
      direccion: "Eléctrica",
      transmision: "Automática 6 vel.",
      garantia: false,
      financiacion: true,
      descripcion: "Chevrolet S10 High Country 2019, la pick-up tope de gama con motor diésel turbo de 200 hp y tracción 4x4. Cuero, pantalla táctil, cámara 360° y control de descenso. Revisada y con service al día. Lista para trabajar.",
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/2073/2073_3854_phablet.jpeg",
      imagenes: [
        "https://cdn.pilotsolution.net/crm/stock/videsol/2073/2073_3854_phablet.jpeg",
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        "https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=800",
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"
      ]
    },
    {
      id: "usado-04",
      marca: "Morris",
      modelo: "Minor",
      version: "Series MM",
      anio: 1950,
      km: 0,
      precio: 8500,
      tipo: "Clásico",
      cilindrada: "918 cc",
      potencia: "27 hp",
      combustible: "Nafta",
      color: "Verde",
      puertas: 2,
      direccion: "Mecánica",
      transmision: "Manual 3 vel.",
      garantia: false,
      financiacion: false,
      descripcion: "Legendario Morris Minor 1950 en estado de conservación notable. Carrocería restaurada respetando la originalidad, motor funcionando correctamente. Un clásico británico para entendidos. Oportunidad única para amantes del automóvil histórico.",
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/2718/2718_3886_phablet.jpeg",
      imagenes: [
        "https://cdn.pilotsolution.net/crm/stock/videsol/2718/2718_3886_phablet.jpeg",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
        "https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0?w=800",
        "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800"
      ]
    },
    {
      id: "usado-05",
      marca: "Citroen",
      modelo: "New C3",
      version: "Feel 1.2 PureTech",
      anio: 2018,
      km: 59000,
      precio: 18300,
      tipo: "Hatchback",
      cilindrada: "1200 cc",
      potencia: "82 hp",
      combustible: "Nafta",
      color: "Rojo",
      puertas: 5,
      direccion: "Eléctrica",
      transmision: "Manual 5 vel.",
      garantia: false,
      financiacion: true,
      descripcion: "Citroën New C3 2018 con 59.000 km reales. Motor 1.2 PureTech de bajo consumo, pantalla táctil, cámara trasera y airbumps protectores. Único dueño, service en concesionaria oficial, excelente estado general.",
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/2721/2721_4125_phablet.jpeg",
      imagenes: [
        "https://cdn.pilotsolution.net/crm/stock/videsol/2721/2721_4125_phablet.jpeg",
        "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800",
        "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
        "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
      ]
    },
    {
      id: "usado-06",
      marca: "Peugeot",
      modelo: "Landtrek",
      version: "Allure 1.9 TD 4x4 (Test Drive)",
      anio: 2023,
      km: 0,
      precio: 39000,
      tipo: "Pick-Up",
      cilindrada: "1900 cc",
      potencia: "150 hp",
      combustible: "Diesel",
      color: "Gris",
      puertas: 4,
      direccion: "Eléctrica",
      transmision: "Automática 6 vel.",
      garantia: true,
      financiacion: true,
      descripcion: "Peugeot Landtrek 2023 ex-vehículo de test drive con kilómetros mínimos. En perfectas condiciones de uso, con garantía de fábrica vigente. Equipado con pantalla táctil, climatizador y tracción 4x4. Oportunidad única al precio de usado.",
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/2950/2950_4387_phablet.jpeg",
      imagenes: [
        "https://cdn.pilotsolution.net/crm/stock/videsol/2950/2950_4387_phablet.jpeg",
        "https://images.unsplash.com/photo-1571987502227-9231b837d92a?w=800",
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"
      ]
    },
    {
      id: "usado-07",
      marca: "Renault",
      modelo: "Oroch",
      version: "Dynamique 2.0 4x2",
      anio: 2018,
      km: 120000,
      precio: 15700,
      tipo: "Pick-Up",
      cilindrada: "2000 cc",
      potencia: "143 hp",
      combustible: "Nafta",
      color: "Blanco",
      puertas: 4,
      direccion: "Hidráulica",
      transmision: "Manual 6 vel.",
      garantia: false,
      financiacion: true,
      descripcion: "Renault Oroch Dynamique 2018 con 120.000 km. Pick-up compacta versátil para ciudad y campo. Motor 2.0 nafta, climatizador, pantalla multimedia, cuatro airbags y control de estabilidad. Sin golpes, impecable mecánica.",
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/2981/2981_4519_phablet.jpeg",
      imagenes: [
        "https://cdn.pilotsolution.net/crm/stock/videsol/2981/2981_4519_phablet.jpeg",
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
        "https://images.unsplash.com/photo-1609695001649-afb26d43a857?w=800",
        "https://images.unsplash.com/photo-1464219551459-ac14ae01fbe0?w=800"
      ]
    },
    {
      id: "usado-08",
      marca: "Peugeot",
      modelo: "3008",
      version: "GT Line 1.6 THP AT",
      anio: 2022,
      km: 55000,
      precio: 29300,
      tipo: "SUV",
      cilindrada: "1600 cc",
      potencia: "180 hp",
      combustible: "Nafta",
      color: "Azul",
      puertas: 5,
      direccion: "Eléctrica",
      transmision: "Automática 8 vel.",
      garantia: false,
      financiacion: true,
      descripcion: "Peugeot 3008 GT Line 2022 en estado impecable. i-Cockpit® digital, techo panorámico, asientos deportivos con calefacción, detección de peatones y freno autónomo. Un SUV premium que combina diseño francés con tecnología de vanguardia.",
      prin: "https://cdn.pilotsolution.net/crm/stock/videsol/3034/3034_4652_phablet.jpeg",
      imagenes: [
        "https://cdn.pilotsolution.net/crm/stock/videsol/3034/3034_4652_phablet.jpeg",
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800",
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800",
        "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800"
      ]
    }
  ]

};

// Exportar para uso en módulos (comentar si se usa como script simple)
export default vehiculos;