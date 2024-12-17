import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Venta } from 'src/app/models/venta';
import { VentaService } from 'src/app/services/venta.service';
import { ProductoService } from 'src/app/services/producto.service';  // Import the product service
import { Producto } from 'src/app/models/producto';  // Assuming Producto model exists

@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
  styleUrls: ['./crear-venta.component.css']
})
export class CrearVentaComponent implements OnInit {
  ventaForm: FormGroup;
  titulo = 'Crear Venta';
  id: string | null;
  productos: Producto[] = []; // List of products to be selected in the form

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _ventaService: VentaService,
    private _productoService: ProductoService,  // Inject the product service
    private aRouter: ActivatedRoute
  ) {
    this.ventaForm = this.fb.group({
      producto: ['', Validators.required], // ID del producto
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.cargarProductos(); // Load products when the component is initialized
    this.esEditar();
  }

  cargarProductos() {
    this._productoService.getProductos().subscribe(
      (productos: Producto[]) => {
        this.productos = productos;
      },
      (error: any) => {
        console.error('Error loading products:', error);
        this.toastr.error('No se pudieron cargar los productos', 'Error');
      }
    );
  }
  
  agregarVenta() {
    const VENTA: Venta = {
      producto: this.ventaForm.get('producto')?.value, // Get selected product ID
      cantidad: this.ventaForm.get('cantidad')?.value,
      costoTotal: 0 // Calculate this based on the selected product price
    };

    console.log(VENTA);

    if (this.id !== null) {
      // Editar venta
      this._ventaService.actualizarVenta(this.id, VENTA).subscribe(
        (data) => {
          this.toastr.info('La venta fue actualizada con éxito!', 'Venta Actualizada!');
          this.router.navigate(['/']);
        },
        (error) => {
          console.log(error);
          this.ventaForm.reset();
        }
      );
    } else {
      // Crear venta
      this._ventaService.guardarVenta(VENTA).subscribe(
        (data) => {
          this.toastr.success('La venta fue registrada con éxito!', 'Venta Registrada!');
          this.router.navigate(['/']);
        },
        (error) => {
          console.log(error);
          this.ventaForm.reset();
        }
      );
    }
  }

  esEditar() {
    if (this.id !== null) {
      this.titulo = 'Editar Venta';
      this._ventaService.obtenerVenta(this.id).subscribe((data) => {
        this.ventaForm.setValue({
          producto: data.producto._id, // ID del producto relacionado
          cantidad: data.cantidad
        });
      });
    }
  }
}
