import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import { 
  Home2Outlined, 
  CalendarDaysOutlined, 
  HeartOutlined, 
  User4Outlined, 
  Comment1Outlined,
  StarFatOutlined,
  SlidersHorizontalSquare2Outlined
} from '@lineiconshq/free-icons';

@Component({
  selector: 'app-tourist-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LineiconsComponent
  ],
  templateUrl: './tourist-layout.html',
  styleUrl: './tourist-layout.css'
})
export class TouristLayout {
  readonly Home2Outlined = Home2Outlined;
  readonly CalendarDaysOutlined = CalendarDaysOutlined;
  readonly HeartOutlined = HeartOutlined;
  readonly User4Outlined = User4Outlined;
  readonly Comment1Outlined = Comment1Outlined;
  readonly StarFatOutlined = StarFatOutlined;
  readonly SlidersHorizontalSquare2Outlined = SlidersHorizontalSquare2Outlined;
  }
