import React, { useState } from 'react';
import { Card, Typography, Button, Tag, Row, Col, Tabs, Divider, message, List, Modal } from 'antd';
import { CalendarOutlined, PlusOutlined, QrcodeOutlined, UserOutlined, BarChartOutlined, MailOutlined, DownloadOutlined } from '@ant-design/icons';
import { 
  EventList, 
  EventParticipants, 
  EventRegistrationForm,
  EnhancedQRCodeScanner,
  BatchCheckIn,
  CheckInDashboard
} from '@/components/LazyComponents';
import { Event as EventType } from '@/types';
import { useEventStore } from '@/stores/eventStore';

const { Title, Text } = Typography;
// Using items prop instead of TabPane

const EventPage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationMode, setRegistrationMode] = useState<'register' | 'invite'>('register');
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showBatchCheckIn, setShowBatchCheckIn] = useState(false);
  const [showCheckInDashboard, setShowCheckInDashboard] = useState(false);
  const { upcomingEvents, fetchUpcomingEvents } = useEventStore();

  React.useEffect(() => {
    fetchUpcomingEvents();
    
    // 添加定时刷新机制，每30秒刷新一次数据
    const interval = setInterval(() => {
      fetchUpcomingEvents();
    }, 30000);
    
    return () => clearInterval(interval);
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

  const handleShowScanner = (event: EventType) => {
    setSelectedEvent(event);
    setShowScanner(true);
  };

  const handleShowBatchCheckIn = (event: EventType) => {
    setSelectedEvent(event);
    setShowBatchCheckIn(true);
  };

  const handleShowCheckInDashboard = (event: EventType) => {
    setSelectedEvent(event);
    setShowCheckInDashboard(true);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">活动管理</Title>
          <Text type="secondary">管理雪茄品鉴会、商务聚会和网络活动</Text>
        </div>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="即将举行的活动" className="hover-lift">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarOutlined className="text-4xl text-gray-300 mb-4" />
                <Text type="secondary" className="block mb-4">
                  暂无即将举行的活动
                </Text>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => message.info('创建活动功能开发中')}
                >
                  创建新活动
                </Button>
              </div>
            ) : (
              <List
                dataSource={showAllUpcoming ? upcomingEvents : upcomingEvents.slice(0, 2)}
                renderItem={(event) => {
                  const typeConfig = getEventTypeConfig(event.eventType);
                  return (
                    <List.Item 
                      key={event.id}
                      className="!px-0 !py-3 hover:bg-gray-50 rounded-lg transition-colors"
                      actions={[
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<QrcodeOutlined />}
                          title="查看二维码"
                        />
                      ]}
                    >
                      <List.Item.Meta
                        title={
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-base">{event.title}</span>
                            <Tag color={typeConfig.color} icon={<span>{typeConfig.icon}</span>}>
                              {typeConfig.label}
                            </Tag>
                          </div>
                        }
                        description={
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <CalendarOutlined className="mr-1" />
                              <span>
                                {new Date(event.startDate).toLocaleDateString('zh-CN', {
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center">
                                <UserOutlined className="mr-1" />
                                已报名: {event.currentAttendees}/{event.maxAttendees} 人
                              </span>
                              <span className="flex items-center text-green-600">
                                <QrcodeOutlined className="mr-1" />
                                二维码已生成
                              </span>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            )}
            
            {/* 查看更多按钮 */}
            {upcomingEvents.length > 2 && (
              <div className="text-center pt-4 border-t border-gray-100">
                <Button 
                  type="link" 
                  onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                >
                  {showAllUpcoming ? '收起' : `查看更多 (${upcomingEvents.length - 2})`}
                </Button>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="" className="hover-lift">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-blue-600">本月活动</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-green-600">参与人数</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">89%</div>
                <div className="text-sm text-purple-600">参与率</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">45</div>
                <div className="text-sm text-orange-600">网络连接</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="快速操作" className="hover-lift">
            <div className="grid grid-cols-4 gap-4">
              <Button icon={<PlusOutlined />} title="创建新活动">
                创建
              </Button>
              <Button icon={<QrcodeOutlined />} title="生成签到码">
                签到码
              </Button>
              <Button icon={<CalendarOutlined />} title="查看活动日历">
                日历
              </Button>
              <Button icon={<DownloadOutlined />} title="导出参与报告">
                导出
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card>
        <Tabs 
          defaultActiveKey="list"
          items={[
            {
              key: 'list',
              label: (
                <span>
                  <CalendarOutlined />
                  活动列表
                </span>
              ),
              children: (
                <EventList 
                  onEventSelect={handleEventSelect}
                  onShowParticipants={handleShowParticipants}
                />
              ),
            },
            {
              key: 'participants',
              label: (
                <span>
                  <UserOutlined />
                  参与者管理
                </span>
              ),
              children: selectedEvent ? (
                <EventParticipants 
                  event={selectedEvent}
                  onClose={() => setSelectedEvent(null)}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  请先选择一个活动来查看参与者管理
                </div>
              ),
            },
            {
              key: 'analytics',
              label: (
                <span>
                  <BarChartOutlined />
                  数据分析
                </span>
              ),
              children: (
                <div className="text-center py-8 text-gray-500">
                  活动数据分析功能开发中...
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Event Details Side Panel */}
      {selectedEvent && (
        <Card 
          title="活动详情" 
          extra={
            <Button 
              type="text" 
              onClick={() => setSelectedEvent(null)}
            >
              ×
            </Button>
          }
        >
          <div className="space-y-4">
            <div>
              <Title level={4}>{selectedEvent.title}</Title>
              <Text type="secondary">{selectedEvent.description}</Text>
            </div>
            
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>活动类型：</Text>
                <Tag color={getEventTypeConfig(selectedEvent.eventType).color}>
                  {getEventTypeConfig(selectedEvent.eventType).label}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>地点：</Text>
                <Text>{selectedEvent.location}</Text>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>开始时间：</Text>
                <Text>{new Date(selectedEvent.startDate).toLocaleString('zh-CN')}</Text>
              </Col>
              <Col span={12}>
                <Text strong>结束时间：</Text>
                <Text>{new Date(selectedEvent.endDate).toLocaleString('zh-CN')}</Text>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>参与人数：</Text>
                <Text>{selectedEvent.currentAttendees}/{selectedEvent.maxAttendees}</Text>
              </Col>
              <Col span={12}>
                <Text strong>费用：</Text>
                <Text>¥{selectedEvent.price}</Text>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <Button 
                  type="primary" 
                  icon={<UserOutlined />}
                  onClick={() => handleShowParticipants(selectedEvent)}
                  block
                >
                  查看参与者
                </Button>
              </Col>
              <Col span={8}>
                <Button 
                  icon={<PlusOutlined />}
                  onClick={() => handleShowRegistrationForm(selectedEvent, 'register')}
                  block
                >
                  添加报名
                </Button>
              </Col>
              <Col span={8}>
                <Button 
                  icon={<MailOutlined />}
                  onClick={() => handleShowRegistrationForm(selectedEvent, 'invite')}
                  block
                >
                  发送邀请
                </Button>
              </Col>
            </Row>
            
            <Row gutter={[8, 8]}>
              <Col span={8}>
                <Button 
                  type="primary"
                  icon={<QrcodeOutlined />}
                  onClick={() => handleShowScanner(selectedEvent)}
                  block
                >
                  扫描签到
                </Button>
              </Col>
              <Col span={8}>
                <Button 
                  icon={<UserOutlined />}
                  onClick={() => handleShowBatchCheckIn(selectedEvent)}
                  block
                >
                  批量签到
                </Button>
              </Col>
              <Col span={8}>
                <Button 
                  icon={<BarChartOutlined />}
                  onClick={() => handleShowCheckInDashboard(selectedEvent)}
                  block
                >
                  签到统计
                </Button>
              </Col>
            </Row>
          </div>
        </Card>
      )}

      {/* Feature Description */}
      <Card title="活动功能说明">
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <QrcodeOutlined className="text-blue-500" />
              <h4 className="font-medium">二维码签到</h4>
            </div>
            <Text type="secondary">
              生成专属二维码，支持快速签到和签退，自动记录参与时长
            </Text>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarOutlined className="text-green-500" />
              <h4 className="font-medium">RSVP系统</h4>
            </div>
            <Text type="secondary">
              在线报名系统，支持活动信息发布和参与者管理
            </Text>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarOutlined className="text-purple-500" />
              <h4 className="font-medium">网络连接追踪</h4>
            </div>
            <Text type="secondary">
              记录参与者之间的交流，建立商务网络连接档案
            </Text>
          </div>
        </div>
      </Card>

      {/* Event Registration Form Modal */}
      <EventRegistrationForm
        visible={showRegistrationForm}
        onCancel={() => setShowRegistrationForm(false)}
        onSuccess={() => {
          setShowRegistrationForm(false);
          fetchUpcomingEvents();
        }}
        event={selectedEvent!}
        mode={registrationMode}
      />

      {/* Enhanced QR Code Scanner Modal */}
      <EnhancedQRCodeScanner
        visible={showScanner}
        onCancel={() => setShowScanner(false)}
        event={selectedEvent}
        onScanSuccess={() => {
          fetchUpcomingEvents();
        }}
      />

      {/* Batch Check In Modal */}
      <BatchCheckIn
        visible={showBatchCheckIn}
        onCancel={() => setShowBatchCheckIn(false)}
        event={selectedEvent}
        onBatchComplete={() => {
          fetchUpcomingEvents();
        }}
      />

      {/* Check In Dashboard Modal */}
      {selectedEvent && showCheckInDashboard && (
        <Modal
          title="签到统计面板"
          open={showCheckInDashboard}
          onCancel={() => setShowCheckInDashboard(false)}
          width={1200}
          footer={null}
          destroyOnHidden
        >
          <CheckInDashboard
            event={selectedEvent}
            onRefresh={fetchUpcomingEvents}
          />
        </Modal>
      )}
    </div>
  );
};

export default EventPage;
