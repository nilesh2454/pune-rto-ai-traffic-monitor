export interface ViolationData {
  plateNumber: string;
  ownerName: string;
  mobile: string;
  email: string;
  vehicleType: string;
  violations: string[];
  speed: number;
  speedLimit: number;
  fineAmount: number;
  location: string;
  timestamp: string;
  challanId: string;
  status: 'pending' | 'issued';
}

export interface DashboardStats {
  vehiclesScanned: number;
  violationsDetected: number;
  totalFineAmount: number;
}

export interface ShareFormData {
  mobile: string;
  email: string;
}
