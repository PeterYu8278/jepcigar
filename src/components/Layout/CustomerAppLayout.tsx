import React, { useState } from 'react';
import { Layout, Button, Avatar, Dropdown, Badge, Space } from 'antd';
import { 
  MenuOutlined, 
  BellOutlined, 
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  GiftOutlined,
  LogoutOutlined,
  SettingOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { customerColors, customerClasses } from '@/config/customerTheme';
import './CustomerAppLayout.css';

const { Header, Content, Footer } = Layout;

interface CustomerAppLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

const CustomerAppLayout: React.FC<CustomerAppLayoutProps> = ({ 
  children, 
  showBottomNav = true 
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

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
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const getMemberLevelIcon = (role?: string) => {
    switch (role) {
      case 'admin':
        return <CrownOutlined style={{ color: customerColors.primary }} />;
      case 'manager':
        return <CrownOutlined style={{ color: '#C0C0C0' }} />;
      default:
        return <UserOutlined style={{ color: customerColors.primary }} />;
    }
  };

  return (
    <Layout className={`${customerClasses.container} customer-layout`}>
      {/* 顶部导航栏 */}
      <Header className="customer-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="menu-trigger"
            />
            <div className="logo-section">
              <span className="logo-icon">🚬</span>
              <span className="logo-text">JEP CIGAR</span>
            </div>
          </div>

          <div className="header-right">
            <Space size="middle">
              {/* 通知铃铛 */}
              <Badge count={3} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="notification-btn"
                />
              </Badge>

              {/* 用户头像和菜单 */}
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button type="text" className="user-btn">
                  <Space>
                    <Avatar 
                      size="small" 
                      icon={<UserOutlined />}
                      style={{ backgroundColor: customerColors.primary }}
                    />
                    <span className="user-name">{user?.displayName || '顾客'}</span>
                    {getMemberLevelIcon(user?.role)}
                  </Space>
                </Button>
              </Dropdown>
            </Space>
          </div>
        </div>
      </Header>

      {/* 主内容区域 */}
      <Content className="customer-content">
        {children}
      </Content>

      {/* 底部导航栏 */}
      {showBottomNav && (
        <Footer className="customer-footer">
          <div className="bottom-navigation">
            <Button type="text" className="nav-item active">
              <HomeOutlined />
              <span>首页</span>
            </Button>
            <Button type="text" className="nav-item">
              <CalendarOutlined />
              <span>活动</span>
            </Button>
            <Button type="text" className="nav-item">
              <GiftOutlined />
              <span>商城</span>
            </Button>
            <Button type="text" className="nav-item">
              <UserOutlined />
              <span>我的</span>
            </Button>
          </div>
        </Footer>
      )}
    </Layout>
  );
};

export default CustomerAppLayout;
