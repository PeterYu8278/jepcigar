import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, Space, Typography } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  GiftOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PlusOutlined,
  EyeOutlined,
} from '@ant-design/icons';
// import { Line, Column, Pie } from '@ant-design/plots';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface DashboardStats {
  totalCustomers: number;
  totalSales: number;
  totalRevenue: number;
  activeEvents: number;
  lowStockItems: number;
  pendingOrders: number;
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'customer' | 'event' | 'inventory';
  description: string;
  timestamp: Date;
  amount?: number;
}

interface TopCustomer {
  id: string;
  name: string;
  tier: string;
  totalSpent: number;
  lastPurchase: Date;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalSales: 0,
    totalRevenue: 0,
    activeEvents: 0,
    lowStockItems: 0,
    pendingOrders: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // TODO: Load real data from Firebase
      // Mock data for now
      setStats({
        totalCustomers: 1247,
        totalSales: 89,
        totalRevenue: 125680,
        activeEvents: 3,
        lowStockItems: 12,
        pendingOrders: 8,
      });

      setRecentActivities([
        {
          id: '1',
          type: 'sale',
          description: '新客户购买古巴雪茄套装',
          timestamp: new Date(),
          amount: 2580,
        },
        {
          id: '2',
          type: 'customer',
          description: '客户升级为Gold会员',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '3',
          type: 'event',
          description: '雪茄品鉴会报名人数已达上限',
          timestamp: new Date(Date.now() - 7200000),
        },
        {
          id: '4',
          type: 'inventory',
          description: '多米尼加雪茄库存不足',
          timestamp: new Date(Date.now() - 10800000),
        },
      ]);

      setTopCustomers([
        {
          id: '1',
          name: '张先生',
          tier: 'Royal',
          totalSpent: 45680,
          lastPurchase: new Date(),
        },
        {
          id: '2',
          name: '李女士',
          tier: 'Platinum',
          totalSpent: 32450,
          lastPurchase: new Date(Date.now() - 86400000),
        },
        {
          id: '3',
          name: '王总',
          tier: 'Gold',
          totalSpent: 28900,
          lastPurchase: new Date(Date.now() - 172800000),
        },
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations (placeholder)
  const salesChartConfig = {
    data: [
      { month: '1月', sales: 12500 },
      { month: '2月', sales: 15800 },
      { month: '3月', sales: 18200 },
      { month: '4月', sales: 22100 },
      { month: '5月', sales: 25600 },
      { month: '6月', sales: 28900 },
    ],
    xField: 'month',
    yField: 'sales',
    smooth: true,
    color: '#f16d1f',
    height: 300,
  };

  const tierDistributionConfig = {
    data: [
      { tier: 'Silver', count: 856, percent: 68.7 },
      { tier: 'Gold', count: 287, percent: 23.0 },
      { tier: 'Platinum', count: 89, percent: 7.1 },
      { tier: 'Royal', count: 15, percent: 1.2 },
    ],
    angleField: 'percent',
    colorField: 'tier',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    color: ['#C0C0C0', '#FFD700', '#E5E4E2', '#8B4513'],
    height: 300,
  };

  // Placeholder chart components
  const Line = (_props: any) => (
    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <BarChartOutlined className="text-4xl text-gray-400 mb-2" />
        <div className="text-gray-600">销售趋势图表</div>
        <div className="text-xs text-gray-400 mt-1">(集成Chart.js图表库)</div>
      </div>
    </div>
  );

  const Pie = (_props: any) => (
    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <BarChartOutlined className="text-4xl text-gray-400 mb-2" />
        <div className="text-gray-600">会员等级分布图表</div>
        <div className="text-xs text-gray-400 mt-1">(集成Chart.js图表库)</div>
      </div>
    </div>
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Royal': return 'volcano';
      case 'Platinum': return 'blue';
      case 'Gold': return 'gold';
      case 'Silver': return 'default';
      default: return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <ShoppingCartOutlined className="text-green-500" />;
      case 'customer': return <UserOutlined className="text-blue-500" />;
      case 'event': return <CalendarOutlined className="text-purple-500" />;
      case 'inventory': return <BarChartOutlined className="text-orange-500" />;
      default: return <BarChartOutlined />;
    }
  };

  const recentActivityColumns = [
    {
      title: '活动',
      dataIndex: 'description',
      key: 'description',
      render: (text: string, record: RecentActivity) => (
        <div className="flex items-center space-x-2">
          {getActivityIcon(record.type)}
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => amount ? `¥${amount.toLocaleString()}` : '-',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: Date) => timestamp.toLocaleString('zh-CN'),
    },
  ];

  const topCustomersColumns = [
    {
      title: '客户',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '会员等级',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => (
        <Tag color={getTierColor(tier)}>{tier}</Tag>
      ),
    },
    {
      title: '消费总额',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '最后购买',
      dataIndex: 'lastPurchase',
      key: 'lastPurchase',
      render: (date: Date) => date.toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TopCustomer) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => navigate(`/customers/${record.id}`)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">仪表板</Title>
          <Text type="secondary">欢迎回来！以下是您的业务概览</Text>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => navigate('/customers')}
          >
            添加客户
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="hover-lift">
          <Statistic
            title="总客户数"
            value={stats.totalCustomers}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
        <Card className="hover-lift">
          <Statistic
            title="本月销售"
            value={stats.totalSales}
            prefix={<ShoppingCartOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
        <Card className="hover-lift">
          <Statistic
            title="本月收入"
            value={stats.totalRevenue}
            prefix="¥"
            precision={0}
            valueStyle={{ color: '#f16d1f' }}
          />
        </Card>
        <Card className="hover-lift">
          <Statistic
            title="活跃活动"
            value={stats.activeEvents}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </div>

      {/* Charts Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="销售趋势" className="hover-lift">
            <Line {...salesChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="会员等级分布" className="hover-lift">
            <Pie {...tierDistributionConfig} />
          </Card>
        </Col>
      </Row>

      {/* Alerts and Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="系统提醒" className="hover-lift">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <BarChartOutlined className="text-orange-500" />
                  <span>12个商品库存不足</span>
                </div>
                <Button type="link" onClick={() => navigate('/inventory')}>
                  查看详情
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <GiftOutlined className="text-blue-500" />
                  <span>8个礼品订单待处理</span>
                </div>
                <Button type="link" onClick={() => navigate('/gifting')}>
                  查看详情
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrophyOutlined className="text-green-500" />
                  <span>3个客户即将升级会员等级</span>
                </div>
                <Button type="link" onClick={() => navigate('/royal-program')}>
                  查看详情
                </Button>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="快速操作" className="hover-lift">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                type="dashed" 
                block 
                icon={<ShoppingCartOutlined />}
                onClick={() => navigate('/inventory')}
              >
                管理库存
              </Button>
              <Button 
                type="dashed" 
                block 
                icon={<UserOutlined />}
                onClick={() => navigate('/customers')}
              >
                添加客户
              </Button>
              <Button 
                type="dashed" 
                block 
                icon={<CalendarOutlined />}
                onClick={() => navigate('/events')}
              >
                创建活动
              </Button>
              <Button 
                type="dashed" 
                block 
                icon={<GiftOutlined />}
                onClick={() => navigate('/gifting')}
              >
                礼品定制
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity and Top Customers */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="最近活动" className="hover-lift">
            <Table
              dataSource={recentActivities}
              columns={recentActivityColumns}
              pagination={false}
              size="small"
              loading={loading}
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="VIP客户" className="hover-lift">
            <Table
              dataSource={topCustomers}
              columns={topCustomersColumns}
              pagination={false}
              size="small"
              loading={loading}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
