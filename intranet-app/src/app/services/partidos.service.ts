import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectResponse, ArrayResponse } from '../utils/backend-service';
import { Partido, FiltroPartido } from '../models/partido.model';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getAllPartidos(): Observable<ObjectResponse<Partido[]>>{
    return this.http.get<ObjectResponse<Partido[]>>(`${this.apiServerUrl}/partidos/all`);
  }

  public getPartidosFiltrados(filtro: FiltroPartido): Observable<ObjectResponse<ArrayResponse<Partido>>>{
    return this.http.post<ObjectResponse<ArrayResponse<Partido>>>(`${this.apiServerUrl}/partidos/filter`, filtro);
  }

  public getPartidoById(id: Number): Observable<ObjectResponse<Partido>>{
    return this.http.get<ObjectResponse<Partido>>(`${this.apiServerUrl}/partidos/byId/${id}`);
  }

  public addPartido(partido: Partido): Observable<ObjectResponse<Partido>> {
    return this.http.post<ObjectResponse<Partido>>(`${this.apiServerUrl}/partidos/add`, partido);
  }

  public editPartido(partido: Partido): Observable<ObjectResponse<string>> {
    return this.http.put<ObjectResponse<string>>(`${this.apiServerUrl}/partidos/edit`, partido);
  }

  public deletePartidos(id: Number[]): Observable<ObjectResponse<string>> {
    return this.http.delete<ObjectResponse<string>>(`${this.apiServerUrl}/partidos/delete/${id}`);
  }
}
