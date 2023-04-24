import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { UsuariosDetailComponent } from './components/usuarios/usuarios-detail/usuarios-detail.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
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
        path: 'usuarios-detail/:idUsuario',
        component: UsuariosDetailComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
