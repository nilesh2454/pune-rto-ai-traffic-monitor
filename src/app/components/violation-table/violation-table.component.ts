import { Component, Input } from '@angular/core';
import { NgForOf, NgIf, NgClass } from '@angular/common';
import { ViolationData } from '../../models/violation';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-violation-table',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, LucideAngularModule],
  templateUrl: './violation-table.component.html'
})
export class ViolationTableComponent {
  @Input() violations: ViolationData[] = [];
}
