import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.html',
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  getToastClasses(type: string): string {
    const map: Record<string, string> = {
      success: 'text-green-500 bg-green-100 dark:bg-gray-800 dark:text-green-400',
      error: 'text-red-500 bg-red-100 dark:bg-gray-800 dark:text-red-400',
      warning: 'text-yellow-500 bg-yellow-100 dark:bg-gray-800 dark:text-yellow-400',
      info: 'text-blue-500 bg-blue-100 dark:bg-gray-800 dark:text-blue-400',
    };
    return map[type] || map['info'];
  }

  getIconBg(type: string): string {
    const map: Record<string, string> = {
      success: 'bg-green-100 dark:bg-green-800',
      error: 'bg-red-100 dark:bg-red-800',
      warning: 'bg-yellow-100 dark:bg-yellow-800',
      info: 'bg-blue-100 dark:bg-blue-800',
    };
    return map[type] || map['info'];
  }
}
