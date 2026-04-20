import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import type ApexCharts from 'apexcharts';
import { initFlowbite } from 'flowbite';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  DashboardSquare1Outlined,
  BoxClosedOutlined,
  CalendarDaysOutlined,
  Comment1Outlined,
  StarFatOutlined,
  User4Outlined,
  DollarOutlined,
  CalendarDaysStroke,
  EyeOutlined,
} from '@lineiconshq/free-icons';

interface DashboardStat {
  icon: string;
  value: string;
  label: string;
  trend: string;
}

interface IncomingBooking {
  customer: string;
  room: string;
  dateRange: string;
  guests: string;
  amount: string;
  status: 'Confirmed' | 'Pending';
}

interface Review {
  customer: string;
  text: string;
  ago: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [LineiconsComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit, OnDestroy {
  private salesChart: ApexCharts | null = null;

  starFatOutlined = StarFatOutlined;
  dollarOutlined = DollarOutlined;
  calendarDaysStroke = CalendarDaysStroke;
  eyeOutlined = EyeOutlined;

  stats: DashboardStat[] = [
    { icon: '$', value: '$8,240', label: 'Total Earnings', trend: '+14.2%' },
    { icon: 'cal', value: '12', label: 'Active Bookings', trend: '+3' },
    { icon: 'eye', value: '486', label: 'Profile Views', trend: '+22%' },
    { icon: 'star', value: '4.8', label: 'Avg. Rating', trend: '+0.1' },
  ];

  bookings: IncomingBooking[] = [
    {
      customer: 'Sarah Mitchell',
      room: 'Dar El Medina — Deluxe Room',
      dateRange: 'Mar 15–17',
      guests: '2 guests',
      amount: '$170',
      status: 'Confirmed',
    },
    {
      customer: 'James Laurent',
      room: 'Dar El Medina — Suite',
      dateRange: 'Mar 18–20',
      guests: '1 guest',
      amount: '$240',
      status: 'Pending',
    },
    {
      customer: 'Amina Khelifi',
      room: 'Dar El Medina — Standard',
      dateRange: 'Mar 22–23',
      guests: '2 guests',
      amount: '$85',
      status: 'Confirmed',
    },
  ];

  reviews: Review[] = [
    {
      customer: 'Marco R.',
      text: 'Absolutely stunning riad. The host was incredibly welcoming.',
      ago: '2 days ago',
    },
    {
      customer: 'Nina P.',
      text: 'Great location and breakfast. Room could be a bit bigger.',
      ago: '5 days ago',
    },
  ];

  ngAfterViewInit(): void {
    void this.renderSalesChart();
    initFlowbite();
  }

  ngOnDestroy(): void {
    this.salesChart?.destroy();
    this.salesChart = null;
  }

  private async renderSalesChart(): Promise<void> {
    const chartContainer = document.getElementById('provider-sales-chart');
    if (!chartContainer) {
      return;
    }

    this.salesChart?.destroy();
    const { default: ApexChartsLib } = await import('apexcharts');

    this.salesChart = new ApexChartsLib(chartContainer, {
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
        borderColor: '#cbd5e1',
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
      series: [
        {
          name: 'Sales',
          data: [1000, 1260, 1080, 1600, 1360, 1960],
        },
      ],
      xaxis: {
        categories: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
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
        max: 2000,
        tickAmount: 4,
        labels: {
          formatter: (value: number) => `${Math.round(value)}`,
          style: {
            colors: '#64748b',
            fontSize: '12px',
            fontWeight: '500',
          },
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${Math.round(value)}`,
        },
      },
      colors: ['#60A5FA'],
      legend: { show: false },
    });

    this.salesChart.render();
  }
}
