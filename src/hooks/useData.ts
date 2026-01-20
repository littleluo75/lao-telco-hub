import { useQuery } from '@tanstack/react-query';
import { getLicenses, getDashboardStats, getViolations, getNumberRanges, searchSubscribers, getSubscribers } from '@/api/supabaseClient';

export const licenseKeys = {
  all: ['licenses'] as const,
  lists: () => [...licenseKeys.all, 'list'] as const,
};

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

export const violationKeys = {
  all: ['violations'] as const,
  lists: () => [...violationKeys.all, 'list'] as const,
};

export const numberRangeKeys = {
  all: ['numberRanges'] as const,
  lists: () => [...numberRangeKeys.all, 'list'] as const,
};

export const subscriberKeys = {
  all: ['subscribers'] as const,
  lists: () => [...subscriberKeys.all, 'list'] as const,
  search: (query: string) => [...subscriberKeys.all, 'search', query] as const,
};

export function useLicenses() {
  return useQuery({
    queryKey: licenseKeys.lists(),
    queryFn: getLicenses,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
  });
}

export function useViolations() {
  return useQuery({
    queryKey: violationKeys.lists(),
    queryFn: getViolations,
  });
}

export function useNumberRanges() {
  return useQuery({
    queryKey: numberRangeKeys.lists(),
    queryFn: getNumberRanges,
  });
}

export function useSubscribers() {
  return useQuery({
    queryKey: subscriberKeys.lists(),
    queryFn: getSubscribers,
  });
}

export function useSearchSubscribers(query: string) {
  return useQuery({
    queryKey: subscriberKeys.search(query),
    queryFn: () => searchSubscribers(query),
    enabled: query.length >= 3,
  });
}
