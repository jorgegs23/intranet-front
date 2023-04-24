export enum OPERACION {
  NEW = 'N',
  VIEW = 'V',
  EDIT = 'E'
}

export enum TIPO_DOCUMENTO {
  DNI = 1,
  NIE = 2,
  PASAPORTE = 3
}

export enum PERFIL {
  ADMIN = 'ADM',
  OFICIAL = 'OFI',
  ARBITRO = 'ARB'
}

export enum ROL {
  VALI_CERT = 'ROL_ACTIVO'
}

export enum PERMISO {
  SIN_PERMISO = 'SP',
  LECTURA = 'RO',
  EDICION = 'RW'
}

export enum SESION {
  USUARIO = 'usuario',
  TEMA = 'tema'
}