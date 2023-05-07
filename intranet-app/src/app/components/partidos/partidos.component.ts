import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { Categoria } from 'src/app/models/categoria.model';
import { Competicion } from 'src/app/models/competicion.model';
import { Equipo } from 'src/app/models/equipo.model';
import { Partido, FiltroPartido } from 'src/app/models/partido.model';
import { Temporada } from 'src/app/models/temporada.model';
import { EquiposService } from 'src/app/services/equipos.service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { PartidosService } from 'src/app/services/partidos.service';
import { TemporadasService } from 'src/app/services/temporadas.service';
import { ObjectResponse, ArrayResponse } from 'src/app/utils/backend-service';

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.component.html',
  styleUrls: ['./partidos.component.scss'],
  providers: [ConfirmationService]
})
export class PartidosComponent implements OnInit{

  messages: Message[] = [];

  @ViewChild('dt') dt: Table | undefined;
  
  PAGINACION_ITEMS_TABLA = [5, 10, 20];

  temporada = {id: undefined,  descripcion: 'Todas'}
  categoria = {categoria: undefined,  descripcion: 'Todas'}
  competicion = {competicion: undefined,  descripcion: 'Todas'}
  jornada: Number | undefined ;
  equipoLocal: Equipo | undefined ;
  equipoVisitante: Equipo | undefined ;
  fecha: Date | undefined;
  
  itemsPorPagina: number = 5;
  pagina: number = 0;
  totalItems: number = 0;
  first: number = 0;

  selectedItems: Partido[] = [];
  idsPartidosEliminar: any[] = [];
  
  temporadas: any[] = [];
  categorias: any[] = [];
  competiciones: any[] = [];
  partidos: Partido[] = [];

  filteredEquipos: any[] = [];
  listadoEquipos: Equipo[] = [];
  disableEquipos = true;
  delay: number = 300;

  constructor(
    private partidosService: PartidosService,
    private masterDataService: MasterDataService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private temporadasServive: TemporadasService,
    private equiposSerivice: EquiposService
  ) {}

  ngOnInit(): void {
    //this.getPartidos();
    this.filtrar(true);
    this.getCategorias();
    this.getTemporadas();
    this.getCompeticiones();
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
          this.temporada = this.temporadas[0];
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
        } 
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de temporadas' }];  
      }
    });
  }

  getCompeticiones(){
    this.masterDataService.getAllCompeticiones().subscribe({
      next: (response: Competicion[]) => {
        this.competiciones = response;
        this.competiciones.unshift({
          competicion: undefined,
          descripcion: 'Todas'
        })
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de competiciones' }];
      }
    });
  }

  filtrar(reset: boolean){
    let filtro = {} as FiltroPartido ;
    if (this.temporada?.id != null && this.temporada.id != undefined) filtro.temporada = this.temporada.id;
    if (this.categoria?.categoria != null && this.categoria.categoria != undefined) filtro.categoria = this.categoria.categoria;
    if (this.competicion?.competicion != null && this.competicion.competicion != undefined) filtro.competicion = this.competicion.competicion;
    if (this.jornada != null && this.jornada != undefined) filtro.jornada = this.jornada;
    if (this.equipoLocal?.id != null && this.equipoLocal.id != undefined) filtro.equipoLocal = this.equipoLocal.id;
    if (this.equipoVisitante?.id != null && this.equipoVisitante.id != undefined) filtro.equipoVisitante = this.equipoVisitante.id;
    if (this.fecha != null && this.fecha != undefined) filtro.fecha = this.fecha;
    
    if (reset) {
      this.first = 0;
      this.pagina= 0;
    }
    filtro.pagina = this.pagina;
    filtro.itemsPorPagina = this.itemsPorPagina;

    this.partidosService.getPartidosFiltrados(filtro).subscribe({
      next: (response: ObjectResponse<ArrayResponse<Partido>>) =>{
        if (response.success){
          if (response.message.content)
            this.partidos = response.message.content;
          if (response.message.paginacion){
            this.totalItems = response.message.paginacion.total;
          }
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];  
        }
        
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de partidos' }];  
      }
    });

  }

  limpiarFiltros(){
    this.temporada = {id: undefined,  descripcion: 'Todas'}
    this.categoria = {categoria: undefined,  descripcion: 'Todas'}
    this.enableEquipos();
    this.competicion = {competicion: undefined,  descripcion: 'Todas'}
    this.jornada = undefined ;
    this.equipoLocal = undefined ;
    this.equipoVisitante = undefined ;
    this.fecha =  undefined;
    this.filtrar(true);
  }

  add(){
    this.router.navigate(['/partidos-detail']);
  }

  edit(partido: Partido){
    this.router.navigate(['/partidos-detail', partido.id]);
  }

  deleteSelected(){
    if (this.selectedItems.length > 0){
      this.idsPartidosEliminar = [];
      this.selectedItems.forEach(item=> this.idsPartidosEliminar.push(item.id));
      let content = (this.idsPartidosEliminar.length > 1 ? 'Van a ser eliminados ' + this.idsPartidosEliminar.length + ' partidos' : 
        'Va a ser eliminado ' + this.idsPartidosEliminar.length  + ' partido') + ', esta acción no se puede deshacer ¿Estás seguro?';
      this.confirmationService.confirm({
        message: content,
        header: 'Eliminación de partido',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deletePartido();
        },
        reject: (type: any) => {
          //this.messages = [{ severity: 'info', summary: 'Info', detail: 'Borrado cancelado' }]; 
        }
      });
    }
  }

  delete(partido: Partido){
    if (partido.id){
      this.idsPartidosEliminar.push(partido.id);
      this.confirmationService.confirm({
        message: 'Va a ser eliminado el partido "' 
          + partido.equipoLocal?.nombre +  ' - ' + partido.equipoVisitante?.nombre +
          '", esta acción no se puede deshacer ¿Estás seguro?',
        header: 'Eliminación de partido',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deletePartido();
        },
        reject: (type: any) => {
          //this.messages = [{ severity: 'info', summary: 'Info', detail: 'Borrado cancelado' }]; 
        }
      });
    }  
  }

  deletePartido(){
      this.partidosService.deletePartidos(this.idsPartidosEliminar).subscribe({
        next: (response) => {
          if (response.success){
            this.idsPartidosEliminar = [];
            this.selectedItems = [];
            this.messages = [{ severity: 'success', summary: 'Ok', detail: response.message }]; 
            this.filtrar(false);         
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
          }
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al eliminar el partido' }];  
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

  async enableEquipos(){
    if (this.categoria != undefined && this.categoria != null &&
      this.categoria.categoria != undefined && this.categoria.categoria != null){
      let idTemporada: number = this.temporada.id as unknown as number;
      await this.buscarEquipos(this.categoria.categoria, idTemporada);
      this.disableEquipos = false;
    } else {
      this.disableEquipos = true;
    }
  }

  async buscarEquipos(categoria: string, idTemporada: number){
    await this.equiposSerivice.getEquipoByCategoriaAndTemporada(categoria, idTemporada)
      .then((response)=>{
        this.listadoEquipos = response;
      })
      .catch((error) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al recuperar los equipos' }];
      });
  }

  filterEquipos(event: any){
    this.filteredEquipos = [];
    let filtered: any[] = [];
    let query = event.query;

    let lista: any[] = []
    this.listadoEquipos.forEach((item: Equipo)=>{
      if (item?.nombre && item?.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    });
    this.filteredEquipos = filtered;
  }
}
