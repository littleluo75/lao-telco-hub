import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getApplications, 
  updateApplicationStatus, 
  createApplication,
  type CreateApplicationInput 
} from '@/api/supabaseClient';
import { ApplicationStatus } from '@/types';
import { toast } from '@/hooks/use-toast';

export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  list: (filters: string) => [...applicationKeys.lists(), { filters }] as const,
  details: () => [...applicationKeys.all, 'detail'] as const,
  detail: (id: string) => [...applicationKeys.details(), id] as const,
};

export function useApplications() {
  return useQuery({
    queryKey: applicationKeys.lists(),
    queryFn: getApplications,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id, 
      status, 
      submissionDate 
    }: { 
      id: string; 
      status: ApplicationStatus; 
      submissionDate?: string;
    }) => updateApplicationStatus(id, status, submissionDate),
    
    onSuccess: (updatedApplication) => {
      // Invalidate and refetch applications list
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      
      const statusLabels: Record<ApplicationStatus, string> = {
        DRAFT: 'Nháp',
        SUBMITTED: 'Đã nộp',
        REVIEWING: 'Đang xem xét',
        APPROVED: 'Đã duyệt',
        REJECTED: 'Từ chối',
      };
      
      toast({
        title: 'Cập nhật thành công',
        description: `Hồ sơ ${updatedApplication.code} đã chuyển sang "${statusLabels[updatedApplication.status]}"`,
      });
    },
    
    onError: (error) => {
      toast({
        title: 'Lỗi cập nhật',
        description: error instanceof Error ? error.message : 'Không thể cập nhật trạng thái hồ sơ',
        variant: 'destructive',
      });
    },
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateApplicationInput) => createApplication(input),
    
    onSuccess: (newApplication) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      
      toast({
        title: 'Tạo hồ sơ thành công',
        description: `Hồ sơ ${newApplication.code} đã được tạo`,
      });
    },
    
    onError: (error) => {
      toast({
        title: 'Lỗi tạo hồ sơ',
        description: error instanceof Error ? error.message : 'Không thể tạo hồ sơ mới',
        variant: 'destructive',
      });
    },
  });
}
