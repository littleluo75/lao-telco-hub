import { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Search, Edit, MoreHorizontal, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Nguyễn Văn Admin',
    email: 'admin@ltra.gov.la',
    role: 'Administrator',
    department: 'IT',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Trần Thị Reviewer',
    email: 'reviewer@ltra.gov.la',
    role: 'Reviewer',
    department: 'License Management',
    status: 'ACTIVE',
  },
  {
    id: '3',
    name: 'Lê Văn Director',
    email: 'director@ltra.gov.la',
    role: 'Director',
    department: 'Management',
    status: 'ACTIVE',
  },
  {
    id: '4',
    name: 'Phạm Thị User',
    email: 'user@ltra.gov.la',
    role: 'Staff',
    department: 'Resource Management',
    status: 'ACTIVE',
  },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredUsers = mockUsers.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setIsCreateOpen(false);
    toast({
      title: 'Thành công',
      description: 'Người dùng mới đã được tạo.',
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Administrator':
        return 'destructive';
      case 'Director':
        return 'default';
      case 'Reviewer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const columns = [
    { key: 'name', header: 'Họ tên' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Vai trò',
      render: (user: User) => (
        <Badge variant={getRoleBadgeVariant(user.role) as any}>
          {user.role}
        </Badge>
      ),
    },
    { key: 'department', header: 'Phòng ban' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (user: User) => (
        <Badge
          variant="outline"
          className={
            user.status === 'ACTIVE' ? 'status-active' : 'status-draft'
          }
        >
          {user.status === 'ACTIVE' ? 'Hoạt động' : 'Khóa'}
        </Badge>
      ),
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
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Phân quyền
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <AppHeader
        title="Quản lý Người dùng"
        description="Quản lý tài khoản người dùng hệ thống"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm người dùng
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm người dùng</DialogTitle>
                <DialogDescription>
                  Tạo tài khoản người dùng mới
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Họ tên</Label>
                  <Input id="name" placeholder="Nhập họ tên" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Nhập email" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Vai trò</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Phòng ban</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="license">License Management</SelectItem>
                      <SelectItem value="resource">Resource Management</SelectItem>
                      <SelectItem value="management">Management</SelectItem>
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
        <DataTable data={filteredUsers} columns={columns} />
      </div>
    </div>
  );
}
