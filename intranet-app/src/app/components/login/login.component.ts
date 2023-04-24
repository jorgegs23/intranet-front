import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { SESION } from 'src/app/utils/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  title = 'Acceso a la Intranet';
  user: string = '';
  pass: string = '';
  messages: Message[] = [];
  showError =  false;



  constructor(
    private authService: AuthService,
    private router: Router
    ){
       //this.messages = [{ severity: 'success', summary: 'Correcto', detail: 'Usuario logueado' }];
    }

  ngOnInit(){

  }

  login(){
    this.authService.login(this.user, this.pass).subscribe(
      (response: Usuario) => {
        if (response != null){
          this.authService.usuarioActual = response;
          sessionStorage.setItem(SESION.USUARIO, JSON.stringify(response));
          this.router.navigate(['/inicio']);
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Usuario/contraseña incorrectos' }];  
        } 
      }, (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al hacer el login' }];  
      }
    );
  }

}
