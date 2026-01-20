import { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { serviceTypes } from '@/data/mockData';
import { ServiceType } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function ServiceTypes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredTypes = serviceTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setIsCreateOpen(false);
    toast({
      title: 'Thành công',
      description: 'Loại dịch vụ mới đã được tạo.',
    });
  };

  const columns = [
    { key: 'code', header: 'Mã' },
    { key: 'name', header: 'Tên dịch vụ' },
    {
      key: 'group_type',
      header: 'Nhóm',
      render: (type: ServiceType) => {
        const labels: Record<string, string> = {
          TELECOM: 'Viễn thông',
          VAS: 'GTGT',
          OTT: 'OTT',
        };
        return labels[type.group_type] || type.group_type;
      },
    },
    {
      key: 'requires_license',
      header: 'Yêu cầu GP',
      render: (type: ServiceType) => (type.requires_license ? 'Có' : 'Không'),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (type: ServiceType) => <StatusBadge status={type.status} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Loại Dịch vụ"
        description="Quản lý các loại dịch vụ viễn thông"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo mã, tên..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm loại dịch vụ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm loại dịch vụ</DialogTitle>
                <DialogDescription>
                  Tạo loại dịch vụ viễn thông mới
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Mã dịch vụ</Label>
                  <Input id="code" placeholder="VD: MOBILE, FIXED" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Tên dịch vụ</Label>
                  <Input id="name" placeholder="Nhập tên dịch vụ" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="groupType">Nhóm dịch vụ</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhóm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TELECOM">Viễn thông</SelectItem>
                      <SelectItem value="VAS">Giá trị gia tăng (VAS)</SelectItem>
                      <SelectItem value="OTT">OTT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="requiresLicense" defaultChecked />
                  <Label htmlFor="requiresLicense">Yêu cầu giấy phép</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreate}>Thêm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <DataTable data={filteredTypes} columns={columns} />
      </div>
    </div>
  );
}
