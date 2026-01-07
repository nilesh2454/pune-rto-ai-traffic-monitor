import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-video-panel',
  standalone: true,
  imports: [NgIf, LucideAngularModule],
  templateUrl: './video-panel.component.html'
})
export class VideoPanelComponent implements OnDestroy {
  @Input() isAnalyzing = false;
  @Input() hasRecording = false;
  @Output() analyze = new EventEmitter<void>();
  @Output() recordingComplete = new EventEmitter<void>();

  @ViewChild('videoEl') videoRef!: ElementRef<HTMLVideoElement>;

  isCameraActive = false;
  isRecording = false;
  recordingSaved = false;
  cameraError: string | null = null;
  recordingTime = 0;

  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordingTimer: ReturnType<typeof setInterval> | null = null;

  async startRecording() {
    try {
      this.cameraError = null;
      this.recordingSaved = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      this.stream = stream;
      this.isCameraActive = true;

      if (this.videoRef?.nativeElement) {
        this.videoRef.nativeElement.srcObject = stream;
        const playPromise = this.videoRef.nativeElement.play();
        if (playPromise) playPromise.catch(() => undefined);
      }

      const chunks: BlobPart[] = [];
      if (typeof MediaRecorder !== 'undefined') {
        try {
          const preferredTypes = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm',
          ];
          const supportedType = preferredTypes.find((t) => (MediaRecorder as any).isTypeSupported?.(t));
          const options = supportedType ? ({ mimeType: supportedType } as MediaRecorderOptions) : undefined;

          this.mediaRecorder = options ? new MediaRecorder(stream, options) : new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
          };
          this.mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: chunks.length ? (supportedType ?? 'video/webm') : 'video/webm' });
            console.log('Recording saved, size:', blob.size);
          };
          this.mediaRecorder.start();
        } catch (err) {
          console.warn('MediaRecorder not available/supported in this browser:', err);
          this.mediaRecorder = null;
        }
      }

      this.isRecording = true;
      this.recordingTime = 0;
      this.recordingTimer = setInterval(() => (this.recordingTime += 1), 1000);
    } catch (error) {
      console.error('Camera error:', error);
      this.cleanupStreams();
      this.cameraError = 'Unable to access camera. Please grant camera permissions and try again.';
      this.isCameraActive = false;
      this.isRecording = false;
    }
  }

  stopRecording() {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        console.warn('Failed to stop MediaRecorder:', e);
      }
    }

    this.cleanupStreams();

    if (this.videoRef?.nativeElement) {
      this.videoRef.nativeElement.srcObject = null;
    }

    this.isRecording = false;
    this.isCameraActive = false;
    this.recordingSaved = true;
    this.recordingComplete.emit();
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  ngOnDestroy(): void {
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
    }
    this.cleanupStreams();
  }

  private cleanupStreams() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}
