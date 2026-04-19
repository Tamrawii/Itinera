import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-provider-layout',
  imports: [Sidebar, RouterOutlet],
  templateUrl: './provider-layout.html',
  styleUrl: './provider-layout.css',
})
export class ProviderLayout {}
