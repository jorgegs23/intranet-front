import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';
import { Generic } from '../utils/utils';
import { PERFIL, SESION } from '../utils/constants';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiServerUrl = environment.apiBaseUrl;
  usuarioActual: Usuario = {
    id: undefined,
    nombre: '',
    apellido1: '',
    apellido2: '',
    docIdentidad: '',
    tipoDocIdentidad: '',
    email: '',
    login: '',
    pass: '',
    telefono: undefined,
    direccion: '',
    municipio: '',
    activo: false,
    validado: false,
    perfil: {
      perfil: '',
      descripcion: '',
      activo: false 
    }
  };

  constructor( 
    readonly router: Router,
    private http: HttpClient
  ) { }

  get perfil() {
    if (Generic.isNullOrUndefined(this.usuarioActual)) {
      return null;
    }
    return this.usuarioActual?.perfil?.perfil;
  }

  get isAdmin(): boolean {
    if (Generic.isNullOrUndefined(this.usuarioActual)) {
      return false;
    }
    return (this.usuarioActual?.perfil?.perfil) === PERFIL.ADMIN;
  }

   login(login: string, pass: string): Observable<Usuario> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.set('login', login);
    httpParams = httpParams.set('pass', pass);
    return this.http.get<Usuario>(`${this.apiServerUrl}/usuarios/auth/login`,{params: httpParams});
  }

  getLoggedUser(): Usuario {
    var user: Usuario = this.usuarioActual;
    if (this.usuarioActual.id == null || this.usuarioActual.id ==  undefined){
      let userString =sessionStorage.getItem(SESION.USUARIO);
      if(userString != null && userString!==JSON.stringify(user)){
        user =JSON.parse(userString);
      }
    }
      
    return user;
  }

  logout(): void {
    this.usuarioActual = {
      id: undefined,
      nombre: '',
      apellido1: '',
      apellido2: '',
      docIdentidad: '',
      tipoDocIdentidad: '',
      email: '',
      login: '',
      pass: '',
      telefono: undefined,
      direccion: '',
      municipio: '',
      activo: false,
      validado: false,
      perfil: {
        perfil: '',
        descripcion: '',
        activo: false 
      }
    };

    this.router.navigate([environment.defaultRoute])
  }
}
