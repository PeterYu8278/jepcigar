import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Badge } from 'antd';
import { 
  HomeOutlined, 
  CalendarOutlined, 
  GiftOutlined, 
  UserOutlined,
  CrownOutlined
} from '@ant-design/icons';
import './CustomerBottomNavigation.css';

interface CustomerBottomNavigationProps {
  className?: string;
}

const CustomerBottomNavigation: React.FC<CustomerBottomNavigationProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      key: 'home',
      path: '/customer',
      icon: <HomeOutlined />,
      label: '首页',
      badge: null,
    },
    {
      key: 'events',
      path: '/customer/events',
      icon: <CalendarOutlined />,
      label: '活动',
      badge: 2, // 示例：有2个新活动
    },
    {
      key: 'marketplace',
      path: '/customer/marketplace',
      icon: <GiftOutlined />,
      label: '商城',
      badge: null,
    },
    {
      key: 'profile',
      path: '/customer/profile',
      icon: <UserOutlined />,
      label: '我的',
      badge: null,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    if (path === '/customer') {
      return location.pathname === '/customer' || location.pathname === '/customer/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`customer-bottom-nav ${className || ''}`}>
      <div className="nav-container">
        {navigationItems.map((item) => (
          <Button
            key={item.key}
            type="text"
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <div className="nav-icon-wrapper">
              {item.badge ? (
                <Badge count={item.badge} size="small" offset={[-5, 5]}>
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </div>
            <span className="nav-label">{item.label}</span>
          </Button>
        ))}
        
        {/* VIP会员入口 */}
        <Button
          type="text"
          className="nav-item vip-item"
          onClick={() => navigate('/customer/vip')}
        >
          <div className="nav-icon-wrapper">
            <CrownOutlined />
          </div>
          <span className="nav-label">VIP</span>
        </Button>
      </div>
    </div>
  );
};

export default CustomerBottomNavigation;
