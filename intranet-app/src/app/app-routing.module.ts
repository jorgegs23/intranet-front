import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { UsuariosDetailComponent } from './components/usuarios/usuarios-detail/usuarios-detail.component';
import { TemporadasComponent } from './components/temporadas/temporadas.component';
import { EquiposComponent } from './components/equipos/equipos.component';
import { EquiposDetailComponent } from './components/equipos/equipos-detail/equipos-detail.component';
import { PartidosComponent } from './components/partidos/partidos.component';
import { PartidosDetailComponent } from './components/partidos/partidos-detail/partidos-detail.component';
import { DesignacionesComponent } from './components/designaciones/designaciones.component';
import { DesignacionesDetailComponent } from './components/designaciones/designaciones-detail/designaciones-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'registro',
        component: UsuariosDetailComponent
      },
      {
        path: 'inicio',
        component: InicioComponent
      },
      {
        path: 'usuarios',
        component: UsuariosComponent
      },
      {
        path: 'usuarios-detail',
        component: UsuariosDetailComponent
      },
      {
        path: 'area-personal',
        component: UsuariosDetailComponent
      },
      {
        path: 'usuarios-detail/:idUsuario',
        component: UsuariosDetailComponent
      },
      {
        path: 'temporadas',
        component: TemporadasComponent
      },
      {
        path: 'equipos',
        component: EquiposComponent
      },
      {
        path: 'equipos-detail',
        component: EquiposDetailComponent
      },
      {
        path: 'equipos-detail/:idEquipo',
        component: EquiposDetailComponent
      },
      {
        path: 'partidos',
        component: PartidosComponent
      },
      {
        path: 'partidos-detail',
        component: PartidosDetailComponent
      },
      {
        path: 'partidos-detail/:idPartido',
        component: PartidosDetailComponent
      },
      {
        path: 'designaciones',
        component: DesignacionesComponent
      },
      {
        path: 'designaciones-detail',
        component: DesignacionesDetailComponent
      },
      {
        path: 'designaciones-detail/:idDesignacion',
        component: DesignacionesDetailComponent
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
