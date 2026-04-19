import { Component } from '@angular/core';
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
export class Dashboard {
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
}
