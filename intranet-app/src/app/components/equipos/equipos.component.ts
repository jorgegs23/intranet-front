import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { Categoria } from 'src/app/models/categoria.model';
import { FiltroEquipo } from 'src/app/models/equipo.model';
import { Equipo } from 'src/app/models/equipo.model';
import { Temporada } from 'src/app/models/temporada.model';
import { EquiposService } from 'src/app/services/equipos.service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { TemporadasService } from 'src/app/services/temporadas.service';
import { ObjectResponse, ArrayResponse } from 'src/app/utils/backend-service';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.component.html',
  styleUrls: ['./equipos.component.scss'],
  providers: [ConfirmationService]
})
export class EquiposComponent implements OnInit{

  messages: Message[] = [];

  @ViewChild('dt') dt: Table | undefined;
  
  PAGINACION_ITEMS_TABLA = [5, 10, 20];

  nombre: string = '';
  categoria = {categoria: undefined,  descripcion: 'Todas'}
  municipio: string = '';
  temporada = {id: undefined,  descripcion: 'Todas'}
  itemsPorPagina: number = 5;
  pagina: number = 0;
  totalItems: number = 0;
  first: number = 0;

  selectedItems: Equipo[] = [];
  idsEquiposEliminar: any[] = [];
  
  temporadas: any[] = [];
  categorias: any[] = [];
  equipos: Equipo[] = [];

  constructor(
    private equiposService: EquiposService,
    private masterDataService: MasterDataService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private temporadasServive: TemporadasService
  ) {}

  ngOnInit(): void {
    //this.getEquipos();
    this.filtrar(true);
    this.getCategorias();
    this.getTemporadas();
  }

  applyFilterGlobal($event: Event, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  getCategorias(){
    this.masterDataService.getAllCategorias().subscribe({
      next: (response: Categoria[]) => {
        this.categorias = response;
        this.categorias.unshift({
          categoria: undefined,
          descripcion: 'Todas'
        })
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de categorias' }];  
      }
    });
  }
  
  getTemporadas(){
    this.temporadasServive.getAllTemporadas().subscribe({
      next: (response: ObjectResponse<Temporada[]>) => {
        if (response.success){
          this.temporadas = response.message;
          this.temporadas.unshift({
            id: undefined,
            descripcion: 'Todas'
          })
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
        } 
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de temporadas' }];  
      }
    });
  }

  filtrar(reset: boolean){
    let filtro = {} as FiltroEquipo ;
    if (this.nombre != '') filtro.nombre = this.nombre;
    if (this.categoria?.categoria != null && this.categoria.categoria != undefined) filtro.categoria = this.categoria.categoria;
    if (this.municipio != '') filtro.municipio = this.municipio;
    if (this.temporada?.id != null && this.temporada.id != undefined) filtro.temporada = this.temporada.id;

    if (reset) {
      this.first = 0;
      this.pagina= 0;
    }
    filtro.pagina = this.pagina;
    filtro.itemsPorPagina = this.itemsPorPagina;

    this.equiposService.getEquiposFiltrados(filtro).subscribe({
      next: (response: ObjectResponse<ArrayResponse<Equipo>>) =>{
        if (response.success){
          if (response.message.content)
            this.equipos = response.message.content;
          if (response.message.paginacion){
            //this.itemsPorPagina = response.message.paginacion.itemPerPage;
            this.totalItems = response.message.paginacion.total;
            //this.pagina = response.message.paginacion.paginas;
          }
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];  
        }
        
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de equipos' }];  
      }
    });

  }

  limpiarFiltros(){
    this.nombre = '';
    this.categoria = {categoria: undefined,  descripcion: 'Todas'};
    this.municipio = '';
    this.temporada = {id: undefined,  descripcion: 'Todas'};
    this.filtrar(true);
  }

  add(){
    this.router.navigate(['/equipos-detail']);
  }

  edit(equipo: Equipo){
    this.router.navigate(['/equipos-detail', equipo.id]);
  }

  deleteSelected(){
    if (this.selectedItems.length > 0){
      this.idsEquiposEliminar = [];
      this.selectedItems.forEach(item=> this.idsEquiposEliminar.push(item.id));
      let content = (this.idsEquiposEliminar.length > 1 ? 'Van a ser eliminados ' + this.idsEquiposEliminar.length + ' equipos' : 
        'Va a ser eliminado ' + this.idsEquiposEliminar.length  + ' equipo') + ', esta acción no se puede deshacer ¿Estás seguro?';
      this.confirmationService.confirm({
        message: content,
        header: 'Eliminación de equipo',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteEquipo();
        },
        reject: (type: any) => {
          //this.messages = [{ severity: 'info', summary: 'Info', detail: 'Borrado cancelado' }]; 
        }
      });
    }
  }

  delete(equipo: Equipo){
    if (equipo.id){
      this.idsEquiposEliminar.push(equipo.id);
      this.confirmationService.confirm({
        message: 'Va a ser eliminado el equipo "' + equipo.nombre + '", esta acción no se puede deshacer ¿Estás seguro?',
        header: 'Eliminación de equipo',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteEquipo();
        },
        reject: (type: any) => {
          //this.messages = [{ severity: 'info', summary: 'Info', detail: 'Borrado cancelado' }]; 
        }
      });
    }  
  }

  deleteEquipo(){
      this.equiposService.deleteEquipos(this.idsEquiposEliminar).subscribe({
        next: (response) => {
          if (response.success){
            this.idsEquiposEliminar = [];
            this.selectedItems = [];
            this.messages = [{ severity: 'success', summary: 'Ok', detail: response.message }]; 
            this.filtrar(false);         
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
          }
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al eliminar el equipo' }];  
        }
      });
 
      
  }

  onPageChange(event: any){
    this.selectedItems = [];
    this.itemsPorPagina = event.rows;
    this.first = event.first;
    this.pagina =  event.first / event.rows;
    this.filtrar(false);
  }
}
