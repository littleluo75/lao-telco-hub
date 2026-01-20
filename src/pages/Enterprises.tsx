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
import { Plus, Search, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { enterprises, enterpriseTypes } from '@/data/mockData';
import { Enterprise } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function Enterprises() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredEnterprises = enterprises.filter(enterprise =>
    enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enterprise.tax_code.includes(searchTerm)
  );

  const handleCreate = () => {
    setIsCreateOpen(false);
    toast({
      title: 'Thành công',
      description: 'Doanh nghiệp mới đã được tạo.',
    });
  };

  const columns = [
    { key: 'name', header: 'Tên doanh nghiệp' },
    { key: 'tax_code', header: 'Mã số thuế' },
    { key: 'representative', header: 'Người đại diện' },
    {
      key: 'enterprise_type_id',
      header: 'Loại hình',
      render: (e: Enterprise) => {
        const type = enterpriseTypes.find(t => t.id === e.enterprise_type_id);
        return type?.name || '-';
      },
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (e: Enterprise) => <StatusBadge status={e.status} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (e: Enterprise) => (
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
        title="Quản lý Doanh nghiệp"
        description="Danh sách các doanh nghiệp viễn thông đang hoạt động"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, MST..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm doanh nghiệp
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm doanh nghiệp mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin doanh nghiệp viễn thông mới
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Tên doanh nghiệp</Label>
                  <Input id="name" placeholder="Nhập tên doanh nghiệp" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="taxCode">Mã số thuế</Label>
                  <Input id="taxCode" placeholder="Nhập mã số thuế" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="representative">Người đại diện</Label>
                  <Input id="representative" placeholder="Nhập tên người đại diện" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Loại hình doanh nghiệp</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại hình" />
                    </SelectTrigger>
                    <SelectContent>
                      {enterpriseTypes.map(type => (
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
                <Button onClick={handleCreate}>Thêm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <DataTable data={filteredEnterprises} columns={columns} />
      </div>
    </div>
  );
}
