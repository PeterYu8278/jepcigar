import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Drawer, Button, Avatar, Space, Typography, Badge } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  HomeOutlined,
  InboxOutlined,
  TeamOutlined,
  CalendarOutlined,
  GiftOutlined,
  TrophyOutlined,
  BookOutlined,
  BarChartOutlined,
  ShareAltOutlined,
  BulbOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import useMobile from '@/hooks/useMobile';
import MobileNavigation from '@/components/Layout/MobileNavigation';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

interface MobileAppLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const MobileAppLayout: React.FC<MobileAppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  const { user, logout } = useAuthStore();
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  // 菜单项配置
  const menuItems: MenuItem[] = [
    { key: '/dashboard', label: '仪表板', icon: <HomeOutlined />, path: '/dashboard' },
    { key: '/inventory', label: '库存管理', icon: <InboxOutlined />, path: '/inventory' },
    { key: '/customers', label: '客户管理', icon: <TeamOutlined />, path: '/customers' },
    { key: '/events', label: '活动管理', icon: <CalendarOutlined />, path: '/events' },
    { key: '/gifting', label: '礼品管理', icon: <GiftOutlined />, path: '/gifting' },
    { key: '/gamification', label: '游戏化', icon: <TrophyOutlined />, path: '/gamification' },
    { key: '/academy', label: '学院', icon: <BookOutlined />, path: '/academy' },
    { key: '/analytics', label: '数据分析', icon: <BarChartOutlined />, path: '/analytics' },
    { key: '/referrals', label: '推荐', icon: <ShareAltOutlined />, path: '/referrals' },
    { key: '/recommendations', label: 'AI推荐', icon: <BulbOutlined />, path: '/recommendations' },
    { key: '/gamification?tab=royal', label: '皇家计划', icon: <CrownOutlined />, path: '/gamification?tab=royal' },
    { key: '/settings', label: '设置', icon: <SettingOutlined />, path: '/settings' },
  ];

  // 获取当前页面标题
  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem?.label || 'JEP Cigar';
  };

  // 处理菜单点击
  const handleMenuClick = (path: string) => {
    navigate(path);
    setMobileMenuVisible(false);
  };

  // 处理退出登录
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  // 移动端菜单渲染
  const renderMobileMenu = () => (
    <div className="mobile-container">
      <div className="mobile-spacing-lg">
        {/* 用户信息 */}
        <div className="mobile-flex-start mobile-spacing-md mb-6">
          <Avatar 
            size={48} 
            icon={<UserOutlined />}
            className="bg-primary-100 text-primary-600"
          />
          <div className="flex-1">
            <Text className="mobile-text-lg font-medium block">
              {user?.displayName || user?.email || '用户'}
            </Text>
            <Text className="mobile-text-sm text-gray-500">
              {user?.email}
            </Text>
          </div>
        </div>

        {/* 菜单项 */}
        <div className="mobile-flex-col">
          {menuItems.map((item) => (
            <Button
              key={item.key}
              type={location.pathname === item.path ? 'primary' : 'text'}
              icon={item.icon}
              className={`
                mobile-btn mobile-btn-full justify-start mb-2
                ${location.pathname === item.path ? 'mobile-btn-primary' : 'mobile-btn-secondary'}
              `}
              onClick={() => handleMenuClick(item.path)}
            >
              <div className="mobile-flex-between w-full">
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge count={item.badge} size="small" />
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* 退出按钮 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            className="mobile-btn mobile-btn-full justify-start"
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </div>
      </div>
    </div>
  );

  // 桌面端渲染
  if (!isMobile) {
    return (
      <Layout className="min-h-screen">
        <Content className="bg-gray-50">
          {children}
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* 移动端头部 */}
      <Header className="mobile-safe-top bg-white border-b border-gray-200 sticky top-0 z-50 px-4">
        <div className="mobile-flex-between items-center h-full">
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="mobile-touch-target"
            onClick={() => setMobileMenuVisible(true)}
          />
          
          <Text className="mobile-title-h4 font-medium">
            {getPageTitle()}
          </Text>
          
          <Space>
            <Button
              type="text"
              icon={<BellOutlined />}
              className="mobile-touch-target"
            />
            <Avatar 
              size={32} 
              icon={<UserOutlined />}
              className="mobile-touch-target"
            />
          </Space>
        </div>
      </Header>

      {/* 主内容区域 */}
      <Content className="flex-1 overflow-y-auto">
        {children}
      </Content>

      {/* 移动端底部导航 */}
      <Footer className="mobile-safe-bottom p-0 border-t border-gray-200">
        <MobileNavigation />
      </Footer>

      {/* 侧边菜单抽屉 */}
      <Drawer
        title="菜单"
        placement="left"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={280}
        className="mobile-drawer"
        styles={{ 
          body: { padding: 0 },
          header: { padding: '16px 16px 0 16px' }
        }}
      >
        {renderMobileMenu()}
      </Drawer>
    </Layout>
  );
};

export default MobileAppLayout;
