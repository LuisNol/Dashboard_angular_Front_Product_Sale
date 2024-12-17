import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Venta } from 'src/app/models/venta';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'app-listar-ventas',
  templateUrl: './listar-ventas.component.html',
  styleUrls: ['./listar-ventas.component.css']
})
export class ListarVentasComponent implements OnInit {
  listVentas: Venta[] = [];

  constructor(private _ventaService: VentaService,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.obtenerVentas();
  }

  obtenerVentas() {
    this._ventaService.getVentas().subscribe(data => {
      console.log(data);
      this.listVentas = data;
    }, error => {
      console.log(error);
    });
  }

  eliminarVenta(id: any) {
    this._ventaService.eliminarVenta(id).subscribe(data => {
      this.toastr.error('La venta fue eliminada con éxito', 'Venta Eliminada');
      this.obtenerVentas();
    }, error => {
      console.log(error);
    });
  }
}

