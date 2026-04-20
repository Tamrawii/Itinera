import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import type ApexCharts from 'apexcharts';
import { initFlowbite } from 'flowbite';

interface BookingRow {
  id: string;
  customer: string;
  service: string;
  amount: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

@Component({
  selector: 'app-overview',
  imports: [],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview implements AfterViewInit, OnDestroy {
  private revenueChart: ApexCharts | null = null;
  private weeklyBookingsChart: ApexCharts | null = null;

  bookings: BookingRow[] = [
    {
      id: 'BK-1042',
      customer: 'Sarah Mitchell',
      service: 'Dar El Medina',
      amount: '$170',
      status: 'Confirmed',
    },
    {
      id: 'BK-1041',
      customer: 'James Laurent',
      service: 'Sahara Desert Trek',
      amount: '$240',
      status: 'Pending',
    },
    {
      id: 'BK-1040',
      customer: 'Amina Khelifi',
      service: 'Medina Walking Tour',
      amount: '$50',
      status: 'Confirmed',
    },
    {
      id: 'BK-1039',
      customer: 'Marco Rossi',
      service: 'Le Pirate',
      amount: '$70',
      status: 'Cancelled',
    },
  ];

  ngAfterViewInit(): void {
    void this.renderRevenueChart();
    void this.renderWeeklyBookingsChart();
    initFlowbite();
  }

  ngOnDestroy(): void {
    this.revenueChart?.destroy();
    this.weeklyBookingsChart?.destroy();
    this.revenueChart = null;
    this.weeklyBookingsChart = null;
  }

  private async renderRevenueChart(): Promise<void> {
    const chartContainer = document.getElementById('admin-revenue-chart');
    if (!chartContainer) {
      return;
    }

    this.revenueChart?.destroy();

    const { default: ApexChartsLib } = await import('apexcharts');

    this.revenueChart = new ApexChartsLib(chartContainer, {
      chart: {
        type: 'area',
        height: 260,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
        sparkline: { enabled: false },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['#60A5FA'],
      },
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.35,
          opacityTo: 0.08,
          shadeIntensity: 1,
          gradientToColors: ['#60A5FA'],
          stops: [0, 100],
        },
      },
      dataLabels: { enabled: false },
      grid: {
        show: true,
        strokeDashArray: 4,
        borderColor: '#dbe2ea',
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
      series: [
        {
          name: 'Revenue',
          data: [3200, 4100, 3900, 5200, 4900, 6100, 5800],
        },
      ],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '12px',
            fontWeight: '600',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 8000,
        tickAmount: 4,
        labels: {
          formatter: (value: number) => `${Math.round(value)}`,
          style: {
            colors: '#64748b',
            fontSize: '12px',
            fontWeight: '600',
          },
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => `$${value.toLocaleString()}`,
        },
      },
      colors: ['#60A5FA'],
      legend: { show: false },
    });

    this.revenueChart.render();
  }

  private async renderWeeklyBookingsChart(): Promise<void> {
    const chartContainer = document.getElementById('admin-weekly-bookings-chart');
    if (!chartContainer) {
      return;
    }

    this.weeklyBookingsChart?.destroy();
    const { default: ApexChartsLib } = await import('apexcharts');

    this.weeklyBookingsChart = new ApexChartsLib(chartContainer, {
      chart: {
        type: 'bar',
        height: 260,
        toolbar: { show: false },
        fontFamily: 'Inter, sans-serif',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
        },
      },
      dataLabels: { enabled: false },
      grid: {
        show: true,
        strokeDashArray: 4,
        borderColor: '#dbe2ea',
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
      series: [
        {
          name: 'Bookings',
          data: [12, 19, 15, 22, 28, 35, 30],
        },
      ],
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '12px',
            fontWeight: '600',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        min: 0,
        max: 36,
        tickAmount: 4,
        labels: {
          formatter: (value: number) => `${Math.round(value)}`,
          style: {
            colors: '#64748b',
            fontSize: '12px',
            fontWeight: '600',
          },
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${Math.round(value)} bookings`,
        },
      },
      colors: ['#3b82f6'],
      legend: { show: false },
    });

    this.weeklyBookingsChart.render();
  }
}
