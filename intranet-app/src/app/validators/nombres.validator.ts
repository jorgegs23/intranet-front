import { Letras } from "@shared/utils/utils";

export class nombre{
    static validationNombre(nombre: string): boolean {
        return Letras.getRegexForNombre().test(nombre);
      }
}