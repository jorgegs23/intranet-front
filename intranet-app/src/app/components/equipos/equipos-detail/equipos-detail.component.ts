import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Categoria } from 'src/app/models/categoria.model';
import { Equipo } from 'src/app/models/equipo.model';
import { Temporada } from 'src/app/models/temporada.model';
import { EquiposService } from 'src/app/services/equipos.service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { TemporadasService } from 'src/app/services/temporadas.service';
import { ObjectResponse } from 'src/app/utils/backend-service';
import { OPERACION } from 'src/app/utils/constants';

@Component({
  selector: 'app-equipos-detail',
  templateUrl: './equipos-detail.component.html',
  styleUrls: ['./equipos-detail.component.scss']
})
export class EquiposDetailComponent {

  messages: Message[] = [];
  OPS = OPERACION;
  op: OPERACION = OPERACION.NEW;
  idEquipo: any;
  equipoForm: FormGroup ;

  temporadaActiva: Temporada | undefined;
  categorias: Categoria[] = [];
  equipo: Equipo | undefined;
  
  cargaInicial = false;
  activo: string = '';

  deshabilitarTemporada = true;
  consulta: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private equiposService: EquiposService,
    private masterDataService: MasterDataService,
    private temporadasServive: TemporadasService
  ){
    this.equipoForm=this.formBuilder.group({});
    this.fillForm();
  }

  async ngOnInit(): Promise<void> {
    this.getCategorias();
    await this.getTemporadaActiva();
    this.activatedRoute.params.subscribe(params => {
      if (params && params['idEquipo']) {
        this.op = this.OPS.EDIT;
        this.idEquipo = params['idEquipo'];    
        this.getEquipo();
        if (localStorage.getItem("idCreado") && localStorage.getItem("idCreado")!  === this.idEquipo) {
          let messageStorageSplited = localStorage.getItem("messagesCreado")?.split(",");
          this.messages = [{ severity: messageStorageSplited![0], summary: messageStorageSplited![1], detail: messageStorageSplited![2] }];
          localStorage.removeItem("idCreado");
          localStorage.removeItem("messagesCreado");
        }
      } else {
        this.op = this.OPS.NEW;
        this.cargaInicial = true;
      }
      
    }); 
  }

  getEquipo(){
    this.equiposService.getEquipoById(this.idEquipo).subscribe({
      next: (response) =>{
        if (response.success){
          this.equipo =  response.message;  
          if (this.equipo.temporada?.id != this.temporadaActiva?.id){
            this.consulta = true;
          }
          this.fillForm();
          this.cargaInicial = true;
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
        }
        
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el equipo' }];  
        }
    })
  }

  getCategorias(){
    this.masterDataService.getAllCategorias().subscribe({
      next: (response: Categoria[]) => {
        this.categorias = response;
        this.categorias.unshift({
          categoria: undefined,
          descripcion: 'Seleccione un valor'
        })
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de categorias' }];  
      }
    });
  }

  async getTemporadaActiva(){
    await this.temporadasServive.getTemporadaActiva().subscribe({
      next: (response: ObjectResponse<Temporada>) => {
        if (response.success){
          this.temporadaActiva = response.message;
          this.equipoForm.get('temporada')?.setValue(this.temporadaActiva.descripcion)
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
        } 
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener la temporada activa' }];  
      }
    });
  }
  
  fillForm() {
    this.equipoForm=this.formBuilder.group({
      id: [this.equipo?.id ? this.equipo.id :null,],
      nombre: [{value: this.equipo?.nombre ? this.equipo.nombre : '', disabled: this.consulta}, [Validators.required]],
      categoria: [{value: this.equipo?.categoria ? this.equipo?.categoria : null, disabled: this.consulta},],
      municipio: [{value: this.equipo?.municipio ? this.equipo.municipio : null, disabled: this.consulta}, [Validators.required]],
      direccion: [{value: this.equipo?.direccion ? this.equipo.direccion : null, disabled: this.consulta}, [Validators.required]],
      pabellon: [{value: this.equipo?.pabellon ? this.equipo.pabellon : null, disabled: this.consulta}, [Validators.required]],
      temporada: [{value: this.equipo?.temporada ? this.equipo.temporada.descripcion : null, disabled: true},[Validators.required]]
    })
  }

  guardar(){
    if (this.equipoForm.invalid){
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'Hay errores en el formulario, faltan campos por rellenar' }];  
      return;
    } 

    if (this.equipoForm.get('categoria')?.value.categoria == undefined)  {
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'La categoria es obligatoria' }];  
      return;
    }

    let temporada = this.op == this.OPS.NEW ? this.temporadaActiva : this.equipo?.temporada
    if (temporada == undefined)  {
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'La temporada es obligatoria' }];  
      return;
    }
    this.equipo = this.equipoForm.getRawValue() as Equipo;
    this.equipo.temporada = temporada; 

    if(this.op == this.OPS.NEW){
      this.equiposService.addEquipo(this.equipo).subscribe({
        next: (response) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: 'Equipo insertado' }]; 
            localStorage.setItem("idCreado", response.message.id?.toString()!)
            localStorage.setItem("messagesCreado", this.messages[0].severity! + ", " + this.messages[0].summary! + ", " + this.messages[0].detail!)
            this.router.navigate([`/equipos-detail/${response.message.id}`]);
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
          }
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar el equipo' }];  
        }
      });
    } else if (this.op = this.OPS.EDIT){
      this.equiposService.editEquipo(this.equipo).subscribe({
        next: (response) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: response.message }]; 
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
          }
          
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar el equipo' }];  
        }
      });
    }
  }

  volver(){
    this.router.navigate(['/equipos']);
  }
}
