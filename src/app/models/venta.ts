import { Producto } from "./producto";

export class Venta {
    _id?: number;
    producto: Producto; // Instancia de la clase Producto
    cantidad: number;
    costoTotal: number;
    fechaVenta?: Date;

    constructor(producto: Producto, cantidad: number, costoTotal: number, fechaVenta?: Date) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.costoTotal = costoTotal;
        this.fechaVenta = fechaVenta || new Date();
    }
}
