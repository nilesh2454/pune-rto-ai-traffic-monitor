import { Component, computed, inject } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgForOf, NgClass, NgIf],
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css']
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);
  toasts = computed(() => this.toastService.toasts());

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
}
