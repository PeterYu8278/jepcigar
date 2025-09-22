import React, { useState } from 'react';
import { Row, Col, Card, Button, Tabs, Badge, Space, Typography, Tag, Avatar, Divider } from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
  FireOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { customerColors, customerClasses } from '@/config/customerTheme';
import './CustomerEventsPage.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CustomerEventsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // 模拟数据
  const upcomingEvents = [
    {
      id: 1,
      title: '雪茄品鉴会',
      date: '2024-01-20',
      time: '19:00-21:00',
      location: 'JEP雪茄俱乐部',
      description: '专业品鉴师指导，品尝来自古巴的顶级雪茄',
      spots: 15,
      registered: 12,
      price: 0,
      type: 'tasting',
      featured: true,
      image: '🚬'
    },
    {
      id: 2,
      title: 'VIP会员聚会',
      date: '2024-01-25',
      time: '18:30-22:00',
      location: '私人会所',
      description: 'VIP会员专享聚会，提供高端雪茄和精美小食',
      spots: 8,
      registered: 5,
      price: 200,
      type: 'vip',
      featured: false,
      image: '👑'
    },
    {
      id: 3,
      title: '雪茄文化讲座',
      date: '2024-01-28',
      time: '14:00-16:00',
      location: 'JEP教育中心',
      description: '了解雪茄的历史文化，学习正确的品鉴方法',
      spots: 30,
      registered: 18,
      price: 0,
      type: 'education',
      featured: false,
      image: '📚'
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: '新年雪茄派对',
      date: '2024-01-01',
      time: '20:00-24:00',
      location: 'JEP雪茄俱乐部',
      description: '庆祝新年的特别活动',
      spots: 20,
      registered: 20,
      price: 150,
      type: 'party',
      featured: false,
      image: '🎉',
      attended: true,
      rating: 5
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'tasting': return 'orange';
      case 'vip': return 'gold';
      case 'education': return 'blue';
      case 'party': return 'purple';
      default: return 'default';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'tasting': return '品鉴会';
      case 'vip': return 'VIP聚会';
      case 'education': return '文化讲座';
      case 'party': return '主题派对';
      default: return '活动';
    }
  };

  const renderEventCard = (event: any, isPast: boolean = false) => (
    <Card 
      key={event.id}
      className={`${customerClasses.card} event-card ${event.featured ? 'featured' : ''}`}
      hoverable
    >
      <div className="event-header">
        <div className="event-image">
          <span className="event-emoji">{event.image}</span>
          {event.featured && (
            <div className="featured-badge">
              <FireOutlined />
            </div>
          )}
        </div>
        <div className="event-info">
          <div className="event-title-row">
            <Title level={5} style={{ margin: 0 }}>
              {event.title}
            </Title>
            <Tag color={getEventTypeColor(event.type)}>
              {getEventTypeText(event.type)}
            </Tag>
          </div>
          <Text type="secondary" className="event-description">
            {event.description}
          </Text>
        </div>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      <div className="event-details">
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <Space>
              <CalendarOutlined />
              <Text>{event.date}</Text>
              <ClockCircleOutlined />
              <Text>{event.time}</Text>
            </Space>
          </Col>
          <Col span={24}>
            <Space>
              <EnvironmentOutlined />
              <Text>{event.location}</Text>
            </Space>
          </Col>
          <Col span={24}>
            <Space>
              <UserOutlined />
              <Text>{event.registered}/{event.spots} 人已报名</Text>
            </Space>
          </Col>
        </Row>
      </div>

      <div className="event-footer">
        <Row justify="space-between" align="middle">
          <Col>
            {event.price > 0 ? (
              <Text strong style={{ color: customerColors.primary }}>
                ¥{event.price}
              </Text>
            ) : (
              <Text strong style={{ color: '#52c41a' }}>
                免费
              </Text>
            )}
          </Col>
          <Col>
            {isPast ? (
              <Space>
                {event.attended && (
                  <Badge 
                    status="success" 
                    text={<Text type="secondary">已参加</Text>}
                  />
                )}
                {event.rating && (
                  <Space>
                    <StarOutlined style={{ color: '#faad14' }} />
                    <Text>{event.rating}</Text>
                  </Space>
                )}
              </Space>
            ) : (
              <Button 
                type="primary" 
                shape="round"
                disabled={event.registered >= event.spots}
              >
                {event.registered >= event.spots ? '已满员' : '立即报名'}
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </Card>
  );

  return (
    <div className={`${customerClasses.container} customer-events-page`}>
      {/* 页面标题 */}
      <div className="page-header">
        <Title level={2} style={{ margin: 0, color: customerColors.primary }}>
          <CalendarOutlined /> 活动中心
        </Title>
        <Text type="secondary">参与精彩活动，结识更多雪茄爱好者</Text>
      </div>

      {/* 统计信息 */}
      <div className="stats-section">
        <Row gutter={16}>
          <Col span={8}>
            <Card className={`${customerClasses.card} stat-card`}>
              <div className="stat-content">
                <div className="stat-icon">
                  <CalendarOutlined />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{upcomingEvents.length}</div>
                  <div className="stat-label">即将开始</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className={`${customerClasses.card} stat-card`}>
              <div className="stat-content">
                <div className="stat-icon">
                  <CheckCircleOutlined />
                </div>
                <div className="stat-info">
                  <div className="stat-number">{pastEvents.length}</div>
                  <div className="stat-label">已参加</div>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card className={`${customerClasses.card} stat-card`}>
              <div className="stat-content">
                <div className="stat-icon">
                  <StarOutlined />
                </div>
                <div className="stat-info">
                  <div className="stat-number">4.8</div>
                  <div className="stat-label">平均评分</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 活动列表 */}
      <div className="events-section">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="events-tabs"
        >
          <TabPane 
            tab={
              <span>
                <CalendarOutlined />
                即将开始
                <Badge count={upcomingEvents.length} size="small" />
              </span>
            } 
            key="upcoming"
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {upcomingEvents.map(event => renderEventCard(event))}
            </Space>
          </TabPane>
          
          <TabPane 
            tab={
              <span>
                <CheckCircleOutlined />
                历史活动
                <Badge count={pastEvents.length} size="small" />
              </span>
            } 
            key="past"
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {pastEvents.map(event => renderEventCard(event, true))}
            </Space>
          </TabPane>
        </Tabs>
      </div>

      {/* 推荐活动 */}
      <div className="recommended-section">
        <Title level={4}>
          <GiftOutlined /> 推荐活动
        </Title>
        <Card className={`${customerClasses.card} recommendation-card`}>
          <Row align="middle" justify="space-between">
            <Col>
              <Space direction="vertical" size="small">
                <Title level={5} style={{ margin: 0 }}>
                  🎯 个性化推荐
                </Title>
                <Text type="secondary">
                  基于您的偏好为您推荐最适合的活动
                </Text>
              </Space>
            </Col>
            <Col>
              <Button type="primary" shape="round">
                查看推荐
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default CustomerEventsPage;
