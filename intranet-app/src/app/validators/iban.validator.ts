import {Generic, Strings} from '@shared/utils/utils';

const modulo97 = (iban: string): number => {
  const parts = Math.ceil(iban.length / 7);
  let remainer = '';

  for (let i = 1; i <= parts; i++) {
      remainer = String(parseFloat(remainer + iban.substr((i - 1) * 7, 7)) % 97);
  }

  return Number(remainer);
};

const getnumIBAN = (letra: string): number => {
  const lsLetras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return lsLetras.search(letra) + 10;
};

export const esIbanValido = (iban: string): boolean => {
  if (Generic.isNullOrUndefined(iban) || Strings.isEmpty(iban)) {
    return false;
  }

  const ibanAux = iban.toUpperCase().trim().replace(/\s/g, '');
  // La longitud debe ser siempre de 24 caracteres
  if (ibanAux.length !== 24) {
      return false;
  }

  let letra1: string;
  let letra2: string;
  let num1: number;
  let num2: number;
  let isbanaux: string;

  // Se coge las primeras dos letras y se pasan a números
  letra1 = iban.substring(0, 1);
  letra2 = iban.substring(1, 2);
  num1 = getnumIBAN(letra1);
  num2 = getnumIBAN(letra2);
  // Se sustituye las letras por números.
  isbanaux = String(num1) + String(num2) + ibanAux.substring(2);
  // Se mueve los 6 primeros caracteres al final de la cadena.
  isbanaux = isbanaux.substring(6) + isbanaux.substring(0, 6);

  // Se calcula el resto, llamando a la función modulo97, definida más abajo
  const resto = modulo97(isbanaux);
  return (resto === 1);
};
