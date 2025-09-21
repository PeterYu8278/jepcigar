import React, { useState } from 'react';
import { Tabs, Card, Typography } from 'antd';
import { 
  InboxOutlined, 
  UserOutlined, 
  BarChartOutlined 
} from '@ant-design/icons';
import useMobile from '@/hooks/useMobile';

// Import existing pages as components
import InventoryPage from '@/pages/Inventory/InventoryPage';
import CustomerPage from '@/pages/Customer/CustomerPage';
import AnalyticsPage from '@/pages/Analytics/AnalyticsPage';

const { Title } = Typography;

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SystemManagementPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState('inventory');
  const { isMobile } = useMobile();

  const tabItems: TabItem[] = [
    {
      key: 'inventory',
      label: '库存管理',
      icon: <InboxOutlined />,
      children: <InventoryPage />
    },
    {
      key: 'customers',
      label: '客户管理',
      icon: <UserOutlined />,
      children: <CustomerPage />
    },
    {
      key: 'analytics',
      label: '分析报告管理',
      icon: <BarChartOutlined />,
      children: <AnalyticsPage />
    }
  ];

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div className={`system-management-page ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className="mb-6">
        <Title level={2} className="!mb-2">
          系统管理
        </Title>
        <p className="text-gray-600">
          集中管理系统的核心功能模块
        </p>
      </div>

      <Card className="system-management-card">
        <Tabs
          activeKey={activeKey}
          onChange={handleTabChange}
          type="card"
          size={isMobile ? 'small' : 'large'}
          tabPosition={isMobile ? 'top' : 'top'}
          items={tabItems.map(item => ({
            key: item.key,
            label: (
              <span className="flex items-center gap-2">
                {item.icon}
                <span className={isMobile ? 'text-sm' : ''}>{item.label}</span>
              </span>
            ),
            children: (
              <div className="tab-content">
                {item.children}
              </div>
            )
          }))}
          className="system-tabs"
        />
      </Card>
    </div>
  );
};

export default SystemManagementPage;
