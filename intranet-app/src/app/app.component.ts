import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { Message } from 'primeng/api';
import { UsuariosService } from './services/usuarios.service';
import { Usuario } from './models/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(){ }
}
