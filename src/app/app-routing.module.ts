import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CrearProductoComponent } from './components/crear-producto/crear-producto.component';
import { CrearVentaComponent } from './components/crear-venta/crear-venta.component';

const routes: Routes = [
  // Ruta principal que muestra los dos componentes al mismo tiempo
  { path: '', component: DashboardComponent },

  // Rutas de productos
  { path: 'crear-producto', component: CrearProductoComponent },
  { path: 'editar-producto/:id', component: CrearProductoComponent },

  // Rutas de ventas
  { path: 'crear-venta', component: CrearVentaComponent },
  { path: 'editar-venta/:id', component: CrearVentaComponent },

  // Redirección en caso de ruta inválida
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
