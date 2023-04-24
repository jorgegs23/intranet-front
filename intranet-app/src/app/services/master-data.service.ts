import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Perfil } from '../models/perfil.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getAllPerfiles(): Observable<Perfil[]>{
    return this.http.get<Perfil[]>(`${this.apiServerUrl}/masterData/allPerfiles`);
  }
}
