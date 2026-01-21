import { Tag } from 'antd';
import type { PresetColorType, PresetStatusColorType } from 'antd/es/_util/colors';

interface StatusTagProps {
  status: string | null | undefined;
  type?: 'status' | 'severity' | 'default';
}

const statusConfig: Record<string, { color: PresetColorType | PresetStatusColorType; text: string }> = {
  // Application & License Status
  ACTIVE: { color: 'success', text: 'Hiệu lực' },
  INACTIVE: { color: 'default', text: 'Không hiệu lực' },
  PENDING: { color: 'warning', text: 'Chờ xử lý' },
  APPROVED: { color: 'success', text: 'Đã duyệt' },
  REJECTED: { color: 'error', text: 'Từ chối' },
  EXPIRED: { color: 'error', text: 'Hết hạn' },
  EXPIRING: { color: 'warning', text: 'Sắp hết hạn' },
  DRAFT: { color: 'default', text: 'Nháp' },
  SUBMITTED: { color: 'processing', text: 'Đã nộp' },
  REVIEWING: { color: 'processing', text: 'Đang xem xét' },
  
  // Violation Status
  NEW: { color: 'error', text: 'Mới' },
  INVESTIGATING: { color: 'warning', text: 'Đang điều tra' },
  RESOLVED: { color: 'success', text: 'Đã xử lý' },
  
  // Number Range Status
  IN_USE: { color: 'success', text: 'Đang sử dụng' },
  AVAILABLE: { color: 'default', text: 'Còn trống' },
  RESERVED: { color: 'warning', text: 'Đã đặt trước' },
  
  // Severity
  LOW: { color: 'default', text: 'Thấp' },
  MEDIUM: { color: 'warning', text: 'Trung bình' },
  HIGH: { color: 'orange', text: 'Cao' },
  CRITICAL: { color: 'error', text: 'Nghiêm trọng' },
};

export default function StatusTag({ status, type = 'default' }: StatusTagProps) {
  if (!status) return <Tag>-</Tag>;
  
  const normalizedStatus = status.toUpperCase().replace(/\s+/g, '_');
  const config = statusConfig[normalizedStatus];
  
  if (config) {
    return <Tag color={config.color}>{config.text}</Tag>;
  }
  
  return <Tag>{status}</Tag>;
}
