import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 
  | 'ACTIVE' 
  | 'INACTIVE' 
  | 'PENDING' 
  | 'EXPIRED' 
  | 'REVOKED' 
  | 'SUSPENDED'
  | 'DRAFT'
  | 'PENDING_ACTIVATION'
  | 'SUBMITTED'
  | 'REVIEWING'
  | 'APPROVED'
  | 'REJECTED'
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'IN_USE'
  | 'QUARANTINE'
  | 'NEW'
  | 'INVESTIGATING'
  | 'RESOLVED'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  ACTIVE: { label: 'Hoạt động', className: 'status-active' },
  INACTIVE: { label: 'Không hoạt động', className: 'status-draft' },
  PENDING: { label: 'Chờ xử lý', className: 'status-pending' },
  EXPIRED: { label: 'Hết hạn', className: 'status-expired' },
  REVOKED: { label: 'Thu hồi', className: 'status-expired' },
  SUSPENDED: { label: 'Tạm dừng', className: 'status-pending' },
  DRAFT: { label: 'Nháp', className: 'status-draft' },
  PENDING_ACTIVATION: { label: 'Chờ kích hoạt', className: 'status-pending' },
  SUBMITTED: { label: 'Đã nộp', className: 'status-pending' },
  REVIEWING: { label: 'Đang xem xét', className: 'status-pending' },
  APPROVED: { label: 'Đã duyệt', className: 'status-active' },
  REJECTED: { label: 'Từ chối', className: 'status-expired' },
  AVAILABLE: { label: 'Có sẵn', className: 'status-active' },
  ASSIGNED: { label: 'Đã phân bổ', className: 'status-pending' },
  IN_USE: { label: 'Đang sử dụng', className: 'status-active' },
  QUARANTINE: { label: 'Cách ly', className: 'status-expired' },
  NEW: { label: 'Mới', className: 'status-expired' },
  INVESTIGATING: { label: 'Đang điều tra', className: 'status-pending' },
  RESOLVED: { label: 'Đã xử lý', className: 'status-active' },
  LOW: { label: 'Thấp', className: 'status-draft' },
  MEDIUM: { label: 'Trung bình', className: 'status-pending' },
  HIGH: { label: 'Cao', className: 'status-expired' },
  CRITICAL: { label: 'Nghiêm trọng', className: 'bg-destructive text-destructive-foreground' },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: 'status-draft' };

  return (
    <Badge
      variant="outline"
      className={cn('font-medium', config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
