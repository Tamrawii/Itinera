import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, LineiconsComponent],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  dashboardSquare1BulkOutlined = DashboardSquare1Outlined;
  boxClosedOutlined = BoxClosedOutlined;
  calendarDaysOutlined = CalendarDaysOutlined;
  comment1Outlined = Comment1Outlined;
  starFatOutlined = StarFatOutlined;
  user4Outlined = User4Outlined;
  dollarOutlined = DollarOutlined;
  calendarDaysStroke = CalendarDaysStroke;
  eyeOutlined = EyeOutlined;
}
