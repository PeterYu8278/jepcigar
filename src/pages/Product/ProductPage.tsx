import React, { useState } from 'react';
import { Card, Typography, Tabs, Button, Space } from 'antd';
import { 
  GiftOutlined, 
  ShoppingCartOutlined, 
  BookOutlined, 
  PlusOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

// Import the migrated components
import GiftingPage from './GiftingPage';
import PointsMarketplacePage from './PointsMarketplacePage';
import AcademyPage from './AcademyPage';
import AIRecommendationPage from './AIRecommendationPage';

const { Title, Text } = Typography;

const ProductPage: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('gifting');

  // Get the active tab from URL hash or default to gifting
  React.useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['gifting', 'marketplace', 'academy', 'ai-recommendation'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // Update URL hash without causing page reload
    window.history.replaceState(null, '', `#${key}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'gifting':
        return <GiftingPage />;
      case 'marketplace':
        return <PointsMarketplacePage />;
      case 'academy':
        return <AcademyPage />;
      case 'ai-recommendation':
        return <AIRecommendationPage />;
      default:
        return <GiftingPage />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">产品服务</Title>
          <Text type="secondary">礼品定制、积分商城、雪茄学院、AI推荐一站式服务</Text>
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            快速操作
          </Button>
        </Space>
      </div>

      

      {/* Tab Navigation */}
      <Card className="hover-lift">
        <Tabs 
          activeKey={activeTab} 
          onChange={handleTabChange}
          items={[
            {
              key: 'gifting',
              label: (
                <span>
                  <GiftOutlined />
                  礼品定制
                </span>
              ),
            },
            {
              key: 'marketplace',
              label: (
                <span>
                  <ShoppingCartOutlined />
                  积分商城
                </span>
              ),
            },
            {
              key: 'academy',
              label: (
                <span>
                  <BookOutlined />
                  雪茄学院
                </span>
              ),
            },
            {
              key: 'ai-recommendation',
              label: (
                <span>
                  <BulbOutlined />
                  AI推荐
                </span>
              ),
            },
          ]}
        >
        </Tabs>
        
        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </Card>
    </div>
  );
};

export default ProductPage;
