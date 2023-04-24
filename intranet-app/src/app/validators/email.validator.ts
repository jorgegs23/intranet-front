import {Emails} from '@shared/utils/utils';

export class EmailValidation {
  static validationUserAragon(email: string): boolean {
    return Emails.getRegexForEmailAragon().test(email);
  }

  static validationEmailAragon(email: string): boolean {
    return Emails.getRegexForEmailExtAragon().test(email);
  }

  static validateEmailDefaultWithName(value: string): boolean {
    return Emails.getRegexForEmailWithName().test(value);
  }

  static validationEmailDefault(email: string): boolean {
    return Emails.getRegexForEmailDefault().test(email);
  }

  // Validacion estandar usada en HTML con type="email"
  static validationEmailW3CStandar(email: string): boolean {
    return Emails.getRegexForEmailW3CStandar().test(email);
  }

  static validationEmailRFC(email: string): boolean {
    // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    return Emails.getRegexForEmailRFC().test(email);
  }

  static validationEmail(email: string): boolean {
    return (
      EmailValidation.validationUserAragon(email)
      || EmailValidation.validationEmailAragon(email)
      || EmailValidation.validationEmailRFC(email)
    );
  }
}
