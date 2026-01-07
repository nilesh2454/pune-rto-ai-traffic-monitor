import { Component, Input } from '@angular/core';
import { ViolationData } from '../../models/violation';
import { LucideAngularModule } from 'lucide-angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-fine-slip',
  standalone: true,
  imports: [LucideAngularModule, NgIf],
  templateUrl: './fine-slip.component.html'
})
export class FineSlipComponent {
  @Input({ required: true }) data!: ViolationData;
  @Input() id = 'fine-slip';

  get vehicleIcon(): 'bike' | 'car' {
    return this.data.vehicleType.toLowerCase() === 'bike' ? 'bike' : 'car';
  }
}
