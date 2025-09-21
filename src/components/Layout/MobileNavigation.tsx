import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  InboxOutlined, 
  UserOutlined, 
  CalendarOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Badge } from 'antd';

interface MobileNavigationProps {
  className?: string;
}

interface NavItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 简化的导航项目配置（只显示核心功能）
  const navItems: NavItem[] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '首页',
    },
    {
      key: '/products',
      icon: <InboxOutlined />,
      label: '产品',
    },
    {
      key: '/events',
      icon: <CalendarOutlined />,
      label: '活动',
    },
    {
      key: '/system',
      icon: <SettingOutlined />,
      label: '系统',
    },
    {
      key: '/settings',
      icon: <UserOutlined />,
      label: '设置',
    },
  ];

  // 获取当前激活的导航项
  const getActiveKey = (): string => {
    const path = location.pathname;
    
    // 直接匹配主要路由
    if (path === '/dashboard') return '/dashboard';
    if (path.startsWith('/products') || path.startsWith('/gifting') || 
        path.startsWith('/academy') || path.startsWith('/marketplace') || path.startsWith('/points') ||
        path.startsWith('/recommendations') || path.startsWith('/ai-recommendations')) {
      return '/products';
    }
    if (path.startsWith('/events')) return '/events';
    if (path.startsWith('/system') || path.startsWith('/inventory') || path.startsWith('/customers') || 
        path.startsWith('/analytics') || path.startsWith('/finance') || path.startsWith('/reports')) {
      return '/system';
    }
    if (path.startsWith('/settings') || path.startsWith('/profile')) return '/settings';
    
    return '/dashboard'; // 默认
  };

  const activeKey = getActiveKey();

  // 处理导航点击
  const handleNavClick = (key: string) => {
    navigate(key);
  };

  return (
    <div className={`mobile-nav ${className}`}>
      <div className="flex justify-around items-center py-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavClick(item.key)}
            className={`
              mobile-nav-item touch-target touch-feedback
              ${activeKey === item.key ? 'active' : ''}
              flex flex-col items-center justify-center py-2 px-1 text-xs
              transition-colors duration-200
            `}
            style={{
              minWidth: '44px',
              minHeight: '44px',
            }}
          >
            <div className="relative">
              {item.badge && item.badge > 0 ? (
                <Badge count={item.badge} size="small" offset={[-2, 2]}>
                  <span className="text-lg">{item.icon}</span>
                </Badge>
              ) : (
                <span className="text-lg">{item.icon}</span>
              )}
            </div>
            <span className="mt-1 text-center leading-tight">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
