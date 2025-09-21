import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Tabs, 
  Typography, 
  Space, 
  Button, 
  Statistic,
  Table,
  Tag,
  Progress,
  Alert,
  message,
  App,
  Tooltip,
  Badge,
  Divider,
  List,
  Avatar
} from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  InboxOutlined,
  BarChartOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  CalendarOutlined,
  DollarOutlined,
  TrendingUpOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCustomerStore } from '@/stores/customerStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useEventStore } from '@/stores/eventStore';
import { Customer, Cigar, Event } from '@/types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const SystemManagementPage: React.FC = () => {
  const { message: messageApi } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Store hooks
  const { customers, fetchCustomers } = useCustomerStore();
  const { cigars, fetchCigars, getLowStockCigars } = useInventoryStore();
  const { events, fetchEvents } = useEventStore();
  
  // Determine active tab based on URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/system/customers')) return 'customers';
    if (path.includes('/system/inventory')) return 'inventory';
    if (path.includes('/system/analytics')) return 'analytics';
    return 'overview';
  };
  
  // Local state
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState({
    totalCustomers: 0,
    totalCigars: 0,
    lowStockItems: 0,
    activeEvents: 0,
    totalRevenue: 0,
    systemHealth: 95
  });

  useEffect(() => {
    loadSystemData();
  }, []);

  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(`/system${key === 'overview' ? '' : `/${key}`}`);
  };

  const loadSystemData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCustomers(),
        fetchCigars(),
        fetchEvents()
      ]);
      
      // Calculate system statistics
      const lowStockItems = await getLowStockCigars();
      
      setSystemStats({
        totalCustomers: customers.length,
        totalCigars: cigars.length,
        lowStockItems: lowStockItems.length,
        activeEvents: events.filter(e => 
          dayjs(e.startDate).isAfter(dayjs()) && 
          dayjs(e.endDate).isAfter(dayjs())
        ).length,
        totalRevenue: 0, // This would come from actual sales data
        systemHealth: 95
      });
      
      setLoading(false);
    } catch (error) {
      messageApi.error('加载系统数据失败');
      setLoading(false);
    }
  };

  const getSystemHealthColor = (health: number) => {
    if (health >= 90) return '#52c41a';
    if (health >= 70) return '#faad14';
    return '#f5222d';
  };

  const getSystemHealthStatus = (health: number) => {
    if (health >= 90) return { status: 'success', text: '优秀' };
    if (health >= 70) return { status: 'warning', text: '良好' };
    return { status: 'error', text: '需要关注' };
  };

  // Customer Management Tab
  const CustomerManagementTab = () => (
    <div className="space-y-6">
      {/* Customer Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总客户数"
              value={customers.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃客户"
              value={customers.filter(c => c.isActive).length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="VIP客户"
              value={customers.filter(c => c.tags?.includes('VIP')).length}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="新客户（本月）"
              value={customers.filter(c => 
                dayjs(c.createdAt).isAfter(dayjs().startOf('month'))
              ).length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="客户管理操作" extra={
        <Button type="primary" onClick={() => navigate('/customers')}>
          进入客户管理
        </Button>
      }>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" hoverable onClick={() => navigate('/customers')}>
              <div className="text-center">
                <UserOutlined className="text-3xl text-blue-500 mb-2" />
                <div className="font-medium">客户列表</div>
                <Text type="secondary">查看和管理所有客户</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" hoverable onClick={() => navigate('/customers/digital-cards')}>
              <div className="text-center">
                <TeamOutlined className="text-3xl text-green-500 mb-2" />
                <div className="font-medium">数字名片</div>
                <Text type="secondary">管理客户数字名片</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" hoverable onClick={() => navigate('/analytics')}>
              <div className="text-center">
                <BarChartOutlined className="text-3xl text-purple-500 mb-2" />
                <div className="font-medium">客户分析</div>
                <Text type="secondary">查看客户数据分析</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Recent Customers */}
      <Card title="最近新增客户">
        <List
          dataSource={customers.slice(0, 5)}
          renderItem={(customer: Customer) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={`${customer.firstName} ${customer.lastName}`}
                description={
                  <div>
                    <Text type="secondary">{customer.email}</Text>
                    <div className="mt-1">
                      {customer.tags?.map(tag => (
                        <Tag key={tag} size="small">{tag}</Tag>
                      ))}
                    </div>
                  </div>
                }
              />
              <div className="text-right">
                <Text type="secondary">
                  {dayjs(customer.createdAt).format('MM-DD HH:mm')}
                </Text>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  // Inventory Management Tab
  const InventoryManagementTab = () => (
    <div className="space-y-6">
      {/* Inventory Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总雪茄种类"
              value={cigars.length}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="库存不足"
              value={systemStats.lowStockItems}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总库存价值"
              value={cigars.reduce((sum, cigar) => 
                sum + (cigar.currentStock * cigar.retailPrice), 0
              )}
              prefix="¥"
              precision={0}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃商品"
              value={cigars.filter(c => c.isActive).length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="库存管理操作" extra={
        <Button type="primary" onClick={() => navigate('/inventory')}>
          进入库存管理
        </Button>
      }>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" hoverable onClick={() => navigate('/inventory')}>
              <div className="text-center">
                <InboxOutlined className="text-3xl text-blue-500 mb-2" />
                <div className="font-medium">雪茄库存</div>
                <Text type="secondary">管理雪茄库存</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" hoverable onClick={() => navigate('/inventory/stock-transactions')}>
              <div className="text-center">
                <ShoppingCartOutlined className="text-3xl text-green-500 mb-2" />
                <div className="font-medium">库存交易</div>
                <Text type="secondary">查看交易记录</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" hoverable onClick={() => navigate('/inventory/price-history')}>
              <div className="text-center">
                <TrendingUpOutlined className="text-3xl text-orange-500 mb-2" />
                <div className="font-medium">价格历史</div>
                <Text type="secondary">价格趋势分析</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small" hoverable onClick={() => navigate('/analytics')}>
              <div className="text-center">
                <BarChartOutlined className="text-3xl text-purple-500 mb-2" />
                <div className="font-medium">库存分析</div>
                <Text type="secondary">库存数据分析</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Low Stock Alert */}
      {systemStats.lowStockItems > 0 && (
        <Alert
          message="库存预警"
          description={`有 ${systemStats.lowStockItems} 个商品库存不足，请及时补货。`}
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/inventory')}>
              查看详情
            </Button>
          }
        />
      )}

      {/* Recent Inventory Changes */}
      <Card title="最近库存变动">
        <Table
          dataSource={cigars.slice(0, 5)}
          pagination={false}
          size="small"
          columns={[
            {
              title: '雪茄品牌',
              dataIndex: 'brand',
              key: 'brand',
            },
            {
              title: '型号',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '当前库存',
              dataIndex: 'currentStock',
              key: 'currentStock',
              render: (stock: number, record: Cigar) => (
                <div className="flex items-center space-x-2">
                  <span>{stock}</span>
                  {stock <= record.minStock && (
                    <Tag color="red" size="small">库存不足</Tag>
                  )}
                </div>
              ),
            },
            {
              title: '零售价',
              dataIndex: 'retailPrice',
              key: 'retailPrice',
              render: (price: number) => `¥${price.toLocaleString()}`,
            },
            {
              title: '状态',
              dataIndex: 'isActive',
              key: 'isActive',
              render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                  {isActive ? '活跃' : '停用'}
                </Tag>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );

  // Analytics Tab
  const AnalyticsTab = () => (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="系统健康度"
              value={systemStats.systemHealth}
              suffix="%"
              valueStyle={{ color: getSystemHealthColor(systemStats.systemHealth) }}
            />
            <Progress
              percent={systemStats.systemHealth}
              strokeColor={getSystemHealthColor(systemStats.systemHealth)}
              showInfo={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="数据完整性"
              value={98}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="系统运行时间"
              value="99.9"
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="数据备份"
              value="100"
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Analytics Actions */}
      <Card title="数据分析操作" extra={
        <Button type="primary" onClick={() => navigate('/analytics')}>
          进入分析中心
        </Button>
      }>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" hoverable onClick={() => navigate('/analytics')}>
              <div className="text-center">
                <BarChartOutlined className="text-3xl text-blue-500 mb-2" />
                <div className="font-medium">业务分析</div>
                <Text type="secondary">查看业务数据分析</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" hoverable onClick={() => navigate('/analytics')}>
              <div className="text-center">
                <TrendingUpOutlined className="text-3xl text-green-500 mb-2" />
                <div className="font-medium">趋势分析</div>
                <Text type="secondary">分析业务趋势</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" hoverable onClick={() => navigate('/analytics')}>
              <div className="text-center">
                <DollarOutlined className="text-3xl text-orange-500 mb-2" />
                <div className="font-medium">财务报告</div>
                <Text type="secondary">生成财务报告</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* System Status */}
      <Card title="系统状态">
        <List
          dataSource={[
            { name: '数据库连接', status: 'success', icon: <CheckCircleOutlined /> },
            { name: '文件存储', status: 'success', icon: <CheckCircleOutlined /> },
            { name: '邮件服务', status: 'warning', icon: <ClockCircleOutlined /> },
            { name: '支付网关', status: 'success', icon: <CheckCircleOutlined /> },
            { name: '短信服务', status: 'error', icon: <ExclamationCircleOutlined /> },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={item.icon} />}
                title={item.name}
              />
              <Tag color={
                item.status === 'success' ? 'green' :
                item.status === 'warning' ? 'orange' : 'red'
              }>
                {item.status === 'success' ? '正常' :
                 item.status === 'warning' ? '警告' : '错误'}
              </Tag>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  // Overview Tab
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* System Overview */}
      <Card title="系统概览">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="总客户数"
                value={systemStats.totalCustomers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="雪茄种类"
                value={systemStats.totalCigars}
                prefix={<InboxOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="活跃活动"
                value={systemStats.activeEvents}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card size="small">
              <Statistic
                title="系统健康度"
                value={systemStats.systemHealth}
                suffix="%"
                valueStyle={{ color: getSystemHealthColor(systemStats.systemHealth) }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Quick Access */}
      <Card title="快速访问">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" hoverable onClick={() => setActiveTab('customers')}>
              <div className="text-center">
                <UserOutlined className="text-4xl text-blue-500 mb-3" />
                <Title level={4}>客户管理</Title>
                <Text type="secondary">管理客户信息和关系</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" hoverable onClick={() => setActiveTab('inventory')}>
              <div className="text-center">
                <InboxOutlined className="text-4xl text-green-500 mb-3" />
                <Title level={4}>库存管理</Title>
                <Text type="secondary">管理雪茄库存和价格</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card size="small" hoverable onClick={() => setActiveTab('analytics')}>
              <div className="text-center">
                <BarChartOutlined className="text-4xl text-purple-500 mb-3" />
                <Title level={4}>数据分析</Title>
                <Text type="secondary">查看业务分析报告</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* System Alerts */}
      <Card title="系统提醒">
        <Space direction="vertical" className="w-full">
          {systemStats.lowStockItems > 0 && (
            <Alert
              message="库存预警"
              description={`有 ${systemStats.lowStockItems} 个商品库存不足`}
              type="warning"
              showIcon
              action={
                <Button size="small" onClick={() => navigate('/inventory')}>
                  查看详情
                </Button>
              }
            />
          )}
          
          <Alert
            message="系统运行正常"
            description="所有核心服务运行正常，系统健康度良好"
            type="success"
            showIcon
          />
          
          <Alert
            message="数据备份提醒"
            description="建议定期进行数据备份，确保数据安全"
            type="info"
            showIcon
            action={
              <Button size="small" onClick={() => messageApi.info('备份功能开发中')}>
                立即备份
              </Button>
            }
          />
        </Space>
      </Card>
    </div>
  );

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <SettingOutlined />
          系统概览
        </span>
      ),
      children: <OverviewTab />,
    },
    {
      key: 'customers',
      label: (
        <span>
          <UserOutlined />
          客户管理
        </span>
      ),
      children: <CustomerManagementTab />,
    },
    {
      key: 'inventory',
      label: (
        <span>
          <InboxOutlined />
          库存管理
        </span>
      ),
      children: <InventoryManagementTab />,
    },
    {
      key: 'analytics',
      label: (
        <span>
          <BarChartOutlined />
          数据分析
        </span>
      ),
      children: <AnalyticsTab />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">系统管理</Title>
          <Text type="secondary">统一管理系统核心功能和数据</Text>
        </div>
        <Space>
          <Button icon={<SettingOutlined />} onClick={() => navigate('/settings')}>
            系统设置
          </Button>
          <Button type="primary" onClick={loadSystemData} loading={loading}>
            刷新数据
          </Button>
        </Space>
      </div>

      {/* System Status Bar */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getSystemHealthColor(systemStats.systemHealth) }}
              />
              <div>
                <Text strong>系统状态: </Text>
                <Tag color={getSystemHealthStatus(systemStats.systemHealth).status}>
                  {getSystemHealthStatus(systemStats.systemHealth).text}
                </Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <Text strong>最后更新: </Text>
            <Text type="secondary">{dayjs().format('YYYY-MM-DD HH:mm:ss')}</Text>
          </Col>
          <Col xs={24} sm={8}>
            <Text strong>数据版本: </Text>
            <Text type="secondary">v1.0.0</Text>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        />
      </Card>
    </div>
  );
};

export default SystemManagementPage;
