import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { Temporada } from 'src/app/models/temporada.model';
import { TemporadasService } from 'src/app/services/temporadas.service';
import { ObjectResponse } from 'src/app/utils/backend-service';

@Component({
  selector: 'app-temporadas',
  templateUrl: './temporadas.component.html',
  styleUrls: ['./temporadas.component.scss'],
  providers: [ConfirmationService]
})
export class TemporadasComponent {

  messages: Message[] = [];

  @ViewChild('dt') dt: Table | undefined;

  selectedItem: Temporada | undefined;

  temporadas: Temporada[] = [];
  ultimaTemporada: Temporada | undefined;

  constructor(
    private temporadasService: TemporadasService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ){ }

  ngOnInit(): void {
    this.getTemporadas();
  }

  applyFilterGlobal($event: Event, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  getTemporadas(){
    this.temporadas = [];
    this.temporadasService.getAllTemporadas().subscribe({
      next: (response: ObjectResponse<Temporada[]>) => {
        if (response.success){
          this.temporadas = response.message;
          if (this.temporadas.length > 0)
            this.ultimaTemporada = this.temporadas[0];
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];  
        }   
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de temporadas' }];  
      }
    });
  }

  add(){
    this.temporadasService.createTemporada().subscribe({
      next: (response: ObjectResponse<string>) => {
        if (response.success){
          this.messages = [{ severity: 'success', summary: 'Ok', detail: response.message }]; 
          this.selectedItem = undefined;
          this.getTemporadas();
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];  
        }   
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al crear una nueva temporadas' }];  
      }
    });
  }

  abrir(){
    if (this.selectedItem && this.selectedItem.id){
      this.temporadasService.abrirTemporada(this.selectedItem.id).subscribe({
        next: (response: ObjectResponse<string>) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: response.message }]; 
            this.selectedItem = undefined;
            this.getTemporadas();
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];  
          }   
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al abrir la temporadas' }];  
        }
      });
    }
  }

  cerrar(){
    if (this.selectedItem && this.selectedItem.id){
      this.temporadasService.cerrarTemporada(this.selectedItem.id).subscribe({
        next: (response: ObjectResponse<string>) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: response.message }]; 
            this.selectedItem = undefined;
            this.getTemporadas();
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];  
          }   
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al cerrar la temporadas' }];  
        }
      });
    }
  }

}
