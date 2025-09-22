import React from 'react';
import { Row, Col, Card, Button, Statistic, Space, Avatar, Typography, Divider } from 'antd';
import { 
  CrownOutlined, 
  GiftOutlined, 
  CalendarOutlined, 
  UserOutlined,
  RightOutlined,
  FireOutlined,
  StarOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { customerColors, customerClasses } from '@/config/customerTheme';
import './CustomerHomePage.css';

const { Title, Text } = Typography;

const CustomerHomePage: React.FC = () => {
  // 模拟数据
  const userStats = {
    points: 1280,
    level: 'Gold',
    eventsAttended: 12,
    referrals: 3
  };

  const upcomingEvents = [
    {
      id: 1,
      title: '雪茄品鉴会',
      date: '2024-01-20',
      location: 'JEP雪茄俱乐部',
      spots: 15
    },
    {
      id: 2,
      title: 'VIP会员聚会',
      date: '2024-01-25',
      location: '私人会所',
      spots: 8
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: '古巴高希霸',
      price: 280,
      points: 1400,
      image: '🚬'
    },
    {
      id: 2,
      name: '多米尼加雪茄',
      price: 180,
      points: 900,
      image: '🚬'
    }
  ];

  return (
    <div className={`${customerClasses.container} customer-home-page`}>
      {/* 欢迎区域 */}
      <div className="welcome-section">
        <Card className={`${customerClasses.card} welcome-card`}>
          <Row align="middle" justify="space-between">
            <Col>
              <Space direction="vertical" size="small">
                <Title level={3} style={{ margin: 0, color: customerColors.primary }}>
                  欢迎回来！👋
                </Title>
                <Text type="secondary">今天是享受雪茄的完美时光</Text>
              </Space>
            </Col>
            <Col>
              <Avatar 
                size={60} 
                icon={<UserOutlined />}
                style={{ backgroundColor: customerColors.primary }}
              />
            </Col>
          </Row>
        </Card>
      </div>

      {/* 会员信息卡片 */}
      <div className="member-info-section">
        <Card className={`${customerClasses.card} member-card`}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="我的积分"
                value={userStats.points}
                suffix="分"
                valueStyle={{ color: customerColors.primary }}
                prefix={<StarOutlined />}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="会员等级"
                value={userStats.level}
                valueStyle={{ color: customerColors.primary }}
                prefix={<CrownOutlined />}
              />
            </Col>
          </Row>
          <Divider style={{ margin: '16px 0' }} />
          <Row gutter={16}>
            <Col span={12}>
              <Text type="secondary">参与活动: {userStats.eventsAttended}次</Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">推荐好友: {userStats.referrals}人</Text>
            </Col>
          </Row>
        </Card>
      </div>

      {/* 快捷功能 */}
      <div className="quick-actions-section">
        <Title level={4}>快捷功能</Title>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Button 
              type="primary" 
              size="large" 
              className={`${customerClasses.button} action-button`}
              icon={<CalendarOutlined />}
              block
            >
              今日活动
            </Button>
          </Col>
          <Col span={12}>
            <Button 
              size="large" 
              className={`${customerClasses.button} action-button`}
              icon={<GiftOutlined />}
              block
            >
              积分商城
            </Button>
          </Col>
          <Col span={12}>
            <Button 
              size="large" 
              className={`${customerClasses.button} action-button`}
              icon={<UserOutlined />}
              block
            >
              我的名片
            </Button>
          </Col>
          <Col span={12}>
            <Button 
              size="large" 
              className={`${customerClasses.button} action-button`}
              icon={<TrophyOutlined />}
              block
            >
              成就中心
            </Button>
          </Col>
        </Row>
      </div>

      {/* 即将到来的活动 */}
      <div className="events-section">
        <div className="section-header">
          <Title level={4}>
            <FireOutlined /> 即将到来的活动
          </Title>
          <Button type="text" icon={<RightOutlined />}>
            查看更多
          </Button>
        </div>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {upcomingEvents.map((event) => (
            <Card 
              key={event.id} 
              className={`${customerClasses.card} event-card`}
              hoverable
            >
              <Row justify="space-between" align="middle">
                <Col>
                  <Space direction="vertical" size="small">
                    <Title level={5} style={{ margin: 0 }}>
                      {event.title}
                    </Title>
                    <Text type="secondary">
                      📅 {event.date} | 📍 {event.location}
                    </Text>
                    <Text type="secondary">
                      剩余名额: {event.spots}个
                    </Text>
                  </Space>
                </Col>
                <Col>
                  <Button type="primary" shape="round">
                    立即报名
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
        </Space>
      </div>

      {/* 精选商品 */}
      <div className="products-section">
        <div className="section-header">
          <Title level={4}>
            <GiftOutlined /> 精选商品
          </Title>
          <Button type="text" icon={<RightOutlined />}>
            查看更多
          </Button>
        </div>
        <Row gutter={[16, 16]}>
          {featuredProducts.map((product) => (
            <Col span={12} key={product.id}>
              <Card 
                className={`${customerClasses.card} product-card`}
                hoverable
                cover={
                  <div className="product-image">
                    <span className="product-emoji">{product.image}</span>
                  </div>
                }
              >
                <Card.Meta
                  title={product.name}
                  description={
                    <Space direction="vertical" size="small">
                      <Text strong style={{ color: customerColors.primary }}>
                        ¥{product.price}
                      </Text>
                      <Text type="secondary">
                        {product.points}积分
                      </Text>
                    </Space>
                  }
                />
                <div className="product-actions">
                  <Button type="primary" size="small" block>
                    立即兑换
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* VIP特权提示 */}
      <div className="vip-section">
        <Card className={`${customerClasses.card} vip-card`}>
          <Row align="middle" justify="space-between">
            <Col>
              <Space direction="vertical" size="small">
                <Title level={4} style={{ margin: 0, color: customerColors.primary }}>
                  <CrownOutlined /> VIP会员特权
                </Title>
                <Text type="secondary">
                  升级VIP享受更多专属服务
                </Text>
              </Space>
            </Col>
            <Col>
              <Button type="primary" shape="round" icon={<CrownOutlined />}>
                立即升级
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default CustomerHomePage;
