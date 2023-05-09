import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { PERFIL, SESION } from 'src/app/utils/constants';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [ConfirmationService]
})
export class MenuComponent implements OnInit {

  items: MenuItem[] = [];
  tema: boolean = false;

  constructor(
    private themeService: ThemeService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.comprobarTheme();
    this.checkPerfilUser();
  }

  checkPerfilUser() {
    let usuario: Usuario = this.authService.getLoggedUser();
    if (usuario.perfil?.perfil?.toUpperCase() == PERFIL.ADMIN) {
      this.fillItemsAmdin();
    } else if (usuario.perfil?.perfil?.toUpperCase() == PERFIL.ARBITRO 
        ||  usuario.perfil?.perfil?.toUpperCase() == PERFIL.OFICIAL ) {
      this.fillItemsUser();
    } else {
      this.fillItemsLogin();
    }
  }

  fillItemsAmdin() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-fw pi-home',
        routerLink: '/inicio'
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-fw pi-user',
            routerLink: '/usuarios'
          },
          {
            label: 'Nuevo Usuario',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: '/usuarios-detail'
          }
        ]
      },
      {
        label: 'Temporadas',
        icon: 'pi pi-fw pi-calendar',
        routerLink: '/temporadas'
      },
      {
        label: 'Equipos',
        icon: 'pi pi-fw pi-users',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-fw pi-users',
            routerLink: '/equipos'
          },
          {
            label: 'Nuevo Equipo',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: '/equipos-detail'
          }
        ]
      },
      {
        label: 'Partidos',
        icon: 'pi pi-fw pi-tags',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-fw pi-tags',
            routerLink: '/partidos'
          },
          {
            label: 'Nuevo Partido',
            icon: 'pi pi-fw pi-plus-circle',
            routerLink: '/partidos-detail'
          }
        ]
      },
      {
        label: 'Designaciones',
        icon: 'pi pi-fw pi-file-export',
        items: [
          {
            label: 'Listado',
            icon: 'pi pi-fw pi-file',
            routerLink: '/designaciones'
          },
          {
            label: 'Nueva Designación',
            icon: 'pi pi-fw pi-file-edit',
            routerLink: '/designaciones-detail'
          }
        ]
      },
      {
        label: 'Area Personal',
        icon: 'pi pi-fw pi-user',
        routerLink: '/area-personal'
      },

      {
        label: 'Salir',
        icon: 'pi pi-fw pi-power-off',
        command: e => this.salir()
        // routerLink: 'login'
      }
    ];
  }

  fillItemsUser() {
    this.items = [
      {
        label: 'Inicio',
        icon: 'pi pi-fw pi-home',
        routerLink: '/inicio'
      },
      {
        label: 'Designaciones',
        icon: 'pi pi-fw pi-file-export',
        routerLink: '/designaciones'
      },
      {
        label: 'Area Personal',
        icon: 'pi pi-fw pi-user',
        routerLink: '/area-personal'
      },

      {
        label: 'Salir',
        icon: 'pi pi-fw pi-power-off',
        command: e => this.salir()
        // routerLink: 'login'
      }
    ];
  }

  fillItemsLogin() {
    this.items = [
      {
        label: 'Acceso',
        icon: 'pi pi-fw pi-sign-in',
        routerLink: '/login'
      },
      {
        label: 'Registro',
        icon: 'pi pi-fw pi-user-plus',
        routerLink: '/registro'
      }
    ];
  }

  comprobarTheme() {
    let temaSesion = sessionStorage.getItem(SESION.TEMA);
    if (temaSesion != null) {
      if (temaSesion == 'dark') {
        this.tema = true;
      } else {
        this.tema = false;
      }
    }
    this.changeTheme();
  }

  changeTheme() {
    let estilo = ''
    if (this.tema) {
      // estilo = 'md-dark-indigo';
      // estilo = 'bootstrap4-dark-blue';
      estilo = 'dark';
    } else {
      // estilo = 'md-light-indigo';
      // estilo = 'bootstrap4-light-blue';
      estilo = 'light';
    }
    sessionStorage.setItem(SESION.TEMA, estilo);
    this.themeService.switchTheme(estilo);
  }

  salir() {
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea salir de la aplicación?',
      header: 'Salir',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        sessionStorage.removeItem(SESION.USUARIO);
        this.router.navigate(['/login'])
        .then(() => {
          this.fillItemsLogin()
        });
      },
      reject: (type: any) => {
      }
    });
  }
}
