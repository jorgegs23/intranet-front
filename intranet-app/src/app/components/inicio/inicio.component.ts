import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  
  messages: Message[] = [];
  usuario: Usuario = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.usuario = this.authService.getLoggedUser();
    this.messages = [{ 
      severity: 'success', 
      summary: 'Usuario "' + this.usuario.login + '" logueado' , 
      detail: 'perfil: ' + this.usuario.perfil?.descripcion 
    }];
    throw new Error('Method not implemented.');
  }


}
