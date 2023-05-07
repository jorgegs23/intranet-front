import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Temporada } from '../models/temporada.model';
import { Observable } from 'rxjs';
import { ObjectResponse } from '../utils/backend-service';

@Injectable({
  providedIn: 'root'
})
export class TemporadasService {

  private apiServerUrl = environment.apiBaseUrl;
  
  constructor(private http: HttpClient) { }

  public getAllTemporadas(): Observable<ObjectResponse<Temporada[]>>{
    return this.http.get<ObjectResponse<Temporada[]>>(`${this.apiServerUrl}/temporadas/all`);
  }

  public getTemporadaActiva(): Observable<ObjectResponse<Temporada>>{
    return this.http.get<ObjectResponse<Temporada>>(`${this.apiServerUrl}/temporadas/activa`);
  }

  public createTemporada(): Observable<ObjectResponse<string>>{
    return this.http.get<ObjectResponse<string>>(`${this.apiServerUrl}/temporadas/create`);
  }

  public abrirTemporada(id: Number): Observable<ObjectResponse<string>>{
    return this.http.get<ObjectResponse<string>>(`${this.apiServerUrl}/temporadas/open/${id}`);
  }

  public cerrarTemporada(id: Number): Observable<ObjectResponse<string>>{
    return this.http.get<ObjectResponse<string>>(`${this.apiServerUrl}/temporadas/close/${id}`);
  }
}
