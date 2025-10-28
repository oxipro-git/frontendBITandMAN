import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-notificacion-dialog',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    animations: [
        trigger('fadeInScale', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.7)' }),
                animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
            ])
        ])
    ],
    template: `
    <div class="overlay">
        <div class="dialog-container" [ngClass]="data.tipo" @fadeInScale>
            <div class="icono">
            <span *ngIf="data.tipo === 'success'">✅</span>
            <span *ngIf="data.tipo === 'error'">❌</span>
            <span *ngIf="data.tipo === 'warning'">⚠️</span>
        </div>
        <div class="titulo">{{ obtenerTitulo() }}</div>
        <div class="mensaje">{{ data.mensaje }}</div>

        <button mat-raised-button color="primary" (click)="cerrar()">Aceptar</button>
      </div>
    </div>
  `,
    styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0,0,0,0.3);
      backdrop-filter: blur(6px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2000;
    }
    .dialog-container {
      text-align: center;
      padding: 30px 25px;
      border-radius: 18px;
      width: 350px;
      box-shadow: 0 6px 25px rgba(0,0,0,0.25);
      background-color: white;
      animation: pop 0.3s ease-out;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .icono {
      font-size: 3.8rem;
      margin-bottom: 10px;
    }
    .titulo {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .mensaje {
      font-size: 1rem;
      margin-bottom: 20px;
    }
    .dialog-container.success {
      border-top: 6px solid #2e7d32;
    }
    .dialog-container.error {
      border-top: 6px solid #c62828;
    }
    .dialog-container.warning {
      border-top: 6px solid #f9a825;
    }
  `]
})
export class NotificacionDialogComponent implements OnInit {
    private audio: HTMLAudioElement | null = null;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { mensaje: string; tipo: 'success' | 'error' | 'warning' },
        private dialogRef: MatDialogRef<NotificacionDialogComponent>
    ) { }

    ngOnInit() {
        this.reproducirSonido();
        setTimeout(() => this.cerrar(), 3000); // ⏱️ Autocierre en 3 segundos
    }

    reproducirSonido() {
        let sonido = '';
        switch (this.data.tipo) {
            case 'success':
                sonido = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
                break;
            case 'error':
                sonido = 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg';
                break;
            case 'warning':
                sonido = 'https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg';
                break;
        }
        this.audio = new Audio(sonido);
        this.audio.volume = 0.4;
        this.audio.play().catch(() => { }); // Evita error si el usuario tiene bloqueo de autoplay
    }

    obtenerTitulo(): string {
        switch (this.data.tipo) {
            case 'success': return '¡Operación exitosa!';
            case 'error': return 'Error al guardar';
            case 'warning': return 'Campos obligatorios';
            default: return '';
        }
    }

    cerrar() {
        this.dialogRef.close();
    }
}
