import { Component } from '@angular/core';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-public-layout',
  imports: [Navbar],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {}
