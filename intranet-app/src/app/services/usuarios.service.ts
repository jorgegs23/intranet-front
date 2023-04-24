import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getAllUsuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(`${this.apiServerUrl}/usuarios/all`);
  }

  public getUsuarioById(id: Number): Observable<Usuario>{
    return this.http.get<Usuario>(`${this.apiServerUrl}/usuarios/byId/${id}`);
  }

  public addUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiServerUrl}/usuarios/add`, usuario);
  }

  public editUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiServerUrl}/usuarios/edit`, usuario);
  }

  public deleteUsuario(id: Number): Observable<string> {
    return this.http.delete<string>(`${this.apiServerUrl}/usuarios/delete/${id}`);
  }
}
