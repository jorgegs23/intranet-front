import {Injectable, Injector} from '@angular/core';

export let InjectorInstance: Injector

@Injectable({
  providedIn: 'root'
})

export class InjectorService {

  injectorInstance!: Injector;

  constructor() {
  }

  setInjector(injector: Injector) {
    InjectorInstance = injector;
  }
}
