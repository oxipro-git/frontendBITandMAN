import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatAutocompleteModule,
  ],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent {
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

  public form: FormGroup;

  secciones = [
    { key: 'inspeccion', label: 'Inspección Externa Equipos' },
    { key: 'soplado', label: 'Soplado' },
    { key: 'limpieza', label: 'Limpieza' },
    { key: 'pruebas', label: 'Pruebas' },
    { key: 'reparacion', label: 'Reparación' },
    { key: 'tercero', label: 'Inspección Tercero' },
    { key: 'liberacion', label: 'Liberación' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      realizaReparacion: [false],

      inspeccion: this.crearGrupoProceso(),
      soplado: this.crearGrupoProceso(),
      limpieza: this.crearGrupoProceso(),
      pruebas: this.crearGrupoProceso(),
      tercero: this.crearGrupoProceso(),
      reparacion: this.fb.group({
        equiposIngresados: [null],
        equiposReparados: [null],
        horaInicio: [''],
        horaFin: [''],
      }),
      liberacion: this.fb.group({
        equiposLiberados: [null, Validators.required],
        horaInicio: [null, Validators.required],
        horaFin: [null, Validators.required],
      }),
    });

    // ✅ Validaciones dinámicas de reparación
    this.form.get('realizaReparacion')?.valueChanges.subscribe((value) => {
      const reparacionGroup = this.form.get('reparacion') as FormGroup;
      const campos = [
        'equiposIngresados',
        'equiposReparados',
        'horaInicio',
        'horaFin',
      ];

      campos.forEach((campo) => {
        const control = reparacionGroup.get(campo);
        if (value) control?.setValidators([Validators.required]);
        else control?.clearValidators();
        control?.updateValueAndValidity();
      });
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
      'reparacion',
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
      'reparacion',
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

  /** ✅ Mapeo limpio de datos para enviar al backend */
  public getFormData(): any {
    this.form.markAllAsTouched();

    // 🔍 Depuración
    //this.debugForm();

    const raw = this.form.getRawValue();

    return {
      realizaReparacion: raw.realizaReparacion,
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
      r_equiposIngresados: raw.reparacion.equiposIngresados,
      r_equiposReparados: raw.reparacion.equiposReparados,
      r_horaInicio: raw.reparacion.horaInicio,
      r_horaFin: raw.reparacion.horaFin,
      r_equiposApoyo: raw.reparacion.equiposApoyo,
      ter_equiposLiberados: raw.tercero.equiposVerificados,
      ter_horaInicio: raw.tercero.horaInicio,
      ter_horaFin: raw.tercero.horaFin,
      li_equiposLiberados: raw.liberacion.equiposLiberados,
      li_horaInicio: raw.liberacion.horaInicio,
      li_horaFin: raw.liberacion.horaFin,
      li_equiposApoyo: raw.liberacion.equiposApoyo,
    };
  }
}
