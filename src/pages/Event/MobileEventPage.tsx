import React, { useState } from 'react';
import { Card, Tag, Button, Space, Typography } from 'antd';
import { 
  CalendarOutlined, 
  PlusOutlined, 
  QrcodeOutlined, 
  UserOutlined, 
  BarChartOutlined, 
  MailOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { Event as EventType } from '@/types';
import { useEventStore } from '@/stores/eventStore';
import {
  MobileContainer,
  MobileSpacing,
  MobileCard,
  MobileTitle,
  MobileText,
  MobileButton,
  MobileGrid,
  MobileStatus
} from '@/components/Common/MobileComponents';
import useMobile from '@/hooks/useMobile';

const { Title, Text } = Typography;

const MobileEventPage: React.FC = () => {
  const { isMobile } = useMobile();
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationMode, setRegistrationMode] = useState<'register' | 'invite'>('register');
  const { upcomingEvents, fetchUpcomingEvents } = useEventStore();

  React.useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  const handleEventSelect = (event: EventType) => {
    setSelectedEvent(event);
  };

  const handleShowParticipants = (event: EventType) => {
    setSelectedEvent(event);
  };

  const handleShowRegistrationForm = (event: EventType, mode: 'register' | 'invite') => {
    setSelectedEvent(event);
    setRegistrationMode(mode);
    setShowRegistrationForm(true);
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
            icon={<PlusOutlined />}
            onClick={() => {/* TODO: 创建新活动 */}}
            className="mobile-touch-target"
          >
            创建活动
          </MobileButton>
        </div>

        {/* 即将举行的活动 */}
        <MobileCard title="即将举行的活动" elevated>
          <MobileSpacing size="sm">
            {upcomingEvents.slice(0, 2).map((event) => {
              const typeConfig = getEventTypeConfig(event.eventType);
              return (
                <div key={event.id} className="p-4 bg-blue-50 rounded-lg">
                  <div className="mobile-flex-between mb-2">
                    <MobileTitle level={4} className="mb-0">
                      {event.title}
                    </MobileTitle>
                    <Tag color={typeConfig.color} icon={<span>{typeConfig.icon}</span>}>
                      {typeConfig.label}
                    </Tag>
                  </div>
                  <MobileText size="sm" color="secondary" className="block mb-2">
                    {new Date(event.startDate).toLocaleDateString('zh-CN', {
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </MobileText>
                  <div className="mobile-flex-start mb-2">
                    <QrcodeOutlined className="text-blue-500 mr-2" />
                    <MobileText size="sm" color="secondary">
                      签到二维码已生成
                    </MobileText>
                  </div>
                  <div className="mobile-flex-between">
                    <MobileText size="sm" color="secondary">
                      已报名: {event.currentAttendees}/{event.maxAttendees} 人
                    </MobileText>
                    <MobileButton
                      size="small"
                      type="text"
                      icon={<ArrowRightOutlined />}
                      onClick={() => handleEventSelect(event)}
                    >
                      查看详情
                    </MobileButton>
                  </div>
                </div>
              );
            })}
            {upcomingEvents.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <CalendarOutlined className="text-4xl text-gray-300 mb-2" />
                <MobileText size="sm" color="muted">
                  暂无即将举行的活动
                </MobileText>
              </div>
            )}
          </MobileSpacing>
        </MobileCard>

        {/* 活动统计 - 一行显示 */}
        <MobileCard title="活动统计" elevated>
          <MobileGrid columns={4} gap="sm">
            {/* 本月活动 */}
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <CalendarOutlined className="text-2xl text-blue-500 mb-2" />
              <div className="text-xl font-bold text-blue-600">12</div>
              <div className="text-xs text-blue-600">本月活动</div>
            </div>

            {/* 参与人数 */}
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <UserOutlined className="text-2xl text-green-500 mb-2" />
              <div className="text-xl font-bold text-green-600">156</div>
              <div className="text-xs text-green-600">参与人数</div>
            </div>

            {/* 参与率 */}
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <BarChartOutlined className="text-2xl text-purple-500 mb-2" />
              <div className="text-xl font-bold text-purple-600">89%</div>
              <div className="text-xs text-purple-600">参与率</div>
            </div>

            {/* 网络连接 */}
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <MailOutlined className="text-2xl text-orange-500 mb-2" />
              <div className="text-xl font-bold text-orange-600">45</div>
              <div className="text-xs text-orange-600">网络连接</div>
            </div>
          </MobileGrid>
        </MobileCard>

        {/* 快速操作 - 一行显示 */}
        <MobileCard title="快速操作" elevated>
          <MobileGrid columns={4} gap="sm">
            <MobileButton
              variant="outline"
              icon={<PlusOutlined />}
              onClick={() => {/* TODO: 创建新活动 */}}
              className="h-16 flex-col"
            >
              <div className="text-sm">创建</div>
              <div className="text-xs text-gray-500">新活动</div>
            </MobileButton>

            <MobileButton
              variant="outline"
              icon={<QrcodeOutlined />}
              onClick={() => {/* TODO: 生成签到码 */}}
              className="h-16 flex-col"
            >
              <div className="text-sm">生成</div>
              <div className="text-xs text-gray-500">签到码</div>
            </MobileButton>

            <MobileButton
              variant="outline"
              icon={<CalendarOutlined />}
              onClick={() => {/* TODO: 查看日历 */}}
              className="h-16 flex-col"
            >
              <div className="text-sm">查看</div>
              <div className="text-xs text-gray-500">活动日历</div>
            </MobileButton>

            <MobileButton
              variant="outline"
              icon={<BarChartOutlined />}
              onClick={() => {/* TODO: 导出报告 */}}
              className="h-16 flex-col"
            >
              <div className="text-sm">导出</div>
              <div className="text-xs text-gray-500">参与报告</div>
            </MobileButton>
          </MobileGrid>
        </MobileCard>

        {/* 活动功能说明 - 一行显示 */}
        <MobileCard title="活动功能说明" elevated>
          <MobileGrid columns={2} gap="sm">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg text-center">
              <QrcodeOutlined className="text-2xl text-blue-500 mb-2" />
              <MobileTitle level={5} className="mb-1">二维码签到</MobileTitle>
              <MobileText size="xs" color="secondary">
                生成专属二维码，参与者扫码即可完成签到
              </MobileText>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg text-center">
              <UserOutlined className="text-2xl text-green-500 mb-2" />
              <MobileTitle level={5} className="mb-1">参与者管理</MobileTitle>
              <MobileText size="xs" color="secondary">
                实时查看参与者信息，管理报名和签到状态
              </MobileText>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg text-center">
              <MailOutlined className="text-2xl text-purple-500 mb-2" />
              <MobileTitle level={5} className="mb-1">邮件邀请</MobileTitle>
              <MobileText size="xs" color="secondary">
                批量发送邀请邮件，支持个性化邀请内容
              </MobileText>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg text-center">
              <BarChartOutlined className="text-2xl text-orange-500 mb-2" />
              <MobileTitle level={5} className="mb-1">数据分析</MobileTitle>
              <MobileText size="xs" color="secondary">
                详细的活动数据统计和参与度分析报告
              </MobileText>
            </div>
          </MobileGrid>
        </MobileCard>

        {/* 活动类型分布 */}
        <MobileCard title="活动类型分布" elevated>
          <MobileSpacing size="sm">
            <div className="mobile-flex-between p-3 border-b border-gray-100">
              <div className="mobile-flex-start">
                <span className="text-lg mr-2">🍷</span>
                <div>
                  <MobileText size="sm" weight="medium">品鉴会</MobileText>
                  <MobileText size="xs" color="secondary">雪茄品鉴活动</MobileText>
                </div>
              </div>
              <div className="text-right">
                <MobileText size="sm" weight="medium">8</MobileText>
                <MobileText size="xs" color="secondary" className="block">67%</MobileText>
              </div>
            </div>

            <div className="mobile-flex-between p-3 border-b border-gray-100">
              <div className="mobile-flex-start">
                <span className="text-lg mr-2">🤝</span>
                <div>
                  <MobileText size="sm" weight="medium">网络聚会</MobileText>
                  <MobileText size="xs" color="secondary">商务社交活动</MobileText>
                </div>
              </div>
              <div className="text-right">
                <MobileText size="sm" weight="medium">3</MobileText>
                <MobileText size="xs" color="secondary" className="block">25%</MobileText>
              </div>
            </div>

            <div className="mobile-flex-between p-3">
              <div className="mobile-flex-start">
                <span className="text-lg mr-2">📚</span>
                <div>
                  <MobileText size="sm" weight="medium">教育培训</MobileText>
                  <MobileText size="xs" color="secondary">知识分享活动</MobileText>
                </div>
              </div>
              <div className="text-right">
                <MobileText size="sm" weight="medium">1</MobileText>
                <MobileText size="xs" color="secondary" className="block">8%</MobileText>
              </div>
            </div>
          </MobileSpacing>
        </MobileCard>

        {/* 最近活动 */}
        <MobileCard title="最近活动" elevated>
          <MobileSpacing size="sm">
            <div className="mobile-flex-between p-3 border-b border-gray-100">
              <div className="mobile-flex-start">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-1"></div>
                <div>
                  <MobileText size="sm" weight="medium">古巴雪茄品鉴会</MobileText>
                  <MobileText size="xs" color="secondary">2024年1月15日</MobileText>
                </div>
              </div>
              <MobileStatus status="success" size="small">
                已完成
              </MobileStatus>
            </div>

            <div className="mobile-flex-between p-3 border-b border-gray-100">
              <div className="mobile-flex-start">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 mt-1"></div>
                <div>
                  <MobileText size="sm" weight="medium">商务网络聚会</MobileText>
                  <MobileText size="xs" color="secondary">2024年1月20日</MobileText>
                </div>
              </div>
              <MobileStatus status="info" size="small">
                进行中
              </MobileStatus>
            </div>

            <div className="mobile-flex-between p-3">
              <div className="mobile-flex-start">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3 mt-1"></div>
                <div>
                  <MobileText size="sm" weight="medium">雪茄知识讲座</MobileText>
                  <MobileText size="xs" color="secondary">2024年1月25日</MobileText>
                </div>
              </div>
              <MobileStatus status="warning" size="small">
                待开始
              </MobileStatus>
            </div>
          </MobileSpacing>
        </MobileCard>

        {/* 底部安全区域 */}
        <div className="mobile-safe-bottom h-4" />
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileEventPage;
