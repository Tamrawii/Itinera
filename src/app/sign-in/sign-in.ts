import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LineiconsComponent } from '@lineiconshq/angular-lineicons';
import {
  AppleBrandOutlined,
  Envelope1Outlined,
  EyeOutlined,
  EyeSolid,
  GoogleOutlined,
  Locked1Outlined,
  MapMarker5Outlined,
  User4Outlined,
  Bolt3Solid,
} from '@lineiconshq/free-icons';

@Component({
  selector: 'app-sign-in',
  imports: [LineiconsComponent, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  AppleBrandOutlined = AppleBrandOutlined;
  Envelope1Outlined = Envelope1Outlined;
  EyeOutlined = EyeOutlined;
  EyeSolid = EyeSolid;
  GoogleOutlined = GoogleOutlined;
  Locked1Outlined = Locked1Outlined;
  MapMarker5Outlined = MapMarker5Outlined;
  User2Outlined = User4Outlined;
  Bolt3Solid = Bolt3Solid;

  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
