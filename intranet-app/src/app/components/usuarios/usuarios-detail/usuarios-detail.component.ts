import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api/public_api';
import { Perfil } from 'src/app/models/perfil.model';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { OPERACION, SESION } from 'src/app/utils/constants';

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
  opcionesAdmin = false;
  activo: string = '';

  opcionesSiONo = [
    {text: 'No', value: false},
    {text: 'Si', value: true}
  ];

  opcionNo =  {text: 'No', value: false};
  mostrarVolver = true;
  registro = false;
  registroCorrecto = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    private masterDataService: MasterDataService
  ){
    this.usuarioForm=this.formBuilder.group({});
    this.fillForm();
  }

  ngOnInit(): void {
    this.getPerfiles();
    let url: string = this.router.url;
    if (url.includes('registro')){
      this.op = this.OPS.NEW;
      this.cargaInicial = true;
      this.registro = true;
    } else if (url.includes('area-personal')){
      this.mostrarVolver = false;
      this.op = this.OPS.EDIT;
      this.usuario = this.authService.getLoggedUser();
      this.fillForm();
      this.cargaInicial = true;
    } else if (url.includes('usuarios')){
      this.opcionesAdmin = true;
      this.activatedRoute.params.subscribe(params => {
        if (params && params['idUsuario']) {
          this.op = this.OPS.EDIT;
          this.idUsuario = params['idUsuario'];    
          this.getUsuario();
          if (localStorage.getItem("idCreado") && localStorage.getItem("idCreado")!  === this.idUsuario) {
            let messageStorageSplited = localStorage.getItem("messagesCreado")?.split(",");
            this.messages = [{ severity: messageStorageSplited![0], summary: messageStorageSplited![1], detail: messageStorageSplited![2] }];
            localStorage.removeItem("idCreado");
            localStorage.removeItem("messagesCreado");
          }
        } else {
          this.op = this.OPS.NEW;
          this.cargaInicial = true;
        }
      }); 
    }
  }

  getUsuario(){
    this.usuariosService.getUsuarioById(this.idUsuario).subscribe({
      next: (response) =>{
        if (response.success){
          this.usuario =  response.message;
          this.fillForm();
          this.cargaInicial = true;
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
        }
        
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el usuario' }];  
        }
    })
  }

  getUsuarioSesion(){
    
  }

  getPerfiles(){
    this.masterDataService.getAllPerfiles().subscribe({
      next: (response: Perfil[]) => {
        this.perfiles = response;
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
      pass: [this.usuario?.pass ? this.usuario.pass : '',  [Validators.required]],
      nombre: [this.usuario?.nombre ? this.usuario.nombre : null,  [Validators.required]],
      apellido1: [this.usuario?.apellido1 ? this.usuario.apellido1 : null,],
      apellido2: [this.usuario?.apellido2 ? this.usuario.apellido2 : null,],
      docIdentidad: [this.usuario?.docIdentidad ? this.usuario.docIdentidad : null,],
      email: [this.usuario?.email ? this.usuario.email : null,],
      perfil: [this.usuario?.perfil ? this.usuario.perfil : null,],
      telefono: [this.usuario?.telefono ? this.usuario.telefono : null,],
      municipio: [this.usuario?.municipio ? this.usuario.municipio : null,],
      direccion: [this.usuario?.direccion ? this.usuario.direccion : null,],
      validado: [this.usuario?.validado ? this.opcionesSiONo.find(o => o.value == this.usuario?.validado) : this.opcionNo,],
      activo: [this.usuario?.activo ? this.opcionesSiONo.find(o => o.value == this.usuario?.activo) : this.opcionNo,]
    })
  }

  guardar(){
    if (this.usuarioForm.invalid){
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'Hay errores en el formulario, faltan campos por rellenar' }];  
      return;
    } 
    this.usuario = this.usuarioForm.getRawValue() as Usuario;
    if (this.registro){
      this.usuario.activo = false;
      this.usuario.validado = false;
    }else{  
      if (this.usuarioForm.get('activo')?.value){
        let activo = this.usuarioForm.get('activo')?.value;
        if (activo.value){
          this.usuario.activo = true;
        } else {
          this.usuario.activo = false;
        }
      } else this.usuario.activo = false;
      if (this.usuarioForm.get('validado')?.value){
        let validado = this.usuarioForm.get('validado')?.value;
        if (validado.value){
          this.usuario.validado = true;
        } else {
          this.usuario.validado = false;
        }
      } else this.usuario.validado = false;
    }
    
     
    if(this.op == this.OPS.NEW){
      this.usuariosService.addUsuario(this.usuario).subscribe({
        next: (response) => {
          if (response.success){
            if (this.registro){
              this.registroCorrecto = true;
              this.messages = [{ severity: 'success', summary: 'Ok', detail: 'Usuario registrado y pendiente de validar' }]; 
              this.usuarioForm.disable(); // TODO REVISAR disabled

            } else {
              this.messages = [{ severity: 'success', summary: 'Ok', detail: 'Usuario insertado' }]; 
              localStorage.setItem("idCreado", response.message.id?.toString()!)
              localStorage.setItem("messagesCreado", this.messages[0].severity! + ", " + this.messages[0].summary! + ", " + this.messages[0].detail!)
              this.router.navigate([`/usuarios-detail/${response.message.id}`]);
              // this.router.navigateByUrl("/usuarios-detail/" + response.message.id)
            }
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
          }
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar el usaurio' }];  
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
          
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar el usaurio' }];  
        }
      });
    }  
  }

  volver(){
    let url = this.router.url;
    if (url.includes('usuarios')){
      this.router.navigate(['/usuarios']);
    } else if (url.includes('registro')){
      this.router.navigate(['/login']);
    }   
  }

}
