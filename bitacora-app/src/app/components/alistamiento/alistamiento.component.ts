// 👈 NUEVO: Se importan OnDestroy, AbstractControl y Subscription
import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
// 👈 NUEVO: Se importa AbstractControl
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs'; // 👈 NUEVO: Se importa Subscription

@Component({
  selector: 'app-alistamiento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './alistamiento.component.html',
  styleUrls: ['./alistamiento.component.css']
})
// 👈 NUEVO: Se implementa OnDestroy para limpiar la suscripción
export class AlistamientoComponent implements OnDestroy {
  // 🔁 Control de campos de apoyo
  private _mostrarCamposApoyo = false;

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

  // ----------------------------------------------------
  // ✅ INICIO: Código para vincular con el padre
  // ----------------------------------------------------

  // 👈 NUEVO: Variable para guardar la suscripción al control padre
  private parentSub?: Subscription;

  // 👈 NUEVO: Arreglo para guardar las suscripciones de encadenamiento
  private timeSubscriptions: Subscription[] = [];

  /**
   * 👈 NUEVO: Este es el Input setter.
   * Recibe el control 'cantidadEquipos' del padre.
   * Se ejecuta cuando Angular asigna el valor al Input.
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

      // 3. 🚨 ¡SOLUCIÓN! Leer y aplicar el valor ACTUAL del control
      // Esto asegura que el campo se rellene la primera vez que se carga el hijo.
      this.actualizarEquiposVerificados(control.value);
    }
  }

  /**
   * 👈 NUEVO: Este método aplica el valor del padre a los campos hijos.
   * Actualiza los campos 'equiposVerificados' en las secciones
   * deseadas (Inspección, Limpieza, Pruebas).
   */
  private actualizarEquiposVerificados(cantidad: number | null) {
    if (cantidad === null || cantidad === undefined) {
      return; // No hacer nada si el valor es nulo
    }

    // Definimos las secciones que queremos actualizar
    const seccionesAActualizar = ['inspeccion', 'limpieza', 'pruebas'];

    for (const seccionKey of seccionesAActualizar) {
      // Usamos patchValue para actualizar solo el campo deseado
      this.form.get(seccionKey)?.patchValue({
        equiposVerificados: cantidad
      });
    }
  }

  // 👈 NUEVO: Implementamos ngOnDestroy para limpiar la suscripción y evitar fugas de memoria
  ngOnDestroy() {
    this.parentSub?.unsubscribe();
    // 👈 NUEVO: Limpiamos las suscripciones de tiempo
    this.timeSubscriptions.forEach(sub => sub.unsubscribe());
  }

  // ----------------------------------------------------
  // ✅ FIN: Código para vincular con el padre
  // ----------------------------------------------------


  @Output() datosListos = new EventEmitter<any>();

  form: FormGroup;

  // 🧩 Secciones del alistamiento
  secciones = [
    { key: 'inspeccion', label: 'Inspección Visual' },
    { key: 'limpieza', label: 'Limpieza' },
    { key: 'pruebas', label: 'Pruebas de Funcionamiento' },
    { key: 'liberacion', label: 'Liberación de Equipos' }
  ];

  // ⏰ NUEVO: Mapeo de procesos para encadenar las horas
  private procesosEncadenados = [
      { fin: 'inspeccion', inicio: 'limpieza' },   // Inspección.horaFin -> Limpieza.horaInicio
      { fin: 'limpieza', inicio: 'pruebas' },      // Limpieza.horaFin -> Pruebas.horaInicio
      { fin: 'pruebas', inicio: 'liberacion' }     // Pruebas.horaFin -> Liberacion.horaInicio
  ];

  constructor(private fb: FormBuilder) {
    // 🏗️ Estructura del formulario
    this.form = this.fb.group({
      marcaCalor: [false],
      cantidadMarcaCalor: [{ value: null, disabled: true }],
      alarmaCero: [false],
      flujoMaximo: [false],
      desconexion: [false],

      // Secciones principales
      inspeccion: this.crearGrupoProceso(),
      limpieza: this.crearGrupoProceso(),
      pruebas: this.crearGrupoProceso(),
      liberacion: this.crearGrupoProceso()
    });

    // ⚙️ Control dinámico de cantidadMarcaCalor
    this.form.get('marcaCalor')?.valueChanges.subscribe(value => {
      const campoCantidad = this.form.get('cantidadMarcaCalor');
      if (value) {
        campoCantidad?.enable();
        campoCantidad?.setValidators([Validators.required]);
      } else {
        campoCantidad?.disable();
        campoCantidad?.reset();
        campoCantidad?.clearValidators();
      }
      campoCantidad?.updateValueAndValidity();
    });

    // ⏰ NUEVO: Configuración del encadenamiento de tiempos
    this.configurarEncadenamientoTiempos();
  }

  // 🧱 Crea cada grupo de proceso (reutilizable)
  private crearGrupoProceso(): FormGroup {
    return this.fb.group({
      equiposVerificados: [null, Validators.required],
      horaInicio: [null, Validators.required],
      horaFin: [null, Validators.required],
      equiposApoyo: [null] // lo dejamos por defecto, no interfiere si está oculto
    });
  }

  /**
   * ⏰ NUEVO: Configura las suscripciones para encadenar la Hora Fin de un proceso
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
                  // { emitEvent: false } es crucial para evitar bucles o re-ejecuciones innecesarias.
                  controlInicioSiguiente.setValue(horaFinValue, { emitEvent: false });
              });
              // Almacenar la suscripción para limpiarla en ngOnDestroy
              this.timeSubscriptions.push(sub);
          }
      });
  }

  // ➕ Agregar campos de apoyo si se habilita el modo “mostrarCamposApoyo”
  private agregarCamposApoyo() {
    const secciones = ['inspeccion', 'limpieza', 'pruebas', 'liberacion'];
    for (const seccion of secciones) {
      const grupo = this.form.get(seccion) as FormGroup;
      if (grupo && !grupo.get('equiposApoyo')) {
        grupo.addControl('equiposApoyo', new FormControl(null));
      }
    }
  }

  // ➖ Quitar campos de apoyo cuando no se necesitan
  private removerCamposApoyo() {
    const secciones = ['inspeccion', 'limpieza', 'pruebas', 'liberacion'];
    for (const seccion of secciones) {
      const grupo = this.form.get(seccion) as FormGroup;
      if (grupo?.get('equiposApoyo')) {
        grupo.removeControl('equiposApoyo');
      }
    }
  }

  public debugForm(): void {
    console.log('📝 Valores actuales del formulario de Alistamiento:', this.form.getRawValue());
  }


  public getFormData(): any {
    this.form.markAllAsTouched();

    // 🔍 Depuración
    // this.debugForm();

    const raw = this.form.getRawValue();

    return {
      // 🔧 Campos generales
      alarmaCero: raw.alarmaCero,
      flujoMaximo: raw.flujoMaximo,
      desconexion: raw.desconexion,
      marcaCalor: raw.marcaCalor,
      cantidadMarcaCalor: raw.cantidadMarcaCalor,

      // 🧩 Inspección Visual
      i_equiposVerificados: raw.inspeccion?.equiposVerificados,
      i_horaInicio: raw.inspeccion?.horaInicio,
      i_horaFin: raw.inspeccion?.horaFin,
      i_equiposApoyo: raw.inspeccion?.equiposApoyo,

      // 🧽 Limpieza
      l_equiposVerificados: raw.limpieza?.equiposVerificados,
      l_horaInicio: raw.limpieza?.horaInicio,
      l_horaFin: raw.limpieza?.horaFin,
      l_equiposApoyo: raw.limpieza?.equiposApoyo,

      // ⚙️ Pruebas
      p_equiposVerificados: raw.pruebas?.equiposVerificados,
      p_horaInicio: raw.pruebas?.horaInicio,
      p_horaFin: raw.pruebas?.horaFin,
      p_equiposApoyo: raw.pruebas?.equiposApoyo,

      // 🚀 Liberación
      li_equiposVerificados: raw.liberacion?.equiposVerificados,
      li_horaInicio: raw.liberacion?.horaInicio,
      li_horaFin: raw.liberacion?.horaFin,
      li_equiposApoyo: raw.liberacion?.equiposApoyo,
    };
  }

}