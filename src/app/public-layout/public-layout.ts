import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  Buildings1Solid,
  KnifeFork1Solid,
  MapMarker5Solid,
  Car2Solid,
  Search1Outlined,
  MapMarker5Outlined,
  StarFatSolid,
  HeartOutlined,
  Bolt3Solid,
} from '@lineiconshq/free-icons';

@Component({
  selector: 'app-public-layout',
  imports: [Navbar, LineiconsComponent],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {
  Buildings1Solid = Buildings1Solid;
  KnifeFork1Solid = KnifeFork1Solid;
  MapMarker5Solid = MapMarker5Solid;
  Car2Solid = Car2Solid;
  Search1Outlined = Search1Outlined;
  MapMarker5Outlined = MapMarker5Outlined;
  StarFatSolid = StarFatSolid;
  HeartOutlined = HeartOutlined;
  Bolt3Solid = Bolt3Solid;

  year = new Date().getFullYear();
}
