import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Perfil } from '../models/perfil.model';
import { Observable } from 'rxjs/internal/Observable';
import { Categoria } from '../models/categoria.model';
import { Competicion } from '../models/competicion.model';
import { Partido } from '../models/partido.model';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getAllPerfiles(): Observable<Perfil[]>{
    return this.http.get<Perfil[]>(`${this.apiServerUrl}/masterData/allPerfiles`);
  }

  public getAllCategorias(): Observable<Categoria[]>{
    return this.http.get<Categoria[]>(`${this.apiServerUrl}/masterData/allCategorias`);
  }

  public getAllCompeticiones(): Observable<Competicion[]>{
    return this.http.get<Competicion[]>(`${this.apiServerUrl}/masterData/allCompeticiones`);
  }

  public getCompeticionesByCategoria(categoria: string): Observable<Competicion[]>{
    return this.http.get<Competicion[]>(`${this.apiServerUrl}/masterData/competiciones/${categoria}`);
  }

  public getJornadasByCategoriaAndCompeticion(categoria: string, competicion: string): Observable<Number[]>{
    return this.http.get<Number[]>(`${this.apiServerUrl}/masterData/jornadas/${categoria}/${competicion}`);
  }

  public getPartidosByCategoriaAndCompeticionAndJornada(categoria: string, competicion: string, jornada: number): Observable<Partido[]>{
    return this.http.get<Partido[]>(`${this.apiServerUrl}/masterData/partidos/${categoria}/${competicion}/${jornada}`);
  }
}
