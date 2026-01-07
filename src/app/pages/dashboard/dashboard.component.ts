import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
} from 'lucide-angular';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { DashboardStats, ViolationData } from '../../models/violation';
import { generateChallanFilename, generatePDF } from '../../utils/pdf.util';
import { HeaderComponent } from '../../components/header/header.component';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { VideoPanelComponent } from '../../components/video-panel/video-panel.component';
import { ViolationCardComponent } from '../../components/violation-card/violation-card.component';
import { FineSlipComponent } from '../../components/fine-slip/fine-slip.component';
import { ShareModalComponent } from '../../components/share-modal/share-modal.component';
import { ViolationTableComponent } from '../../components/violation-table/violation-table.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    HeaderComponent,
    StatsCardComponent,
    VideoPanelComponent,
    ViolationCardComponent,
    FineSlipComponent,
    ShareModalComponent,
    ViolationTableComponent
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  @ViewChild(VideoPanelComponent) videoPanel?: VideoPanelComponent;

  stats = signal<DashboardStats | null>(null);
  violations = signal<ViolationData[]>([]);
  currentViolation = signal<ViolationData | null>(null);

  isAnalyzing = signal(false);
  showShareModal = signal(false);
  showFineSlip = signal(false);
  isDownloading = signal(false);
  hasRecording = signal(false);
  noViolationDetected = signal(false);

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.api.getDashboardStats().subscribe({
      next: stats => this.stats.set(stats),
      error: err => console.error('Failed to load stats', err)
    });

    this.api.getViolationHistory().subscribe({
      next: list => this.violations.set(list),
      error: err => console.error('Failed to load violations', err)
    });
  }

  onRecordingComplete() {
    this.hasRecording.set(true);
    this.currentViolation.set(null);
    this.noViolationDetected.set(false);
    this.showFineSlip.set(false);
  }

  startNewRecording() {
    this.currentViolation.set(null);
    this.noViolationDetected.set(false);
    this.showFineSlip.set(false);
    this.hasRecording.set(false);

     // Safely stop any existing recording/stream and immediately start a fresh one
     this.videoPanel?.stopRecording();
     this.videoPanel?.startRecording();
  }

  toggleFineSlip() {
    this.showFineSlip.update(v => !v);
  }

  handleAnalyze() {
    this.isAnalyzing.set(true);
    this.currentViolation.set(null);
    this.noViolationDetected.set(false);
    this.showFineSlip.set(false);

    this.api.analyzeTraffic().subscribe({
      next: violation => {
        if (!violation) {
          this.noViolationDetected.set(true);
          this.toast.show({
            title: 'Analysis Complete',
            description: 'No traffic violation detected. Vehicle is compliant.'
          });
          return;
        }

        this.currentViolation.set(violation);
        this.showFineSlip.set(true);
        this.noViolationDetected.set(false);

        this.violations.update(list => [violation, ...list]);

        this.toast.show({
          title: 'Violation Detected!',
          description: `Vehicle ${violation.plateNumber} - ${violation.violations.join(', ')}`,
          variant: 'destructive'
        });
      },
      error: () => {
        this.toast.show({
          title: 'Analysis Failed',
          description: 'Failed to analyze traffic footage. Please try again.',
          variant: 'destructive'
        });
      },
      complete: () => {
        this.isAnalyzing.set(false);
        this.hasRecording.set(false);
      }
    });
  }

  async handleDownloadPDF() {
    const violation = this.currentViolation();
    if (!violation) return;
    this.isDownloading.set(true);
    try {
      const filename = generateChallanFilename(violation.plateNumber);
      await generatePDF('fine-slip', filename);
      this.toast.show({
        title: 'Download Complete',
        description: `Fine slip saved as ${filename}`
      });
    } catch {
      this.toast.show({
        title: 'Download Failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive'
      });
    } finally {
      this.isDownloading.set(false);
    }
  }

  get statsValue() {
    return this.stats();
  }

  get violationsList() {
    return this.violations();
  }
}
