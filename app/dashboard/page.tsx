"use client";

import { useAuth } from '@/lib/auth-context';
import { DashboardLayout } from '@/components/dashboard-layout';
import { StudentDashboard } from '@/components/dashboards/student-dashboard';
import { StaffDashboard } from '@/components/dashboards/staff-dashboard';
import { SecurityDashboard } from '@/components/dashboards/security-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'student':
        return <StudentDashboard />;
      case 'security':
        return <SecurityDashboard />;
      case 'advisor':
      case 'hod':
      case 'principal':
      case 'warden':
      case 'deputy_warden':
        return <StaffDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
}
