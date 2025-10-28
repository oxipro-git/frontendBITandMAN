import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
export class AlistamientoComponent {
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

  @Output() datosListos = new EventEmitter<any>();

  form: FormGroup;

  // 🧩 Secciones del alistamiento
  secciones = [
    { key: 'inspeccion', label: 'Inspección Visual' },
    { key: 'limpieza', label: 'Limpieza' },
    { key: 'pruebas', label: 'Pruebas de Funcionamiento' },
    { key: 'liberacion', label: 'Liberación de Equipos' }
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
