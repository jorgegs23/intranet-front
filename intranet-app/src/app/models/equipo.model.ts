import { Categoria } from "./categoria.model";
import { Temporada } from "./temporada.model";

export interface Equipo{
    id?: Number,
    nombre?: string,
    categoria?: Categoria,
    municipio?: string,
    pabellon?: string,
    direccion?: string,
    temporada?: Temporada
}

export interface FiltroEquipo{
    nombre?: string,
    categoria?: string,
    municipio?: string,
    temporada?: Number,
    itemsPorPagina?: number,
    pagina?: number
}