import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { Perfil } from 'src/app/models/perfil.model';
import { FiltroUsuario, Usuario } from 'src/app/models/usuario.model';
import { MasterDataService } from 'src/app/services/master-data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ArrayResponse, ObjectResponse } from 'src/app/utils/backend-service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  providers: [ConfirmationService]
})
export class UsuariosComponent implements OnInit{

  messages: Message[] = [];

  @ViewChild('dt') dt: Table | undefined;
  
  PAGINACION_ITEMS_TABLA = [5, 10, 20];

  nombre: string = '';
  perfil = {perfil: undefined,  descripcion: 'Todos'}
  validado = {text: 'Todos', value: undefined};
  activo = {text: 'Todos', value: undefined};
  itemsPorPagina: number = 5;
  pagina: number = 0;
  totalItems: number = 0;
  first: number = 0;

  selectedItems: Usuario[] = [];
  idsUsuariosEliminar: any[] = [];
  
  perfiles: any[] = [];
  usuarios: Usuario[] = [];

  opcionesSiONo = [
    {text: 'Todos', value: undefined},
    {text: 'Si', value: true},
    {text: 'No', value: false}
  ];

  constructor(
    private usuariosService: UsuariosService,
    private masterDataService: MasterDataService,
    private router: Router,
    private confirmationService: ConfirmationService,
  ){}

  ngOnInit(): void {
    //this.getUsuarios();
    this.filtrar(true);
    this.getPerfiles();
  }

  applyFilterGlobal($event: Event, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  getPerfiles(){
    this.masterDataService.getAllPerfiles().subscribe({
      next: (response: Perfil[]) => {
        this.perfiles = response;
        this.perfiles.unshift({
          perfil: undefined,
          descripcion: 'Todos'
        })
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de perfiles' }];  
      }
    });
  }

  getUsuarios(){
    this.usuarios = [];
    this.usuariosService.getAllUsuarios().subscribe({
      next: (response: ObjectResponse<Usuario[]>) => {
        if (response.success){
          this.usuarios = response.message;
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
    let filtro = {} as FiltroUsuario ;
    if (this.nombre != '') filtro.nombre = this.nombre;
    if (this.perfil?.perfil != null && this.perfil.perfil != undefined) filtro.perfil = this.perfil.perfil;
    if (this.activo.value != undefined) filtro.activo = this.activo.value;
    if (this.validado.value != undefined) filtro.validado = this.validado.value;
    if (reset) {
      this.first = 0;
      this.pagina= 0;
    }
    filtro.pagina = this.pagina;
    filtro.itemsPorPagina = this.itemsPorPagina;

    this.usuariosService.getUsuariosFiltrados(filtro).subscribe({
      next: (response: ObjectResponse<ArrayResponse<Usuario>>) =>{
        if (response.success){
          if (response.message.content)
            this.usuarios = response.message.content;
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
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de usuarios' }];  
      }
    });
  }

  limpiarFiltros(){
    this.nombre = '';
    this.perfil = {perfil: undefined,  descripcion: 'Todos'}
    this.validado = {text: 'Todos', value: undefined};
    this.activo = {text: 'Todos', value: undefined};
    this.filtrar(true);
  }

  add(){
    this.router.navigate(['/usuarios-detail']);
  }

  edit(usuario: Usuario){
    this.router.navigate(['/usuarios-detail', usuario.id]);
  }

  deleteSelected(){
    if (this.selectedItems.length > 0){
      this.idsUsuariosEliminar = [];
      this.selectedItems.forEach(item=> this.idsUsuariosEliminar.push(item.id));
      let content = (this.idsUsuariosEliminar.length > 1 ? 'Van a ser eliminados ' + this.idsUsuariosEliminar.length + ' usuarios' : 
        'Va a ser eliminado ' + this.idsUsuariosEliminar.length  + ' usuario') + ', esta acción no se puede deshacer ¿Estás seguro?';
      this.confirmationService.confirm({
        message: content,
        header: 'Eliminación de usuario',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteUsuario();
        },
        reject: (type: any) => {
          //this.messages = [{ severity: 'info', summary: 'Info', detail: 'Borrado cancelado' }]; 
        }
      });
    }
  }

  delete(usuario: Usuario){
    if (usuario.id){
      this.idsUsuariosEliminar.push(usuario.id);
      this.confirmationService.confirm({
        message: 'Va a ser eliminado el usuario "' + usuario.nombre + '", esta acción no se puede deshacer ¿Estás seguro?',
        header: 'Eliminación de usuario',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.deleteUsuario();
        },
        reject: (type: any) => {
          //this.messages = [{ severity: 'info', summary: 'Info', detail: 'Borrado cancelado' }]; 
        }
      });
    }  
  }

  deleteUsuario(){
      this.usuariosService.deleteUsuarios(this.idsUsuariosEliminar).subscribe({
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
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al eliminar el usuario' }];  
        },
        complete: ()=>{
          this.idsUsuariosEliminar = [];
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
