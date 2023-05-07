import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Equipo, FiltroEquipo } from '../models/equipo.model';
import { ObjectResponse, ArrayResponse } from '../utils/backend-service';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getAllEquipos(): Observable<ObjectResponse<Equipo[]>>{
    return this.http.get<ObjectResponse<Equipo[]>>(`${this.apiServerUrl}/equipos/all`);
  }

  public getEquiposFiltrados(filtro: FiltroEquipo): Observable<ObjectResponse<ArrayResponse<Equipo>>>{
    return this.http.post<ObjectResponse<ArrayResponse<Equipo>>>(`${this.apiServerUrl}/equipos/filter`, filtro);
  }

  public getEquipoById(id: Number): Observable<ObjectResponse<Equipo>>{
    return this.http.get<ObjectResponse<Equipo>>(`${this.apiServerUrl}/equipos/byId/${id}`);
  }

  public addEquipo(equipo: Equipo): Observable<ObjectResponse<Equipo>> {
    return this.http.post<ObjectResponse<Equipo>>(`${this.apiServerUrl}/equipos/add`, equipo);
  }

  public editEquipo(equipo: Equipo): Observable<ObjectResponse<string>> {
    return this.http.put<ObjectResponse<string>>(`${this.apiServerUrl}/equipos/edit`, equipo);
  }

  public deleteEquipos(id: Number[]): Observable<ObjectResponse<string>> {
    return this.http.delete<ObjectResponse<string>>(`${this.apiServerUrl}/equipos/delete/${id}`);
  }

  async getEquipoByCategoriaAndTemporada(categoria: string, idTemporada: number): Promise<Equipo[]>{
    let httpParams: HttpParams = new HttpParams();
    if(categoria != null) httpParams = httpParams.set('categoria', categoria);
    if(idTemporada != null) httpParams = httpParams.set('idTemporada', idTemporada);
   
    return new Promise((resolve, reject) => {
      this.http.get<ObjectResponse<Equipo[]>>(`${this.apiServerUrl}/equipos/byCategoriaAndTemporada`, {
          observe: 'body', params:httpParams
        })
        .subscribe({
          next: (response: ObjectResponse<Equipo[]>) => {
            if (response.success){
              resolve(response.message);
            } else {
              reject(response.error);
            }
          }, error: (error) =>{
            reject('Error al obtener los equipos')
          }
        });
    });
  }
}
