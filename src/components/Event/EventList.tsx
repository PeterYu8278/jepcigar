import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Tag,
  Space,
  Input,
  Select,
  Row,
  Col,
  Typography,
  Modal,
  Dropdown,
  App,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  PlayCircleOutlined,
  StopOutlined,
  QrcodeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Event as EventType } from '@/types';
import { useEventStore } from '@/stores/eventStore';
import EventForm from './EventForm';
import QRCodeGenerator from './QRCodeGenerator';
import QRCodeScanner from './QRCodeScanner';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface EventListProps {
  onEventSelect?: (event: EventType) => void;
  onShowParticipants?: (event: EventType) => void;
}

const EventList: React.FC<EventListProps> = ({ onEventSelect, onShowParticipants }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [qrGeneratorVisible, setQrGeneratorVisible] = useState(false);
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const { modal, message } = App.useApp();
  
  const {
    isLoading,
    error,
    eventTypeFilter,
    statusFilter,
    dateFilter,
    currentPage,
    pageSize,
    fetchAllEvents,
    setEventTypeFilter,
    setStatusFilter,
    setDateFilter,
    setCurrentPage,
    setPageSize,
    deleteEvent,
    publishEvent,
    cancelEvent,
    getFilteredEvents,
    clearError,
  } = useEventStore();

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleResetFilters = () => {
    setSearchText('');
    setEventTypeFilter(null);
    setStatusFilter(null);
    setDateFilter('all');
    setCurrentPage(1);
    message.success('筛选条件已重置');
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setFormMode('create');
    setFormVisible(true);
  };

  const handleGenerateQRCode = (event: EventType) => {
    setSelectedEvent(event);
    setQrGeneratorVisible(true);
  };

  const handleOpenScanner = (event: EventType) => {
    setSelectedEvent(event);
    setQrScannerVisible(true);
  };

  const handleEditEvent = (event: EventType) => {
    setSelectedEvent(event);
    setFormMode('edit');
    setFormVisible(true);
  };

  const handleDeleteEvent = async (event: EventType) => {
    modal.confirm({
      title: '确认删除',
      content: `确定要删除活动"${event.title}"吗？此操作将取消所有报名并无法撤销。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteEvent(event.id);
          message.success('活动删除成功');
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handlePublishEvent = async (event: EventType) => {
    try {
      await publishEvent(event.id);
      message.success('活动发布成功');
    } catch (error) {
      message.error('发布失败');
    }
  };

  const handleCancelEvent = async (event: EventType) => {
    modal.confirm({
      title: '确认取消',
      content: `确定要取消活动"${event.title}"吗？此操作将取消所有报名。`,
      okText: '取消活动',
      okType: 'danger',
      cancelText: '不取消',
      onOk: async () => {
        try {
          await cancelEvent(event.id);
          message.success('活动取消成功');
        } catch (error) {
          message.error('取消失败');
        }
      },
    });
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

  const getStatusConfig = (status: string) => {
    const configs = {
      draft: { label: '草稿', color: 'default' },
      published: { label: '已发布', color: 'success' },
      cancelled: { label: '已取消', color: 'error' },
      completed: { label: '已完成', color: 'processing' },
    };
    return configs[status as keyof typeof configs] || { label: status, color: 'default' };
  };

  const getActionMenuItems = (event: EventType) => {
    const items = [
      {
        key: 'view',
        label: '查看详情',
        icon: <EyeOutlined />,
        onClick: () => onEventSelect?.(event),
      },
      {
        key: 'edit',
        label: '编辑活动',
        icon: <EditOutlined />,
        onClick: () => handleEditEvent(event),
      },
      {
        key: 'participants',
        label: '参与者管理',
        icon: <UserOutlined />,
        onClick: () => onShowParticipants?.(event),
      },
      {
        key: 'generate-qr',
        label: '生成二维码',
        icon: <QrcodeOutlined />,
        onClick: () => handleGenerateQRCode(event),
      },
      {
        key: 'scan-qr',
        label: '扫描签到',
        icon: <QrcodeOutlined />,
        onClick: () => handleOpenScanner(event),
      },
    ];

    if (event.status === 'draft') {
      items.push({
        key: 'publish',
        label: '发布活动',
        icon: <PlayCircleOutlined />,
        onClick: () => { handlePublishEvent(event); },
      });
    }

    if (event.status === 'published') {
      items.push({
        key: 'cancel',
        label: '取消活动',
        icon: <StopOutlined />,
        onClick: () => { handleCancelEvent(event); },
      });
    }

    items.push({
      key: 'delete',
      label: '删除活动',
      icon: <DeleteOutlined />,
      onClick: () => { handleDeleteEvent(event); },
    });

    return items;
  };

  const columns: ColumnsType<EventType> = [
    {
      title: '活动信息',
      key: 'eventInfo',
      width: 300,
      render: (_, record) => {
        const typeConfig = getEventTypeConfig(record.eventType);
        return (
          <div>
            <div className="font-medium text-base mb-1">{record.title}</div>
            <div className="text-gray-500 text-sm mb-2 line-clamp-2">
              {record.description}
            </div>
            <Space>
              <Tag color={typeConfig.color} icon={<span>{typeConfig.icon}</span>}>
                {typeConfig.label}
              </Tag>
              <Tag color={record.isVirtual ? 'cyan' : 'geekblue'}>
                {record.isVirtual ? '线上' : '线下'}
              </Tag>
            </Space>
          </div>
        );
      },
    },
    {
      title: '时间',
      key: 'time',
      width: 180,
      render: (_, record) => {
        // Helper function to parse date with timezone support
        const parseDate = (dateValue: any) => {
          if (!dateValue) return null;
          
          // If it's already a Date object, use it directly
          if (dateValue instanceof Date) {
            return dayjs(dateValue);
          }
          
          // If it's a string, try to parse it
          if (typeof dateValue === 'string') {
            // Check if it matches the specific format: "11 September 2025 at 00:00:00 UTC+8"
            const customFormatMatch = dateValue.match(/^(\d{1,2}) (\w+) (\d{4}) at (\d{2}):(\d{2}):(\d{2}) UTC([+-]\d+)$/);
            
            if (customFormatMatch) {
              const [, day, month, year, hour, minute, second] = customFormatMatch;
              
              // Convert month name to number
              const monthNames: { [key: string]: string } = {
                'January': '01', 'February': '02', 'March': '03', 'April': '04',
                'May': '05', 'June': '06', 'July': '07', 'August': '08',
                'September': '09', 'October': '10', 'November': '11', 'December': '12'
              };
              
              const monthNum = monthNames[month];
              if (monthNum) {
                // Create ISO string and parse as UTC (since we have timezone info)
                const isoString = `${year}-${monthNum}-${day.padStart(2, '0')}T${hour}:${minute}:${second}.000Z`;
                const parsed = dayjs.utc(isoString);
                if (parsed.isValid()) return parsed;
              }
            }
            
            // Try parsing with custom format first (for other formats)
            let parsed = dayjs(dateValue, 'DD MMMM YYYY [at] HH:mm:ss [UTC]Z', true);
            if (parsed.isValid()) return parsed;
            
            // Try parsing as ISO string
            parsed = dayjs(dateValue);
            if (parsed.isValid()) return parsed;
            
            // Try parsing with timezone info
            parsed = dayjs.tz(dateValue);
            if (parsed.isValid()) return parsed;
          }
          
          return null;
        };

        const startDate = parseDate(record.startDate);
        const endDate = parseDate(record.endDate);

         return (
           <div>
             <div className="font-medium">
               {startDate && startDate.isValid() 
                 ? startDate.format('DD-MMM-YYYY HH:mm')
                 : '时间待定'
               }
             </div>
             <div className="text-gray-500 text-sm">
               {endDate && endDate.isValid()
                 ? endDate.format('DD-MMM-YYYY HH:mm')
                 : '时间待定'
               }
             </div>
           </div>
         );
      },
    },
    {
      title: '地点',
      key: 'location',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium flex items-center">
            <EnvironmentOutlined className="mr-1" />
            {record.location}
          </div>
          {record.address && (
            <div className="text-gray-500 text-sm">{record.address}</div>
          )}
          {record.isVirtual && record.meetingLink && (
            <div className="text-blue-500 text-sm">线上活动</div>
          )}
        </div>
      ),
    },
    {
      title: '参与情况',
      key: 'attendance',
      width: 120,
      render: (_, record) => (
        <div className="text-center">
          <div className="font-medium text-lg">
            <UserOutlined className="mr-1" />
            {record.currentAttendees}/{record.maxAttendees}
          </div>
          <div className="text-gray-500 text-sm">
            {Math.round((record.currentAttendees / record.maxAttendees) * 100)}%
          </div>
        </div>
      ),
    },
    {
      title: '费用',
      key: 'pricing',
      width: 100,
      render: (_, record) => (
        <div className="text-center">
          <div className="font-medium">
            <DollarOutlined className="mr-1" />
            ¥{record.price}
          </div>
          {record.memberDiscount > 0 && (
            <div className="text-green-500 text-sm">
              会员优惠 ¥{record.memberDiscount}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const statusConfig = getStatusConfig(record.status);
        return (
          <Tag color={statusConfig.color}>
            {statusConfig.label}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionMenuItems(record) }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            size="small"
          />
        </Dropdown>
      ),
    },
  ];

  // Filter events based on search and filters
  const filteredEvents = getFilteredEvents().filter(event =>
    (event.title || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (event.description || '').toLowerCase().includes(searchText.toLowerCase()) ||
    (event.location || '').toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="event-list">
      {/* Header */}
      <Card className="mb-4">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} className="mb-0">
              <CalendarOutlined className="mr-2" />
              活动管理
            </Title>
            <Text type="secondary">
              管理雪茄品鉴会、商务聚会和网络活动
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateEvent}
            >
              创建活动
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card className="mb-4">
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="搜索活动标题、描述或地点..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col>
            <Select
              placeholder="活动类型"
              allowClear
              style={{ width: 120 }}
              value={eventTypeFilter}
              onChange={setEventTypeFilter}
            >
              <Option value="tasting">品鉴会</Option>
              <Option value="networking">网络聚会</Option>
              <Option value="educational">教育培训</Option>
              <Option value="celebration">庆祝活动</Option>
            </Select>
          </Col>
          <Col>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: 100 }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="draft">草稿</Option>
              <Option value="published">已发布</Option>
              <Option value="cancelled">已取消</Option>
              <Option value="completed">已完成</Option>
            </Select>
          </Col>
          <Col>
            <Select
              placeholder="时间"
              style={{ width: 100 }}
              value={dateFilter}
              onChange={setDateFilter}
            >
              <Option value="all">全部</Option>
              <Option value="upcoming">即将举行</Option>
              <Option value="past">已结束</Option>
            </Select>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              onClick={handleResetFilters}
              title="重置筛选条件"
            >
              重置筛选
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Events Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredEvents}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredEvents.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: setCurrentPage,
            onShowSizeChange: (_, size) => setPageSize(size),
          }}
          scroll={{ x: 1200 }}
          onRow={(record) => ({
            onClick: () => onEventSelect?.(record),
            style: { cursor: 'pointer' },
          })}
        />
      </Card>

      {/* Event Form Modal */}
      <EventForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSuccess={() => {
          setFormVisible(false);
          fetchAllEvents();
        }}
        event={selectedEvent}
        mode={formMode}
      />

      {/* QR Code Generator Modal */}
      <QRCodeGenerator
        visible={qrGeneratorVisible}
        onCancel={() => setQrGeneratorVisible(false)}
        event={selectedEvent}
      />

      {/* QR Code Scanner Modal */}
      <QRCodeScanner
        visible={qrScannerVisible}
        onCancel={() => setQrScannerVisible(false)}
        event={selectedEvent}
        onScanSuccess={(result) => {
          console.log('Scan success:', result);
          // Refresh data after successful scan
          fetchAllEvents();
        }}
      />

      {/* Error Display */}
      {error && (
        <Modal
          title="错误"
          open={!!error}
          onCancel={clearError}
          footer={[
            <Button key="ok" type="primary" onClick={clearError}>
              确定
            </Button>,
          ]}
        >
          <div className="text-red-500">{error}</div>
        </Modal>
      )}
    </div>
  );
};

export default EventList;
