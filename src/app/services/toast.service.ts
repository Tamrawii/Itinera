import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType): void {
    const id = this.nextId++;
    this.toasts.update((t) => [...t, { id, message, type }]);

    const autoDismissMap: Record<ToastType, number | null> = {
      success: 3000,
      error: null,
      warning: 5000,
      info: 3000,
    };

    const duration = autoDismissMap[type];
    if (duration !== null) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  dismiss(id: number): void {
    this.toasts.update((t) => t.filter((toast) => toast.id !== id));
  }
}
