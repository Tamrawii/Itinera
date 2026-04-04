import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  Buildings1Outlined,
  KnifeFork1Outlined,
  Car2Solid,
  Search1Outlined,
  Home2Outlined,
  MapMarker5Outlined,
  StarFatSolid,
  HeartOutlined,
  Bolt3Solid,
} from '@lineiconshq/free-icons';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-public-layout',
  imports: [Navbar, LineiconsComponent, Footer],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {
  Buildings1Outlined = Buildings1Outlined;
  KnifeFork1Outlined = KnifeFork1Outlined;
  Car2Solid = Car2Solid;
  Search1Outlined = Search1Outlined;
  MapMarker5Outlined = MapMarker5Outlined;
  StarFatSolid = StarFatSolid;
  HeartOutlined = HeartOutlined;
  Bolt3Solid = Bolt3Solid;
  Home2Outlined = Home2Outlined;
}
