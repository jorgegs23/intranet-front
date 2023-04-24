import {AbstractControl, FormGroup, ValidationErrors} from '@angular/forms';
import {Emails, Generic, Letras, Numbers, PhoneNumbers, Strings} from '../utils/utils';
import {esCIFValido, esDNIValido, esNIEValido} from './documents.validator';
import moment from 'moment';
import {esIbanValido} from './iban.validator';
import {EmailValidation} from './email.validator';
import { nombre } from './nombres.validator';

const DATE_FORMAT = ['DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD', 'YYYY-MM-DD'];
const TIME_FORMAT = 'HH:mm';
const DATE_TIME_FORMAT = ['DD-MM-YYYY HH:mm', 'DD/MM/YYYY HH:mm', 'YYYY/MM/DD HH:mm', 'YYYY-MM-DD HH:mm'];

export class FormsValidation {
  static notEmpty(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(`${control.value}`)) {
      return { empty: true };
    }
    return null;
  }

  static isNumber(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(`${control.value}`)) {
      return null;
    }
    if (!Numbers.isNumber(control.value)) {
      return { isNotNumber: true };
    }
    return null;
  }

  static isAlphabetic(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    if (!nombre.validationNombre(control.value)) {
      return { isAlphabetic: true };
    }
    return null;
  }

  static isPhone(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(`${control.value}`)) {
      return null;
    }
    if (!PhoneNumbers.getRegexForTelef().test(control.value.trim())) {
      return { isNotPhone: true };
    }
    return null;
  }


  static isNumberAndPercent(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(`${control.value}`)) {
      return null;
    }
    if (!Numbers.isNumber(control.value)) {
      return { isNotNumber: true };
    }else{
      if (Number(control.value) > 100 || Number(control.value) < 0) {
        return { isNotPercent: true };
      }
    }
    return null;
  }

  static isADay(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(`${control.value}`)) {
      return null;
    }
    if (!Numbers.isNumber(control.value)) {
      return { isNotNumber: true };
    }else{
      if (Number(control.value) > 31 || Number(control.value) < 1) {
        return { isNotDay: true };
      }
    }
    return null;
  }

  static isAMonth(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(`${control.value}`)) {
      return null;
    }
    if (!Numbers.isNumber(control.value)) {
      return { isNotNumber: true };
    }else{
      if (Number(control.value) > 12 || Number(control.value) < 1) {
        return { isNotMonth: true };
      }
    }
    return null;
  }

  static isAYear(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(`${control.value}`)) {
      return null;
    }
    if (!Numbers.isNumber(control.value)) {
      return { isNotNumber: true };
    }else{
      if (Number(control.value) > 9000 || Number(control.value) < 1901) {
        return { isNotYear: true };
      }
    }
    return null;
  }

  static isAYearPost2001(control: AbstractControl): ValidationErrors | null {
    let year = new Date().getFullYear();
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(`${control.value}`)) {
      return null;
    }
    if (!Numbers.isNumber(control.value)) {
      return { isNotNumber: true };
    }else{
      if (Number(control.value) < 2001) {
        return { isNotYearPost2001: true };
      }
    }
    return null;
  }

  static isAYearCurrentLimit(control: AbstractControl): ValidationErrors | null {
    let year = new Date().getFullYear();
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(`${control.value}`)) {
      return null;
    }
    if (!Numbers.isNumber(control.value)) {
      return { isNotNumber: true };
    }else{
      if (Number(control.value) > year) {
        return { isNotYearCurrent: true };
      }
    }
    return null;
  }

  static isAHour(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(`${control.value}`)) {
      return null;
    }
    if (!Numbers.isNumber(control.value)) {
      return { isNotNumber: true };
    }else{
      if (Number(control.value) > 23 || Number(control.value) < 0) {
        return { isNotHour: true };
      }
    }
    return null;
  }

  static isAMin(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(`${control.value}`)) {
      return null;
    }
    if (!Numbers.isNumber(control.value)) {
      return { isNotNumber: true };
    }else{
      if (Number(control.value) > 59 || Number(control.value) < 0) {
        return { isNotMin: true };
      }
    }
    return null;
  }

  static validationUserAragon(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    if (!EmailValidation.validationUserAragon(control.value)) {
      return { invalidUserAragon: true };
    }
    return null;
  }

  static validationEmailAragon(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    if (!EmailValidation.validationEmailAragon(control.value)) {
      return { invalidEmailAragon: true };
    }
    return null;
  }

  static validationEmailDefault(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    if (!EmailValidation.validationEmailDefault(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  static validationEmailRFC(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    if (!EmailValidation.validationEmailRFC(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  static validationEmail(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    if (!EmailValidation.validationEmail(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // Validacion estandar usada en HTML con type='email'
  static validationEmailW3CStandar(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    if (!EmailValidation.validationEmailW3CStandar(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  static validationTipoDocumento(group: FormGroup, tipoDocumentoField: string, documentoField: string): ValidationErrors | null {
    if (Generic.isNullOrUndefined(group)) {
      return null;
    }
    const tipoDocumento: number = Number(group.get(tipoDocumentoField)?.value);
    const documento: string = group.get(documentoField)?.value;

    let currentErrors = group.get(documentoField)?.errors;
    if (!Generic.isNullOrUndefined(currentErrors)) {
      delete currentErrors?.invalidDoc;
      delete currentErrors?.invalidNif;
      delete currentErrors?.invalidNie;

      if (Object.keys(currentErrors).length === 0) {
        currentErrors = null;
      }
    }

    if (Generic.isNullOrUndefined(tipoDocumento)) {
      group.get(documentoField).setErrors({ ...currentErrors, invalidDoc: true });
      return { invalidDoc: true };
    }
    if (tipoDocumento === TIPO_DOCUMENTO.DNI && !esDNIValido(documento)) {
      group.get(documentoField).setErrors({ ...currentErrors, invalidNif: true });
      return { invalidNif: true };
    } else if (tipoDocumento === TIPO_DOCUMENTO.NIE && !esNIEValido(documento)) {
      group.get(documentoField).setErrors({ ...currentErrors, invalidNie: true });
      return { invalidNie: true };
    }
    group.get(documentoField).setErrors(currentErrors);
    return null;
  }

  static validationNIF(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    const nif = Strings.upperCase(control.value);
    if (!esDNIValido(nif)) {
      return { invalidNif: true };
    }
    return null;
  }

  static validationCIF(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    const cif = Strings.upperCase(control.value);
    if (!esCIFValido(cif)) {
      return { invalidCif: true };
    }
    return null;
  }

  static validationNIE(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }

    const nie = Strings.upperCase(control.value);
    if (!esNIEValido(nie)) {
      return { invalidNie: true };
    }
    return null;
  }

  static validationDocumentoId(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    const cifValid = FormsValidation.validationCIF(control);
    const nifValid = FormsValidation.validationNIF(control);
    const nieValid = FormsValidation.validationNIE(control);
    if (cifValid !== null && nifValid !== null && nieValid !== null) {
      return { invalidDoc: true };
    }
    return null;
  }

  static esIbanValido(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }

    const iban = control.value;
    if (!esIbanValido(iban)) {
      return { invalidIban: true };
    }
    return null;
  }

  static esFechaValida(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }

    const date = control.value;
    if (!moment(date, DATE_FORMAT, true).isValid()) {
      return { invalidDate: true };
    }
    return null;
  }

  static esFechaAnterior(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }

    const date = control.value;
    if (moment(date, DATE_FORMAT, true).isSameOrAfter(moment())) {
      return { dateIsAfterNow: true };
    }
    return null;
  }

  static esFechaPosterior(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    const date = control.value;
    if (moment(date, DATE_FORMAT, true).isSameOrBefore(moment())) {
      return { dateIsBeforeNow: true };
    }
    return null;
  }

  static esFechaPosteriorSoloDia(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }
    const date = control.value; 
    const dateActual = new Date();
    const dateActualString = dateActual.toLocaleString("default", { year: "numeric", month: "2-digit", day: "2-digit" });
    if (moment(date, DATE_FORMAT, true).isBefore(moment(dateActualString, DATE_FORMAT, true))) {
      return { dateIsBeforeNow: true };
    }
    return null;
  }

  static esAnioAnterior(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }

    const date = control.value;
    const currentYear = moment().year();
    if (moment(date, DATE_FORMAT, true).year() >= currentYear) {
      return { yearIsNotBeforeNow: true };
    }
    return null;
  }

  static esHoraValida(control: AbstractControl): ValidationErrors | null {
    if (Generic.isNullOrUndefined(control.value) || Strings.isEmpty(control.value)) {
      return null;
    }

    const date = control.value;
    if (!moment(date, TIME_FORMAT, true).isValid()) {
      return { invalidTime: true };
    }
    return null;
  }
}
