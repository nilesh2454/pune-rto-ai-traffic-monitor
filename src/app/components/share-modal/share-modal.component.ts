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
    console.log('sendSMS called, mobile:', this.mobile);
    if (!this.mobile) {
      console.log('No mobile number provided');
      return;
    }
    this.sendingSMS = true;
    console.log('Sending SMS to:', this.mobile, 'challanId:', this.data.challanId);
    this.api.sendSMS(this.mobile, this.data.challanId).subscribe({
      next: () => {
        console.log('SMS sent successfully');
        this.toast.show({ title: 'SMS Sent', description: `Fine slip sent to ${this.mobile}` });
      },
      error: (error) => {
        console.error('SMS send error:', error);
        this.toast.show({ title: 'Failed to send SMS', variant: 'destructive' });
      },
      complete: () => {
        console.log('SMS request completed');
        this.sendingSMS = false;
      }
    });
  }

  async sendEmail() {
    console.log('sendEmail called, email:', this.email);
    if (!this.email) {
      console.log('No email provided');
      return;
    }
    this.sendingEmail = true;
    console.log('Sending Email to:', this.email, 'challanId:', this.data.challanId);
    this.api.sendEmail(this.email, this.data.challanId).subscribe({
      next: () => {
        console.log('Email sent successfully');
        this.toast.show({ title: 'Email Sent', description: `Fine slip sent to ${this.email}` });
      },
      error: (error) => {
        console.error('Email send error:', error);
        this.toast.show({ title: 'Failed to send Email', variant: 'destructive' });
      },
      complete: () => {
        console.log('Email request completed');
        this.sendingEmail = false;
      }
    });
  }
}
