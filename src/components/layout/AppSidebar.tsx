import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Building2,
  Phone,
  Users,
  AlertTriangle,
  Settings,
  Database,
  ChevronDown,
  ChevronRight,
  ScrollText,
  ClipboardList,
  FolderOpen,
  Search,
  Upload,
  Shield,
  UserCog,
  History,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Quản lý Giấy phép',
    icon: FileText,
    children: [
      { title: 'Hồ sơ đề nghị', path: '/applications', icon: ClipboardList },
      { title: 'Giấy phép', path: '/licenses', icon: ScrollText },
    ],
  },
  {
    title: 'Quản lý Kho số',
    icon: Phone,
    children: [
      { title: 'Dải số', path: '/number-ranges', icon: Database },
      { title: 'Tra cứu thuê bao', path: '/subscribers', icon: Search },
    ],
  },
  {
    title: 'Tuân thủ',
    icon: AlertTriangle,
    children: [
      { title: 'Vi phạm', path: '/violations', icon: AlertTriangle },
      { title: 'Upload dữ liệu', path: '/upload-data', icon: Upload },
    ],
  },
  {
    title: 'Danh mục',
    icon: FolderOpen,
    children: [
      { title: 'Doanh nghiệp', path: '/enterprises', icon: Building2 },
      { title: 'Loại giấy phép', path: '/license-types', icon: FileText },
      { title: 'Loại dịch vụ', path: '/service-types', icon: Settings },
    ],
  },
  {
    title: 'Hệ thống',
    icon: Shield,
    children: [
      { title: 'Người dùng', path: '/users', icon: UserCog },
      { title: 'Nhật ký hệ thống', path: '/audit-logs', icon: History },
    ],
  },
];

interface SidebarNavItemProps {
  item: NavItem;
  isCollapsed: boolean;
}

function SidebarNavItem({ item, isCollapsed }: SidebarNavItemProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(
    item.children?.some(child => child.path === location.pathname) || false
  );

  const isActive = item.path === location.pathname;
  const hasActiveChild = item.children?.some(
    child => child.path === location.pathname
  );

  if (item.children) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'nav-link w-full justify-between',
            hasActiveChild && 'bg-sidebar-accent/50'
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>{item.title}</span>}
          </div>
          {!isCollapsed && (
            <span className="transition-transform duration-200">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}
        </button>
        {isOpen && !isCollapsed && (
          <div className="ml-4 space-y-1 border-l border-sidebar-border pl-3">
            {item.children.map(child => (
              <NavLink
                key={child.path}
                to={child.path!}
                className={({ isActive }) =>
                  cn('nav-link text-sm', isActive && 'nav-link-active')
                }
              >
                <child.icon className="h-4 w-4 shrink-0" />
                <span>{child.title}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path!}
      className={({ isActive }) =>
        cn('nav-link', isActive && 'nav-link-active')
      }
    >
      <item.icon className="h-5 w-5 shrink-0" />
      {!isCollapsed && <span>{item.title}</span>}
    </NavLink>
  );
}

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ isCollapsed, onToggle }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Shield className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">
                LTRA
              </span>
              <span className="text-xs text-sidebar-muted">
                License Management
              </span>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map(item => (
          <SidebarNavItem
            key={item.title}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
            <Users className="h-4 w-4 text-sidebar-accent-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-sidebar-foreground">
                Admin User
              </span>
              <span className="text-xs text-sidebar-muted">
                admin@ltra.gov.la
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
