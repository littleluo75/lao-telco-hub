import { Table, Tag, Space, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRoles, useUserRoles, useRolePermissions } from '@/hooks/useRoleData';
import type { Role } from '@/types';

export default function RoleListTab() {
  const { data: roles = [], isLoading } = useRoles();
  const { data: userRoles = [] } = useUserRoles();
  const { data: permissions = [] } = useRolePermissions();

  const getUserCount = (roleId: string) => {
    return userRoles.filter((ur) => ur.role_id === roleId).length;
  };

  const getPermissionCount = (roleId: string) => {
    return permissions.filter((p) => p.role_id === roleId).length;
  };

  const getRoleColor = (code: string) => {
    const colors: Record<string, string> = {
      admin: 'red',
      director: 'purple',
      reviewer: 'blue',
      staff: 'green',
    };
    return colors[code] || 'default';
  };

  const columns: ColumnsType<Role> = [
    {
      title: 'Mã vai trò',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code: string) => (
        <Tag color={getRoleColor(code)}>{code.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className="font-medium">{name}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Số người dùng',
      key: 'userCount',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <Badge count={getUserCount(record.id)} showZero color="blue" />
      ),
    },
    {
      title: 'Số quyền',
      key: 'permissionCount',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Badge count={getPermissionCount(record.id)} showZero color="green" />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'default'}>
          {status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={roles}
      rowKey="id"
      loading={isLoading}
      pagination={false}
    />
  );
}
