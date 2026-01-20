import { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, Eye, Edit, MoreHorizontal, LayoutList, Kanban, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useApplications, useUpdateApplicationStatus, useCreateApplication } from '@/hooks/useApplications';
import { useEnterprises, useLicenseTypes } from '@/hooks/useEnterprises';
import { Application, ApplicationStatus, ApplicationType } from '@/types';
import { toast } from '@/hooks/use-toast';

type ViewMode = 'table' | 'kanban';

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  
  // Form state
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState('');
  const [selectedType, setSelectedType] = useState<ApplicationType | ''>('');
  const [selectedLicenseTypeId, setSelectedLicenseTypeId] = useState('');
  
  // Queries
  const { data: applications = [], isLoading: isLoadingApps } = useApplications();
  const { data: enterprises = [], isLoading: isLoadingEnterprises } = useEnterprises();
  const { data: licenseTypes = [], isLoading: isLoadingLicenseTypes } = useLicenseTypes();
  
  // Mutations
  const updateStatusMutation = useUpdateApplicationStatus();
  const createApplicationMutation = useCreateApplication();

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.enterprise?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateApplication = () => {
    if (!selectedEnterpriseId || !selectedType) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        variant: 'destructive',
      });
      return;
    }

    const code = `HS-${new Date().getFullYear()}-${String(applications.length + 1).padStart(4, '0')}`;
    
    createApplicationMutation.mutate({
      code,
      enterprise_id: selectedEnterpriseId,
      type: selectedType as ApplicationType,
      status: 'DRAFT',
      created_by: 'admin@ltra.gov.la',
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setSelectedEnterpriseId('');
        setSelectedType('');
        setSelectedLicenseTypeId('');
      },
    });
  };

  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
    const submissionDate = newStatus === 'SUBMITTED' ? new Date().toISOString() : undefined;
    
    updateStatusMutation.mutate({
      id: applicationId,
      status: newStatus,
      submissionDate,
    });
  };

  const handleViewApplication = (app: Application) => {
    toast({
      title: 'Xem chi tiết',
      description: `Đang mở chi tiết hồ sơ ${app.code}`,
    });
  };

  const handleEditApplication = (app: Application) => {
    toast({
      title: 'Chỉnh sửa',
      description: `Đang mở form chỉnh sửa hồ sơ ${app.code}`,
    });
  };

  const columns = [
    { key: 'code', header: 'Mã hồ sơ' },
    {
      key: 'enterprise_id',
      header: 'Doanh nghiệp',
      render: (app: Application) => app.enterprise?.name || '-',
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
            <DropdownMenuItem onClick={() => handleViewApplication(app)}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditApplication(app)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const isLoading = isLoadingApps || isLoadingEnterprises;

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

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList className="h-9">
                <TabsTrigger value="table" className="px-3">
                  <LayoutList className="h-4 w-4 mr-1.5" />
                  Bảng
                </TabsTrigger>
                <TabsTrigger value="kanban" className="px-3">
                  <Kanban className="h-4 w-4 mr-1.5" />
                  Kanban
                </TabsTrigger>
              </TabsList>
            </Tabs>

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
                    <Label htmlFor="enterprise">Doanh nghiệp *</Label>
                    <Select value={selectedEnterpriseId} onValueChange={setSelectedEnterpriseId}>
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
                    <Label htmlFor="type">Loại hồ sơ *</Label>
                    <Select value={selectedType} onValueChange={(v) => setSelectedType(v as ApplicationType)}>
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
                    <Select value={selectedLicenseTypeId} onValueChange={setSelectedLicenseTypeId}>
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
                  <Button 
                    onClick={handleCreateApplication}
                    disabled={createApplicationMutation.isPending}
                  >
                    {createApplicationMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Tạo hồ sơ
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Content based on view mode */}
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-[500px] w-[300px] rounded-xl" />
              ))}
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <DataTable data={filteredApplications} columns={columns} />
        ) : (
          <KanbanBoard
            applications={statusFilter === 'all' ? applications : filteredApplications}
            enterprises={enterprises}
            onStatusChange={handleStatusChange}
            onView={handleViewApplication}
            onEdit={handleEditApplication}
          />
        )}
      </div>
    </div>
  );
}
