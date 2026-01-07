import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NgClass, NgIf } from '@angular/common';

type Variant = 'default' | 'success' | 'warning';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [LucideAngularModule, NgClass, NgIf],
  templateUrl: './stats-card.component.html'
})
export class StatsCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() trend?: string;
  @Input() icon: 'car' | 'alert-triangle' | 'indian-rupee' = 'car';
  @Input() variant: Variant = 'default';

  get variantBorder(): string {
    return {
      default: 'border-l-primary',
      success: 'border-l-success',
      warning: 'border-l-warning'
    }[this.variant];
  }

  get iconClasses(): string {
    return {
      default: 'text-primary bg-primary/10',
      success: 'text-success bg-success/10',
      warning: 'text-warning bg-warning/10'
    }[this.variant];
  }

  get displayValue(): string | number {
    if (typeof this.value === 'number') {
      return this.value.toLocaleString('en-IN');
    }
    return this.value;
  }
}
