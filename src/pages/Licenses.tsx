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
import { Search, Filter, Eye, FileDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLicenses } from '@/hooks/useData';
import { License } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function Licenses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: licenses = [], isLoading } = useLicenses();

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch =
      license.license_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.enterprise?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || license.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGeneratePdf = (license: License) => {
    toast({
      title: 'Đang tạo PDF',
      description: `Đang tạo file PDF cho giấy phép ${license.license_number}...`,
    });
  };

  const columns = [
    { key: 'license_number', header: 'Số giấy phép' },
    {
      key: 'enterprise_id',
      header: 'Doanh nghiệp',
      render: (license: License) => license.enterprise?.name || '-',
    },
    {
      key: 'license_type_id',
      header: 'Loại giấy phép',
      render: (license: License) => license.license_type?.name || '-',
    },
    {
      key: 'issue_date',
      header: 'Ngày cấp',
      render: (license: License) =>
        license.issue_date ? new Date(license.issue_date).toLocaleDateString('vi-VN') : '-',
    },
    {
      key: 'expiry_date',
      header: 'Ngày hết hạn',
      render: (license: License) =>
        license.expiry_date ? new Date(license.expiry_date).toLocaleDateString('vi-VN') : '-',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (license: License) => <StatusBadge status={license.status} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (license: License) => (
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
            <DropdownMenuItem onClick={() => handleGeneratePdf(license)}>
              <FileDown className="mr-2 h-4 w-4" />
              Tạo PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Calculate stats
  const activeCount = licenses.filter(l => l.status === 'ACTIVE').length;
  const expiredCount = licenses.filter(l => l.status === 'EXPIRED').length;
  const expiringCount = licenses.filter(l => {
    if (!l.expiry_date) return false;
    const expiryDate = new Date(l.expiry_date);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return l.status === 'ACTIVE' && expiryDate <= threeMonthsFromNow;
  }).length;

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Quản lý Giấy phép"
        description="Danh sách các giấy phép viễn thông đã được cấp"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo số GP, doanh nghiệp..."
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
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="EXPIRED">Hết hạn</SelectItem>
                <SelectItem value="SUSPENDED">Tạm dừng</SelectItem>
                <SelectItem value="REVOKED">Thu hồi</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              <p className="text-sm text-muted-foreground">Tổng số</p>
              <p className="text-2xl font-bold">{licenses.length}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Đang hoạt động</p>
              <p className="text-2xl font-bold text-success">{activeCount}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Hết hạn</p>
              <p className="text-2xl font-bold text-destructive">{expiredCount}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Sắp hết hạn</p>
              <p className="text-2xl font-bold text-warning">{expiringCount}</p>
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
          <DataTable data={filteredLicenses} columns={columns} />
        )}
      </div>
    </div>
  );
}
