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

  temporadas: Temporada[] = [];
  categorias: Categoria[] = [];
  equipo: Equipo | undefined;
  
  cargaInicial = false;
  activo: string = '';

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

  ngOnInit(): void {
    this.getCategorias();
    this.getTemporadas();
    this.activatedRoute.params.subscribe(params => {
      if (params && params['idEquipo']) {
        this.op = this.OPS.EDIT;
        this.idEquipo = params['idEquipo'];    
        this.getEquipo();
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
          this.fillForm();
          this.cargaInicial = true;
          this.router.navigate(['/equipos-detail', this.equipo.id]);
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
        }
        
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el equipo' }];  
        console.log('Error al obtener el usaurio: ' + error)
        }
    })
  }

  getCategorias(){
    this.masterDataService.getAllCategorias().subscribe({
      next: (response: Categoria[]) => {
        this.categorias = response;
        console.log(response)
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

  getTemporadas(){
    this.temporadasServive.getAllTemporadas().subscribe({
      next: (response: ObjectResponse<Temporada[]>) => {
        if (response.success){
          this.temporadas = response.message;
          this.temporadas.unshift({
            id: undefined,
            descripcion: 'Seleccione un valor'
          })
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
        } 
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de temporadas' }];  
      }
    });
  }
  
  fillForm() {
    this.equipoForm=this.formBuilder.group({
      id: [this.equipo?.id ? this.equipo.id :null],
      nombre: [this.equipo?.nombre ? this.equipo.nombre : '', [Validators.required]],
      categoria: [this.equipo?.categoria ? this.equipo?.categoria : null,],
      municipio: [this.equipo?.municipio ? this.equipo.municipio : null, [Validators.required]],
      direccion: [this.equipo?.direccion ? this.equipo.direccion : null, [Validators.required]],
      pabellon: [this.equipo?.pabellon ? this.equipo.pabellon : null, [Validators.required]],
      temporada: [this.equipo?.temporada ? this.equipo.temporada : null,],
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

    if (this.equipoForm.get('temporada')?.value.id == undefined)  {
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'La temporada es obligatoria' }];  
      return;
    }

    this.equipo = this.equipoForm.getRawValue() as Equipo;
     
    if(this.op == this.OPS.NEW){
      this.equiposService.addEquipo(this.equipo).subscribe({
        next: (response) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: 'Equipo insertado' }]; 
            //this.router.navigate['/equipos-detail/${this.equipo.id}'];
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
          }
          //this.router.navigate['/equipos-detail/${this.equipo.id}'];
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar el usaurio' }];  
          console.log('Error al guardar: ' + error)
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
          
          //this.router.navigate['/equipos-detail/${this.equipo.id}'];
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar el usaurio' }];  
          console.log('Error al guardar: ' + error)
        }
      });
    }
    console.log(this.equipoForm);
  }

  volver(){
    this.router.navigate(['/equipos']);
  }
}
