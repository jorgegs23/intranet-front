import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ThemeService } from 'src/app/services/theme.service';
import { SESION } from 'src/app/utils/constants';

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
    private router: Router
    ){
  }

  ngOnInit() {
    this.comprobarTheme();
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
            icon: 'pi pi-fw pi-users',
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
        icon: 'pi pi-fw pi-user',
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
        label: 'Salir',
        icon: 'pi pi-fw pi-power-off',
        command: e =>  this.salir()
        // routerLink: 'login'
      }
    ];
  }

  comprobarTheme(){
    let temaSesion = sessionStorage.getItem(SESION.TEMA);
    if (temaSesion != null){
      if (temaSesion == 'md-dark-indigo'){
        this.tema = true;
      } else {
        this.tema = false;
      }
    }
    this.changeTheme();
  }

  changeTheme() {
    let estilo = ''
    if (this.tema){
      estilo = 'md-dark-indigo';
    } else {
      estilo = 'md-light-indigo';
    }
    sessionStorage.setItem(SESION.TEMA, estilo);
    this.themeService.switchTheme(estilo);
  }

  salir(){
    this.confirmationService.confirm({
      message: '¿Esta seguro que desea salir de la aplicación?',
      header: 'Salir',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        sessionStorage.removeItem(SESION.USUARIO);
        this.router.navigate(['/login']);
      },
      reject: (type: any) => {
      }
  });
  }
}
