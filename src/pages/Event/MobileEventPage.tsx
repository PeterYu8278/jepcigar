import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarOutlined,
  PlusOutlined,
  QrcodeOutlined,
  UserOutlined,
  BarChartOutlined,
  MailOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';
import {
  MobileContainer,
  MobileSpacing,
  MobileCard,
  MobileTitle,
  MobileText,
  MobileButton,
  MobileGrid,
  MobileStatus,
  MobileLoading,
  MobileEmpty
} from '@/components/Common/MobileComponents';
import { Event as EventType } from '@/types';
import { useEventStore } from '@/stores/eventStore';
import useMobile from '@/hooks/useMobile';

const MobileEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const { upcomingEvents, fetchUpcomingEvents } = useEventStore();

  useEffect(() => {
    loadEventData();
  }, []);

  const loadEventData = async () => {
    setLoading(true);
    try {
      await fetchUpcomingEvents();
    } catch (error) {
      console.error('Failed to load event data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeConfig = (type: string) => {
    const configs = {
      tasting: { label: '品鉴会', color: 'blue', icon: '🍷' },
      networking: { label: '网络聚会', color: 'green', icon: '🤝' },
      educational: { label: '教育培训', color: 'purple', icon: '📚' },
      celebration: { label: '庆祝活动', color: 'orange', icon: '🎉' },
    };
    return configs[type as keyof typeof configs] || { label: type, color: 'default', icon: '📅' };
  };

  // 活动统计卡片数据
  const eventStats = [
    {
      title: '本月活动',
      value: '12',
      icon: <CalendarOutlined className="text-blue-500" />,
      color: '#1890ff',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: '参与人数',
      value: '156',
      icon: <UserOutlined className="text-green-500" />,
      color: '#52c41a',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: '参与率',
      value: '89%',
      icon: <BarChartOutlined className="text-purple-500" />,
      color: '#722ed1',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: '网络连接',
      value: '45',
      icon: <ShareAltOutlined className="text-orange-500" />,
      color: '#f16d1f',
      bgColor: 'from-orange-50 to-orange-100'
    }
  ];

  // 快速操作按钮数据
  const quickActions = [
    {
      title: '创建新活动',
      icon: <PlusOutlined />,
      color: 'primary',
      onClick: () => navigate('/events/new')
    },
    {
      title: '生成签到码',
      icon: <QrcodeOutlined />,
      color: 'secondary',
      onClick: () => console.log('生成签到码')
    },
    {
      title: '查看活动日历',
      icon: <CalendarOutlined />,
      color: 'secondary',
      onClick: () => console.log('查看活动日历')
    },
    {
      title: '导出参与报告',
      icon: <DownloadOutlined />,
      color: 'secondary',
      onClick: () => console.log('导出参与报告')
    }
  ];

  // 活动功能说明卡片
  const featureCards = [
    {
      title: '智能签到',
      description: '使用二维码快速签到，自动统计参与人数',
      icon: <QrcodeOutlined className="text-blue-500" />,
      color: 'blue'
    },
    {
      title: '网络连接',
      description: '帮助参与者建立商务联系，扩大人脉网络',
      icon: <ShareAltOutlined className="text-green-500" />,
      color: 'green'
    },
    {
      title: '数据统计',
      description: '实时统计活动效果，生成详细分析报告',
      icon: <BarChartOutlined className="text-purple-500" />,
      color: 'purple'
    },
    {
      title: '邮件通知',
      description: '自动发送活动邀请和提醒邮件',
      icon: <MailOutlined className="text-orange-500" />,
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <MobileContainer>
        <MobileLoading size="large" text="加载活动数据中..." />
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <MobileSpacing size="lg">
        {/* 页面标题 */}
        <div className="mobile-flex-between mb-4">
          <div>
            <MobileTitle level={2}>活动管理</MobileTitle>
            <MobileText size="sm" color="secondary">
              管理雪茄品鉴会、商务聚会和网络活动
            </MobileText>
          </div>
          <MobileButton
            variant="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => navigate('/events/new')}
          >
            创建
          </MobileButton>
        </div>

        {/* 即将举行的活动 */}
        <MobileSpacing size="md">
          <MobileTitle level={4}>即将举行的活动</MobileTitle>
          {upcomingEvents.length === 0 ? (
            <MobileEmpty
              icon={<CalendarOutlined />}
              title="暂无即将举行的活动"
              description="点击创建按钮开始创建第一个活动"
              action={
                <MobileButton
                  variant="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/events/new')}
                >
                  创建活动
                </MobileButton>
              }
            />
          ) : (
            <div className="space-y-3">
              {upcomingEvents.slice(0, 3).map((event) => {
                const typeConfig = getEventTypeConfig(event.eventType);
                return (
                  <MobileCard key={event.id} elevated onClick={() => setSelectedEvent(event)}>
                    <div className="mobile-flex-between mb-3">
                      <div className="flex-1">
                        <MobileText size="base" weight="bold">
                          {event.title}
                        </MobileText>
                        <div className="flex items-center space-x-2 mt-1">
                          <MobileStatus status={typeConfig.color as any} size="small">
                            {typeConfig.icon} {typeConfig.label}
                          </MobileStatus>
                        </div>
                      </div>
                      <EyeOutlined className="text-gray-400" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <ClockCircleOutlined className="text-gray-400" />
                        <MobileText size="sm" color="secondary">
                          {new Date(event.startDate).toLocaleDateString('zh-CN', {
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </MobileText>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <EnvironmentOutlined className="text-gray-400" />
                        <MobileText size="sm" color="secondary">
                          {event.location}
                        </MobileText>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TeamOutlined className="text-gray-400" />
                          <MobileText size="sm" color="secondary">
                            已报名: {event.currentAttendees}/{event.maxAttendees} 人
                          </MobileText>
                        </div>
                        <div className="flex items-center space-x-1">
                          <QrcodeOutlined className="text-green-500" />
                          <MobileText size="xs" color="success">
                            已生成签到码
                          </MobileText>
                        </div>
                      </div>
                    </div>
                  </MobileCard>
                );
              })}
            </div>
          )}
        </MobileSpacing>

        {/* 活动统计卡片 - 呈列显示 */}
        <MobileSpacing size="md">
          <MobileTitle level={4}>活动统计</MobileTitle>
          <div className="space-y-3">
            {eventStats.map((stat, index) => (
              <MobileCard key={index} elevated>
                <div className="mobile-flex-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.bgColor} flex items-center justify-center`}>
                      <div className="text-xl" style={{ color: stat.color }}>
                        {stat.icon}
                      </div>
                    </div>
                    <div>
                      <MobileText size="sm" color="secondary">
                        {stat.title}
                      </MobileText>
                      <MobileText size="xl" weight="bold" style={{ color: stat.color }}>
                        {stat.value}
                      </MobileText>
                    </div>
                  </div>
                  <div className="text-right">
                    <MobileText size="xs" color="success" weight="medium">
                      +12%
                    </MobileText>
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>
        </MobileSpacing>

        {/* 快速操作卡片 - 按键呈列显示 */}
        <MobileSpacing size="md">
          <MobileTitle level={4}>快速操作</MobileTitle>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <MobileButton
                key={index}
                variant={action.color === 'primary' ? 'primary' : 'outline'}
                icon={action.icon}
                className="mobile-btn-full justify-start h-12"
                onClick={action.onClick}
              >
                {action.title}
              </MobileButton>
            ))}
          </div>
        </MobileSpacing>

        {/* 活动功能说明卡片 - 卡片呈列显示 */}
        <MobileSpacing size="md">
          <MobileTitle level={4}>功能说明</MobileTitle>
          <div className="space-y-3">
            {featureCards.map((feature, index) => (
              <MobileCard key={index} size="small" elevated>
                <div className="mobile-flex-start">
                  <div className="text-xl mr-3">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <MobileText size="sm" weight="bold" className="block mb-1">
                      {feature.title}
                    </MobileText>
                    <MobileText size="xs" color="secondary">
                      {feature.description}
                    </MobileText>
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>
        </MobileSpacing>

        {/* 查看更多 */}
        <MobileSpacing size="md">
          <MobileButton
            variant="secondary"
            className="mobile-btn-full"
            onClick={() => navigate('/events/list')}
          >
            查看所有活动
          </MobileButton>
        </MobileSpacing>
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileEventPage;
