import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  DashboardSquare1Outlined,
  BoxClosedOutlined,
  CalendarDaysOutlined,
  Comment1Outlined,
  StarFatOutlined,
  User4Outlined,
} from '@lineiconshq/free-icons';

@Component({
  selector: 'app-provider-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LineiconsComponent],
  templateUrl: './provider-layout.html',
  styleUrl: './provider-layout.css',
})
export class ProviderLayout {
  dashboardSquare1Outlined = DashboardSquare1Outlined;
  boxClosedOutlined = BoxClosedOutlined;
  calendarDaysOutlined = CalendarDaysOutlined;
  comment1Outlined = Comment1Outlined;
  starFatOutlined = StarFatOutlined;
  user4Outlined = User4Outlined;
}
