import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { 
  CrownOutlined, 
  GiftOutlined, 
  CalendarOutlined,
  UserOutlined,
  StarOutlined,
  FireOutlined
} from '@ant-design/icons';
import { customerClasses } from '@/config/customerTheme';
import './CustomerEntryPage.css';

const { Title, Text } = Typography;

const CustomerEntryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/customer/login');
  };

  const handleBrowse = () => {
    navigate('/customer');
  };

  return (
    <div className={`${customerClasses.container} customer-entry-page`}>
      <div className="entry-container">
        {/* 主标题区域 */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-logo">
              <span className="logo-icon">🚬</span>
              <Title level={1} className="hero-title">JEP CIGAR</Title>
            </div>
            <Title level={2} className="hero-subtitle">
              高端雪茄俱乐部
            </Title>
            <Text className="hero-description">
              加入我们的雪茄爱好者社区，享受专业品鉴、高端活动、积分奖励和个性化服务
            </Text>
            
            <div className="hero-actions">
              <Space size="large">
                <Button 
                  type="primary" 
                  size="large"
                  onClick={handleLogin}
                  className="primary-action"
                  icon={<UserOutlined />}
                >
                  登录/注册
                </Button>
                <Button 
                  size="large"
                  onClick={handleBrowse}
                  className="secondary-action"
                  icon={<StarOutlined />}
                >
                  游客浏览
                </Button>
              </Space>
            </div>
          </div>
        </div>

        {/* 功能特色展示 */}
        <div className="features-section">
          <Title level={3} className="section-title">
            为什么选择我们？
          </Title>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={8}>
              <Card className={`${customerClasses.card} feature-card`}>
                <div className="feature-icon">
                  <CalendarOutlined />
                </div>
                <Title level={4} className="feature-title">专业活动</Title>
                <Text className="feature-description">
                  参与顶级雪茄品鉴会、专家讲座和VIP会员聚会，与雪茄爱好者交流
                </Text>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={8}>
              <Card className={`${customerClasses.card} feature-card`}>
                <div className="feature-icon">
                  <GiftOutlined />
                </div>
                <Title level={4} className="feature-title">积分奖励</Title>
                <Text className="feature-description">
                  消费获得积分，兑换精美礼品、专属服务和雪茄配件
                </Text>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={8}>
              <Card className={`${customerClasses.card} feature-card`}>
                <div className="feature-icon">
                  <CrownOutlined />
                </div>
                <Title level={4} className="feature-title">VIP特权</Title>
                <Text className="feature-description">
                  享受专属活动、个性化推荐和优先预订等VIP会员特权
                </Text>
              </Card>
            </Col>
          </Row>
        </div>

        {/* 会员等级展示 */}
        <div className="membership-section">
          <Title level={3} className="section-title">
            会员等级体系
          </Title>
          
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Card className={`${customerClasses.card} membership-card silver`}>
                <div className="membership-icon">🥈</div>
                <Title level={5} className="membership-title">Silver</Title>
                <Text className="membership-description">银牌会员</Text>
              </Card>
            </Col>
            
            <Col xs={12} sm={6}>
              <Card className={`${customerClasses.card} membership-card gold`}>
                <div className="membership-icon">🥇</div>
                <Title level={5} className="membership-title">Gold</Title>
                <Text className="membership-description">金牌会员</Text>
              </Card>
            </Col>
            
            <Col xs={12} sm={6}>
              <Card className={`${customerClasses.card} membership-card platinum`}>
                <div className="membership-icon">💎</div>
                <Title level={5} className="membership-title">Platinum</Title>
                <Text className="membership-description">白金会员</Text>
              </Card>
            </Col>
            
            <Col xs={12} sm={6}>
              <Card className={`${customerClasses.card} membership-card royal`}>
                <div className="membership-icon">👑</div>
                <Title level={5} className="membership-title">Royal</Title>
                <Text className="membership-description">皇室会员</Text>
              </Card>
            </Col>
          </Row>
        </div>

        {/* 统计数据 */}
        <div className="stats-section">
          <Row gutter={[32, 32]}>
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">活跃会员</div>
              </div>
            </Col>
            
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">精品活动</div>
              </div>
            </Col>
            
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">满意度</div>
              </div>
            </Col>
            
            <Col xs={12} sm={6}>
              <div className="stat-item">
                <div className="stat-number">5年</div>
                <div className="stat-label">专业经验</div>
              </div>
            </Col>
          </Row>
        </div>

        {/* 底部行动号召 */}
        <div className="cta-section">
          <Card className={`${customerClasses.card} cta-card`}>
            <div className="cta-content">
              <FireOutlined className="cta-icon" />
              <Title level={3} className="cta-title">
                立即加入我们的雪茄俱乐部
              </Title>
              <Text className="cta-description">
                开启您的雪茄之旅，享受专业服务和专属特权
              </Text>
              <div className="cta-actions">
                <Space size="large">
                  <Button 
                    type="primary" 
                    size="large"
                    onClick={handleLogin}
                    className="cta-button"
                  >
                    立即注册
                  </Button>
                  <Button 
                    size="large"
                    onClick={handleBrowse}
                    className="cta-button-secondary"
                  >
                    了解更多
                  </Button>
                </Space>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerEntryPage;
