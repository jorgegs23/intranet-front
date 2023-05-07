import { Categoria } from "./categoria.model";
import { Competicion } from "./competicion.model";
import { Equipo } from "./equipo.model";
import { Temporada } from "./temporada.model";

export interface Partido{
    id?: Number,
    temporada?: Temporada,
    competicion?: Competicion,
    categoria?: Categoria,
    jornada?: Number,
    equipoLocal?: Equipo,
    equipoVisitante?: Equipo,
    fecha?: Date,
    municipio?: string,
    pabellon?: string,
    direccion?: string,
}

export interface FiltroPartido{
    temporada?: Number,
    competicion?: string,
    categoria?: string,
    jornada?: Number,
    equipoLocal?: Number,
    equipoVisitante?: Number,
    fecha?: Date,
    itemsPorPagina?: number,
    pagina?: number
}