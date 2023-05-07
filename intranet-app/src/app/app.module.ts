import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { UsuariosService } from './services/usuarios.service';
import { HttpClientModule } from '@angular/common/http';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { MenubarModule } from 'primeng/menubar'
import { SharedModule } from "./shared/shared.module";
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { AccordionModule } from 'primeng/accordion';
import { UsuariosDetailComponent } from './components/usuarios/usuarios-detail/usuarios-detail.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TemporadasComponent } from './components/temporadas/temporadas.component';
import { EquiposComponent } from './components/equipos/equipos.component';
import { EquiposDetailComponent } from './components/equipos/equipos-detail/equipos-detail.component';
import { PartidosComponent } from './components/partidos/partidos.component';
import { PartidosDetailComponent } from './components/partidos/partidos-detail/partidos-detail.component';
import { DesignacionesComponent } from './components/designaciones/designaciones.component';
import { DesignacionesDetailComponent } from './components/designaciones/designaciones-detail/designaciones-detail.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
    declarations: [
        AppComponent,
        UsuariosComponent,
        InicioComponent,
        LoginComponent,
        AppLayoutComponent,
        UsuariosDetailComponent,
        TemporadasComponent,
        EquiposComponent,
        EquiposDetailComponent,
        PartidosComponent,
        PartidosDetailComponent,
        DesignacionesComponent,
        DesignacionesDetailComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        MessagesModule,
        MenubarModule,
        SharedModule,
        DropdownModule,
        TableModule,
        ToolbarModule,
        AccordionModule,
        ReactiveFormsModule,
        RadioButtonModule,
        PaginatorModule,
        ConfirmDialogModule,
        AutoCompleteModule,
        CalendarModule,
        PasswordModule,
        InputNumberModule
        
    ]
})
export class AppModule { }
