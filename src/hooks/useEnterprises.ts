import { useQuery } from '@tanstack/react-query';
import { getEnterprises, getLicenseTypes } from '@/api/supabaseClient';

export const enterpriseKeys = {
  all: ['enterprises'] as const,
  lists: () => [...enterpriseKeys.all, 'list'] as const,
};

export const licenseTypeKeys = {
  all: ['licenseTypes'] as const,
  lists: () => [...licenseTypeKeys.all, 'list'] as const,
};

export function useEnterprises() {
  return useQuery({
    queryKey: enterpriseKeys.lists(),
    queryFn: getEnterprises,
  });
}

export function useLicenseTypes() {
  return useQuery({
    queryKey: licenseTypeKeys.lists(),
    queryFn: getLicenseTypes,
  });
}
