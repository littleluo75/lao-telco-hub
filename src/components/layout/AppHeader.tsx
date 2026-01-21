import { Layout, Input, Badge, Dropdown, Button, Space, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { SearchOutlined, BellOutlined, SettingOutlined, GlobalOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

interface AppHeaderProps {
  title?: string;
  description?: string;
}

export function AppHeader({ title, description }: AppHeaderProps) {
  const notificationItems: MenuProps['items'] = [
    { key: '1', label: <div><Text strong>Hồ sơ mới cần xử lý</Text><br/><Text type="secondary" style={{ fontSize: 12 }}>HS-2024-004 đang chờ phê duyệt</Text></div> },
    { key: '2', label: <div><Text strong>Giấy phép sắp hết hạn</Text><br/><Text type="secondary" style={{ fontSize: 12 }}>2 giấy phép sẽ hết hạn trong 30 ngày</Text></div> },
  ];

  return (
    <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 50, height: 64 }}>
      <div>
        {title && <Text strong style={{ fontSize: 20 }}>{title}</Text>}
        {description && <Text type="secondary" style={{ marginLeft: 16 }}>{description}</Text>}
      </div>
      <Space size={16}>
        <Input placeholder="Tìm kiếm..." prefix={<SearchOutlined />} style={{ width: 200 }} />
        <Dropdown menu={{ items: notificationItems }} placement="bottomRight" trigger={['click']}>
          <Badge count={3} size="small"><Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} /></Badge>
        </Dropdown>
        <Button type="text" icon={<SettingOutlined style={{ fontSize: 18 }} />} />
      </Space>
    </Header>
  );
}

export default AppHeader;
