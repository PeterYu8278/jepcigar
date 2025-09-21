import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Typography, 
  Row,
  Col,
  Statistic,
  Tabs,
  message,
  App,
  Tooltip,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Rate,
  Empty,
  Badge,
  Divider,
  List
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  LinkOutlined,
  MessageOutlined,
  CalendarOutlined,
  StarOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  ReloadOutlined,
  TrophyOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { Graph, NetworkGraph } from '@ant-design/plots';
import { useEventStore } from '@/stores/eventStore';
import { useCustomerStore } from '@/stores/customerStore';
import { NetworkConnection, Customer, Event } from '@/types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const NetworkingPage: React.FC = () => {
  const { message: messageApi } = App.useApp();
  const { events, fetchEvents } = useEventStore();
  const { customers, fetchCustomers } = useCustomerStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>();
  const [connectionType, setConnectionType] = useState<'all' | 'business' | 'personal' | 'referral'>('all');
  const [selectedTab, setSelectedTab] = useState('connections');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingConnection, setEditingConnection] = useState<NetworkConnection | null>(null);
  const [form] = Form.useForm();

  // Mock data for network connections
  const [networkConnections, setNetworkConnections] = useState<NetworkConnection[]>([
    {
      id: '1',
      fromCustomerId: 'c1',
      toCustomerId: 'c2',
      connectionType: 'business',
      strength: 4,
      eventId: 'e1',
      notes: '在雪茄品鉴会上认识，共同对高端雪茄感兴趣',
      date: new Date('2024-01-15'),
      status: 'active',
      tags: ['雪茄爱好者', '商务人士'],
      interactions: 5
    },
    {
      id: '2',
      fromCustomerId: 'c2',
      toCustomerId: 'c3',
      connectionType: 'referral',
      strength: 5,
      eventId: 'e1',
      notes: '推荐客户，已成功转化',
      date: new Date('2024-01-20'),
      status: 'active',
      tags: ['推荐客户', 'VIP'],
      interactions: 12
    },
    {
      id: '3',
      fromCustomerId: 'c1',
      toCustomerId: 'c4',
      connectionType: 'personal',
      strength: 3,
      eventId: 'e2',
      notes: '私人朋友，偶尔一起品鉴雪茄',
      date: new Date('2024-02-10'),
      status: 'active',
      tags: ['私人朋友', '品鉴伙伴'],
      interactions: 3
    }
  ]);

  useEffect(() => {
    fetchEvents();
    fetchCustomers();
  }, [fetchEvents, fetchCustomers]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleEventFilter = (value: string | undefined) => {
    setSelectedEvent(value);
  };

  const handleTypeFilter = (value: 'all' | 'business' | 'personal' | 'referral') => {
    setConnectionType(value);
  };

  const handleCreateConnection = () => {
    setEditingConnection(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditConnection = (connection: NetworkConnection) => {
    setEditingConnection(connection);
    form.setFieldsValue({
      ...connection,
      date: dayjs(connection.date)
    });
    setIsModalVisible(true);
  };

  const handleModalSubmit = async (values: any) => {
    try {
      const connectionData = {
        ...values,
        date: values.date.toDate(),
        id: editingConnection?.id || `conn_${Date.now()}`,
        status: 'active',
        interactions: editingConnection?.interactions || 0
      };

      if (editingConnection) {
        setNetworkConnections(prev => 
          prev.map(conn => conn.id === editingConnection.id ? connectionData : conn)
        );
        messageApi.success('连接记录更新成功');
      } else {
        setNetworkConnections(prev => [...prev, connectionData]);
        messageApi.success('连接记录创建成功');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      messageApi.error('操作失败，请重试');
    }
  };

  const getConnectionTypeConfig = (type: string) => {
    const configs = {
      business: { label: '商务连接', color: 'blue', icon: <TeamOutlined /> },
      personal: { label: '个人连接', color: 'green', icon: <HeartOutlined /> },
      referral: { label: '推荐连接', color: 'orange', icon: <TrophyOutlined /> }
    };
    return configs[type as keyof typeof configs] || { label: type, color: 'default', icon: <LinkOutlined /> };
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 4) return '#52c41a';
    if (strength >= 3) return '#faad14';
    return '#f5222d';
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : '未知客户';
  };

  const getEventName = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.title : '未知活动';
  };

  const columns = [
    {
      title: '连接时间',
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a: NetworkConnection, b: NetworkConnection) => 
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: '连接双方',
      key: 'participants',
      render: (record: NetworkConnection) => (
        <div className="flex items-center space-x-2">
          <Avatar size="small" icon={<UserOutlined />} />
          <Text strong>{getCustomerName(record.fromCustomerId)}</Text>
          <Text type="secondary">↔</Text>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text strong>{getCustomerName(record.toCustomerId)}</Text>
        </div>
      ),
    },
    {
      title: '连接类型',
      dataIndex: 'connectionType',
      key: 'connectionType',
      render: (type: string) => {
        const config = getConnectionTypeConfig(type);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
      filters: [
        { text: '商务连接', value: 'business' },
        { text: '个人连接', value: 'personal' },
        { text: '推荐连接', value: 'referral' },
      ],
      onFilter: (value: string, record: NetworkConnection) => record.connectionType === value,
    },
    {
      title: '连接强度',
      dataIndex: 'strength',
      key: 'strength',
      render: (strength: number) => (
        <div className="flex items-center space-x-2">
          <Rate 
            disabled 
            value={strength} 
            style={{ fontSize: 14 }}
          />
          <Text style={{ color: getStrengthColor(strength) }}>
            {strength}/5
          </Text>
        </div>
      ),
      sorter: (a: NetworkConnection, b: NetworkConnection) => a.strength - b.strength,
    },
    {
      title: '相关活动',
      dataIndex: 'eventId',
      key: 'eventId',
      render: (eventId: string) => (
        <Tag icon={<CalendarOutlined />}>
          {getEventName(eventId)}
        </Tag>
      ),
    },
    {
      title: '互动次数',
      dataIndex: 'interactions',
      key: 'interactions',
      render: (count: number) => (
        <Badge count={count} showZero color="#1890ff" />
      ),
      sorter: (a: NetworkConnection, b: NetworkConnection) => a.interactions - b.interactions,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space wrap>
          {tags.map(tag => (
            <Tag key={tag} size="small">{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: NetworkConnection) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleEditConnection(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditConnection(record)}
          />
          <Button 
            type="text" 
            icon={<MessageOutlined />} 
            title="发送消息"
          />
        </Space>
      ),
    },
  ];

  // 准备网络图谱数据
  const prepareNetworkData = () => {
    const nodes = customers.map(customer => ({
      id: customer.id,
      label: `${customer.firstName} ${customer.lastName}`,
      type: 'customer',
      size: networkConnections.filter(conn => 
        conn.fromCustomerId === customer.id || conn.toCustomerId === customer.id
      ).length + 10, // 根据连接数调整节点大小
      style: {
        fill: '#1890ff',
        stroke: '#fff',
        lineWidth: 2,
      }
    }));

    const edges = networkConnections.map(conn => ({
      source: conn.fromCustomerId,
      target: conn.toCustomerId,
      type: conn.connectionType,
      weight: conn.strength,
      style: {
        stroke: getStrengthColor(conn.strength),
        lineWidth: conn.strength,
        opacity: 0.6,
      },
      label: {
        value: `${conn.strength}/5`,
        style: {
          fill: '#666',
          fontSize: 10,
        }
      }
    }));

    return { nodes, edges };
  };

  const networkData = prepareNetworkData();

  // 计算统计数据
  const getStatistics = () => {
    const totalConnections = networkConnections.length;
    const businessConnections = networkConnections.filter(c => c.connectionType === 'business').length;
    const personalConnections = networkConnections.filter(c => c.connectionType === 'personal').length;
    const referralConnections = networkConnections.filter(c => c.connectionType === 'referral').length;
    
    const avgStrength = totalConnections > 0 
      ? networkConnections.reduce((sum, c) => sum + c.strength, 0) / totalConnections 
      : 0;

    const totalInteractions = networkConnections.reduce((sum, c) => sum + c.interactions, 0);

    return {
      totalConnections,
      businessConnections,
      personalConnections,
      referralConnections,
      avgStrength,
      totalInteractions
    };
  };

  const statistics = getStatistics();

  const tabItems = [
    {
      key: 'connections',
      label: (
        <span>
          <TeamOutlined />
          连接列表
        </span>
      ),
      children: (
        <Table
          columns={columns}
          dataSource={networkConnections}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条连接`,
          }}
          scroll={{ x: 1200 }}
        />
      ),
    },
    {
      key: 'network',
      label: (
        <span>
          <LinkOutlined />
          网络图谱
        </span>
      ),
      children: (
        <div className="space-y-6">
          <Card>
            <Title level={4}>客户关系网络图</Title>
            <Text type="secondary">
              展示客户之间的连接关系，节点大小表示连接数量，连线粗细表示连接强度
            </Text>
            
            {networkData.nodes.length > 0 ? (
              <div style={{ height: 600, marginTop: 16 }}>
                <Graph
                  data={networkData}
                  layout={{
                    type: 'force',
                    preventOverlap: true,
                    nodeSize: 30,
                  }}
                  nodeStyle={{
                    fill: '#1890ff',
                    stroke: '#fff',
                    lineWidth: 2,
                  }}
                  edgeStyle={{
                    stroke: '#999',
                    lineWidth: 1,
                    opacity: 0.6,
                  }}
                  behaviors={['drag-canvas', 'zoom-canvas', 'drag-node']}
                />
              </div>
            ) : (
              <Empty 
                description="暂无网络连接数据" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </div>
      ),
    },
    {
      key: 'analytics',
      label: (
        <span>
          <BarChartOutlined />
          连接分析
        </span>
      ),
      children: (
        <div className="space-y-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="总连接数"
                  value={statistics.totalConnections}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="商务连接"
                  value={statistics.businessConnections}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="平均强度"
                  value={statistics.avgStrength}
                  precision={1}
                  suffix="/5"
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="总互动数"
                  value={statistics.totalInteractions}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="连接类型分布">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <TeamOutlined className="text-2xl text-blue-500 mb-2" />
                    <div className="font-medium">商务连接</div>
                    <div className="text-lg font-bold">{statistics.businessConnections}</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <HeartOutlined className="text-2xl text-green-500 mb-2" />
                    <div className="font-medium">个人连接</div>
                    <div className="text-lg font-bold">{statistics.personalConnections}</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <TrophyOutlined className="text-2xl text-orange-500 mb-2" />
                    <div className="font-medium">推荐连接</div>
                    <div className="text-lg font-bold">{statistics.referralConnections}</div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="高价值连接">
                <List
                  dataSource={networkConnections
                    .filter(c => c.strength >= 4)
                    .sort((a, b) => b.strength - a.strength)
                    .slice(0, 5)
                  }
                  renderItem={(connection) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <div className="flex items-center justify-between">
                            <span>
                              {getCustomerName(connection.fromCustomerId)} ↔ {getCustomerName(connection.toCustomerId)}
                            </span>
                            <Rate disabled value={connection.strength} style={{ fontSize: 12 }} />
                          </div>
                        }
                        description={
                          <div>
                            <Tag size="small" color={getConnectionTypeConfig(connection.connectionType).color}>
                              {getConnectionTypeConfig(connection.connectionType).label}
                            </Tag>
                            <Text type="secondary" className="ml-2">
                              {connection.interactions} 次互动
                            </Text>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">网络连接</Title>
          <Text type="secondary">管理和分析客户之间的商务网络连接</Text>
        </div>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateConnection}
        >
          新增连接
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} lg={6}>
            <Input
              placeholder="搜索客户姓名..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="连接类型"
              value={connectionType}
              onChange={handleTypeFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">全部类型</Option>
              <Option value="business">商务连接</Option>
              <Option value="personal">个人连接</Option>
              <Option value="referral">推荐连接</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="相关活动"
              value={selectedEvent}
              onChange={handleEventFilter}
              style={{ width: '100%' }}
              allowClear
            >
              {events.map(event => (
                <Option key={event.id} value={event.id}>
                  {event.title}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} lg={10}>
            <Space>
              <Button icon={<FilterOutlined />}>
                高级筛选
              </Button>
              <Button onClick={() => {
                setSearchTerm('');
                setConnectionType('all');
                setSelectedEvent(undefined);
              }}>
                重置筛选
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Content */}
      <Card>
        <Tabs
          activeKey={selectedTab}
          onChange={setSelectedTab}
          items={tabItems}
          size="large"
        />
      </Card>

      {/* Connection Modal */}
      <Modal
        title={editingConnection ? '编辑连接记录' : '新增连接记录'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fromCustomerId"
                label="客户A"
                rules={[{ required: true, message: '请选择客户A' }]}
              >
                <Select placeholder="选择客户A" showSearch>
                  {customers.map(customer => (
                    <Option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="toCustomerId"
                label="客户B"
                rules={[{ required: true, message: '请选择客户B' }]}
              >
                <Select placeholder="选择客户B" showSearch>
                  {customers.map(customer => (
                    <Option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="connectionType"
                label="连接类型"
                rules={[{ required: true, message: '请选择连接类型' }]}
              >
                <Select placeholder="选择连接类型">
                  <Option value="business">商务连接</Option>
                  <Option value="personal">个人连接</Option>
                  <Option value="referral">推荐连接</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="strength"
                label="连接强度"
                rules={[{ required: true, message: '请选择连接强度' }]}
              >
                <Rate />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="eventId"
                label="相关活动"
                rules={[{ required: true, message: '请选择相关活动' }]}
              >
                <Select placeholder="选择相关活动">
                  {events.map(event => (
                    <Option key={event.id} value={event.id}>
                      {event.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="连接时间"
                rules={[{ required: true, message: '请选择连接时间' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="选择连接时间"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="输入标签"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="notes"
            label="备注"
          >
            <TextArea 
              rows={3} 
              placeholder="输入备注信息"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setIsModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingConnection ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NetworkingPage;
