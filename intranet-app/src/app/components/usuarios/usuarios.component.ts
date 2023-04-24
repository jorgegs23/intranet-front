import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Table } from 'primeng/table';
import { Perfil } from 'src/app/models/perfil.model';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit{

  messages: Message[] = [];

  @ViewChild('dt') dt: Table | undefined;

  
  nombre: string = '';
  perfil: string = '';
  validado: string = '';
  activo: string = '';

  selectedItems: Usuario[] = [];
  
  perfiles: any[] = [];
  usuarios: Usuario[] = [];

  opcionesSiONo = [
    {text: 'Todos', value: ''},
    {text: 'Si', value: true},
    {text: 'No', value: false}
  ];

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.getUsuarios();
  }

  applyFilterGlobal($event: Event, stringVal: string) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  getUsuarios(){
    this.usuariosService.getAllUsuarios().subscribe(
      (response: Usuario[]) => {
        this.usuarios = response;
        console.log(response)
      }, (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de usuarios' }];  
      }
    );
  }

  getUsuarioById(){
    this.usuariosService.getUsuarioById(1).subscribe(
      (response: Usuario) => {
        //this.usuarios = response;
        console.log(response)
      }, (error: HttpErrorResponse) => {
        
      }
    );
  }

  add(){
    this.router.navigate(['/usuarios-detail']);
  }

  edit(usuario: Usuario){

  }

  deleteSelected(){

  }

  delete(usuario: Usuario){

  }

}
