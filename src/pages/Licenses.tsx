import { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
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
import { licenses, enterprises, licenseTypes } from '@/data/mockData';
import { License } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function Licenses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch =
      license.license_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprises.find(e => e.id === license.enterprise_id)?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
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
      render: (license: License) => {
        const enterprise = enterprises.find(e => e.id === license.enterprise_id);
        return enterprise?.name || '-';
      },
    },
    {
      key: 'license_type_id',
      header: 'Loại giấy phép',
      render: (license: License) => {
        const type = licenseTypes.find(t => t.id === license.license_type_id);
        return type?.name || '-';
      },
    },
    {
      key: 'issue_date',
      header: 'Ngày cấp',
      render: (license: License) =>
        new Date(license.issue_date).toLocaleDateString('vi-VN'),
    },
    {
      key: 'expiry_date',
      header: 'Ngày hết hạn',
      render: (license: License) =>
        new Date(license.expiry_date).toLocaleDateString('vi-VN'),
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
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Tổng số</p>
            <p className="text-2xl font-bold">{licenses.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Đang hoạt động</p>
            <p className="text-2xl font-bold text-success">
              {licenses.filter(l => l.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Hết hạn</p>
            <p className="text-2xl font-bold text-destructive">
              {licenses.filter(l => l.status === 'EXPIRED').length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Sắp hết hạn</p>
            <p className="text-2xl font-bold text-warning">2</p>
          </div>
        </div>

        {/* Table */}
        <DataTable data={filteredLicenses} columns={columns} />
      </div>
    </div>
  );
}
