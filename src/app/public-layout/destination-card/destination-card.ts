import { Component, input } from '@angular/core';

export interface DestinationItem {
  title: string;
  image: string;
}

@Component({
  selector: 'app-destination-card',
  templateUrl: './destination-card.html',
  styleUrl: './destination-card.css',
})
export class DestinationCard {
  readonly item = input.required<DestinationItem>();
}
