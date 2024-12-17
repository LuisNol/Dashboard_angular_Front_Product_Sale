import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  url = 'http://localhost:4000/api/ventas/';

  constructor(private http: HttpClient) { }

  // Obtener todas las ventas
  getVentas(): Observable<any> {
    return this.http.get(this.url);
  }

  // Eliminar una venta
  eliminarVenta(id: string): Observable<any> {
    return this.http.delete(this.url + id);
  }

  // Guardar una nueva venta
  guardarVenta(venta: Venta): Observable<any> {
    return this.http.post(this.url + 'crear', venta);
  }

  // Obtener una venta específica
  obtenerVenta(id: string): Observable<any> {
    return this.http.get(this.url + id);
  }

  // Actualizar una venta existente
  actualizarVenta(id: string, venta: Venta): Observable<any> {
    return this.http.put(this.url + id, venta);
  }
  
   // Obtener resumen de ventas
   obtenerResumen(): Observable<any> {
    return this.http.get(this.url + 'resumen');
  }

  obtenerVentasPorHora(): Observable<any> {
    return this.http.get(this.url + 'resumenH');
  }
}
