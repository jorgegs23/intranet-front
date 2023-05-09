import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';
import { Categoria } from 'src/app/models/categoria.model';
import { Competicion } from 'src/app/models/competicion.model';
import { Equipo } from 'src/app/models/equipo.model';
import { Partido } from 'src/app/models/partido.model';
import { Temporada } from 'src/app/models/temporada.model';
import { EquiposService } from 'src/app/services/equipos.service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { PartidosService } from 'src/app/services/partidos.service';
import { TemporadasService } from 'src/app/services/temporadas.service';
import { ObjectResponse } from 'src/app/utils/backend-service';
import { OPERACION } from 'src/app/utils/constants';
import { nombre } from 'src/app/validators/nombres.validator';

@Component({
  selector: 'app-partidos-detail',
  templateUrl: './partidos-detail.component.html',
  styleUrls: ['./partidos-detail.component.scss']
})
export class PartidosDetailComponent {

  messages: Message[] = [];
  OPS = OPERACION;
  op: OPERACION = OPERACION.NEW;
  idPartido: any;
  partidoForm: FormGroup ;

  temporadaActiva: Temporada | undefined;
  categorias: Categoria[] = [];
  competiciones: Competicion[] = [];
  listadoEquipos: Equipo[] = [];
  filteredEquipos: any[] = [];
  partido: Partido | undefined;

  equipoLocal: any;

  cargaInicial = false;
  activo: string = '';

  deshabilitarTemporada = true;
  consulta: boolean = false;

  delay: number = 300;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private partidosService: PartidosService,
    private masterDataService: MasterDataService,
    private temporadasServive: TemporadasService,
    private equiposSerivice: EquiposService
  ){
    this.partidoForm=this.formBuilder.group({});
    this.fillForm();
  }

  async ngOnInit(): Promise<void> {
    this.getCategorias();
    this.getCompeticiones();
    await this.getTemporadaActiva();
    this.activatedRoute.params.subscribe(params => {
      if (params && params['idPartido']) {
        this.op = this.OPS.EDIT;
        this.idPartido = params['idPartido'];
        this.getPartido();
      } else {
        this.op = this.OPS.NEW;
        this.cargaInicial = true;
      }

    });
  }

  getPartido(){
    this.partidosService.getPartidoById(this.idPartido).subscribe({
      next: (response) =>{
        if (response.success){
          this.partido =  response.message;
          if (this.partido.temporada?.id != this.temporadaActiva?.id){
            this.consulta = true;
          }
          this.fillForm();
          this.cargaInicial = true;
        } else {
          this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
        }

      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el partido' }];
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

  getCompeticiones(){
    this.masterDataService.getAllCompeticiones().subscribe({
      next: (response: Competicion[]) => {
        this.competiciones = response;
        this.competiciones.unshift({
          competicion: undefined,
          descripcion: 'Seleccione un valor'
        })
      },
      error: (error: HttpErrorResponse) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al obtener el listado de competiciones' }];
      }
    });
  }

  async getTemporadaActiva(){
    await this.temporadasServive.getTemporadaActiva().subscribe({
      next: (response: ObjectResponse<Temporada>) => {
        if (response.success){
          this.temporadaActiva = response.message;
          this.partidoForm.get('temporada')?.setValue(this.temporadaActiva.descripcion)
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
    this.partidoForm=this.formBuilder.group({
      id: [this.partido?.id ? this.partido.id :null,],
      temporada: [{value: this.partido?.temporada ? this.partido.temporada.descripcion : '', disabled: true}, [Validators.required]],
      categoria: [{value: this.partido?.categoria ? this.partido?.categoria : null, disabled: this.consulta},[Validators.required]],
      competicion: [{value: this.partido?.competicion ? this.partido.competicion : null, disabled: this.consulta}, [Validators.required]],
      jornada: [{value: this.partido?.jornada ? this.partido.jornada : null, disabled: this.consulta}, [Validators.required]],
      equipoLocal: [{value: this.partido?.equipoLocal ? this.partido.equipoLocal : null, disabled: this.consulta}, [Validators.required]],
      equipoVisitante: [{value: this.partido?.equipoVisitante ? this.partido.equipoVisitante : null, disabled: this.consulta},[Validators.required]],
      fecha: [{value: this.partido?.fecha ? new Date(this.partido.fecha)  : null, disabled: this.consulta},[Validators.required]],
      municipio: [{value: this.partido?.municipio ? this.partido.municipio : null, disabled: this.consulta}, [Validators.required]],
      direccion: [{value: this.partido?.direccion ? this.partido.direccion : null, disabled: this.consulta}, [Validators.required]],
      pabellon: [{value: this.partido?.pabellon ? this.partido.pabellon : null, disabled: this.consulta}, [Validators.required]],
    })
    this.enableEquipos();
  }

  guardar(){
    if (this.partidoForm.invalid){
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'Hay errores en el formulario, faltan campos por rellenar' }];
      return;
    }

    if (this.partidoForm.get('categoria')?.value.categoria == undefined)  {
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'La categoria es obligatoria' }];
      return;
    }

    if (this.partidoForm.get('competicion')?.value.competicion == undefined)  {
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'La competición es obligatoria' }];
      return;
    }

    let temporada = this.op == this.OPS.NEW ? this.temporadaActiva : this.partido?.temporada
    // if (temporada == undefined)  {
    //   this.messages = [{ severity: 'error', summary: 'Error', detail: 'La temporada es obligatoria' }];
    //   return;
    // }

    this.partido = this.partidoForm.getRawValue() as Partido;
    this.partido.temporada = temporada;

    if(this.op == this.OPS.NEW){
      this.partidosService.addPartido(this.partido).subscribe({
        next: (response) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: 'Partido insertado' }];
            //this.router.navigate['/partidos-detail/${this.partido.id}'];
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
          }
          //this.router.navigate['/partidos-detail/${this.partido.id}'];
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar el partido' }];
        }
      });
    } else if (this.op = this.OPS.EDIT){
      this.partidosService.editPartido(this.partido).subscribe({
        next: (response) => {
          if (response.success){
            this.messages = [{ severity: 'success', summary: 'Ok', detail: response.message }];
          } else {
            this.messages = [{ severity: 'error', summary: 'Error', detail: response.error }];
          }

          //this.router.navigate['/partidos-detail/${this.partido.id}'];
        },
        error: (error: HttpErrorResponse) => {
          this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al guardar el partido' }];
        }
      });
    }
  }

  volver(){
    this.router.navigate(['/partidos']);
  }

  async enableEquipos(){
    let categoria = this.partidoForm.get('categoria')?.value;
    if (categoria != undefined && categoria != null &&
      categoria.categoria != undefined && categoria.categoria != null){
      let categoria =  this.partidoForm.get('categoria')?.value.categoria;
      let temporada = this.op == this.OPS.NEW ? this.temporadaActiva?.id : this.partido?.temporada?.id
      let idTemporada: number = temporada as number;
      await this.buscarEquipos(categoria, idTemporada);
      this.partidoForm.controls['equipoLocal'].enable();
      this.partidoForm.controls['equipoVisitante'].enable();
    } else {
      this.partidoForm.controls['equipoLocal'].disable();
      this.partidoForm.controls['equipoVisitante'].disable();
    }
  }

  async buscarEquipos(categoria: string, idTemporada: number){
    await this.equiposSerivice.getEquipoByCategoriaAndTemporada(categoria, idTemporada)
      .then((response)=>{
        this.listadoEquipos = response;
      })
      .catch((error) => {
        this.messages = [{ severity: 'error', summary: 'Error', detail: 'Error al recuperar los equipos' }];
      });
  }

  filterEquipos(event: any){
    this.filteredEquipos = [];
    let filtered: any[] = [];
    let query = event.query;

    let lista: any[] = []
    this.listadoEquipos.forEach((item: Equipo)=>{
      if (item?.nombre && item?.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    });
    this.filteredEquipos = filtered;
  }

  selectEquipoLocal(){
    let local = this.partidoForm.get('equipoLocal')?.value as Equipo;
    if (local){
      this.partidoForm.get('municipio')?.setValue(local.municipio);
      this.partidoForm.get('pabellon')?.setValue(local.pabellon);
      this.partidoForm.get('direccion')?.setValue(local.direccion);
    }
  }
}
