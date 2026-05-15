export type UserRole = 
  | 'student' 
  | 'advisor' 
  | 'hod' 
  | 'warden' 
  | 'deputy_warden' 
  | 'principal' 
  | 'security';

export type HostelType = 'G' | 'BH1' | 'BH2' | 'BH3' | 'dayscholar';

export type Department = 'CSE' | 'CCE' | 'AIML' | 'AIDS' | 'MECH' | 'CIVIL';

export type Year = '1st' | '2nd' | '3rd' | '4th';

export type PassType = 'casual' | 'emergency';

export type PassStatus = 
  | 'pending_advisor' 
  | 'pending_hod' 
  | 'pending_principal' 
  | 'pending_warden' 
  | 'pending_deputy_warden' 
  | 'approved' 
  | 'rejected';

export interface User {
  id: string;
  rollNo: string;
  name: string;
  role: UserRole;
  department?: Department;
  year?: Year;
  hostel?: HostelType;
  roomNo?: string;
  floorNo?: string;
  parentPhone?: string;
  photo?: string;
}

export interface GatePass {
  id: string;
  studentId: string;
  student: User;
  purpose: string;
  native: string;
  outDateTime: string;
  inDateTime: string;
  passType: PassType;
  status: PassStatus;
  createdAt: string;
  approvals: Approval[];
  qrCode?: string;
  scannedOut?: string;
  scannedIn?: string;
}

export interface Approval {
  role: UserRole;
  userId: string;
  userName: string;
  status: 'approved' | 'rejected';
  timestamp: string;
  comment?: string;
}

export interface ScanLog {
  id: string;
  passId: string;
  studentId: string;
  studentName: string;
  type: 'out' | 'in';
  timestamp: string;
  securityId: string;
}

// Greeting messages based on time of day
export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return `Good Morning, ${name}! Reach your destination quickly and safely.`;
  } else if (hour < 14) {
    return `Good Afternoon, ${name}! Have lunch and get your permissions sorted.`;
  } else if (hour < 17) {
    return `Good Evening, ${name}! The buses are waiting - plan your journey.`;
  } else {
    return `Good Night, ${name}! Wishing you a safe journey ahead.`;
  }
}

// Determine approval flow based on hostel type and time
export function getNextApprover(currentStatus: PassStatus, isHosteler: boolean, hour: number): PassStatus | 'approved' {
  const isAfterHours = hour < 9 || hour >= 17;
  
  if (isAfterHours) {
    // After hours: Skip Advisor/HOD, go directly to Warden
    if (currentStatus === 'pending_advisor' || currentStatus === 'pending_hod' || currentStatus === 'pending_principal') {
      return isHosteler ? 'pending_warden' : 'approved';
    }
  }
  
  // Normal flow
  switch (currentStatus) {
    case 'pending_advisor':
      return 'pending_hod';
    case 'pending_hod':
      return 'pending_principal';
    case 'pending_principal':
      return isHosteler ? 'pending_warden' : 'approved';
    case 'pending_warden':
      return 'pending_deputy_warden';
    case 'pending_deputy_warden':
      return 'approved';
    default:
      return 'approved';
  }
}

// Get status display text
export function getStatusText(status: PassStatus): string {
  switch (status) {
    case 'pending_advisor': return 'Pending Advisor Approval';
    case 'pending_hod': return 'Pending HOD Approval';
    case 'pending_principal': return 'Pending Principal Approval';
    case 'pending_warden': return 'Pending Warden Approval';
    case 'pending_deputy_warden': return 'Pending Deputy Warden Approval';
    case 'approved': return 'Approved';
    case 'rejected': return 'Rejected';
  }
}

// Get status color
export function getStatusColor(status: PassStatus): string {
  switch (status) {
    case 'approved': return 'bg-[#22CFCD] text-[#1C1C1C]';
    case 'rejected': return 'bg-[#FF4444] text-white';
    default: return 'bg-[#F59E0B] text-[#1C1C1C]';
  }
}
