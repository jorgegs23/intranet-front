import {Generic} from '@shared/utils/utils';

export const esDNIValido = (dni: string): boolean => {
  if (Generic.isNullOrUndefined(dni)) {
    return false;
  }
  const doc = dni.toUpperCase();
  const expresionRegularDni = /^\d{8}[a-zA-Z]$/;
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKET';

  if (!expresionRegularDni.test(doc)) {
    return false;
  }

  const resto = parseInt(doc.substr(0, doc.length - 1), 10) % 23;
  const letra = doc.charAt(doc.length - 1);
  if (letra.toUpperCase() !== letras.charAt(resto)) {
    return false;
  }

  return true;
};

export const esCIFValido = (cif: string): boolean => {
  if (Generic.isNullOrUndefined(cif)) {
    return false;
  }
  const doc = cif.toUpperCase();
  const letras = 'ABCDEFGHKLMNPQS';
  const letra = doc.charAt(0);
  let par = 0;
  let non = 0;

  if (doc.length !== 9) {
    return false;
  }

  if (letras.indexOf(letra.toUpperCase()) === -1) {
    return false;
  }

  for (let zz = 2; zz < 8; zz += 2) {
    par = par + Number(doc.charAt(zz));
  }

  for (let zz = 1; zz < 9; zz += 2) {
    let nn = Number(doc.charAt(zz)) * 2;
    if (nn > 9) {
      nn = (nn - 10) + 1;
    }
    non = non + nn;
  }

  const parcial = par + non;
  let control = (10 - (parcial % 10));
  if (control === 10) {
    control = 0;
  }
  if (control !== Number(doc.charAt(8))) {
    return false;
  }
  return true;
};

export const esNIEValido = (nie: string): boolean => {
  if (Generic.isNullOrUndefined(nie)) {
    return false;
  }
  const doc = nie.toUpperCase();
  const expr = /^[XYZ]\d{5,8}[A-Z]$/;
  const letras = 'TRWAGMYFPDXBNJZSQVHLCKET';

  if (!expr.test(doc)) {
    return false;
  }

  const sNnumero = doc.substr(0, doc.length - 1)
    .replace('X', '0')
    .replace('Y', '1')
    .replace('Z', '2');
  const letra = doc.charAt(doc.length - 1);
  const resto = parseInt(sNnumero, 10) % 23;
  if (letra !== letras.charAt(resto)) {
    return false;
  }
  return true;
};
