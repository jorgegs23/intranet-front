import { Partido } from "./partido.model";
import { Usuario } from "./usuario.model";

export interface Designacion{
    id?: Number,
    fecha?: Date,
    partido?: Partido,
    arbitro1?: Usuario,
    arbitro2?: Usuario,
    arbitro3?: Usuario,
    oficial1?: Usuario,
    oficial2?: Usuario,
    oficial3?: Usuario,
    oficial4?: Usuario,
}

export interface FiltroDesignacion{
    temporada?: Number,
    mes?: Date,
    fecha?: Date,
    usuario?: Number,
    idsDesignaciones?: Number[],
    itemsPorPagina?: number,
    pagina?: number
}