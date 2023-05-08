import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, ConfirmationService } from 'primeng/api';
import { Categoria } from 'src/app/models/categoria.model';
import { Competicion } from 'src/app/models/competicion.model';
import { Designacion } from 'src/app/models/designacion.model';
import { Partido } from 'src/app/models/partido.model';
import { Temporada } from 'src/app/models/temporada.model';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { DesignacionesService } from 'src/app/services/designaciones.service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { TemporadasService } from 'src/app/services/temporadas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ObjectResponse } from 'src/app/utils/backend-service';
import { OPERACION, PERFIL } from 'src/app/utils/constants';

@Component({
  selector: 'app-designaciones-detail',
  templateUrl: './designaciones-detail.component.html',
  styleUrls: ['./designaciones-detail.component.scss']
})
export class DesignacionesDetailComponent {

  messages: Message[] = [];
  OPS = OPERACION;
  op: OPERACION = OPERACION.NEW;
  idDesignacion: any;
  designacionForm: FormGroup ;

  temporadaActiva: Temporada | undefined;
  categorias: Categoria[] = [];
  competiciones: Competicion[] = [];
  jornadas: any[] = [];
  partidos: any[] = [];
  partido: Partido | undefined;
  filteredUsuarios: any[] = [];
  listadoUsuarios: Usuario[] = [];
  designacion: Designacion | undefined;
  
  cargaInicial = false;

  arbitros: number = 0;
  oficiales: number = 0;

  deshabilitarTemporada = true;
  consulta: boolean = false;

  delay: number = 300;

  constructor(
    private designacionesService: DesignacionesService,
    private masterDataService: MasterDataService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private temporadasServive: TemporadasService,
    private usuariosService: UsuariosService
  ) {
    this.designacionForm=this.formBuilder.group({});
    this.fillForm();
  }

  async ngOnInit(): Promise<void> {
    this.getCategorias();
    this.getUsuarios();
    await this.getTemporadaActiva();
    this.activatedRoute.params.subscribe(params => {
      if (params && params['idDesignacion']) {
        this.op = this.OPS.EDIT;
        this.idDesignacion = params['idDesignacion'];
        this.getDesignacion();
      } else {
        this.op = this.OPS.NEW;
        this.cargaInicial = true;
        this.designacionForm.get('competicion')?.disable();
        this.designacionForm.get('jornada')?.disable();
        this.designacionForm.get('partido')?.disable();
      }
    });
  }

  getDesignacion(){
    this.designacionesService.getDesignacionById(this.idDesignacion).subscribe({
      next: (response) =>{
        if (response.success){
          this.designacion =  response.message;
          if (this.designacion.partido != null && this.designacion.partido.temporada?.id != this.temporadaActiva?.id){
            this.consulta = true;
          }
          this.fillForm();
          this.cargaInicial = true;
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
        }

      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener la designación' }];
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

  getUsuarios(){
    this.usuariosService.getAllUsuariosDesignables(true).subscribe({
      next: (response: ObjectResponse<Usuario[]>) => {
        if (response.success){
          this.listadoUsuarios = response.message;
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }]; 
        } 
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de temporadas' }];  
      }
    });
  }

  async getTemporadaActiva(){
    await this.temporadasServive.getTemporadaActiva().subscribe({
      next: (response: ObjectResponse<Temporada>) => {
        if (response.success){
          this.temporadaActiva = response.message;
          this.designacionForm.get('temporada')?.setValue(this.temporadaActiva.descripcion)
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
        }
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el la temporada activa' }];
      }
    });
  }

  fillForm() {
    this.designacionForm=this.formBuilder.group({
      id: [this.designacion?.id ? this.designacion.id :null,],
      temporada: [{value: this.designacion?.partido?.temporada ? this.designacion.partido.temporada.descripcion : '', disabled: true},[Validators.required]],
      categoria: [{value: this.designacion?.partido?.categoria ? this.designacion?.partido?.categoria : null, disabled: this.consulta},[Validators.required]],
      competicion: [{value: this.designacion?.partido?.competicion ? this.designacion?.partido.competicion : null, disabled: this.consulta},[Validators.required]],
      jornada: [{value: this.designacion?.partido?.jornada ? this.designacion.partido.jornada : null, disabled: this.consulta},[Validators.required]],
      partido: [{value: this.designacion?.partido ? this.designacion.partido : null, disabled: this.consulta}, [Validators.required]],
      fecha: [{value: this.designacion?.fecha ? new Date(this.designacion.fecha)  : null, disabled: this.consulta},[Validators.required]],

      arbitro1: [{value: this.designacion?.arbitro1 ? this.designacion.arbitro1 : null, disabled: this.consulta},[Validators.required]],
      arbitro2: [{value: this.designacion?.arbitro2 ? this.designacion.arbitro2 : null, disabled: this.consulta},],
      arbitro3: [{value: this.designacion?.arbitro3 ? this.designacion.arbitro3 : null, disabled: this.consulta},],

      oficial1: [{value: this.designacion?.oficial1 ? this.designacion.oficial1 : null, disabled: this.consulta},[Validators.required]],
      oficial2: [{value: this.designacion?.oficial2 ? this.designacion.oficial2 : null, disabled: this.consulta},],
      oficial3: [{value: this.designacion?.oficial3 ? this.designacion.oficial3 : null, disabled: this.consulta},],
      oficial4: [{value: this.designacion?.oficial4 ? this.designacion.oficial4 : null, disabled: this.consulta},],
    });

    if (this.designacion){
      this.changeCategoria(true);
    }
  }

  guardar(){
    if (this.designacionForm.invalid){
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'Hay errores en el formulario, faltan campos por rellenar' }];
      return;
    }

    if (this.designacionForm.get('partido')?.value.categoria == undefined)  {
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'El partido es obligatorio' }];
      return;
    }

    if (this.designacionForm.get('arbitro1')?.value.id == undefined)  {
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'Se debe seleccionar al menos un árbitro' }];
      return;
    }
    if (this.designacionForm.get('oficial1')?.value.id == undefined)  {
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'Se debe seleccionar al menos un oficial' }];
      return;
    }

    let temporada = this.op == this.OPS.NEW ? this.temporadaActiva : this.partido?.temporada
    // if (temporada == undefined)  {
    //   this.messages = [{ severity: 'error', summary: 'Error', detail: 'La temporada es obligatoria' }];
    //   return;
    // }

    //this.designacion = this.designacionForm.getRawValue() as Designacion;
    if (this.designacion == null || this.designacion == undefined) this.designacion = {} as Designacion ;
    this.recogerFormulario();

    if(this.op == this.OPS.NEW){
      this.designacionesService.addDesignacion(this.designacion).subscribe({
        next: (response) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: 'Designación insertada' }];
            //this.router.navigate['/partidos-detail/${this.partido.id}'];
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
          }
          //this.router.navigate['/partidos-detail/${this.partido.id}'];
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar la designación' }];
        }
      });
    } else if (this.op = this.OPS.EDIT){
      this.designacionesService.editDesignacion(this.designacion).subscribe({
        next: (response) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: response.message }];
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
          }

          //this.router.navigate['/partidos-detail/${this.partido.id}'];
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar la designación' }];
        }
      });
    }
  }

  recogerFormulario(){
    if (this.designacion ==null || this.designacion == undefined) this.designacion = {} as Designacion ;
    if (this.designacionForm.get('partido')?.value)
      this.designacion.partido =  this.designacionForm.get('partido')?.value;
    if (this.designacionForm.get('fecha')?.value)
      this.designacion.fecha =  this.designacionForm.get('fecha')?.value;

    if (this.designacionForm.get('arbitro1')?.value)
      this.designacion.arbitro1 =  this.designacionForm.get('arbitro1')?.value;
    if (this.designacionForm.get('arbitro2')?.value)
      this.designacion.arbitro2 =  this.designacionForm.get('arbitro2')?.value;
    if (this.designacionForm.get('arbitro3')?.value)
      this.designacion.arbitro3 =  this.designacionForm.get('arbitro3')?.value;

    if (this.designacionForm.get('oficial1')?.value)
      this.designacion.oficial1 =  this.designacionForm.get('oficial1')?.value;
    if (this.designacionForm.get('oficial2')?.value)
      this.designacion.oficial2 =  this.designacionForm.get('oficial2')?.value;
    if (this.designacionForm.get('oficial3')?.value)
      this.designacion.oficial3 =  this.designacionForm.get('oficial3')?.value;
    if (this.designacionForm.get('oficial4')?.value)
      this.designacion.oficial4 =  this.designacionForm.get('oficial4')?.value;
  }

  volver(){
    this.router.navigate(['/designaciones']);
  }

  filterUsuarios(event: any, perfil: string){
    this.filteredUsuarios = [];
    let filtered: any[] = [];
    let query = event.query;

    let lista: any[] = []
    this.listadoUsuarios.forEach((item: Usuario)=>{
      let nombreCompleto =  item.nombre 
        + (item.apellido1 ? ' ' + item.apellido1 : '' ) 
        + (item.apellido2 ? ' ' + item.apellido2 : '' ) ;
      if (nombreCompleto && nombreCompleto.toLowerCase().indexOf(query.toLowerCase()) == 0 && item.perfil?.perfil == perfil) {
        filtered.push(item);
      }
    });
    this.filteredUsuarios = filtered;
  }

  changeCategoria(edicion: boolean){
    this.arbitros = 0;
    this.oficiales = 0;
    let categoria  = this.designacionForm.get('categoria')?.value;
    if (categoria !=  undefined){
      this.masterDataService.getCompeticionesByCategoria(categoria.categoria).subscribe({
        next: (response: Competicion[]) => {  
          if (response.length > 0 ){ 
            this.competiciones = response;
            this.arbitros = categoria.arbitros;
            this.oficiales = categoria.oficiales;
            this.designacionForm.get('competicion')?.enable();
            this.competiciones.unshift({
              competicion: undefined,
              descripcion: 'Seleccione un valor'
            });
            if (edicion) this.changeCompeticion()
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: 'No se han encontrado competiciones para los parametros seleccionados' }];
            this.arbitros = 0;
            this.oficiales = 0;
            this.competiciones = [];
            this.jornadas = [];
            this.partidos = [];
            this.designacionForm.get('competicion')?.disable();
            this.designacionForm.get('jornada')?.disable();
            this.designacionForm.get('partido')?.disable();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de competiciones' }];
        }
      });
    }
    
  }

  changeCompeticion(){
    let categoria  = this.designacionForm.get('categoria')?.value.categoria;
    let competicion  = this.designacionForm.get('competicion')?.value.competicion;
    if (categoria !=  undefined && competicion != undefined){
      this.masterDataService.getJornadasByCategoriaAndCompeticion(categoria, competicion).subscribe({
        next: (response: Number[]) => {
          if (response.length > 0 ){
            this.jornadas = response;
            this.designacionForm.get('jornada')?.enable();
            this.designacionForm.get('jornada')?.setValue(this.jornadas[0])
            this.changeJornada();
          }else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: 'No se han encontrado jornadas para los parametros seleccionados' }];
            this.jornadas = [];
            this.partidos = [];
            this.designacionForm.get('jornada')?.disable();
            this.designacionForm.get('partido')?.disable();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de jornadas' }];
        }
      });
    }
  }

  changeJornada(){
    let categoria  = this.designacionForm.get('categoria')?.value.categoria;
    let competicion  = this.designacionForm.get('competicion')?.value.competicion;
    let jornada  = this.designacionForm.get('jornada')?.value;
    if (categoria !=  undefined && competicion != undefined && jornada != undefined){
      this.masterDataService.getPartidosByCategoriaAndCompeticionAndJornada(categoria, competicion, jornada).subscribe({
        next: (response: Partido[]) => {
          if(response.length > 0){
            this.partidos = response;
            this.designacionForm.get('partido')?.enable();
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: 'No se han encontrado partidos para los parametros seleccionados' }];
            this.partidos = [];
            this.designacionForm.get('partido')?.disable();
          }
          
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de partidos' }];
        }
      });
    }
  }
}
