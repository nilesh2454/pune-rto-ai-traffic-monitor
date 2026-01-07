import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { ViolationData } from '../../models/violation';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './share-modal.component.html'
})
export class ShareModalComponent implements OnChanges {
  @Input({ required: true }) data!: ViolationData;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  mobile = '';
  email = '';
  sendingSMS = false;
  sendingEmail = false;

  constructor(private readonly api: ApiService, private readonly toast: ToastService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.mobile = this.data.mobile;
      this.email = this.data.email;
    }
  }

  close() {
    this.closed.emit();
  }

  async sendSMS() {
    if (!this.mobile) return;
    this.sendingSMS = true;
    this.api.sendSMS(this.mobile, this.data.challanId).subscribe({
      next: () => this.toast.show({ title: 'SMS Sent', description: `Fine slip sent to ${this.mobile}` }),
      error: () => this.toast.show({ title: 'Failed to send SMS', variant: 'destructive' }),
      complete: () => (this.sendingSMS = false)
    });
  }

  async sendEmail() {
    if (!this.email) return;
    this.sendingEmail = true;
    this.api.sendEmail(this.email, this.data.challanId).subscribe({
      next: () => this.toast.show({ title: 'Email Sent', description: `Fine slip sent to ${this.email}` }),
      error: () => this.toast.show({ title: 'Failed to send Email', variant: 'destructive' }),
      complete: () => (this.sendingEmail = false)
    });
  }
}
