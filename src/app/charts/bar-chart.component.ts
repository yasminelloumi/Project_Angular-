import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartOptions, registerables } from 'chart.js';
import { ChartData } from 'Modeles/chart-data';

Chart.register(...registerables);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-wrapper">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .chart-wrapper canvas {
      width: 100% !important;
      height: 100% !important;
    }
  `]
})
export class BarChartComponent implements OnInit, OnChanges {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() data!: ChartData;
  @Input() options: ChartOptions = {};

  private chart: Chart | null = null;

  ngOnInit(): void {
    if (this.data) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
  }

  private createChart(): void {
    setTimeout(() => {
      if (this.chartCanvas) {
        const ctx = this.chartCanvas.nativeElement.getContext('2d');
        if (ctx) {
          this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: this.data.labels,
              datasets: this.data.datasets
            },
            options: {
              ...this.options,
              animation: {
                duration: 1000,
                easing: 'easeOutCubic',
              }
            }
          });
        }
      }
    });
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.data.labels = this.data.labels;
      this.chart.data.datasets = this.data.datasets;
      this.chart.update();
    } else {
      this.createChart();
    }
  }
}
