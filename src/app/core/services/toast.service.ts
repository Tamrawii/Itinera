import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts$ = new BehaviorSubject<Toast[]>([]);

  /** Observable stream of all currently active toast notifications. */
  readonly toasts$: Observable<Toast[]> = this._toasts$.asObservable();

  /**
   * Displays a toast notification app-wide.
   * @param message  - The text to display.
   * @param type     - Visual severity: 'success' | 'error' | 'warning' | 'info'.
   * @param duration - Auto-dismiss delay in ms (default 4000; 0 = no auto-dismiss).
   */
  show(message: string, type: ToastType, duration: number = 4000): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const toast: Toast = { id, message, type, duration };
    this._toasts$.next([...this._toasts$.getValue(), toast]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  /**
   * Dismisses a specific toast by its unique string ID.
   * @param id - The ID of the toast to remove.
   */
  dismiss(id: string): void {
    this._toasts$.next(this._toasts$.getValue().filter((t) => t.id !== id));
  }
}
