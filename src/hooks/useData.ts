// LTRA License Management System - Data Hooks with Mock Data
// All data comes from static mock data - no server required

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  applications as mockApplications,
  enterprises as mockEnterprises,
  licenses as mockLicenses,
  licenseTypes as mockLicenseTypes,
  numberRanges as mockNumberRanges,
  subscribers as mockSubscribers,
  violations as mockViolations,
  dashboardStats as mockDashboardStats,
  getEnterpriseById,
  getLicenseTypeById,
} from '@/data/mockData';
import type { 
  Application, 
  ApplicationStatus, 
  ApplicationType,
  Enterprise,
  License,
  LicenseType,
  NumberRange,
  Subscriber,
  ComplianceViolation,
  DashboardStats,
} from '@/types';
import { message } from 'antd';

// ============ In-memory data store (simulates database) ============
let applicationsStore = [...mockApplications];
let subscribersStore = [...mockSubscribers];

// ============ Enterprises ============
export const enterpriseKeys = {
  all: ['enterprises'] as const,
  lists: () => [...enterpriseKeys.all, 'list'] as const,
};

export function useEnterprises() {
  return useQuery({
    queryKey: enterpriseKeys.lists(),
    queryFn: async (): Promise<Enterprise[]> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockEnterprises;
    },
  });
}

// ============ License Types ============
export const licenseTypeKeys = {
  all: ['licenseTypes'] as const,
  lists: () => [...licenseTypeKeys.all, 'list'] as const,
};

export function useLicenseTypes() {
  return useQuery({
    queryKey: licenseTypeKeys.lists(),
    queryFn: async (): Promise<LicenseType[]> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockLicenseTypes;
    },
  });
}

// ============ Licenses ============
export const licenseKeys = {
  all: ['licenses'] as const,
  lists: () => [...licenseKeys.all, 'list'] as const,
};

export function useLicenses() {
  return useQuery({
    queryKey: licenseKeys.lists(),
    queryFn: async (): Promise<License[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockLicenses.map(l => ({
        ...l,
        enterprise: getEnterpriseById(l.enterprise_id || ''),
        license_type: getLicenseTypeById(l.license_type_id || ''),
      }));
    },
  });
}

// ============ Applications ============
export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
};

export function useApplications() {
  return useQuery({
    queryKey: applicationKeys.lists(),
    queryFn: async (): Promise<Application[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return applicationsStore.map(app => ({
        ...app,
        enterprise: getEnterpriseById(app.enterprise_id || ''),
      }));
    },
  });
}

export interface CreateApplicationInput {
  code: string;
  enterprise_id: string;
  license_id?: string;
  type: ApplicationType;
  status?: ApplicationStatus;
  created_by?: string;
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateApplicationInput): Promise<Application> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newApplication: Application = {
        id: String(applicationsStore.length + 1),
        code: input.code,
        enterprise_id: input.enterprise_id,
        license_id: input.license_id,
        type: input.type,
        status: input.status || 'DRAFT',
        created_by: input.created_by,
        created_at: new Date().toISOString(),
        enterprise: getEnterpriseById(input.enterprise_id),
      };
      
      applicationsStore = [newApplication, ...applicationsStore];
      return newApplication;
    },
    onSuccess: (newApplication) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      message.success(`Hồ sơ ${newApplication.code} đã được tạo`);
    },
    onError: () => {
      message.error('Không thể tạo hồ sơ mới');
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      submissionDate 
    }: { 
      id: string; 
      status: ApplicationStatus; 
      submissionDate?: string;
    }): Promise<Application> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = applicationsStore.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Application not found');
      
      applicationsStore[index] = {
        ...applicationsStore[index],
        status,
        submission_date: submissionDate || applicationsStore[index].submission_date,
      };
      
      return {
        ...applicationsStore[index],
        enterprise: getEnterpriseById(applicationsStore[index].enterprise_id || ''),
      };
    },
    onSuccess: (updatedApp) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      const statusLabels: Record<ApplicationStatus, string> = {
        DRAFT: 'Nháp',
        SUBMITTED: 'Đã nộp',
        REVIEWING: 'Đang xem xét',
        APPROVED: 'Đã duyệt',
        REJECTED: 'Từ chối',
      };
      message.success(`Hồ sơ ${updatedApp.code} đã chuyển sang "${statusLabels[updatedApp.status]}"`);
    },
    onError: () => {
      message.error('Không thể cập nhật trạng thái hồ sơ');
    },
  });
}

// ============ Number Ranges ============
export const numberRangeKeys = {
  all: ['numberRanges'] as const,
  lists: () => [...numberRangeKeys.all, 'list'] as const,
};

export function useNumberRanges() {
  return useQuery({
    queryKey: numberRangeKeys.lists(),
    queryFn: async (): Promise<NumberRange[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockNumberRanges.map(nr => ({
        ...nr,
        telco: getEnterpriseById(nr.telco_id || ''),
      }));
    },
  });
}

// ============ Subscribers ============
export const subscriberKeys = {
  all: ['subscribers'] as const,
  lists: () => [...subscriberKeys.all, 'list'] as const,
  search: (query: string) => [...subscriberKeys.all, 'search', query] as const,
};

export function useSubscribers() {
  return useQuery({
    queryKey: subscriberKeys.lists(),
    queryFn: async (): Promise<Subscriber[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return subscribersStore.map(s => ({
        ...s,
        telco: getEnterpriseById(s.telco_id || ''),
      }));
    },
  });
}

export function useSearchSubscribers(query: string) {
  return useQuery({
    queryKey: subscriberKeys.search(query),
    queryFn: async (): Promise<Subscriber[]> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      const results = subscribersStore.filter(
        s => s.msisdn?.includes(query) || s.serial_number?.includes(query)
      );
      return results.map(s => ({
        ...s,
        telco: getEnterpriseById(s.telco_id || ''),
      }));
    },
    enabled: query.length >= 3,
  });
}

// ============ Violations ============
export const violationKeys = {
  all: ['violations'] as const,
  lists: () => [...violationKeys.all, 'list'] as const,
};

export function useViolations() {
  return useQuery({
    queryKey: violationKeys.lists(),
    queryFn: async (): Promise<ComplianceViolation[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockViolations.map(v => ({
        ...v,
        enterprise: getEnterpriseById(v.enterprise_id || ''),
      }));
    },
  });
}

// ============ Dashboard Stats ============
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async (): Promise<DashboardStats> => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockDashboardStats;
    },
  });
}
