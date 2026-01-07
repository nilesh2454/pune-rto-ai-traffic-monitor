import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'default' | 'destructive' | 'success';

export interface ToastMessage {
  id: number;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  private readonly toastsSignal = signal<ToastMessage[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  show(toast: Omit<ToastMessage, 'id'>) {
    const id = ++this.counter;
    const message: ToastMessage = { id, ...toast };
    this.toastsSignal.update(list => [...list, message]);
    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: number) {
    this.toastsSignal.update(list => list.filter(t => t.id !== id));
  }
}
