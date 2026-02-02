import { useState } from 'react';
import { Table, Tag, Button, Select, Space, Modal, Avatar, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useUsers, useRoles, useAssignRole, useRemoveRole } from '@/hooks/useRoleData';
import type { User, Role } from '@/types';

export default function UserRolesTab() {
  const { data: users = [], isLoading: loadingUsers } = useUsers();
  const { data: roles = [], isLoading: loadingRoles } = useRoles();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleAssignRole = () => {
    if (selectedUser && selectedRole) {
      assignRole.mutate(
        { userId: selectedUser, roleId: selectedRole },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setSelectedUser(null);
            setSelectedRole(null);
          },
        }
      );
    }
  };

  const handleRemoveRole = (userId: string, roleId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa vai trò',
      content: 'Bạn có chắc chắn muốn xóa vai trò này khỏi người dùng?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        removeRole.mutate({ userId, roleId });
      },
    });
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

  const columns: ColumnsType<User> = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar_url} />
          <div>
            <div className="font-medium">{record.full_name}</div>
            <div className="text-xs text-muted-foreground">{record.email}</div>
          </div>
        </Space>
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
    {
      title: 'Vai trò',
      key: 'roles',
      render: (_, record) => (
        <Space wrap>
          {record.roles?.map((role) => (
            <Tag
              key={role.id}
              color={getRoleColor(role.code)}
              closable
              onClose={(e) => {
                e.preventDefault();
                handleRemoveRole(record.id, role.id);
              }}
            >
              {role.name}
            </Tag>
          ))}
          {(!record.roles || record.roles.length === 0) && (
            <span className="text-muted-foreground text-sm">Chưa gán vai trò</span>
          )}
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Tooltip title="Thêm vai trò">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedUser(record.id);
              setIsModalOpen(true);
            }}
          >
            Thêm vai trò
          </Button>
        </Tooltip>
      ),
    },
  ];

  // Get available roles for selected user (exclude already assigned)
  const getAvailableRoles = () => {
    if (!selectedUser) return roles;
    const user = users.find((u) => u.id === selectedUser);
    const assignedRoleIds = user?.roles?.map((r) => r.id) || [];
    return roles.filter((r) => !assignedRoleIds.includes(r.id));
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loadingUsers}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Gán vai trò cho người dùng"
        open={isModalOpen}
        onOk={handleAssignRole}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
          setSelectedRole(null);
        }}
        okText="Gán vai trò"
        cancelText="Hủy"
        confirmLoading={assignRole.isPending}
        okButtonProps={{ disabled: !selectedRole }}
      >
        <div className="py-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Người dùng</label>
            <Select
              className="w-full"
              placeholder="Chọn người dùng"
              value={selectedUser}
              onChange={setSelectedUser}
              loading={loadingUsers}
              options={users.map((u) => ({
                value: u.id,
                label: `${u.full_name} (${u.email})`,
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Vai trò</label>
            <Select
              className="w-full"
              placeholder="Chọn vai trò"
              value={selectedRole}
              onChange={setSelectedRole}
              loading={loadingRoles}
              options={getAvailableRoles().map((r) => ({
                value: r.id,
                label: r.name,
              }))}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
