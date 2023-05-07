import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ObjectResponse, ArrayResponse } from '../utils/backend-service';
import { Designacion, FiltroDesignacion } from '../models/designacion.model';

@Injectable({
  providedIn: 'root'
})
export class DesignacionesService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getAllDesignaciones(): Observable<ObjectResponse<Designacion[]>>{
    return this.http.get<ObjectResponse<Designacion[]>>(`${this.apiServerUrl}/designaciones/all`);
  }

  public getDesignacionesFiltrados(filtro: FiltroDesignacion): Observable<ObjectResponse<ArrayResponse<Designacion>>>{
    return this.http.post<ObjectResponse<ArrayResponse<Designacion>>>(`${this.apiServerUrl}/designaciones/filter`, filtro);
  }

  public getDesignacionById(id: Number): Observable<ObjectResponse<Designacion>>{
    return this.http.get<ObjectResponse<Designacion>>(`${this.apiServerUrl}/designaciones/byId/${id}`);
  }

  public addDesignacion(designacion: Designacion): Observable<ObjectResponse<Designacion>> {
    return this.http.post<ObjectResponse<Designacion>>(`${this.apiServerUrl}/designaciones/add`, designacion);
  }

  public editDesignacion(designacion: Designacion): Observable<ObjectResponse<string>> {
    return this.http.put<ObjectResponse<string>>(`${this.apiServerUrl}/designaciones/edit`, designacion);
  }

  public deleteDesignaciones(id: Number[]): Observable<ObjectResponse<string>> {
    return this.http.delete<ObjectResponse<string>>(`${this.apiServerUrl}/designaciones/delete/${id}`);
  }
}
