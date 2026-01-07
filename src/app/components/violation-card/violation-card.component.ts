import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { NgForOf, NgIf } from '@angular/common';
import { ViolationData } from '../../models/violation';

@Component({
  selector: 'app-violation-card',
  standalone: true,
  imports: [LucideAngularModule, NgForOf, NgIf],
  templateUrl: './violation-card.component.html'
})
export class ViolationCardComponent {
  @Input({ required: true }) data!: ViolationData;

  get vehicleIcon(): 'car' | 'bike' {
    return this.data.vehicleType.toLowerCase() === 'bike' ? 'bike' : 'car';
  }
}
