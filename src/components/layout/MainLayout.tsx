import { Layout } from 'antd';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import { useAppStore } from '@/stores/appStore';

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout
        style={{
          marginLeft: sidebarCollapsed ? 80 : 256,
          transition: 'margin-left 0.2s',
        }}
      >
        <AppHeader />
        <Content
          style={{
            margin: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
