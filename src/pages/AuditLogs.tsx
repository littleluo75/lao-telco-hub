import { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { DataTable } from '@/components/common/DataTable';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { systemLogs } from '@/data/mockData';
import { SystemLog } from '@/types';
import { Badge } from '@/components/ui/badge';

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = systemLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction =
      actionFilter === 'all' || log.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('CREATE')) return 'default';
    if (action.includes('UPDATE')) return 'secondary';
    if (action.includes('APPROVE')) return 'outline';
    if (action.includes('ALLOCATE')) return 'outline';
    return 'secondary';
  };

  const columns = [
    {
      key: 'created_at',
      header: 'Thời gian',
      render: (log: SystemLog) =>
        new Date(log.created_at).toLocaleString('vi-VN'),
    },
    {
      key: 'action',
      header: 'Hành động',
      render: (log: SystemLog) => (
        <Badge variant={getActionBadgeVariant(log.action) as any}>
          {log.action}
        </Badge>
      ),
    },
    { key: 'actor', header: 'Người thực hiện' },
    { key: 'target_entity', header: 'Đối tượng' },
    { key: 'details', header: 'Chi tiết' },
  ];

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Nhật ký Hệ thống"
        description="Theo dõi các hoạt động trong hệ thống"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Lọc hành động" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="CREATE">Tạo mới</SelectItem>
              <SelectItem value="UPDATE">Cập nhật</SelectItem>
              <SelectItem value="APPROVE">Phê duyệt</SelectItem>
              <SelectItem value="ALLOCATE">Phân bổ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Tổng sự kiện</p>
            <p className="text-2xl font-bold">{systemLogs.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Hôm nay</p>
            <p className="text-2xl font-bold">
              {
                systemLogs.filter(
                  l =>
                    new Date(l.created_at).toDateString() ===
                    new Date().toDateString()
                ).length
              }
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Tuần này</p>
            <p className="text-2xl font-bold">{systemLogs.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Người dùng hoạt động</p>
            <p className="text-2xl font-bold">
              {new Set(systemLogs.map(l => l.actor)).size}
            </p>
          </div>
        </div>

        {/* Table */}
        <DataTable data={filteredLogs} columns={columns} />
      </div>
    </div>
  );
}
