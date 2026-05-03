import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  imports: [CommonModule],
  templateUrl: './message.html',
  styleUrl: './message.css',
})
export class Message {
  @Input() text: string = '';
  @Input() isUserMessage: boolean = false;
}
