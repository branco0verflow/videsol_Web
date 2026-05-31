export interface ColorOption {
  nombre:   string
  swatch:   string
  prin:     string
  imagenes: string[]
}

export interface VehicleData {
  id:                 string
  marca:              string
  modelo:             string
  version:            string
  anio:               number
  km:                 number
  precio:             number
  tipo:               string | null
  cilindrada:         string | null
  potencia:           string | null
  combustible:        string | null
  color:              string | null
  puertas:            number
  direccion:          string | null
  transmision:        string | null
  garantia:           boolean
  financiacion:       boolean
  descripcion:        string
  prin:               string
  imagenes:           string[]
  catalogo?:          string | null
  colorSeleccionado?: string
  colores?:           ColorOption[]
}

export interface VehicleAPI {
  id:                 number
  code?:              string
  marca:              string
  modelo:             string
  version:            string
  precio:             number
  tipoNegocio?:       string
  imagenPrincipalUrl: string
  anio:               number
  combustible:        string
  transmision:        string
  garantia:           boolean
  financiacion:       boolean
  km?:                number
  tipo?:              string
  color?:             string
  unicoDueno?:        boolean
}

export interface PaginaVehiculos {
  contenido:      VehicleAPI[]
  paginaActual:   number
  totalPaginas:   number
  totalElementos: number
  porPagina:      number
  esUltima:       boolean
}

export interface ImagenUsadoAPI {
  id:          number
  url:         string
  esPrincipal: boolean
  orden:       number
}

export interface VehicleUsadoDetailAPI {
  id:                  number
  activo:              boolean
  disponibleEnPilot?:  boolean
  pilotId?:            string | null
  marca:          string
  modelo:         string
  version:        string
  anio:           number
  km:             number
  precio?:        number
  precioRef?:     string | null
  tipo:           string | null
  cilindrada:     string | null
  potencia:       string | null
  combustible:    string
  color:          string | null
  puertas:        number
  direccion:      string | null
  transmision:    string
  garantia:       boolean
  financiacion:   boolean
  unicoDueno?:    boolean
  patenteMensual?: number | null
  patenteAnual?:  number | null
  descripcion:     string
  imagenes:        ImagenUsadoAPI[]
  caracteristicas?: CaracteristicasAPI
}

export interface ImagenDetailAPI {
  id:    number
  url:   string
  orden: number
}

export interface ColorDetailAPI {
  id:                 number
  nombre:             string
  swatchUrl:          string
  imagenPrincipalUrl: string
  imagenes:           ImagenDetailAPI[]
}

export interface CaracteristicasAPI {
  seguridad:  string[]
  confort:    string[]
  multimedia: string[]
}

export interface VehicleDetailAPI {
  id:             number
  code:           string
  marca:          string
  modelo:         string
  version:        string
  precio:         number
  vigenciaPrecio: string
  tipoNegocio:    string
  activo:         boolean
  tipo:           string | null
  anio:           number
  cilindrada:     string | null
  potencia:       string | null
  combustible:    string
  puertas:        number
  direccion:      string | null
  transmision:    string
  garantia:       boolean
  financiacion:   boolean
  descripcion:    string
  catalogoPdfUrl: string | null
  colores:        ColorDetailAPI[]
  caracteristicas: CaracteristicasAPI
}
