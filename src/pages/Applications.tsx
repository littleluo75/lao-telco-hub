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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter, Eye, Edit, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { applications, enterprises, licenseTypes } from '@/data/mockData';
import { Application } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprises.find(e => e.id === app.enterprise_id)?.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateApplication = () => {
    setIsCreateOpen(false);
    toast({
      title: 'Thành công',
      description: 'Hồ sơ mới đã được tạo thành công.',
    });
  };

  const columns = [
    { key: 'code', header: 'Mã hồ sơ' },
    {
      key: 'enterprise_id',
      header: 'Doanh nghiệp',
      render: (app: Application) => {
        const enterprise = enterprises.find(e => e.id === app.enterprise_id);
        return enterprise?.name || '-';
      },
    },
    {
      key: 'type',
      header: 'Loại hồ sơ',
      render: (app: Application) => {
        const typeLabels: Record<string, string> = {
          NEW: 'Cấp mới',
          RENEW: 'Gia hạn',
          ADJUST: 'Điều chỉnh',
          REVOKE: 'Thu hồi',
        };
        return typeLabels[app.type] || app.type;
      },
    },
    {
      key: 'submission_date',
      header: 'Ngày nộp',
      render: (app: Application) =>
        app.submission_date
          ? new Date(app.submission_date).toLocaleDateString('vi-VN')
          : '-',
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (app: Application) => <StatusBadge status={app.status} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (app: Application) => (
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
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Quản lý Hồ sơ"
        description="Quản lý các hồ sơ đề nghị cấp, gia hạn, điều chỉnh giấy phép"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã, doanh nghiệp..."
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
                <SelectItem value="DRAFT">Nháp</SelectItem>
                <SelectItem value="SUBMITTED">Đã nộp</SelectItem>
                <SelectItem value="REVIEWING">Đang xem xét</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tạo hồ sơ mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tạo hồ sơ mới</DialogTitle>
                <DialogDescription>
                  Tạo hồ sơ đề nghị cấp phép mới cho doanh nghiệp
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="enterprise">Doanh nghiệp</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn doanh nghiệp" />
                    </SelectTrigger>
                    <SelectContent>
                      {enterprises.map(enterprise => (
                        <SelectItem key={enterprise.id} value={enterprise.id}>
                          {enterprise.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Loại hồ sơ</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hồ sơ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">Cấp mới</SelectItem>
                      <SelectItem value="RENEW">Gia hạn</SelectItem>
                      <SelectItem value="ADJUST">Điều chỉnh</SelectItem>
                      <SelectItem value="REVOKE">Thu hồi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="licenseType">Loại giấy phép</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại giấy phép" />
                    </SelectTrigger>
                    <SelectContent>
                      {licenseTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateApplication}>Tạo hồ sơ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <DataTable data={filteredApplications} columns={columns} />
      </div>
    </div>
  );
}
