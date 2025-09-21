import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  InboxOutlined, 
  UserOutlined, 
  CalendarOutlined,
  TrophyOutlined,
  GiftOutlined,
  BookOutlined,
  BarChartOutlined,
  SettingOutlined,
  BulbOutlined,
  ShoppingOutlined
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

  // 导航项目配置
  const navItems: NavItem[] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: '/inventory',
      icon: <InboxOutlined />,
      label: '库存',
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: '客户',
      badge: 3, // 示例：新客户数量
    },
    {
      key: '/events',
      icon: <CalendarOutlined />,
      label: '活动',
    },
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: '产品',
    },
    {
      key: '/gamification',
      icon: <TrophyOutlined />,
      label: '游戏',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: '分析',
    },
    {
      key: '/recommendations',
      icon: <BulbOutlined />,
      label: '推荐',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  // 获取当前激活的导航项
  const getActiveKey = (): string => {
    const path = location.pathname;
    
    // 精确匹配
    const exactMatch = navItems.find(item => item.key === path);
    if (exactMatch) return exactMatch.key;
    
    // 前缀匹配
    const prefixMatch = navItems.find(item => 
      path.startsWith(item.key) && item.key !== '/'
    );
    if (prefixMatch) return prefixMatch.key;
    
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
