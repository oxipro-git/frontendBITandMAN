import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
export class TerceroComponent {
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

  secciones = [
    { key: 'inspeccion', label: 'Inspección Externa Equipos' },
    { key: 'soplado', label: 'Soplado' },
    { key: 'limpieza', label: 'Limpieza' },
    { key: 'pruebas', label: 'Pruebas' },
    { key: 'tercero', label: 'Verificación Tercero' },
    { key: 'liberacion', label: 'Liberación' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      inspeccion: this.crearGrupoProceso(),
      soplado: this.crearGrupoProceso(),
      limpieza: this.crearGrupoProceso(),
      pruebas: this.crearGrupoProceso(),
      tercero: this.crearGrupoProceso(),
      liberacion: this.fb.group({
        equiposLiberados: [null, Validators.required],
        horaInicio: [null, Validators.required],
        horaFin: [null, Validators.required],
      }),
    });
  }

  crearGrupoProceso(): FormGroup {
    return this.fb.group({
      equiposVerificados: [null, Validators.required],
      horaInicio: [null, Validators.required],
      horaFin: [null, Validators.required],
    });
  }

  agregarCamposApoyo() {
    const secciones = [
      'inspeccion',
      'soplado',
      'limpieza',
      'pruebas',
      'liberacion',
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
      te_equiposVerificados: raw.tercero.equiposVerificados,
      te_horaInicio: raw.tercero.horaInicio,
      te_horaFin: raw.tercero.horaFin,
      li_equiposLiberados: raw.liberacion.equiposLiberados,
      li_horaInicio: raw.liberacion.horaInicio,
      li_horaFin: raw.liberacion.horaFin,
      li_equiposApoyo: raw.liberacion.equiposApoyo,
    };
  }
}
