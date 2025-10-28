import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionDialogComponent } from '../../shared/notificacion-dialog/notificacion-dialog.component';

// 🧩 Subcomponentes
import { FormularioComponent } from '../formulario/formulario.component';
import { AlistamientoComponent } from '../alistamiento/alistamiento.component';
import { TerceroComponent } from '../tercero/tercero.component';

// 🧩 Servicio y modelo
import { SheetService } from '../../services/sheet.service';
import { RegistroGeneral as Registro } from '../../models/registro-general.model';

@Component({
  selector: 'app-plantilla-general',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatButtonModule,
    FormularioComponent,
    AlistamientoComponent,
    TerceroComponent,
  ],
  templateUrl: './plantilla-general.component.html',
  styleUrls: ['./plantilla-general.component.css'],
})
export class PlantillaGeneralComponent {
  formGeneral: FormGroup;
  tecnicos = ['BSGARCIA', 'JBUENO', 'MVARGAS', 'SARIAS'];

  @ViewChild(FormularioComponent) formularioComp?: FormularioComponent;
  @ViewChild(AlistamientoComponent) alistamientoComp?: AlistamientoComponent;
  @ViewChild(TerceroComponent) terceroComp?: TerceroComponent;

  constructor(private fb: FormBuilder, private sheetService: SheetService, private dialog: MatDialog) {
    this.formGeneral = this.fb.group({
      fecha: [{ value: this.obtenerFechaActual(), disabled: true }],
      tecnico: ['', Validators.required],
      cantidadEquipos: [null, Validators.required],
      numeroRemisionEquipos: [null, Validators.required],
      numeroRemisionEquiposSalida: [null, Validators.required],
      ayudaOtroTecnico: [false],
      nombreOtroTecnico: [{ value: '', disabled: true }, Validators.required],
      mostrarMantenimiento: [false],
      mostrarAlistamiento: [false],
      mostrarTercero: [false],
      liberaRepuestos: [false],
      numeroRemisionRepuestos: [{ value: null, disabled: true }],
    });

    // 🔄 Control dinámico para liberar repuestos
    this.formGeneral.get('liberaRepuestos')?.valueChanges.subscribe((value) => {
      const campoRemision = this.formGeneral.get('numeroRemisionRepuestos');
      if (value) {
        campoRemision?.enable();
        campoRemision?.setValidators([Validators.required]);
      } else {
        campoRemision?.disable();
        campoRemision?.clearValidators();
        campoRemision?.reset();
      }
      campoRemision?.updateValueAndValidity();
    });
    //////////////////////////////////////////////////////////
    this.formGeneral.get('ayudaOtroTecnico')?.valueChanges.subscribe((value) => {
      const campoNombre = this.formGeneral.get('nombreOtroTecnico');
      if (value) {
        campoNombre?.enable();
        campoNombre?.setValidators([Validators.required]);
      } else {
        campoNombre?.disable();
        campoNombre?.clearValidators();
        campoNombre?.reset();
      }
      campoNombre?.updateValueAndValidity();
    });
    //////////////////////////////////////////////////////////////
  }

  obtenerFechaActual(): string {
    const hoy = new Date();
    return hoy.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private safeGetChildData(child: any): any | null {
    if (!child) return null;
    if (typeof child.getFormData === 'function') {
      try {
        return child.getFormData();
      } catch (e) {
        console.warn('Error llamando getFormData() en componente hijo', e);
        return null;
      }
    }
    if (child.form && typeof child.form.getRawValue === 'function') {
      return child.form.getRawValue();
    }
    return null;
  }

  // 🧩 Mapeos individuales
  private mapearAlistamiento(data: any) {
    return {
      a_alarmaCero: data.alarmaCero,
      a_flujoMaximo: data.flujoMaximo,
      a_desconexion: data.desconexion,
      a_marcaCalor: data.marcaCalor,
      a_cantidadMarcaCalor: data.cantidadMarcaCalor,
      a_i_equiposVerificados: data.i_equiposVerificados,
      a_i_horaInicio: data.i_horaInicio,
      a_i_horaFin: data.i_horaFin,
      a_i_equiposApoyo: data.i_equiposApoyo,
      a_l_equiposVerificados: data.l_equiposVerificados,
      a_l_horaInicio: data.l_horaInicio,
      a_l_horaFin: data.l_horaFin,
      a_l_equiposApoyo: data.l_equiposApoyo,
      a_p_equiposVerificados: data.p_equiposVerificados,
      a_p_horaInicio: data.p_horaInicio,
      a_p_horaFin: data.p_horaFin,
      a_p_equiposApoyo: data.p_equiposApoyo,
      a_li_equiposVerificados: data.li_equiposVerificados,
      a_li_horaInicio: data.li_horaInicio,
      a_li_horaFin: data.li_horaFin,
      a_li_equiposApoyo: data.li_equiposApoyo,
    };
  }

  private mapearMantenimiento(data: any) {
    return {
      m_realizaReparacion: data.realizaReparacion,
      m_s_equiposVerificados: data.s_equiposVerificados,
      m_s_horaInicio: data.s_horaInicio,
      m_s_horaFin: data.s_horaFin,
      m_s_equiposApoyo: data.s_equiposApoyo,
      m_i_equiposVerificados: data.i_equiposVerificados,
      m_i_horaInicio: data.i_horaInicio,
      m_i_horaFin: data.i_horaFin,
      m_i_equiposApoyo: data.i_equiposApoyo,
      m_l_equiposVerificados: data.l_equiposVerificados,
      m_l_horaInicio: data.l_horaInicio,
      m_l_horaFin: data.l_horaFin,
      m_l_equiposApoyo: data.l_equiposApoyo,
      m_p_equiposVerificados: data.p_equiposVerificados,
      m_p_horaInicio: data.p_horaInicio,
      m_p_horaFin: data.p_horaFin,
      m_p_equiposApoyo: data.p_equiposApoyo,
      m_r_equiposIngresados: data.r_equiposIngresados,
      m_r_equiposReparados: data.r_equiposReparados,
      m_r_horaInicio: data.r_horaInicio,
      m_r_horaFin: data.r_horaFin,
      m_r_equiposApoyo: data.r_equiposApoyo,
      m_te_equiposVerificados: data.ter_equiposLiberados,
      m_te_horaInicio: data.ter_horaInicio,
      m_te_horaFin: data.ter_horaFin,
      m_li_equiposLiberados: data.li_equiposLiberados,
      m_li_horaInicio: data.li_horaInicio,
      m_li_horaFin: data.li_horaFin,
      m_li_equiposApoyo: data.li_equiposApoyo,
    };
  }

  private mapearTercero(data: any) {
    return {
      t_s_equiposVerificados: data.s_equiposVerificados,
      t_s_horaInicio: data.s_horaInicio,
      t_s_horaFin: data.s_horaFin,
      t_s_equiposApoyo: data.s_equiposApoyo,
      t_i_equiposVerificados: data.i_equiposVerificados,
      t_i_horaInicio: data.i_horaInicio,
      t_i_horaFin: data.i_horaFin,
      t_i_equiposApoyo: data.i_equiposApoyo,
      t_l_equiposVerificados: data.l_equiposVerificados,
      t_l_horaInicio: data.l_horaInicio,
      t_l_horaFin: data.l_horaFin,
      t_l_equiposApoyo: data.l_equiposApoyo,
      t_p_equiposVerificados: data.p_equiposVerificados,
      t_p_horaInicio: data.p_horaInicio,
      t_p_horaFin: data.p_horaFin,
      t_p_equiposApoyo: data.p_equiposApoyo,
      t_li_equiposLiberados: data.li_equiposLiberados,
      t_li_horaInicio: data.li_horaInicio,
      t_li_horaFin: data.li_horaFin,
      t_li_equiposApoyo: data.li_equiposApoyo,
      t_te_equiposVerificados: data.te_equiposVerificados,
      t_te_horaInicio: data.te_horaInicio,
      t_te_horaFin: data.te_horaFin,
    };
  }

  private mapearAFormatoBackend(datos: any): Registro {
    const { generales, mantenimiento, alistamiento, tercero } = datos;
    return {
      g_fecha: generales.fecha,
      g_tecnico: generales.tecnico,
      g_cantidadEquipos: generales.cantidadEquipos,
      g_numeroRemisionEquipos: generales.numeroRemisionEquipos,
      g_numeroRemisionEquiposSalida: generales.numeroRemisionEquiposSalida,
      g_liberaRepuestos: generales.liberaRepuestos,
      g_numeroRemisionRepuestos: generales.numeroRemisionRepuestos,
      g_mostrarAlistamiento: generales.mostrarAlistamiento,
      g_mostrarMantenimiento: generales.mostrarMantenimiento,
      g_mostrarTercero: generales.mostrarTercero,
      g_ayudaOtroTecnico: generales.ayudaOtroTecnico,
      g_nombreOtroTecnico: generales.nombreOtroTecnico,
      ...this.mapearAlistamiento(alistamiento),
      ...this.mapearMantenimiento(mantenimiento),
      ...this.mapearTercero(tercero),
    };
  }

    prevenirScrollEnNumber(event: WheelEvent) {
    const target = event.target as HTMLInputElement;
    // Solo si es input tipo number y está enfocado
    if (target.type === 'number' && document.activeElement === target) {
      event.preventDefault();
    }
  }

  guardar() {
    if (this.formGeneral.invalid) {
      this.mostrarNotificacion('⚠️ Completa todos los campos obligatorios.', 'warning');
      return;
    }

    const datosGenerales = this.formGeneral.getRawValue();
    const resultado = {
      generales: datosGenerales,
      mantenimiento: datosGenerales.mostrarMantenimiento ? this.safeGetChildData(this.formularioComp) : {},
      alistamiento: datosGenerales.mostrarAlistamiento ? this.safeGetChildData(this.alistamientoComp) : {},
      tercero: datosGenerales.mostrarTercero ? this.safeGetChildData(this.terceroComp) : {},
    };

    const registro = this.mapearAFormatoBackend(resultado);

    this.sheetService.guardarRegistro(registro).subscribe({
      next: () => {
        this.mostrarNotificacion('✅ Datos guardados correctamente.', 'success');
        this.formGeneral.reset();
        this.formularioComp?.form.reset();
        this.alistamientoComp?.form.reset();
        this.terceroComp?.form.reset();
        this.formGeneral.get('fecha')?.setValue(this.obtenerFechaActual());
        this.formGeneral.get('fecha')?.disable();
      },
      error: (err) => {
        console.error('❌ Error al guardar registro', err);
        this.mostrarNotificacion('❌ Error al guardar los datos. Intenta nuevamente.', 'error');
      },
    });
  }

  // 💬 Nueva función de diálogo centrado
  mostrarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'warning') {
    this.dialog.open(NotificacionDialogComponent, {
      data: { mensaje, tipo },
      disableClose: true,
      width: '400px',
      panelClass: 'dialog-centrado',
    });
  }
}
