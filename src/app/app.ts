import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { PublicLayout } from './public-layout/public-layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PublicLayout],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Itinera');
  ngOnInit(): void {
    initFlowbite();
  }
}
