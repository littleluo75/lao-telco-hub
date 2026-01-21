import { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { UsageBar } from '@/components/common/UsageBar';
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
import { Plus, Search, Filter, Eye, MoreHorizontal, Scissors, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNumberRanges, useLicenses, useEnterprises } from '@/hooks/useData';
import { NumberRange } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function NumberRanges() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAllocateOpen, setIsAllocateOpen] = useState(false);

  const { data: numberRanges = [], isLoading } = useNumberRanges();
  const { data: enterprises = [] } = useEnterprises();
  const { data: licenses = [] } = useLicenses();

  const filteredRanges = numberRanges.filter(range => {
    const matchesSearch =
      range.prefix?.includes(searchTerm) ||
      range.telco?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || range.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAllocate = () => {
    setIsAllocateOpen(false);
    toast({
      title: 'Thành công',
      description: 'Đã phân bổ dải số thành công.',
    });
  };

  const columns = [
    { key: 'prefix', header: 'Prefix' },
    {
      key: 'range',
      header: 'Dải số',
      render: (range: NumberRange) =>
        `${range.start_number.toString().slice(-7)} - ${range.end_number.toString().slice(-7)}`,
    },
    {
      key: 'block_size',
      header: 'Số lượng',
      render: (range: NumberRange) =>
        new Intl.NumberFormat('vi-VN').format(range.block_size),
    },
    {
      key: 'telco_id',
      header: 'Nhà mạng',
      render: (range: NumberRange) => range.telco?.name || '-',
    },
    {
      key: 'usage',
      header: 'Tỷ lệ sử dụng',
      render: (range: NumberRange) => (
        <div className="w-32">
          <UsageBar value={range.usage_percent || 0} />
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (range: NumberRange) => <StatusBadge status={range.status} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (range: NumberRange) => (
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
              <Scissors className="mr-2 h-4 w-4" />
              Tách dải
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Thu hồi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Calculate stats
  const inUseCount = numberRanges.filter(r => r.status === 'IN_USE').length;
  const availableCount = numberRanges.filter(r => r.status === 'AVAILABLE').length;
  const totalSubscribers = numberRanges.reduce(
    (acc, r) => acc + (r.block_size * (r.usage_percent || 0)) / 100,
    0
  );

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Quản lý Kho số"
        description="Quản lý các dải số viễn thông đã phân bổ cho nhà mạng"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo prefix, nhà mạng..."
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
                <SelectItem value="AVAILABLE">Có sẵn</SelectItem>
                <SelectItem value="ASSIGNED">Đã phân bổ</SelectItem>
                <SelectItem value="IN_USE">Đang sử dụng</SelectItem>
                <SelectItem value="REVOKED">Thu hồi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isAllocateOpen} onOpenChange={setIsAllocateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Phân bổ dải số
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Phân bổ dải số</DialogTitle>
                <DialogDescription>
                  Phân bổ dải số cho nhà mạng và liên kết với giấy phép
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="range">Dải số</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn dải số" />
                    </SelectTrigger>
                    <SelectContent>
                      {numberRanges
                        .filter(r => r.status === 'AVAILABLE')
                        .map(range => (
                          <SelectItem key={range.id} value={range.id}>
                            {range.prefix}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telco">Nhà mạng</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn nhà mạng" />
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
                  <Label htmlFor="license">Giấy phép liên kết</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giấy phép" />
                    </SelectTrigger>
                    <SelectContent>
                      {licenses.map(license => (
                        <SelectItem key={license.id} value={license.id}>
                          {license.license_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAllocateOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAllocate}>Phân bổ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
              <p className="text-sm text-muted-foreground">Tổng dải số</p>
              <p className="text-2xl font-bold">{numberRanges.length}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Đang sử dụng</p>
              <p className="text-2xl font-bold text-success">{inUseCount}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Có sẵn</p>
              <p className="text-2xl font-bold text-info">{availableCount}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Tổng số thuê bao</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat('vi-VN').format(Math.round(totalSubscribers))}
              </p>
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
          <DataTable data={filteredRanges} columns={columns} />
        )}
      </div>
    </div>
  );
}
