import {HttpEventType, HttpResponse} from '@angular/common/http';
import {AbstractControl} from '@angular/forms';
import * as moment from 'moment';

type ComparableKeys = number | boolean | string;

export class Generic {
  static isNullOrUndefined<T>(v: T): boolean {
    return v === null || v === undefined;
  }

  static coalesce<T>(...vals: Array<any>): T {
    let result = null;
    if (vals) {
      let i = 0;
      while (result === null && i < vals.length) {
        if (vals[i] !== null && vals[i] !== undefined) {
          result = vals[i];
        }
        i++;
      }
    }
    return result;
  }

  static clone<T>(value: T): T {
    if (value === null || value === undefined) {
      return value;
    }
    return JSON.parse(JSON.stringify(value));
  }
}

export class Strings {
  static isNotEmpty(cad: string | number): boolean {
    return !Generic.isNullOrUndefined(cad) && `${cad}`.trim() !== '';
  }

  static isEmpty(cad: string | number): boolean {
    return Generic.isNullOrUndefined(cad) || `${cad}`.trim() === '';
  }

  static trim(cad: string | number): string {
    if (!Generic.isNullOrUndefined(cad)) {
      return `${cad}`.trim();
    }
    return '';
  }

  static ltrim(cad: string, char = ' '): string {
    if (cad) {
      if (char && char.length > 0) {
        const charAux = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regEx = new RegExp(`^(${charAux})*`);
        return cad.replace(regEx, '');
      }
      return cad.replace(/^\s*/gm, '');
    }
    return '';
  }

  static rtrim(cad: string, char = ' '): string {
    if (cad) {
      if (char && char.length > 0) {
        const charAux = char.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regEx = new RegExp(`(${charAux})*$`);
        return cad.replace(regEx, '');
      }
      return cad.replace(/\s*$/gm, '');
    }
    return '';
  }

  static lowerCase(cad: string): string {
    if (cad) {
      return cad.toLowerCase();
    }
    return '';
  }

  static upperCase(cad: string): string {
    if (cad) {
      return cad.toUpperCase();
    }
    return '';
  }

  static capitalize(cad: string): string {
    if (cad) {
      const trimmedCad = cad.trim();
      if (trimmedCad.length > 1) {
        return (
          trimmedCad.substr(0, 1).toUpperCase() +
          trimmedCad.substr(1).toLowerCase()
        );
      }
      return trimmedCad.toUpperCase();
    }
    return '';
  }

  static removeAccents(cad: string): string {
    if (cad) {
      return cad.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    return '';
  }

  static prepareForSearch(cad: string | number): string {
    if (cad) {
      return Strings.lowerCase(Strings.removeAccents(Strings.trim(`${cad}`)));
    }
    return '';
  }
}

export class Arrays {
  static toArray<T>(val: T | Array<T>): Array<T> {
    if (val === null || val === undefined) {
      return [];
    }
    return Array.isArray(val) ? [...val] : [val];
  }

  static isArray<T>(x: Array<T> | any): x is Array<T> {
    return (Array.isArray && Array.isArray(x)) && (x && typeof x.length === 'number');
  }

  static mapByField<T1, K extends keyof T1>(x: Array<T1>, key: K): Array<T1[K]> {
    if (Generic.isNullOrUndefined(x)) {
      return [];
    }
    if (Generic.isNullOrUndefined(key)) {
      return [];
    }
    return x.map(p => p[key]);
  }

  static sortByField<T1, K extends keyof T1, F extends T1[K] & ComparableKeys>(
      x: Array<T1>,
      key: K,
      order: 'ASC' | 'DESC' = 'ASC'): Array<T1> {

    if (Generic.isNullOrUndefined(x) || x.length === 0) {
      return [];
    }
    if (Generic.isNullOrUndefined(key)) {
      return x;
    }

    let keyComparatorFn: (a: T1[K], b: T1[K]) => number;
    keyComparatorFn = (a: T1[K], b: T1[K]): number => {
      if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
      }
      if (a > b) {
        return 1;
      } else if (a < b) {
        return -1;
    }
      return 0;
    };

    let compareFn: (a: T1, b: T1) => number;
    compareFn = (a: T1, b: T1): number => {
      let res = keyComparatorFn(a[key], b[key]);
      if (order === 'DESC') {
          res = res * -1;
      }
      return res;
    };
    return x.sort(compareFn);
  }

  static isEmpty<T>(arr: Array<T>): boolean {
    return !arr || arr.length === 0;
  }

  static isNotEmpty<T>(arr: Array<T>): boolean {
    return arr && arr.length > 0;
  }

  static nullSafe<T>(arr: Array<T>): Array<T> {
    if (Generic.isNullOrUndefined(arr)) {
      return [];
    }
    return arr;
  }

  static size<T>(arr: Array<T>): number {
    if (Generic.isNullOrUndefined(arr)) {
      return 0;
    }
    return arr.length;
  }

  static forEach<T>(arr: Array<T>, callbackfn: (value: T, index: number, array: Array<T>) => void): void {
    if (!Generic.isNullOrUndefined(arr)) {
      arr.forEach(callbackfn);
    }
  }

  static join<T>(arr: Array<T>, glue = ', '): string {
    if (Generic.isNullOrUndefined(arr) || Arrays.isEmpty(arr)) {
      return '';
    }
    return arr.join(glue);
  }

  static intersection<T>(val1: T | Array<T>, val2: T | Array<T>): Array<T> {
    const arrA: Array<T> = Arrays.toArray(val1);
    const arrB: Array<T> = Arrays.toArray(val2);

    return arrA.filter(x => arrB.includes(x));
  }

  static difference<T>(val1: T | Array<T>, val2: T | Array<T>): Array<T> {
    const arrA: Array<T> = Arrays.toArray(val1);
    const arrB: Array<T> = Arrays.toArray(val2);

    return arrA.filter(x => !arrB.includes(x));
  }

  static symetricalDifference<T>(val1: T | Array<T>, val2: T | Array<T>): Array<T> {
    const arrA: Array<T> = Arrays.toArray(val1);
    const arrB: Array<T> = Arrays.toArray(val2);

    return arrA
      .filter(x => !arrB.includes(x))
      .concat(arrB.filter(x => !arrA.includes(x)));
  }

  static union<T>(val1: T | Array<T>, ...vals: Array<T | Array<T>>): Array<T> {
    let arrA: Array<T> = Arrays.toArray(val1);
    if (vals && vals.length > 0) {
      vals.forEach(arr => {
        const arrB: Array<T> = Arrays.toArray(arr);
        arrA = arrA.concat(arrB.filter(x => !arrA.includes(x)));
      });
    }

    return arrA;
  }

  static containsAll<T>(arr: Array<T>, value: T | Array<T>): boolean {
    if (!arr || !value) {
      return false;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return false;
      }

      let containsAll = true;
      value.forEach((val: T) => {
        containsAll = containsAll && arr.includes(val);
      });
      return containsAll;
    }
    return arr.includes(value);
  }

  static containsAny<T>(arr: Array<T>, value: T | Array<T>): boolean {
    if (!arr || !value) {
      return false;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return false;
      }

      let containsAny = false;
      value.forEach((val: T) => {
        containsAny = containsAny || arr.includes(val);
      });
      return containsAny;
    }
    return arr.includes(value);
  }

  static containsNone<T>(arr: Array<T>, value: T | Array<T>): boolean {
    if (arr === null || arr === undefined) {
      return false;
    } else if (arr.length === 0 || !value) {
      return true;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return false;
      }

      let containsNone = true;
      value.forEach((val: T) => {
        containsNone = containsNone && !arr.includes(val);
      });
      return containsNone;
    }
    return !arr.includes(value);
  }

  static loop(numElements: number): Array<number> {
    if (numElements === null || numElements === undefined || numElements <= 0) {
      return [];
    }

    const result = [];
    for (let i = 0; i < numElements; i++) {
      result.push(i);
    }

    return result;
  }

}

export class Booleans {
  static and(...vals: Array<boolean | Array<boolean>>): boolean {
    if (Arrays.isEmpty(vals)) {
      return false;
    }
    const arr: Array<boolean> = (Arrays.isArray(vals[0])
      ? vals[0] as Array<boolean>
      : Arrays.toArray(vals as Array<boolean>));

    let res: boolean | null = null;
    if (arr && arr.length > 0) {
      arr.forEach(b => {
        if (b !== null && b !== undefined && typeof b === 'boolean') {
          res = (res === null ? b : res && b);
        }
      });
    }
    return (res !== null ? res : false);
  }

  static or(...vals: Array<boolean | Array<boolean>>): boolean {
    if (Arrays.isEmpty(vals)) {
      return false;
    }
    const arr: Array<boolean> = (Arrays.isArray(vals[0])
      ? vals[0] as Array<boolean>
      : Arrays.toArray(vals as Array<boolean>));

    let res: boolean | null = null;
    if (arr && arr.length > 0) {
      arr.forEach(b => {
        if (b !== null && b !== undefined && typeof b === 'boolean') {
          res = (res === null ? b : res || b);
        }
      });
    }
    return (res !== null ? res : false);
  }

  static xor(val1: boolean | number, val2: boolean | number): boolean {
    return ( !val1 != !val2 );
  }
}

export class Flow {
  static executeNTimes(iterations: number, callbackfn: (iteration: number) => void): void {
    if (!callbackfn) {
      return ;
    }
    for (let i = 0; i < iterations; i++) {
      callbackfn(i);
    }
  }
}

export class Numbers {

  static isNumber(val: any): val is number {
    // parseFloat NaNs numeric-cast false positives (null|true|false|"")
    // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    // subtraction forces infinities to NaN
    // adding 1 corrects loss of precision from parseFloat
    return !Arrays.isArray(val) && (val - parseFloat(val) + 1) >= 0;
  }

  static lerp(a: number, b: number, t: number): number {
    return (a * (1 - t)) + (b * t);
  }

  static lpad(num: number, size: number): string {
    let s = `${num}`;
    while (s.length < size) {
      s = `0${s}`;
    }
    return s;
  }
}

export class PhoneNumbers {
  static getRegexForTelef(): RegExp {
    return  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/;
  }

}
export class Letras{
  static getRegexForNombre(): RegExp{
    return  /^(?=.{1,50}$)[a-zA-ZáéíóúüñÁÉÍÓÚÑ]+(?:[\s][a-zA-ZáéíóúüñÁÉÍÓÚÑ]+)*$/;
  }
}

export class Emails {
  static getRegexForEmailAragon(): RegExp {
    return /^\w+@aragon.es$/;
  }

  static getRegexForEmailExtAragon(): RegExp {
    return /^(ams|amm|amm1|ap)\.\w+@ext.aragon.es$/;
  }

  static getRegexForEmailDefault(): RegExp {
    // return /^(\w+\.)+@([a-zA-Z_]+?\.){1,2}[a-zA-Z]{2,4}$/;
    return /^[a-zA-Z]+[a-zA-Z0-9._-]+@[a-zA-Z-_.]+\.[a-zA-Z.-_]{2,5}$/;
  }

  static getRegexForEmailRFC(): RegExp {
    return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  }

  static getRegexForEmailW3CStandar(): RegExp {
    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  }

  static getRegexForEmailWithName(): RegExp {
    return /^((?:"[^<>]+")|(?:[^<>]+))[ ]+<((?:[\w+\.]+)@(?:[a-zA-Z_]+?\.){1,2}[a-zA-Z]{2,4})>$/;
  }

}

export class Files {
  static FRAME_DOWNLOAD_ID = 'download-frame';

  // static createAndDownloadBlobFile(body: BlobPart, options: BlobPropertyBag, filename: string): void {
  //   const blob = new Blob([body], options);
  //   if (navigator.msSaveBlob) {
  //     // IE 10+
  //     navigator.msSaveBlob(blob, filename);
  //   } else {
  //     const link = document.createElement('a');
  //     // Browsers that support HTML5 download attribute
  //     if (link.download !== undefined) {
  //       const url = URL.createObjectURL(blob);
  //       link.setAttribute('href', url);
  //       link.setAttribute('download', filename);
  //       link.style.visibility = 'hidden';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     }
  //   }
  // }

  // static saveBlobAsFile(data: HttpResponse<any> | BlobPart, dataType: HttpEventType.Response | string, filename: string): void {
  //   let blob: Blob;
  //   if (data instanceof HttpResponse) {
  //     const binaryData = [];
  //     binaryData.push(data.body);

  //     blob = new Blob(binaryData, { type: `${dataType}` });
  //   } else {
  //     blob = new Blob([data], { type: `${dataType}` });
  //   }

  //   if (navigator.msSaveBlob) {
  //     // IE 10+
  //     navigator.msSaveBlob(blob, filename);
  //   } else {
  //     const link = document.createElement('a');
  //     // Browsers that support HTML5 download attribute
  //     if (link.download !== undefined) {
  //       const url = window.URL.createObjectURL(blob);
  //       link.setAttribute('href', url);
  //       link.setAttribute('download', filename);
  //       link.style.visibility = 'hidden';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     }
  //   }
  // }

  static downloadFromUrl(url: string): void {
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}

export class FormsUtils {
  // static obtenerMensajeError(control: AbstractControl): string {
  //   if (control.dirty && control.invalid) {
  //     if (control.errors.isNotNumber) {
  //       return 'El campo tiene que ser numérico';
  //     }
  //     if (control.errors.dateIsBeforeNow) {
  //       return 'El campo tiene que ser una fecha posterior a hoy';
  //     }
  //     if (control.errors.dateIsAfterNow) {
  //       return 'El campo tiene que ser una fecha anterior a hoy';
  //     }
  //     if (control.errors.isNotYear) {
  //       return 'El campo tiene que ser superior a 2000';
  //     }
  //     if (control.errors.isNotYearPost2001) {
  //       return 'El campo tiene que ser superior a 2000';
  //     }
  //     if (control.errors.isNotYearCurrent) {
  //       let year = new Date().getFullYear();
  //       return 'El campo tiene que ser inferior a ' + year;
  //     }
  //     if (control.errors.empty) {
  //       return 'El campo no puede estar vacío';
  //     }
  //     if (control.errors.pattern) {
  //       return 'El campo no tiene el formato correcto';
  //     }

  //     if (control.errors.minlength) {
  //       return 'La longitud mínima para el campo son ' + control.errors.minlength.requiredLength + ' caracteres';
  //     }

  //     if (control.errors.maxlength) {
  //       return 'La longitud máxima para el campo son ' + control.errors.maxlength.requiredLength + ' caracteres';
  //     }

  //     if (control.errors.invalidNif) {
  //       return 'El campo tiene un DNI incorrecto';
  //     }

  //     if (control.errors.invalidNie) {
  //       return 'El campo tiene un NIE incorrecto';
  //     }

  //     if (control.errors.invalidDoc) {
  //       return 'El campo tiene un documento incorrecto';
  //     }

  //     if (control.errors.invalidEmail) {
  //       return 'El campo tiene un email incorrecto';
  //     }
  //     if(control.errors.isNotPhone){
  //       return 'El campo tiene un teléfono incorrecto';
  //     }
  //     if(control.errors.isAlphabetic){
  //       return 'El campo solo acepta caracteres alfabéticos';
  //     }
      
  //   }
  //   return null;
  // }

  // static obtenerMensajeErrorFecha(control: AbstractControl): string {

  //   const fecha: Fecha = { día: null, mes: null, año: null };
  //   fecha.día = control.get('day').value;
  //   fecha.mes = control.get('month').value;
  //   fecha.año = control.get('year').value;

  //   if (!fecha.día && !fecha.mes && !fecha.año) {
  //     return 'El campo no puede estar vacío';
  //   } else if (!Dates.fechaValida(fecha)) {
  //     return 'Error fecha inválida';
  //   }
  //   return null;
  // }
}

interface Fecha {
  día: number; mes: number; año: number;
}

export class Dates {

  static fechaValida(fecha: Fecha): boolean {
    const feachAux = `${fecha.día}/${fecha.mes}/${fecha.año}`;
    // tslint:disable-next-line:max-line-length
    if (moment(feachAux, 'D/M/YYYY', true).isValid()) {

      return true;
    }

    return false;
  }

  static fechaVacia(fecha: Fecha): boolean {
    const feachAux = `${fecha.día}/${fecha.mes}/${fecha.año}`;
    // tslint:disable-next-line:max-line-length
    if ((Generic.isNullOrUndefined(fecha.día) && Generic.isNullOrUndefined(fecha.mes) && Generic.isNullOrUndefined(fecha.año))) {

      return true;
    }

    return false;
  }

  static fechaValidaOVacia(fecha: Fecha): boolean {
    if (this.fechaValida(fecha) || this.fechaVacia(fecha)) {
      return true;
    } else {
      return false;
    }

  }
}

export class URLs {
  static getURLSearchParams(urlSearch = window.location.search): URLSearchParams {
    return new URLSearchParams(urlSearch);
  }
}
