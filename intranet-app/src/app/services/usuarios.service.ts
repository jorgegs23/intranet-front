import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { FiltroUsuario, Usuario } from '../models/usuario.model';
import { environment } from 'src/environments/environment';
import { ArrayResponse, ObjectResponse } from '../utils/backend-service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getAllUsuarios(): Observable<ObjectResponse<Usuario[]>>{
    return this.http.get<ObjectResponse<Usuario[]>>(`${this.apiServerUrl}/usuarios/all`);
  }

  public getUsuariosFiltrados(filtro: FiltroUsuario): Observable<ObjectResponse<ArrayResponse<Usuario>>>{
    return this.http.post<ObjectResponse<ArrayResponse<Usuario>>>(`${this.apiServerUrl}/usuarios/filter`, filtro);
  }

  public getUsuarioById(id: Number): Observable<ObjectResponse<Usuario>>{
    return this.http.get<ObjectResponse<Usuario>>(`${this.apiServerUrl}/usuarios/byId/${id}`);
  }

  public addUsuario(usuario: Usuario): Observable<ObjectResponse<Usuario>> {
    return this.http.post<ObjectResponse<Usuario>>(`${this.apiServerUrl}/usuarios/add`, usuario);
  }

  public editUsuario(usuario: Usuario): Observable<ObjectResponse<string>> {
    return this.http.put<ObjectResponse<string>>(`${this.apiServerUrl}/usuarios/edit`, usuario);
  }

  public deleteUsuario(id: Number): Observable<ObjectResponse<string>> {
    return this.http.delete<ObjectResponse<string>>(`${this.apiServerUrl}/usuarios/delete/${id}`);
  }
}
