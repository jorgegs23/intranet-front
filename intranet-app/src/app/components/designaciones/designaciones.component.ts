import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { Designacion, FiltroDesignacion } from 'src/app/models/designacion.model';
import { Temporada } from 'src/app/models/temporada.model';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { DesignacionesService } from 'src/app/services/designaciones.service';
import { EquiposService } from 'src/app/services/equipos.service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { TemporadasService } from 'src/app/services/temporadas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ObjectResponse, ArrayResponse } from 'src/app/utils/backend-service';
import { PERFIL } from 'src/app/utils/constants';

@Component({
  selector: 'app-designaciones',
  templateUrl: './designaciones.component.html',
  styleUrls: ['./designaciones.component.scss'],
  providers: [ConfirmationService]
})
export class DesignacionesComponent implements OnInit{

  messages: Message[] = [];

  @ViewChild('dt') dt: Table | undefined;
  
  PAGINACION_ITEMS_TABLA = [5, 10, 20];

  temporada = {id: undefined,  descripcion: 'Todas'}
  mes: Date | undefined ;
  fecha: Date | undefined;
  usuario: Usuario | undefined ;

  itemsPorPagina: number = 5;
  pagina: number = 0;
  totalItems: number = 0;
  first: number = 0;

  selectedItems: Designacion[] = [];
  idsDesignacionesEliminar: any[] = [];

  temporadas: any[] = [];
  designaciones: any[] = [];
  
  filteredUsuarios: any[] = [];
  listadoUsuarios: Usuario[] = [];

  delay: number = 300;

  usuarioLogueado: Usuario | undefined;
  usuarioAdmin: boolean = false;

  anteriorMes: number = 1;
  anteriorFechaDia: number = 1;

  constructor(
    private designacionesService: DesignacionesService,
    private masterDataService: MasterDataService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private temporadasServive: TemporadasService,
    private usuariosService: UsuariosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkPerfilUser();
    this.filtrar(true);
    this.getUsuarios();
    this.getTemporadas();
  }

  checkPerfilUser(){
    this.usuarioLogueado = this.authService.getLoggedUser();
    if (this.usuarioLogueado.perfil?.perfil?.toUpperCase() == PERFIL.ADMIN){
      this.usuarioAdmin = true;
    } else {
      this.usuarioAdmin = false;
    }
  }

  applyFilterGlobal($event: Event, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
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

  getUsuarios(){
    let activos: boolean = false;
    this.usuariosService.getAllUsuariosDesignables(activos).subscribe({
      next: (response: ObjectResponse<Usuario[]>) => {
        if (response.success){
          this.listadoUsuarios = response.message;
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
        } 
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de usuarios' }];  
      }
    });
  }

  filtrar(reset: boolean){
    let filtro = {} as FiltroDesignacion ;
    filtro = this.setParamsFiltro(filtro); 
    
    if (reset) {
      this.first = 0;
      this.pagina= 0;
    }
    filtro.pagina = this.pagina;
    filtro.itemsPorPagina = this.itemsPorPagina;


    this.designacionesService.getDesignacionesFiltrados(filtro).subscribe({
      next: (response: ObjectResponse<ArrayResponse<Designacion>>) =>{
        if (response.success){
          if (response.message.content)
            this.designaciones = response.message.content;
          if (response.message.paginacion){
            this.totalItems = response.message.paginacion.total;
          }
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];  
        }
        
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de designaciones' }];  
      }
    });
  }

  limpiarFiltros(){
    this.temporada = {id: undefined,  descripcion: 'Todas'}
    this.mes = undefined;
    this.fecha =  undefined;
    this.usuario = undefined;
    this.filtrar(true);
  }

  add(){
    this.router.navigate(['/designaciones-detail']);
  }

  edit(designacion: Designacion){
    this.router.navigate(['/designaciones-detail', designacion.id]);
  }

  deleteSelected(){
    if (this.selectedItems.length > 0){
      this.idsDesignacionesEliminar = [];
      this.selectedItems.forEach(item=> this.idsDesignacionesEliminar.push(item.id));
      let content = (this.idsDesignacionesEliminar.length > 1 ? 'Van a ser eliminadas ' + this.idsDesignacionesEliminar.length + ' designaciones' : 
        'Va a ser eliminada ' + this.idsDesignacionesEliminar.length  + ' designación') + ', esta acción no se puede deshacer ¿Estás seguro?';
      this.confirmationService.confirm({
        message: content,
        header: 'Eliminación de designación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteDesignacion();
        },
        reject: (type: any) => {
          //this.messages = [{ severity: 'info', summary: 'Info', detail: 'Borrado cancelado' }]; 
        }
      });
    }
  }

  delete(designacion: Designacion){
    if (designacion.id){
      this.idsDesignacionesEliminar.push(designacion.id);
      this.confirmationService.confirm({
        message: 'Va a ser eliminada la designación, esta acción no se puede deshacer ¿Estás seguro?',
        header: 'Eliminación de designación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteDesignacion();
        },
        reject: (type: any) => {
          //this.messages = [{ severity: 'info', summary: 'Info', detail: 'Borrado cancelado' }]; 
        }
      });
    }  
  }

  deleteDesignacion(){
      this.designacionesService.deleteDesignaciones(this.idsDesignacionesEliminar).subscribe({
        next: (response) => {
          if (response.success){
            this.selectedItems = [];
            this.messages = [{ severity: 'success', summary: 'Ok', detail: response.message }]; 
            this.filtrar(false);         
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
          }
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al eliminar el designación' }];  
        },
        complete: ()=>{
          this.idsDesignacionesEliminar = [];
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

  filterUsuarios(event: any){
    this.filteredUsuarios = [];
    let filtered: any[] = [];
    let query = event.query;

    let lista: any[] = []
    this.listadoUsuarios.forEach((item: Usuario)=>{
      let nombreCompleto =  item.nombre 
        + (item.apellido1 ? ' ' + item.apellido1 : '' ) 
        + (item.apellido2 ? ' ' + item.apellido2 : '' ) ;
      if (nombreCompleto && nombreCompleto.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    });
    this.filteredUsuarios = filtered;
  }

  setParamsFiltro(filtro: FiltroDesignacion){
    if (this.temporada?.id != null && this.temporada.id != undefined) filtro.temporada = this.temporada.id;
    if (this.mes != null && this.mes != undefined) filtro.mes = this.mes;
    if (this.fecha != null && this.fecha != undefined) filtro.fecha = this.fecha;
    if (this.usuarioAdmin){
       if (this.usuario?.id != null && this.usuario.id != undefined) filtro.usuario = this.usuario.id;
    } else {
      filtro.usuario = this.usuarioLogueado?.id;
    }
    if (filtro.fecha &&  this.anteriorFechaDia != filtro.fecha.getDate()) {
      let fechaInicioDia = new Date (filtro.fecha!.setHours(0,0,0))
      filtro.fecha?.setUTCDate(fechaInicioDia.getDate());
      this.anteriorFechaDia = filtro.fecha.getDate();
    }

    if (filtro.mes && this.anteriorMes != filtro.mes.getMonth()) {
      let fechaInicioMes = new Date(filtro.mes.getFullYear(), filtro.mes.getMonth(), 1); 
      filtro.mes?.setUTCDate(fechaInicioMes.getDate())
      filtro.mes.setMonth(filtro.mes.getMonth() + 1) // Al parsearlo a UTC los meses comienzan en 0
      this.anteriorMes = filtro.mes.getMonth();
    }
    return filtro;
  }

  descargar(){
    let filtro = {} as FiltroDesignacion ;
    filtro = this.setParamsFiltro(filtro); 
    filtro.idsDesignaciones = []
    if (this.selectedItems.length > 0)  
      this.selectedItems.forEach( i=> {
        if (i.id) filtro.idsDesignaciones?.push(i.id);
      });

    this.designacionesService.generarInforme(filtro).subscribe({
      next: (response: ObjectResponse<string>) =>{
        if (response.success){
          const muestra = this.base64ToArrayBuffer(response.message);
          this.processBlob(muestra, 'informe.pdf');    
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];  
        }
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el informe' }];  
      }
    });
  }

  base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    let bytes = new Uint8Array(binaryLen);
    bytes.forEach((_, idx) => {
      const ascii = binaryString.charCodeAt(idx);
      bytes[idx] = ascii;
    });
    return bytes;
  }

  processBlob(resultByte: any, nameDoc: string): void {
    const blob = new Blob([resultByte], { type: "application/pdf" });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = nameDoc;
    link.click();
  }
}

