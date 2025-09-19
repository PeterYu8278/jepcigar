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
  message,
  Dropdown,
  Badge,
  Avatar,
  Progress,
  Statistic,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Event as EventType, EventRegistration, Customer } from '@/types';
import { useEventStore } from '@/stores/eventStore';
import { CustomerService } from '@/services/firebaseService';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface EventParticipantsProps {
  event: EventType;
  onClose?: () => void;
}

interface ParticipantWithDetails extends EventRegistration {
  customer?: Customer;
}

const EventParticipants: React.FC<EventParticipantsProps> = ({
  event,
  onClose,
}) => {
  const [participants, setParticipants] = useState<ParticipantWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  
  const {
    registrations,
    fetchEventRegistrations,
    checkIn,
    checkOut,
    cancelRegistration,
    error,
    clearError,
  } = useEventStore();

  useEffect(() => {
    if (event?.id) {
      loadParticipants();
    }
  }, [event?.id]);

  useEffect(() => {
    // Merge registration data with customer details
    const enrichedParticipants = registrations.map(registration => ({
      ...registration,
      customer: undefined, // Will be loaded separately
    }));
    setParticipants(enrichedParticipants);
    
    // Load customer details for each registration
    loadCustomerDetails(enrichedParticipants);
  }, [registrations]);

  const loadParticipants = async () => {
    if (!event?.id) return;
    
    setLoading(true);
    try {
      await fetchEventRegistrations(event.id);
    } catch (error) {
      message.error('加载参与者失败');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerDetails = async (participantsList: ParticipantWithDetails[]) => {
    const enrichedParticipants = await Promise.all(
      participantsList.map(async (participant) => {
        try {
          const customer = await CustomerService.getById('customers', participant.customerId) as Customer;
          return { ...participant, customer };
        } catch (error) {
          console.error('Failed to load customer details:', error);
          return participant;
        }
      })
    );
    setParticipants(enrichedParticipants);
  };

  const handleCheckIn = async (registrationId: string) => {
    try {
      await checkIn(registrationId);
      message.success('签到成功');
      loadParticipants();
    } catch (error) {
      message.error('签到失败');
    }
  };

  const handleCheckOut = async (registrationId: string) => {
    try {
      await checkOut(registrationId);
      message.success('签退成功');
      loadParticipants();
    } catch (error) {
      message.error('签退失败');
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    Modal.confirm({
      title: '确认取消报名',
      content: '确定要取消此参与者的报名吗？',
      okText: '取消报名',
      okType: 'danger',
      cancelText: '不取消',
      onOk: async () => {
        try {
          await cancelRegistration(registrationId);
          message.success('报名已取消');
          loadParticipants();
        } catch (error) {
          message.error('取消失败');
        }
      },
    });
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      registered: { label: '已报名', color: 'blue', icon: <UserOutlined /> },
      checked_in: { label: '已签到', color: 'green', icon: <CheckCircleOutlined /> },
      checked_out: { label: '已签退', color: 'processing', icon: <ClockCircleOutlined /> },
      no_show: { label: '未到场', color: 'warning', icon: <ExclamationCircleOutlined /> },
      cancelled: { label: '已取消', color: 'error', icon: <CloseCircleOutlined /> },
    };
    return configs[status as keyof typeof configs] || { label: status, color: 'default', icon: <UserOutlined /> };
  };

  const getActionMenuItems = (participant: ParticipantWithDetails) => {
    const items = [];

    if (participant.status === 'registered') {
      items.push({
        key: 'checkin',
        label: '签到',
        icon: <CheckCircleOutlined />,
        onClick: () => handleCheckIn(participant.id),
      });
    }

    if (participant.status === 'checked-in') {
      items.push({
        key: 'checkout',
        label: '签退',
        icon: <ClockCircleOutlined />,
        onClick: () => handleCheckOut(participant.id),
      });
    }

    if (participant.status !== 'cancelled') {
      items.push({
        key: 'cancel',
        label: '取消报名',
        icon: <CloseCircleOutlined />,
        danger: true,
        onClick: () => handleCancelRegistration(participant.id),
      });
    }

    return items;
  };

  const columns: ColumnsType<ParticipantWithDetails> = [
    {
      title: '参与者信息',
      key: 'participantInfo',
      width: 300,
      render: (_, record) => {
        const customer = record.customer;
        if (!customer) {
          return (
            <div className="flex items-center space-x-3">
              <Avatar icon={<UserOutlined />} />
              <div>
                <div className="font-medium">加载中...</div>
                <div className="text-gray-500 text-sm">ID: {record.customerId}</div>
              </div>
            </div>
          );
        }

        return (
          <div className="flex items-center space-x-3">
            <Avatar 
              src={customer.avatar} 
              icon={<UserOutlined />}
            />
            <div>
              <div className="font-medium">
                {customer.firstName} {customer.lastName}
              </div>
              <div className="text-gray-500 text-sm flex items-center space-x-2">
                <MailOutlined />
                <span>{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="text-gray-500 text-sm flex items-center space-x-2">
                  <PhoneOutlined />
                  <span>{customer.phone}</span>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: '公司信息',
      key: 'companyInfo',
      width: 200,
      render: (_, record) => {
        const customer = record.customer;
        if (!customer) return <span className="text-gray-400">-</span>;

        return (
          <div>
            {customer.company && (
              <div className="font-medium">{customer.company}</div>
            )}
            {customer.title && (
              <div className="text-gray-500 text-sm">{customer.title}</div>
            )}
          </div>
        );
      },
    },
    {
      title: '报名时间',
      key: 'registrationTime',
      width: 150,
      render: (_, record) => (
        <div>
          <div className="font-medium">
            {dayjs(record.createdAt).format('DD-MMM-YYYY HH:mm')}
          </div>
          <div className="text-gray-500 text-sm">
            {dayjs(record.createdAt).format('DD-MMM-YYYY')}
          </div>
        </div>
      ),
    },
    {
      title: '签到状态',
      key: 'checkInStatus',
      width: 120,
      render: (_, record) => {
        const statusConfig = getStatusConfig(record.status);
        return (
          <Tag color={statusConfig.color} icon={statusConfig.icon}>
            {statusConfig.label}
          </Tag>
        );
      },
    },
    {
      title: '参与时长',
      key: 'attendanceDuration',
      width: 120,
      render: (_, record) => {
        if (record.status === 'checked-out' && record.attendanceDuration) {
          const hours = Math.floor(record.attendanceDuration / 60);
          const minutes = record.attendanceDuration % 60;
          return (
            <div className="text-center">
              <div className="font-medium">
                {hours}h {minutes}m
              </div>
            </div>
          );
        } else if (record.status === 'checked-in' && record.checkInTime) {
          const now = new Date();
          const duration = Math.floor((now.getTime() - record.checkInTime.getTime()) / (1000 * 60));
          const hours = Math.floor(duration / 60);
          const minutes = duration % 60;
          return (
            <div className="text-center">
              <div className="font-medium text-green-600">
                {hours}h {minutes}m
              </div>
              <div className="text-xs text-gray-500">进行中</div>
            </div>
          );
        }
        return <span className="text-gray-400">-</span>;
      },
    },
    {
      title: '参与度',
      key: 'engagement',
      width: 100,
      render: (_, record) => (
        <div className="text-center">
          <Progress
            percent={record.engagementScore || 0}
            size="small"
            status={record.engagementScore >= 80 ? 'success' : record.engagementScore >= 50 ? 'normal' : 'exception'}
          />
          <div className="text-xs text-gray-500 mt-1">
            {record.engagementScore || 0}/100
          </div>
        </div>
      ),
    },
    {
      title: '网络连接',
      key: 'networking',
      width: 100,
      render: (_, record) => (
        <div className="text-center">
          <Badge 
            count={record.networkingConnections?.length || 0} 
            showZero 
            color="blue"
          >
            <UserOutlined />
          </Badge>
        </div>
      ),
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

  // Filter participants
  const filteredParticipants = participants.filter(participant => {
    const customer = participant.customer;
    if (!customer) return false;

    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
      (customer.company && customer.company.toLowerCase().includes(searchText.toLowerCase()));

    const matchesStatus = !statusFilter || participant.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: participants.length,
    registered: participants.filter(p => p.status === 'registered').length,
    checkedIn: participants.filter(p => p.status === 'checked-in').length,
    checkedOut: participants.filter(p => p.status === 'checked-out').length,
    noShow: participants.filter(p => p.status === 'no-show').length,
    cancelled: participants.filter(p => p.status === 'cancelled').length,
  };

  return (
    <div className="event-participants">
      {/* Header with Statistics */}
      <Card className="mb-4">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} className="mb-2">
              <UserOutlined className="mr-2" />
              {event.title} - 参与者管理
            </Title>
            <Text type="secondary">
              管理活动参与者，处理签到签退和参与度追踪
            </Text>
          </Col>
          <Col>
            <Space>
              <Button icon={<ExportOutlined />}>
                导出名单
              </Button>
              <Button icon={<ImportOutlined />}>
                批量导入
              </Button>
              <Button icon={<PlusOutlined />}>
                添加参与者
              </Button>
              {onClose && (
                <Button onClick={onClose}>
                  关闭
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        {/* Statistics */}
        <Divider />
        <Row gutter={16}>
          <Col span={4}>
            <Statistic
              title="总报名"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="已签到"
              value={stats.checkedIn}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="已签退"
              value={stats.checkedOut}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="未到场"
              value={stats.noShow}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="已取消"
              value={stats.cancelled}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="参与率"
              value={stats.total > 0 ? Math.round(((stats.checkedIn + stats.checkedOut) / stats.total) * 100) : 0}
              suffix="%"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Filters */}
      <Card className="mb-4">
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="搜索参与者姓名、邮箱或公司..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col>
            <Select
              placeholder="签到状态"
              allowClear
              style={{ width: 120 }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="registered">已报名</Option>
              <Option value="checked_in">已签到</Option>
              <Option value="checked_out">已签退</Option>
              <Option value="no_show">未到场</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Participants Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredParticipants}
          rowKey="id"
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedParticipants,
            onChange: (selectedRowKeys: React.Key[]) => setSelectedParticipants(selectedRowKeys.map(String)),
            getCheckboxProps: (record) => ({
              disabled: record.status === 'cancelled',
            }),
          }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

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

export default EventParticipants;
