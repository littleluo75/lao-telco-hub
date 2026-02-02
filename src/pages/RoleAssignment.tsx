import { useState } from 'react';
import { Tabs, Card } from 'antd';
import { UserOutlined, SafetyCertificateOutlined, LockOutlined } from '@ant-design/icons';
import PageHeader from '@/components/common/PageHeader';
import UserRolesTab from '@/components/roles/UserRolesTab';
import RolePermissionsTab from '@/components/roles/RolePermissionsTab';
import RoleListTab from '@/components/roles/RoleListTab';

export default function RoleAssignment() {
  const [activeTab, setActiveTab] = useState('users');

  const tabItems = [
    {
      key: 'users',
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Gán vai trò cho người dùng
        </span>
      ),
      children: <UserRolesTab />,
    },
    {
      key: 'roles',
      label: (
        <span className="flex items-center gap-2">
          <SafetyCertificateOutlined />
          Danh sách vai trò
        </span>
      ),
      children: <RoleListTab />,
    },
    {
      key: 'permissions',
      label: (
        <span className="flex items-center gap-2">
          <LockOutlined />
          Phân quyền
        </span>
      ),
      children: <RolePermissionsTab />,
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Quản lý phân quyền"
        description="Gán vai trò cho người dùng và thiết lập quyền hạn truy cập"
      />
      <Card className="shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Card>
    </div>
  );
}
