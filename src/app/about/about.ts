import { Component } from '@angular/core';
import { Navbar } from '../public-layout/navbar/navbar';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  MapMarker5Outlined,
  Shield2Outlined,
  HeartOutlined,
  Globe1Outlined,
  Bolt3Solid,
  Bolt3Outlined,
  LinkedinOutlined,
  GithubOutlined,
} from '@lineiconshq/free-icons';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-about',
  imports: [Navbar, LineiconsComponent, Footer],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  MapMarker5Outlined = MapMarker5Outlined;
  Shield2Outlined = Shield2Outlined;
  HeartOutlined = HeartOutlined;
  Globe1Outlined = Globe1Outlined;
  Bolt3Solid = Bolt3Solid;
  Bolt3Outlined = Bolt3Outlined;
  LinkedinOutlined = LinkedinOutlined;
  GithubOutlined = GithubOutlined;
}
