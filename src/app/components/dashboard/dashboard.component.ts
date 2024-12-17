import { Component, OnInit } from '@angular/core';
import { VentaService } from 'src/app/services/venta.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalVentas: number = 0;
  resumenVentas: any[] = []; // Datos de ventas diarias
  resumenHoras: any[] = []; // Datos de ventas por hora
  chart: any; // Gráfico de ventas diarias
  chartHoras: any; // Gráfico de ventas por hora

  constructor(private _ventaService: VentaService) {}

  ngOnInit(): void {
    this.cargarResumenVentas(); // Cargar datos al iniciar el componente
  }

  // Cargar resumen de ventas diarias
  cargarResumenVentas() {
    this._ventaService.obtenerResumen().subscribe((data) => {
      this.resumenVentas = data;

      // Asignar el total de ventas
      this.totalVentas = data.length > 0 ? data[0].totalVentas : 0;

      // Generar la gráfica de ventas diarias
      this.generarGraficoVentasDiarias();
    });
  }

  // Generar el gráfico de ventas diarias (NO SE MODIFICA)
  generarGraficoVentasDiarias() {
    const fechas = this.resumenVentas.map((venta) => {
      const [year, month, day] = venta._id.split('-');
      const fecha = new Date(Number(year), Number(month) - 1, Number(day));
      return new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(fecha);
    });

    const totales = this.resumenVentas.map((venta) => venta.totalVentas);

    const canvas = document.getElementById('ventasDiarias') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: fechas,
        datasets: [
          {
            label: 'Ventas Diarias',
            data: totales,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
        },
        plugins: {
          legend: { display: true, position: 'top' },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index; // Índice de la barra clicada
            const fechaSeleccionada = this.resumenVentas[index]._id; // Obtener la fecha
            this.cargarVentasPorHora(fechaSeleccionada); // Cargar ventas por hora
          }
        },
      },
    });
  }

  // Cargar las ventas por hora (FILTRAR localmente)
  cargarVentasPorHora(fechaSeleccionada: string) {
    this._ventaService.obtenerVentasPorHora().subscribe((data) => {
      // Filtrar ventas solo de la fecha seleccionada
      this.resumenHoras = data.filter((venta: any) => venta._id.fecha === fechaSeleccionada);

      // Generar el gráfico de ventas por hora
      this.generarGraficoVentasPorHora();
    });
  }

  // Generar el gráfico de ventas por hora
  generarGraficoVentasPorHora() {
    const horas = this.resumenHoras.map((venta) => `${venta._id.hora}:00`);
    const totales = this.resumenHoras.map((venta) => venta.totalVentas);

    const canvas = document.getElementById('ventasPorHora') as HTMLCanvasElement;

    if (this.chartHoras) {
      this.chartHoras.destroy(); // Limpiar gráfico anterior
    }

    this.chartHoras = new Chart(canvas.getContext('2d')!, {
      type: 'line',
      data: {
        labels: horas, // Horas del día
        datasets: [
          {
            label: 'Ventas por Hora',
            data: totales,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.4, // Línea suavizada
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Total Ventas (S/)' },
          },
          x: {
            title: { display: true, text: 'Hora del Día' },
          },
        },
        plugins: {
          legend: { display: true, position: 'top' },
        },
      },
    });
  }
}

