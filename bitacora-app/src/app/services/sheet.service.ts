import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroGeneral } from '../models/registro-general.model';
// 👈 IMPORTAR el archivo config
import { config } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class SheetService {

  // Construyes la URL usando la constante importada.
  // **ATENCIÓN:** El endpoint completo debe ser: URL_BASE + /guardar/bitacora/
  private readonly apiUrl = `${config.apiUrl}/guardar/bitacora/`;

  constructor(private http: HttpClient) {}

  guardarRegistro(data: RegistroGeneral): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  obtenerRegistros(): Observable<RegistroGeneral[]> {
    return this.http.get<RegistroGeneral[]>(this.apiUrl);
  }
}