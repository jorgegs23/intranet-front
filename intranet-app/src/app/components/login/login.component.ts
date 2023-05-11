import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ObjectResponse } from 'src/app/utils/backend-service';
import { SESION } from 'src/app/utils/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  title = 'Acceso a la aplicación';
  user: string = '';
  pass: string = '';
  messages: Message[] = [];
  showError = false;

 // @Output() acceso: EventEmitter<any> = new EventEmitter();

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  login() {
    this.authService.login(this.user, this.pass).subscribe({
      next: (response: ObjectResponse<Usuario>) => {
        if (response.success) {
          this.authService.usuarioActual = response.message;
          sessionStorage.removeItem(SESION.USUARIO);
          sessionStorage.setItem(SESION.USUARIO, JSON.stringify(response.message));
          this.authService.loggedIn.next(true)
          this.router.navigate(['/inicio'])
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
        }
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al hacer el login' }];
      }
    }

    );
  }

  registro() {
    this.router.navigate(['/registro']);
  }

}
