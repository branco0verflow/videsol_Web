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
