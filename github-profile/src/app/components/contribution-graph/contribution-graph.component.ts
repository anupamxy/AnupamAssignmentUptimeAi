import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContributionDay } from '../../models/github.models';
import * as echarts from 'echarts';

@Component({
  selector: 'app-contribution-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contribution-graph.component.html',
  styleUrl: './contribution-graph.component.scss'
})
export class ContributionGraphComponent implements OnChanges, AfterViewInit {
  @Input() contributions: ContributionDay[] = [];
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  private chart: echarts.ECharts | null = null;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    if (this.contributions.length > 0) {
      this.renderChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contributions'] && this.viewReady) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    if (!this.chartContainer || this.contributions.length === 0) return;

    if (this.chart) {
      this.chart.dispose();
    }

    this.chart = echarts.init(this.chartContainer.nativeElement);

    const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
    const data: [number, number, number][] = [];

    let weekIndex = 0;
    const startDate = new Date(this.contributions[0].date);

    this.contributions.forEach((day) => {
      const d = new Date(day.date);
      const dayOfWeek = d.getDay();
      const diffTime = d.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      weekIndex = Math.floor(diffDays / 7);
      data.push([weekIndex, dayOfWeek, day.count]);
    });

    const maxWeek = data.reduce((max, d) => Math.max(max, d[0]), 0);

    const monthLabels: { pos: number; label: string }[] = [];
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    let lastMonth = -1;

    this.contributions.forEach((day) => {
      const d = new Date(day.date);
      const month = d.getMonth();
      if (month !== lastMonth && d.getDay() === 0) {
        const diffDays = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const wi = Math.floor(diffDays / 7);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthLabels.push({ pos: wi, label: monthNames[month] });
        lastMonth = month;
      }
    });

    const xLabels = Array.from({ length: maxWeek + 1 }, (_, i) => {
      const found = monthLabels.find(m => m.pos === i);
      return found ? found.label : '';
    });

    const option: echarts.EChartsOption = {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const val = params.data;
          if (!val) return '';
          const idx = val[0] * 7 + val[1];
          const date = idx < this.contributions.length ? this.contributions[idx].date : '';
          return `<strong>${val[2]} contributions</strong><br/>${date}`;
        }
      },
      grid: {
        top: 20,
        bottom: 4,
        left: 30,
        right: 10,
        containLabel: false
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#656d76',
          fontSize: 10,
          interval: 0,
          formatter: (value: string) => value
        }
      },
      yAxis: {
        type: 'category',
        data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#656d76',
          fontSize: 10,
          interval: 1
        }
      },
      visualMap: {
        show: false,
        min: 0,
        max: 20,
        inRange: {
          color: colors
        }
      },
      series: [{
        type: 'heatmap',
        data: data,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2,
          borderRadius: 2
        },
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1
          }
        }
      }]
    };

    this.chart.setOption(option);

    const resizeObserver = new ResizeObserver(() => {
      this.chart?.resize();
    });
    resizeObserver.observe(this.chartContainer.nativeElement);
  }
}
