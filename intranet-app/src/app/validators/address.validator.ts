import {AbstractControl} from '@angular/forms';

export const esNumeroCalleValido = (numero: string) => {
  const regex = /^\d+$|^sn$|^SN$|^$/;
  if (numero.match(regex)) {
      return true;
  }
  return false;
};

export const esPisoOPuertaValido = (numero: string) => {
  const regex = /^\d+$|^na$|^NA$|^$/;
  if (numero.match(regex)) {
      return true;
  }
  return false;
};

export const numeroCalleValido = (control: AbstractControl) => {
    const valor = control.value;
    if (valor && !esNumeroCalleValido(valor)) {
        return { numeroCalleValido: "El valor no es válido: se admiten números o la cadena 'sn'"};
    }
    return null;
};

export const pisoOPuertaValido = (control: AbstractControl) => {
    const valor = control.value;
    if (valor && !esPisoOPuertaValido(valor)) {
        return { pisoOPuertaValido: "El valor no es válido: se admiten números o la cadena 'na'"};
    }
    return null;
};
