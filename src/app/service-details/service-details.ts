import { Component } from '@angular/core';
import { Navbar } from '../public-layout/navbar/navbar';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  MapMarker5Outlined,
  StarFatSolid,
  HeartOutlined,
  CheckOutlined,
  StopwatchOutlined,
  User4Outlined,
  Shield2Outlined,
} from '@lineiconshq/free-icons';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-service-details',
  imports: [Navbar, Footer, LineiconsComponent],
  templateUrl: './service-details.html',
  styleUrl: './service-details.css',
})
export class ServiceDetails {
  MapMarker5Outlined = MapMarker5Outlined;
  StarFatSolid = StarFatSolid;
  HeartOutlined = HeartOutlined;
  CheckOutlined = CheckOutlined;
  StopwatchOutlined = StopwatchOutlined;
  User4Outlined = User4Outlined;
  Shield2Outlined = Shield2Outlined;
}
