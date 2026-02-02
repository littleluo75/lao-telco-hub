import { useState, useMemo } from 'react';
import { Table, Tag, Button, Select, Space, Modal, Popconfirm, Card } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useRoles,
  useResources,
  useRolePermissions,
  useCreateRolePermission,
  useDeleteRolePermission,
} from '@/hooks/useRoleData';
import type { RolePermission, PermissionAction, PermissionScope } from '@/types';

const ACTION_OPTIONS: { value: PermissionAction; label: string; color: string }[] = [
  { value: 'create', label: 'Tạo mới', color: 'green' },
  { value: 'read', label: 'Xem', color: 'blue' },
  { value: 'edit', label: 'Sửa', color: 'orange' },
  { value: 'delete', label: 'Xóa', color: 'red' },
];

const SCOPE_OPTIONS: { value: PermissionScope; label: string; color: string }[] = [
  { value: 'own', label: 'Của mình', color: 'cyan' },
  { value: 'any', label: 'Tất cả', color: 'purple' },
];

export default function RolePermissionsTab() {
  const { data: roles = [], isLoading: loadingRoles } = useRoles();
  const { data: resources = [], isLoading: loadingResources } = useResources();
  const { data: permissions = [], isLoading: loadingPermissions } = useRolePermissions();
  const createPermission = useCreateRolePermission();
  const deletePermission = useDeleteRolePermission();

  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPermission, setNewPermission] = useState<{
    role_id: string;
    resource: string;
    action: PermissionAction;
    scope: PermissionScope;
  }>({
    role_id: '',
    resource: '',
    action: 'read',
    scope: 'own',
  });

  const filteredPermissions = useMemo(() => {
    if (!selectedRoleFilter) return permissions;
    return permissions.filter((p) => p.role_id === selectedRoleFilter);
  }, [permissions, selectedRoleFilter]);

  const handleCreatePermission = () => {
    if (newPermission.role_id && newPermission.resource) {
      createPermission.mutate(newPermission, {
        onSuccess: () => {
          setIsModalOpen(false);
          setNewPermission({ role_id: '', resource: '', action: 'read', scope: 'own' });
        },
      });
    }
  };

  const getActionTag = (action: PermissionAction) => {
    const option = ACTION_OPTIONS.find((a) => a.value === action);
    return <Tag color={option?.color}>{option?.label}</Tag>;
  };

  const getScopeTag = (scope: PermissionScope) => {
    const option = SCOPE_OPTIONS.find((s) => s.value === scope);
    return <Tag color={option?.color}>{option?.label}</Tag>;
  };

  const getResourceName = (code: string) => {
    const resource = resources.find((r) => r.code === code);
    return resource?.name || code;
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

  const columns: ColumnsType<RolePermission> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Vai trò',
      key: 'role',
      width: 160,
      render: (_, record) => {
        const role = record.role;
        return role ? (
          <Tag color={getRoleColor(role.code)}>{role.name}</Tag>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      title: 'Tài nguyên',
      dataIndex: 'resource',
      key: 'resource',
      render: (resource: string) => (
        <span className="font-medium">{getResourceName(resource)}</span>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (action: PermissionAction) => getActionTag(action),
    },
    {
      title: 'Phạm vi',
      dataIndex: 'scope',
      key: 'scope',
      width: 120,
      render: (scope: PermissionScope) => getScopeTag(scope),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Xác nhận xóa quyền?"
          description="Bạn có chắc chắn muốn xóa quyền này?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={() => deletePermission.mutate(record.id)}
        >
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Space>
          <span className="text-sm font-medium">Lọc theo vai trò:</span>
          <Select
            allowClear
            placeholder="Tất cả vai trò"
            style={{ width: 200 }}
            value={selectedRoleFilter}
            onChange={setSelectedRoleFilter}
            loading={loadingRoles}
            options={roles.map((r) => ({ value: r.id, label: r.name }))}
          />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
          Thêm quyền
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredPermissions}
        rowKey="id"
        loading={loadingPermissions}
        pagination={{ pageSize: 10 }}
        size="middle"
      />

      <Modal
        title="Thêm quyền mới"
        open={isModalOpen}
        onOk={handleCreatePermission}
        onCancel={() => {
          setIsModalOpen(false);
          setNewPermission({ role_id: '', resource: '', action: 'read', scope: 'own' });
        }}
        okText="Thêm quyền"
        cancelText="Hủy"
        confirmLoading={createPermission.isPending}
        okButtonProps={{ disabled: !newPermission.role_id || !newPermission.resource }}
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Vai trò</label>
            <Select
              className="w-full"
              placeholder="Chọn vai trò"
              value={newPermission.role_id || undefined}
              onChange={(value) => setNewPermission({ ...newPermission, role_id: value })}
              loading={loadingRoles}
              options={roles.map((r) => ({ value: r.id, label: r.name }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tài nguyên</label>
            <Select
              className="w-full"
              placeholder="Chọn tài nguyên"
              value={newPermission.resource || undefined}
              onChange={(value) => setNewPermission({ ...newPermission, resource: value })}
              loading={loadingResources}
              options={resources.map((r) => ({ value: r.code, label: r.name }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hành động</label>
            <Select
              className="w-full"
              value={newPermission.action}
              onChange={(value) => setNewPermission({ ...newPermission, action: value })}
              options={ACTION_OPTIONS.map((a) => ({ value: a.value, label: a.label }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phạm vi</label>
            <Select
              className="w-full"
              value={newPermission.scope}
              onChange={(value) => setNewPermission({ ...newPermission, scope: value })}
              options={SCOPE_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
