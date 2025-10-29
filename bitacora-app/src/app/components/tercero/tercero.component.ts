// 👈 NUEVOS IMPORTS: OnDestroy, AbstractControl, Subscription
import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl, // 👈 Se importa AbstractControl
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs'; // 👈 Se importa Subscription

@Component({
  selector: 'app-tercero',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './tercero.component.html',
  styleUrls: ['./tercero.component.css'],
})
// 👈 Implementa OnDestroy para gestionar la suscripción
export class TerceroComponent implements OnDestroy {
  private _mostrarCamposApoyo = false;

  // ----------------------------------------------------
  // ✅ INICIO: Código para vincular con el padre
  // ----------------------------------------------------

  // 👈 Variable para almacenar la suscripción del padre
  private parentSub?: Subscription;
  // ⏰ NUEVO: Arreglo para guardar las suscripciones de encadenamiento de tiempo
  private timeSubscriptions: Subscription[] = [];

  /**
   * 👈 Input Setter: Recibe el control 'cantidadEquipos' del padre.
   */
  @Input()
  set cantidadEquiposControl(control: AbstractControl | null) {
    // 1. Limpiamos la suscripción anterior
    this.parentSub?.unsubscribe();

    if (control) {
      // 2. Nos suscribimos a los cambios de valor FUTUROS
      this.parentSub = control.valueChanges.subscribe(value => {
        this.actualizarEquiposVerificados(value);
      });

      // 3. Leer y aplicar el valor ACTUAL del control
      this.actualizarEquiposVerificados(control.value);
    }
  }

  /**
   * 👈 Método: Aplica el valor del padre a los campos hijos deseados.
   */
  private actualizarEquiposVerificados(cantidad: number | null) {
    if (cantidad === null || cantidad === undefined) {
      return;
    }

    // Secciones a sincronizar (todas excepto 'liberacion' que usa 'equiposLiberados')
    const seccionesAActualizar = [
      'inspeccion',
      'soplado',
      'limpieza',
      'pruebas',
      // No existe 'tercero' en la estructura del form
    ];

    for (const seccionKey of seccionesAActualizar) {
      this.form.get(seccionKey)?.patchValue({
        equiposVerificados: cantidad,
      });
    }
  }

  // 👈 Limpieza de las suscripciones al destruir el componente
  ngOnDestroy() {
    this.parentSub?.unsubscribe();
    // ⏰ NUEVO: Limpiamos las suscripciones de tiempo
    this.timeSubscriptions.forEach(sub => sub.unsubscribe());
  }

  // ----------------------------------------------------
  // ✅ FIN: Código para vincular con el padre
  // ----------------------------------------------------

  @Input()
  set mostrarCamposApoyo(value: boolean) {
    this._mostrarCamposApoyo = value;
    if (this._mostrarCamposApoyo) {
      this.agregarCamposApoyo();
    } else {
      this.removerCamposApoyo();
    }
  }
  get mostrarCamposApoyo() {
    return this._mostrarCamposApoyo;
  }

  @Output() datosListos = new EventEmitter<any>();

  form: FormGroup;

  secciones = [
    { key: 'inspeccion', label: 'Inspección Externa Equipos' },
    { key: 'soplado', label: 'Soplado' },
    { key: 'limpieza', label: 'Limpieza' },
    { key: 'pruebas', label: 'Pruebas' },
    // { key: 'tercero', label: 'Verificación Tercero' }, <- Se quita de aquí
    { key: 'liberacion', label: 'Liberación' },
  ];

  // ⏰ NUEVO: Mapeo de procesos para encadenar las horas (TODOS secuencialmente)
  private procesosEncadenados = [
      { fin: 'inspeccion', inicio: 'soplado' },
      { fin: 'soplado', inicio: 'limpieza' },
      { fin: 'limpieza', inicio: 'pruebas' },
      { fin: 'pruebas', inicio: 'liberacion' }, // Fin de Pruebas va al Inicio de Liberación
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      inspeccion: this.crearGrupoProceso(),
      soplado: this.crearGrupoProceso(),
      limpieza: this.crearGrupoProceso(),
      pruebas: this.crearGrupoProceso(),
      // 'tercero' se omite aquí
      liberacion: this.fb.group({
        equiposLiberados: [null, Validators.required],
        horaInicio: [null, Validators.required],
        horaFin: [null, Validators.required],
      }),
    });

    // ⏰ NUEVO: Configuración del encadenamiento de tiempos
    this.configurarEncadenamientoTiempos();
  }

  crearGrupoProceso(): FormGroup {
    return this.fb.group({
      equiposVerificados: [null, Validators.required],
      horaInicio: [null, Validators.required],
      horaFin: [null, Validators.required],
    });
  }

  /**
   * ⏰ Configura las suscripciones para encadenar la Hora Fin de un proceso
   * con la Hora Inicio del siguiente.
   */
  private configurarEncadenamientoTiempos(): void {
      this.procesosEncadenados.forEach(encadenamiento => {
          // Obtener el control de la Hora Fin del proceso actual
          const controlFin = this.form.get(`${encadenamiento.fin}.horaFin`);
          // Obtener el control de la Hora Inicio del proceso siguiente
          const controlInicioSiguiente = this.form.get(`${encadenamiento.inicio}.horaInicio`);

          if (controlFin && controlInicioSiguiente) {
              // Suscribirse a los cambios de la hora de FIN
              const sub = controlFin.valueChanges.subscribe(horaFinValue => {
                  // Aplicar ese valor a la hora de INICIO del siguiente proceso
                  controlInicioSiguiente.setValue(horaFinValue, { emitEvent: false });
              });
              // Almacenar la suscripción para limpiarla en ngOnDestroy
              this.timeSubscriptions.push(sub);
          }
      });
  }

  agregarCamposApoyo() {
    const secciones = [
      'inspeccion',
      'soplado',
      'limpieza',
      'pruebas',
      'liberacion',
      // 'tercero' se omite
    ];
    for (const seccion of secciones) {
      const grupo = this.form.get(seccion) as FormGroup;
      if (grupo && !grupo.get('equiposApoyo')) {
        grupo.addControl('equiposApoyo', new FormControl(null));
      }
    }
  }

  removerCamposApoyo() {
    const secciones = [
      'inspeccion',
      'soplado',
      'limpieza',
      'pruebas',
      'liberacion',
      // 'tercero' se omite
    ];
    for (const seccion of secciones) {
      const grupo = this.form.get(seccion) as FormGroup;
      if (grupo && grupo.get('equiposApoyo')) {
        grupo.removeControl('equiposApoyo');
      }
    }
  }

  public debugForm(): void {
    console.log('📝 Valores actuales del formulario de Alistamiento:', this.form.getRawValue());
  }

  /** ✅ Mapeo limpio de datos con prefijo "" */
  public getFormData(): any {
    this.form.markAllAsTouched();

    // 🔍 Depuración
    //this.debugForm();

    const raw = this.form.getRawValue();

    return {
      i_equiposVerificados: raw.inspeccion.equiposVerificados,
      i_horaInicio: raw.inspeccion.horaInicio,
      i_horaFin: raw.inspeccion.horaFin,
      i_equiposApoyo: raw.inspeccion.equiposApoyo,
      s_equiposVerificados: raw.soplado.equiposVerificados,
      s_horaInicio: raw.soplado.horaInicio,
      s_horaFin: raw.soplado.horaFin,
      s_equiposApoyo: raw.soplado.equiposApoyo,
      l_equiposVerificados: raw.limpieza.equiposVerificados,
      l_horaInicio: raw.limpieza.horaInicio,
      l_horaFin: raw.limpieza.horaFin,
      l_equiposApoyo: raw.limpieza.equiposApoyo,
      p_equiposVerificados: raw.pruebas.equiposVerificados,
      p_horaInicio: raw.pruebas.horaInicio,
      p_horaFin: raw.pruebas.horaFin,
      p_equiposApoyo: raw.pruebas.equiposApoyo,
      // 'tercero' se omite
      li_equiposLiberados: raw.liberacion.equiposLiberados,
      li_horaInicio: raw.liberacion.horaInicio,
      li_horaFin: raw.liberacion.horaFin,
      li_equiposApoyo: raw.liberacion.equiposApoyo,
    };
  }
}