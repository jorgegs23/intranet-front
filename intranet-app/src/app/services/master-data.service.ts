import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Perfil } from '../models/perfil.model';
import { Observable } from 'rxjs/internal/Observable';
import { Categoria } from '../models/categoria.model';
import { Competicion } from '../models/competicion.model';

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
}
