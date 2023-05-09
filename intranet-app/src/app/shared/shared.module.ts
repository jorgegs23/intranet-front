import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { MenubarModule } from 'primeng/menubar'
import { InputSwitchModule } from 'primeng/inputswitch';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@NgModule({
  declarations: [
    MenuComponent,
  ],
  exports:[
    MenuComponent
  ],
  imports: [
    CommonModule,
    MenubarModule,
    InputSwitchModule,
    BrowserModule,
    BrowserAnimationsModule,
    InputSwitchModule,
    FormsModule,
    ConfirmDialogModule
  ]
})
export class SharedModule { }
