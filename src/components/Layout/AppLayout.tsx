import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Badge, Space, Typography, Drawer } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  InboxOutlined,
  UserOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  CrownOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCustomerStore } from '@/stores/customerStore';
import useMobile from '@/hooks/useMobile';
import MobileNavigation from './MobileNavigation';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { referrals } = useCustomerStore();
  const { isMobile } = useMobile();

  // 简化的菜单配置 - 只保留核心功能
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: '/products',
      icon: <InboxOutlined />,
      label: '产品中心',
    },
    {
      key: '/customers',
      icon: <UserOutlined />,
      label: '客户管理',
    },
    {
      key: '/events',
      icon: <CalendarOutlined />,
      label: '活动管理',
    },
    {
      key: '/analytics',
      icon: <BarChartOutlined />,
      label: '数据分析',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  // Get current user's tier and points
  const getUserTier = () => {
    // TODO: Get from customer loyalty store
    return { tier: 'Gold', points: 1250 };
  };

  const userTier = getUserTier();

  // User dropdown menu
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: '通知设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    } else {
      navigate(key);
    }
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
    } else {
      navigate(`/${key}`);
    }
  };

  // 简化的路由选择逻辑
  const getSelectedKeys = () => {
    const path = location.pathname;
    
    // 直接匹配主要路由
    if (path === '/dashboard') return ['/dashboard'];
    if (path.startsWith('/system') || path.startsWith('/inventory') || path.startsWith('/customers') || 
        path.startsWith('/analytics') || path.startsWith('/products') || path.startsWith('/gifting') || 
        path.startsWith('/academy') || path.startsWith('/marketplace') || path.startsWith('/points') ||
        path.startsWith('/recommendations') || path.startsWith('/ai-recommendations') || 
        path.startsWith('/settings') || path.startsWith('/profile') || path.startsWith('/finance') || 
        path.startsWith('/reports')) {
      return ['/system'];
    }
    if (path.startsWith('/events')) return ['/events'];
    
    return ['/dashboard']; // 默认选中仪表板
  };

  // 移动端渲染
  if (isMobile) {
    return (
      <Layout className="min-h-screen">
        <Header className="app-header px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setMobileMenuVisible(true)}
              className="text-white hover:bg-white/20"
              size="large"
            />
            
            <div className="flex items-center space-x-2 text-white">
              <CrownOutlined className="text-lg" />
              <span className="text-lg font-bold">JEP Cigar</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge count={referrals.length} size="small">
              <Button 
                type="text" 
                icon={<ShareAltOutlined />} 
                className="text-white hover:bg-white/20"
                onClick={() => navigate('/referrals')}
              />
            </Badge>
            
            <Badge count={3} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                className="text-white hover:bg-white/20"
              />
            </Badge>
            
            <Dropdown
              menu={{ 
                items: userMenuItems, 
                onClick: handleUserMenuClick 
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 rounded-lg px-2 py-1 transition-colors">
                <Avatar 
                  src={user?.avatar} 
                  icon={<UserOutlined />}
                  className="bg-primary-500"
                />
              </div>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="app-content main-scroll" style={{ paddingBottom: '80px' }}>
          <div className="max-w-full">
            {children}
          </div>
        </Content>
        
        <MobileNavigation />
        
        <Drawer
          title="菜单"
          placement="left"
          onClose={() => setMobileMenuVisible(false)}
          open={mobileMenuVisible}
          width={280}
          styles={{ body: { padding: 0 } }}
        >
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            items={menuItems}
            onClick={handleMenuClick}
            className="border-r-0"
          />
        </Drawer>
      </Layout>
    );
  }

  // 桌面端渲染
  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="app-sidebar"
        width={240}
        collapsedWidth={80}
      >
        <div className="flex items-center justify-center h-16 px-4">
          {collapsed ? (
            <div className="text-2xl font-bold text-gradient">J</div>
          ) : (
            <div className="flex items-center space-x-2">
              <CrownOutlined className="text-2xl text-primary-500" />
              <span className="text-xl font-bold text-gradient">JEP Cigar</span>
            </div>
          )}
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-r-0"
          style={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}
        />
      </Sider>
      
      <Layout>
        <Header className="app-header px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-white hover:bg-white/20"
              size="large"
            />
            
            <div className="hidden md:flex items-center space-x-2 text-white">
              <CrownOutlined className="text-lg" />
              <Text className="text-white">
                {userTier.tier} 会员
              </Text>
              <Badge count={userTier.points} showZero color="#DAA520">
                <span className="text-white/80">积分</span>
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Space size="middle">
              <Badge count={referrals.length} size="small">
                <Button 
                  type="text" 
                  icon={<ShareAltOutlined />} 
                  className="text-white hover:bg-white/20"
                  onClick={() => navigate('/settings?tab=referral')}
                />
              </Badge>
              
              <Badge count={3} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined />} 
                  className="text-white hover:bg-white/20"
                />
              </Badge>
              
              <Dropdown
                menu={{ 
                  items: userMenuItems, 
                  onClick: handleUserMenuClick 
                }}
                placement="bottomRight"
                trigger={['click']}
              >
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 rounded-lg px-2 py-1 transition-colors">
                  <Avatar 
                    src={user?.avatar} 
                    icon={<UserOutlined />}
                    className="bg-primary-500"
                  />
                  {!collapsed && (
                    <div className="text-white">
                      <div className="text-sm font-medium">{user?.displayName}</div>
                      <div className="text-xs text-white/70">{user?.role}</div>
                    </div>
                  )}
                </div>
              </Dropdown>
            </Space>
          </div>
        </Header>
        
        <Content className="app-content main-scroll">
          <div className="max-w-full">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
