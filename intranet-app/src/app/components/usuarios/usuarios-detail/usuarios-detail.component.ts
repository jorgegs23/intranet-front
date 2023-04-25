import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api/public_api';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Perfil } from 'src/app/models/perfil.model';
import { Usuario } from 'src/app/models/usuario.model';
import { MasterDataService } from 'src/app/services/master-data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ObjectResponse } from 'src/app/utils/backend-service';
import { OPERACION } from 'src/app/utils/constants';

@Component({
  selector: 'app-usuarios-detail',
  templateUrl: './usuarios-detail.component.html',
  styleUrls: ['./usuarios-detail.component.scss']
})
export class UsuariosDetailComponent implements OnInit {
  
  messages: Message[] = [];
  OPS = OPERACION;
  op: OPERACION = OPERACION.NEW;
  idUsuario: any;
  usuarioForm: FormGroup ;

  perfiles: Perfil[] = [];
  usuario: Usuario | undefined;
  
  cargaInicial = false;
  activo: string = '';

  opcionesSiONo = [
    {text: 'No', value: 'N'},
    {text: 'Si', value: 'S'}
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    private masterDataService: MasterDataService
  ){
    this.usuarioForm=this.formBuilder.group({});
      // this.usuarioForm=this.formBuilder.group({
      //   id: [null],
      //   login: [null, [Validators.required]],
      //   pass: [null],
      //   nombre: [null],
      //   apellido1: [null],
      //   apellido2: [null],
      //   docIdentidad: [null],
      //   email: [null],
      //   perfil: [null],
      //   telefono: [null],
      //   municipio: [null],
      //   direccion: [null],
      //   validado: [false],
      //   activo: [false]
      // })
      this.fillForm();
  }

  ngOnInit(): void {
    this.getPerfiles();
    this.activatedRoute.params.subscribe(params => {
      if (params && params['idUsuario']) {
        this.op = this.OPS.EDIT;
        this.idUsuario = params['idUsuario'];    
        this.getUsuario();
      } else {
        this.op = this.OPS.NEW;
        this.cargaInicial = true;
      }
      
    }); 
  }

  getUsuario(){
    this.usuariosService.getUsuarioById(this.idUsuario).subscribe({
      next: (response) =>{
        if (response.success){
          this.usuario =  response.message;
          this.fillForm();
          this.cargaInicial = true;
          this.router.navigate(['/usuarios-detail', this.usuario.id]);
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
        }
        
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el usuario' }];  
        console.log('Error al obtener el usaurio: ' + error)
        }
    })
  }

  getPerfiles(){
    this.masterDataService.getAllPerfiles().subscribe({
      next: (response: Perfil[]) => {
        this.perfiles = response;
        console.log(response)
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de usuarios' }];  
      }
    });
  }

  fillForm() {
    this.usuarioForm=this.formBuilder.group({
      id: [this.usuario?.id ? this.usuario.id :null],
      login: [this.usuario?.login ? this.usuario.login : '', [Validators.required]],
      pass: [this.usuario?.pass ? this.usuario.pass : ''],
      nombre: [this.usuario?.nombre ? this.usuario.nombre : null,],
      apellido1: [this.usuario?.apellido1 ? this.usuario.apellido1 : null,],
      apellido2: [this.usuario?.apellido2 ? this.usuario.apellido2 : null,],
      docIdentidad: [this.usuario?.docIdentidad ? this.usuario.docIdentidad : null,],
      email: [this.usuario?.email ? this.usuario.email : null,],
      perfil: [this.usuario?.perfil ? this.usuario.perfil : null,],
      telefono: [this.usuario?.telefono ? this.usuario.telefono : null,],
      municipio: [this.usuario?.municipio ? this.usuario.municipio : null,],
      direccion: [this.usuario?.direccion ? this.usuario.direccion : null,],
      validado: [this.usuario?.validado ? this.usuario.validado : null,],
      activo: [this.usuario?.activo ? this.usuario.activo : null,]
    })
  }

  guardar(){
    if (this.usuarioForm.invalid){
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'Hay errores en el formulario' }];  
    } 
    this.usuario = this.usuarioForm.getRawValue() as Usuario;
    if (this.usuarioForm.get('activo')?.value == 'S'){
      this.usuario.activo = true;
    } else {
      this.usuario.activo = false;
    }
    if (this.usuarioForm.get('validado')?.value == 'S'){
      this.usuario.validado = true;
    } else {
      this.usuario.validado = false;
    }

    if(this.op == this.OPS.NEW){
      this.usuariosService.addUsuario(this.usuario).subscribe({
        next: (response) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: 'Usuario insertado' }]; 
            //this.router.navigate['/usuarios-detail/${this.usuario.id}'];
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
          }
          //this.router.navigate['/usuarios-detail/${this.usuario.id}'];
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar el usaurio' }];  
          console.log('Error al guardar: ' + error)
        }
      });
    } else if (this.op = this.OPS.EDIT){
      this.usuariosService.editUsuario(this.usuario).subscribe({
        next: (response) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: response.message }]; 
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
          }
          
          //this.router.navigate['/usuarios-detail/${this.usuario.id}'];
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar el usaurio' }];  
          console.log('Error al guardar: ' + error)
        }
      });
    }
   

    console.log(this.usuarioForm);
    
  }

  volver(){
    this.router.navigate(['/usuarios']);
  }

}
