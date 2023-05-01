import { Perfil } from "./perfil.model"

export interface Usuario{
    id?: Number,
    nombre?: string,
    apellido1?: string,
    apellido2?: string,
    docIdentidad?: string,
    tipoDocIdentidad?: string,
    email?: string,
    login?: string,
    pass?: string,
    telefono?: Number,
    direccion?: string,
    municipio?: string,
    activo?: Boolean,
    validado?: Boolean,
    perfil?: Perfil
}

export interface FiltroUsuario{
    nombre?: string,
    perfil?: string,
    activo?: Boolean,
    validado?: Boolean,
    itemsPorPagina?: number,
    pagina?: number
    
}