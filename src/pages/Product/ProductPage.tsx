import React, { useState } from 'react';
import { Card, Typography, Tabs, Button, Space, Row, Col } from 'antd';
import { 
  GiftOutlined, 
  ShoppingCartOutlined, 
  BookOutlined, 
  PlusOutlined,
  StarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

// Import the migrated components
import GiftingPage from './GiftingPage';
import PointsMarketplacePage from './PointsMarketplacePage';
import AcademyPage from './AcademyPage';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProductPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('gifting');

  // Get the active tab from URL hash or default to gifting
  React.useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['gifting', 'marketplace', 'academy'].includes(hash)) {
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
          <Text type="secondary">礼品定制、积分商城、雪茄学院一站式服务</Text>
        </div>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            快速操作
          </Button>
        </Space>
      </div>

      {/* Overview Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card 
            className="hover-lift cursor-pointer" 
            onClick={() => handleTabChange('gifting')}
          >
            <div className="text-center">
              <GiftOutlined className="text-4xl text-blue-500 mb-3" />
              <Title level={4} className="mb-2">礼品定制</Title>
              <Text type="secondary">
                为特殊场合定制专属雪茄礼品，支持个性化包装和配送
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            className="hover-lift cursor-pointer" 
            onClick={() => handleTabChange('marketplace')}
          >
            <div className="text-center">
              <ShoppingCartOutlined className="text-4xl text-green-500 mb-3" />
              <Title level={4} className="mb-2">积分商城</Title>
              <Text type="secondary">
                使用积分兑换精美礼品和专属体验，享受会员特权
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card 
            className="hover-lift cursor-pointer" 
            onClick={() => handleTabChange('academy')}
          >
            <div className="text-center">
              <BookOutlined className="text-4xl text-purple-500 mb-3" />
              <Title level={4} className="mb-2">雪茄学院</Title>
              <Text type="secondary">
                学习雪茄知识，获得徽章和会员升级，提升品鉴技能
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

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
