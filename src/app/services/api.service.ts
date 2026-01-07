import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';
import { DashboardStats, ViolationData } from '../models/violation';

const mockViolations: ViolationData[] = [
  {
    plateNumber: 'MH12AB1234',
    ownerName: 'Rahul Patil',
    mobile: '+91 9876543210',
    email: 'rahul.patil@email.com',
    vehicleType: 'Bike',
    violations: ['No Helmet', 'Over Speed'],
    speed: 78,
    speedLimit: 50,
    fineAmount: 1500,
    location: 'Shivaji Nagar, Pune',
    timestamp: '2026-01-06 11:32 AM',
    challanId: 'PNRTO-2026-000123',
    status: 'pending'
  },
  {
    plateNumber: 'MH14CD5678',
    ownerName: 'Priya Sharma',
    mobile: '+91 9123456789',
    email: 'priya.sharma@email.com',
    vehicleType: 'Car',
    violations: ['Signal Jump'],
    speed: 45,
    speedLimit: 50,
    fineAmount: 1000,
    location: 'FC Road, Pune',
    timestamp: '2026-01-06 10:15 AM',
    challanId: 'PNRTO-2026-000122',
    status: 'issued'
  },
  {
    plateNumber: 'MH12EF9012',
    ownerName: 'Amit Kulkarni',
    mobile: '+91 9988776655',
    email: 'amit.kulkarni@email.com',
    vehicleType: 'Bike',
    violations: ['Triple Riding', 'No Helmet'],
    speed: 35,
    speedLimit: 40,
    fineAmount: 2000,
    location: 'JM Road, Pune',
    timestamp: '2026-01-06 09:45 AM',
    challanId: 'PNRTO-2026-000121',
    status: 'pending'
  },
  {
    plateNumber: 'MH14GH3456',
    ownerName: 'Sneha Deshmukh',
    mobile: '+91 9876512340',
    email: 'sneha.d@email.com',
    vehicleType: 'Car',
    violations: ['Parking Violation'],
    speed: 0,
    speedLimit: 0,
    fineAmount: 500,
    location: 'Camp Area, Pune',
    timestamp: '2026-01-05 04:30 PM',
    challanId: 'PNRTO-2026-000120',
    status: 'issued'
  },
  {
    plateNumber: 'MH12IJ7890',
    ownerName: 'Vikram Joshi',
    mobile: '+91 9654321098',
    email: 'vikram.j@email.com',
    vehicleType: 'Bike',
    violations: ['Over Speed', 'Wrong Lane'],
    speed: 82,
    speedLimit: 50,
    fineAmount: 1500,
    location: 'Hadapsar, Pune',
    timestamp: '2026-01-05 02:15 PM',
    challanId: 'PNRTO-2026-000119',
    status: 'pending'
  }
];

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Local signal cache to mimic backend state
  private violations = signal<ViolationData[]>([...mockViolations]);
  private stats = signal<DashboardStats>({
    vehiclesScanned: 15847,
    violationsDetected: 342,
    totalFineAmount: 512500
  });

  readonly violations$ = computed(() => this.violations());
  readonly stats$ = computed(() => this.stats());

  analyzeTraffic(): Observable<ViolationData | null> {
    return of(true).pipe(
      delay(2500),
      map(() => {
        if (Math.random() < 0.3) {
          // No violation
          this.stats.update(s => ({
            ...s,
            vehiclesScanned: s.vehiclesScanned + 1
          }));
          return null;
        }

        const randomIndex = Math.floor(Math.random() * mockViolations.length);
        const violation: ViolationData = { ...mockViolations[randomIndex] };
        violation.challanId = `PNRTO-2026-${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
        violation.timestamp = new Date().toLocaleString('en-IN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        violation.status = 'pending';

        this.violations.update(list => [violation, ...list]);
        this.stats.update(s => ({
          vehiclesScanned: s.vehiclesScanned + 1,
          violationsDetected: s.violationsDetected + 1,
          totalFineAmount: s.totalFineAmount + violation.fineAmount
        }));

        return violation;
      })
    );
  }

  getDashboardStats(): Observable<DashboardStats> {
    return of(this.stats()).pipe(delay(500));
  }

  getViolationHistory(): Observable<ViolationData[]> {
    return of(this.violations()).pipe(delay(800));
  }

  sendSMS(mobile: string, challanId: string): Observable<{ success: boolean }> {
    console.log(`[DEMO] SMS sent to ${mobile} for challan ${challanId}`);
    return of({ success: true }).pipe(delay(1500));
  }

  sendEmail(email: string, challanId: string): Observable<{ success: boolean }> {
    console.log(`[DEMO] Email sent to ${email} for challan ${challanId}`);
    return of({ success: true }).pipe(delay(1500));
  }
}
