import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { Perfil } from 'src/app/models/perfil.model';
import { FiltroUsuario, Usuario } from 'src/app/models/usuario.model';
import { MasterDataService } from 'src/app/services/master-data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ObjectResponse } from 'src/app/utils/backend-service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit{

  messages: Message[] = [];

  @ViewChild('dt') dt: Table | undefined;

  
  nombre: string = '';
  perfil = {perfil: undefined,  descripcion: 'Todos'}
  validado = {text: 'Todos', value: undefined};
  activo = {text: 'Todos', value: undefined};

  selectedItems: Usuario[] = [];
  
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
    private router: Router
  ){}

  ngOnInit(): void {
    this.getUsuarios();
    this.getPerfiles();
  }

  applyFilterGlobal($event: Event, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  getPerfiles(){
    this.masterDataService.getAllPerfiles().subscribe({
      next: (response: Perfil[]) => {
        this.perfiles = response;
        console.log(response)
        this.perfiles.unshift({
          perfil: undefined,
          descripcion: 'Todos'
        })
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de usuarios' }];  
      }
    });
  }

  getUsuarios(){
    this.usuarios = [];
    this.usuariosService.getAllUsuarios().subscribe({
      next: (response: ObjectResponse<Usuario[]>) => {
        if (response.success){
          this.usuarios = response.message;
          console.log(response)
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];  
        }   
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de usuarios' }];  
      }
    });
  }

  filtrar(){
    let filtro = {} as FiltroUsuario ;
    if (this.nombre != '') filtro.nombre = this.nombre;
    if (this.perfil?.perfil != null && this.perfil.perfil != undefined) filtro.perfil = this.perfil.perfil;
    if (this.activo.value != undefined) filtro.activo = this.activo.value;
    if (this.validado.value != undefined) filtro.validado = this.validado.value;
    console.log(filtro);
  }

  add(){
    this.router.navigate(['/usuarios-detail']);
  }

  edit(usuario: Usuario){
    this.router.navigate(['/usuarios-detail', usuario.id]);
  }

  deleteSelected(){
  }

  delete(usuario: Usuario){
    if (usuario.id){
      this.usuariosService.deleteUsuario(usuario.id).subscribe({
        next: (response) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: response.message }]; 
            this.getUsuarios();
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
          }
        },
        error: (error: HttpErrorResponse) => {
          debugger
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al eliminar el usuario' }];  
          console.log('Error al eliminar el usaurio: ' + error)
        }
      });
    }  
  }

}
