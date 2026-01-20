import { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, Eye, CheckCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useViolations } from '@/hooks/useData';
import { ComplianceViolation } from '@/types';

export default function Violations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const { data: violations = [], isLoading } = useViolations();

  const filteredViolations = violations.filter(violation => {
    const matchesSearch =
      violation.violation_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || violation.status === statusFilter;
    const matchesSeverity =
      severityFilter === 'all' || violation.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const columns = [
    {
      key: 'detection_date',
      header: 'Ngày phát hiện',
      render: (v: ComplianceViolation) =>
        new Date(v.detection_date).toLocaleDateString('vi-VN'),
    },
    { key: 'violation_type', header: 'Loại vi phạm' },
    {
      key: 'enterprise_id',
      header: 'Doanh nghiệp',
      render: (v: ComplianceViolation) => v.enterprise?.name || '-',
    },
    {
      key: 'license_id',
      header: 'Giấy phép liên quan',
      render: (v: ComplianceViolation) => v.license?.license_number || '-',
    },
    {
      key: 'severity',
      header: 'Mức độ',
      render: (v: ComplianceViolation) => <StatusBadge status={v.severity} />,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (v: ComplianceViolation) => <StatusBadge status={v.status} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (v: ComplianceViolation) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckCircle className="mr-2 h-4 w-4" />
              Đánh dấu đã xử lý
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Calculate stats
  const newCount = violations.filter(v => v.status === 'NEW').length;
  const investigatingCount = violations.filter(v => v.status === 'INVESTIGATING').length;
  const resolvedCount = violations.filter(v => v.status === 'RESOLVED').length;

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Vi phạm tuân thủ"
        description="Danh sách các vi phạm được phát hiện từ hệ thống giám sát"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm vi phạm..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="NEW">Mới</SelectItem>
              <SelectItem value="INVESTIGATING">Đang điều tra</SelectItem>
              <SelectItem value="RESOLVED">Đã xử lý</SelectItem>
            </SelectContent>
          </Select>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Mức độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả mức độ</SelectItem>
              <SelectItem value="LOW">Thấp</SelectItem>
              <SelectItem value="MEDIUM">Trung bình</SelectItem>
              <SelectItem value="HIGH">Cao</SelectItem>
              <SelectItem value="CRITICAL">Nghiêm trọng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-[80px] rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Tổng vi phạm</p>
              <p className="text-2xl font-bold">{violations.length}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Mới phát hiện</p>
              <p className="text-2xl font-bold text-destructive">{newCount}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Đang điều tra</p>
              <p className="text-2xl font-bold text-warning">{investigatingCount}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Đã xử lý</p>
              <p className="text-2xl font-bold text-success">{resolvedCount}</p>
            </div>
          </div>
        )}

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <DataTable data={filteredViolations} columns={columns} />
        )}
      </div>
    </div>
  );
}
