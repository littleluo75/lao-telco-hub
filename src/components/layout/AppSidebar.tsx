import { Layout, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  PhoneOutlined,
  WarningOutlined,
  FolderOutlined,
  SettingOutlined,
  FormOutlined,
  FileProtectOutlined,
  DatabaseOutlined,
  SearchOutlined,
  UploadOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  AppstoreOutlined,
  UserOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { useAppStore } from '@/stores/appStore';

const { Sider } = Layout;
const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: string, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const menuItems: MenuItem[] = [
    getItem('Dashboard', '/', <DashboardOutlined />),
    getItem('Quản lý Giấy phép', 'license-management', <FileTextOutlined />, [
      getItem('Hồ sơ đề nghị', '/applications', <FormOutlined />),
      getItem('Giấy phép', '/licenses', <FileProtectOutlined />),
    ]),
    getItem('Quản lý Kho số', 'resource-management', <PhoneOutlined />, [
      getItem('Dải số', '/number-ranges', <DatabaseOutlined />),
      getItem('Tra cứu thuê bao', '/subscribers', <SearchOutlined />),
    ]),
    getItem('Tuân thủ', 'compliance', <WarningOutlined />, [
      getItem('Vi phạm', '/violations', <WarningOutlined />),
      getItem('Upload dữ liệu', '/upload-data', <UploadOutlined />),
    ]),
    getItem('Danh mục', 'master-data', <FolderOutlined />, [
      getItem('Doanh nghiệp', '/enterprises', <BankOutlined />),
      getItem('Loại giấy phép', '/license-types', <SafetyCertificateOutlined />),
      getItem('Loại dịch vụ', '/service-types', <AppstoreOutlined />),
    ]),
    getItem('Hệ thống', 'system', <SettingOutlined />, [
      getItem('Người dùng', '/users', <UserOutlined />),
      getItem('Nhật ký', '/audit-logs', <HistoryOutlined />),
    ]),
  ];

  const getOpenKeys = (): string[] => {
    const path = location.pathname;
    if (['/applications', '/licenses'].includes(path)) return ['license-management'];
    if (['/number-ranges', '/subscribers'].includes(path)) return ['resource-management'];
    if (['/violations', '/upload-data'].includes(path)) return ['compliance'];
    if (['/enterprises', '/license-types', '/service-types'].includes(path)) return ['master-data'];
    if (['/users', '/audit-logs'].includes(path)) return ['system'];
    return [];
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key.startsWith('/')) navigate(e.key);
  };

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      onCollapse={toggleSidebar}
      width={256}
      collapsedWidth={80}
      style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100 }}
      theme="dark"
    >
      <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-start', padding: sidebarCollapsed ? 0 : '0 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <SafetyCertificateOutlined style={{ fontSize: 24, color: '#60a5fa' }} />
        {!sidebarCollapsed && (
          <div style={{ marginLeft: 12 }}>
            <Text strong style={{ color: '#fff', fontSize: 16, display: 'block' }}>LTRA</Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 12 }}>License Management</Text>
          </div>
        )}
      </div>
      <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} defaultOpenKeys={getOpenKeys()} items={menuItems} onClick={handleMenuClick} style={{ borderRight: 0, marginTop: 8 }} />
    </Sider>
  );
}
